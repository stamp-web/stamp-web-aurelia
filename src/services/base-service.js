/**
 Copyright 2016 Jason Drake

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ObjectUtilities} from '../util/object-utilities';
import {EventNames} from '../events/event-managed';
import {LogManager} from 'aurelia-framework';
import _ from 'lodash';
import $ from 'jquery';

const logger = LogManager.getLogger('services');

class ParameterHelper {

    toParameters(options) {
        let s = "";
        let keys = Object.keys(options);
        for (let k = 0; k < keys.length; k++) {
            if (s.length > 1) {
                s += "&";
            }
            s += keys[k] + '=' + encodeURIComponent(options[keys[k]]);
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
    selections = [];


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
        let theParams = this.monitoredParams(params);
        let cacheAndNew = function (newParams, currentParams) {
            return (typeof newParams._dc === 'undefined' && typeof currentParams._dc !== 'undefined');
        };
        let sameCache = function (newParams, currentParams) {
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
            throw new Error('Requires ' + this.getCollectionName() + ' to be loaded first.');
        }
        if (this.lastCache.id === +id) {
            return this.lastCache.model;
        }
        for (let i = 0, len = this.models.length; i < len; i++) {
            if (this.models[i].id === +id) {
                this.lastCache.id = +id;
                this.lastCache.model = this.models[i];
                return this.lastCache.model;
            }
        }
        return null;
    }

    count(options) {
        let q = new Promise((resolve, reject) => {
            let href = this.baseHref + '/rest/' + this.getResourceName() + '/!count?' + this.paramHelper.toParameters(options);
            this.http.get(href).then(response => {
                let retModel = response.content;
                resolve(+retModel.count);
            }).catch(reason => {
                reject(reason);
            });
        });
        return q;
    }

    remove(model) {
        let self = this;
        return new Promise((resolve, reject) => {
            if( model.id <= 0 ) {
                reject("Can not delete a non-persisted item from " + self.getCollectionName());
                return;
            }
            let href = self.baseHref + '/rest/' + this.getResourceName() + "/" + model.id;
            self.http.delete(href).then(response => {
                if (response.statusCode === 204) {
                    self.eventBus.publish(EventNames.deleteSuccessful, { type: self.getCollectionName(), id: model.id});
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

    _postSave(model) {} //eslint-disable-line no-unused-vars

    updateLocalEntry(model) {
        if( this.loaded && this.models.length > 0 ) {
            let m = _.find(this.models, { id: model.id });
            if(m) {
                _.merge(m, model);
                // Not sure if this is a good idea or not.
                this.eventBus.publish(EventNames.updateFinished, { type: this.getCollectionName(), model: m});
            } else {
                logger.debug("Could not locate id " + model.id + " in " + this.getCollectionName());
            }

        }
    }

    find(options) {
        let self = this;
        let q = new Promise((resolve, reject) => {
            let opts = _.extend({}, self.getDefaultSearchOptions(), options);
            if (!self.loaded || !self.useCachedResult(opts)) {
                logger.debug("[" + self.getCollectionName() + "] retrieving items");
                self.eventBus.publish(EventNames.loadingStarted);
                let href = self.baseHref + '/rest/' + self.getResourceName();
                if (opts) {
                    href += '?' + self.paramHelper.toParameters(opts);
                }
                self.http.get(href).then(response => {
                    self.loaded = true;
                    let total = 0;
                    let models = [];
                    if (response.statusCode === 200 && response.response) {
                        let resp = response.content;
                        models = resp[self.getCollectionName()];;
                        total = resp.total;
                        self._postfind(models);
                        if( !opts.noCache ) {
                            self.models = models;
                            self.total = total;
                        }
                    }
                    self.eventBus.publish(EventNames.loadingFinished);
                    self.parameters = opts;
                    resolve({models: models, total: total});
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

    select(model) {
        model.selected = true;
    }

    unselect(model) {
        model.selected = false;
    }

    selectAll() {
        _.each(this.models, model => {
            model.selected = true;
        });
    }

    clearSelected() {
        _.each(this.models, model => {
            model.selected = false;
        });
    }

    isSelected(model) {
        return model.selected === true;
    }

    getSelected() {
        let retVal = [];
        _.each(this.models, function(model) {
            if( model.selected ) {
                retVal.push(model);
            }
        });
        return retVal;
    }

    sortFunc(m) {
        return m;
    }

    save(model, opts) {
        let self = this;
        return new Promise((resolve, reject) => {
            let href = this.baseHref + '/rest/' + self.getResourceName() + ((model.id > 0 ) ? "/" + model.id : "");
             if( opts ) {
                href += '?' + this.paramHelper.toParameters(opts);
            }
            let body = JSON.stringify(model);
            let updating = model.id > 0;
            this.http[(updating) ? 'put' : 'post'](href, body).then(response => {
                if ((response.statusCode === 200 || response.statusCode === 201) && response.response) {
                    let retModel = response.content;
                    self._postSave(retModel);
                    let m = _.find(self.models, {id: retModel.id});
                    if (m) {
                        _.merge(m, retModel);
                    } else {
                        m = retModel;
                        let index = _.sortedIndexBy(self.models, m, this.sortFunc);
                        if( index < 0 ) {
                            index = self.models.length -1;
                        }
                        self.models.splice(index, 0, m);
                    }
                    self.eventBus.publish(EventNames.saveSuccessful, { type: self.getCollectionName(), model: m});
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
