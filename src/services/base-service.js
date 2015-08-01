import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ObjectUtilities} from '../util/object-utilities';
import {EventNames} from '../events/event-names';
import {LogManager} from 'aurelia-framework';
import _ from 'lodash';

const logger = LogManager.getLogger('services');

class ParameterHelper {

    toParameters(options) {
        var s = "";
        var keys = Object.keys(options);
        for (var k = 0; k < keys.length; k++) {
            if (s.length > 1) {
                s += "&";
            }
            s += keys[k] + '=' + encodeURI(options[keys[k]]);
        }
        return s;
    }
}


@inject(HttpClient, EventAggregator)
export class BaseService {

    baseHref = "/stamp-webservices";

    parameters = {};

    models = [];
    total = 0;
    lastCache = {
        id: 0,
        model: null
    };
    loaded = false;

    constructor(http, eventBus) {
        this.http = http;
        this.paramHelper = new ParameterHelper();
        this.eventBus = eventBus;
        this.http.configure(x => {
            //       x.withHeader('Authorization', 'Basic ' + btoa(this.username + ":" + this.password));
            x.withHeader('Accept', 'application/json');
            x.withHeader('Content-Type', 'application/json');
        });
    }

    monitoredParams(params) {
        let p = {};
        let reservedKeys = ['$filter', '$top', '$orderby', '$skip'];
        if (params) {
            _.forEach(reservedKeys, function(key) {
                if( key in params ) {
                    p[key] = params[key];
                }
            });
        }
        return p;
    }

;

    /**
     * Determine whether to use the cached result for query.  A cached result will be
     * used if the following is true:
     * <ul>
     * <li>The current results have at least one value.</li>
     * <li>The monitored parameters are matching for the existing and new params.</li>
     * <li>The existing params had a dynamic cache directive, but the new params does not.</li>
     * <li>The same dynamic cache directive exists on both the new params and existing params</li>
     *
     * @param {Object} params - the new parameters
     * @param {Object} that - the current service instance
     * @return Whether to use the cache result or not.
     */
    useCachedResult(params) {
        var theParams = this.monitoredParams(params);
        var cacheAndNew = function (newParams, currentParams) {
            return (typeof newParams._dc === 'undefined' && typeof currentParams._dc !== 'undefined');
        };
        var sameCache = function (newParams, currentParams) {
            return newParams._dc === currentParams._dc;
        };
        if (this.models.length > 0 && ObjectUtilities.isEqual(theParams, this.parameters) &&
            (((!this.parameters || Object.keys(this.parameters).length === 0) && params === undefined) || (this.parameters !== undefined &&
            params !== undefined && (cacheAndNew(params, this.parameters) || sameCache(params, this.parameters))))) {
            return true;
        }
        return false;
    }

    getDefaultSearchOptions() {
        return {};
    }


    getResourceName() {
        throw new Error("Unimplemented resource name.");
    }

    getCollectionName() {
        return this.getResourceName();
    }

    getById(id) {
        if (!this.loaded) {
            throw new Error("Requires the service to be loaded first.");
        }
        if (this.lastCache.id === +id) {
            return this.lastCache.model;
        }
        for (var i = 0, len = this.models.length; i < len; i++) {
            if (this.models[i].id === +id) {
                this.lastCache.id = +id;
                this.lastCache.model = this.models[i];
                return this.lastCache.model;
            }
        }
        return null;
    }

    count(options) {
        var q = new Promise((resolve, reject) => {
            var href = this.baseHref + '/rest/' + this.getResourceName() + '/!count?' + this.paramHelper.toParameters(options);
            this.http.get(href).then(response => {
                var retModel = response.content;
                resolve(+retModel.count);
            }).catch(reason => {
                reject(reason);
            });
        });
        return q;
    }

    remove(model) {
        return new Promise((resolve, reject) => {
            var href = this.baseHref + '/rest/' + this.getResourceName() + ((model.id > 0 ) ? "/" + model.id : "");
            this.http.delete(href).then(response => {
                if (response.statusCode === 204) {
                    resolve(true);
                } else {
                    reject(response);
                }
            }).catch(reason => {
                reject(reason);
            });
        });
    }

    _postfind(models) { //eslint-disable-line no-unused-vars
        // do nothing
    }

    find(options) {
        var self = this;
        var q = new Promise((resolve, reject) => {
            var opts = _.extend({}, self.getDefaultSearchOptions(), options);
            if (!self.loaded || !self.useCachedResult(opts)) {
                logger.debug("[" + self.getCollectionName() + "] retrieving items");
                self.eventBus.publish(EventNames.loadingStarted);
                var href = self.baseHref + '/rest/' + self.getResourceName();
                if (opts) {
                    href += '?' + self.paramHelper.toParameters(opts);
                }
                self.http.get(href).then(response => {
                    self.loaded = true;
                    if (response.statusCode === 200 && response.response) {
                        var resp = response.content;
                        self.models = resp[self.getCollectionName()];
                        self._postfind(self.models);
                        self.total = resp.total;
                    }
                    self.eventBus.publish(EventNames.loadingFinished);
                    self.parameters = opts;
                    resolve({models: self.models, total: self.total});
                }).catch(reason => {
                    self.eventBus.publish(EventNames.loadingFinished);
                    reject(reason);
                });

            } else {
                logger.debug("[" + self.getCollectionName() + "] Using cached result with " + self.total + " items.");
                resolve({models: self.models, total: self.total});
            }
        });
        return q;
    }

    save(model) {
        return new Promise((resolve, reject) => {
            var href = this.baseHref + '/rest/' + this.getResourceName() + ((model.id > 0 ) ? "/" + model.id : "");
            var body = JSON.stringify(model);
            this.http[(model.id > 0 ) ? 'put' : 'post'](href, body).then(response => {
                if ((response.statusCode === 200 || response.statusCode === 201) && response.response) {
                    var retModel = response.content;
                    var m = _.findWhere(this.models, {id: retModel.id});
                    if (m) {
                        _.merge(m, retModel);
                    } else {
                        m = retModel;
                        var index = 0;
                        for (index = 0; index < this.models.length; index++) {
                            if (m.name < this.models[index].name) {
                                break;
                            }
                        }
                        index = Math.max(index, this.models.length - 1);
                        this.models.splice(index, 0, m);
                    }
                    resolve(m);
                } else {
                    reject(response);
                }
            }).catch(reason => {
                reject(reason);
            });
        });
    }
}
