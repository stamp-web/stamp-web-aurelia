import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ObjectUtilities} from '../util/object-utilities';
import {EventNames} from '../event-names';
import {LogManager} from 'aurelia-framework';
import  _  from 'lodash';

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
		this.eventBus = eventBus
		this.http.configure(x => {
			//       x.withHeader('Authorization', 'Basic ' + btoa(this.username + ":" + this.password));
			x.withHeader('Accept', 'application/json');
			x.withHeader('Content-Type', 'application/json');
		});
	}

	monitoredParams(params) {
		var p = {};
		var reservedKeys = ['$filter', '$top', '$orderby', '$skip'];
		if (params) {
			for (var i = 0, keys = Object.keys(params); i < keys.length; i++) {
				reservedKeys.forEach(k => {
					if (keys[i] === k) {
						p[k] = params[k];
					}
				});
			}
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
		var the_params = this.monitoredParams(params);
		var cacheAndNew = function (params, a_params) {
			return (typeof params._dc === 'undefined' && typeof a_params._dc !== 'undefined');
		};
		var sameCache = function (params, a_params) {
			return params._dc === a_params._dc;
		};
		if (this.models.length > 0 && ObjectUtilities.isEqual(this.monitoredParams(params), this.parameters) &&
			(((!this.parameters || Object.keys(this.parameters).length === 0) && params === undefined) || (this.parameters !== undefined &&
			params !== undefined && (cacheAndNew(params, this.parameters) || sameCache(params, this.parameters))))) {
			return true;
		}
		return false;
	}

;


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
				resolve(+response.response);
			}).catch(reason => {
				reject(reason);
			});
		});
		return q;
	}

	find(options) {
		var q = new Promise((resolve, reject) => {
			if (!this.loaded || !this.useCachedResult(options)) {
				logger.debug("[" + this.getCollectionName() + "] retrieving items");
				this.eventBus.publish(EventNames.loadingStarted);
				var href = this.baseHref + '/rest/' + this.getResourceName();
				if (options) {
					href += '?' + this.paramHelper.toParameters(options);
				}
				this.http.get(href).then(response => {
					this.loaded = true;
					if (response.statusCode === 200 && response.response) {
						var resp = JSON.parse(response.response);
						this.models = resp[this.getCollectionName()];
						this.total = resp.total;
					}
					this.eventBus.publish(EventNames.loadingFinished);
					resolve({models: this.models, total: this.total});
				}).catch(reason => {
					this.eventBus.publish(EventNames.loadingFinished);
					reject(reason);
				});

			} else {
				logger.debug("[" + this.getCollectionName() + "] Using cached result with " + this.total + " items.");
				resolve({models: this.models, total: this.total});
			}
		});
		return q;
	}

	save(model) {
		return new Promise((resolve, reject) => {
			var href = this.baseHref + '/rest/' + this.getResourceName() + ((model.id > 0 ) ? "/" + model.id : "");
			var body = JSON.stringify(model);
			console.log(body);
			this.http[(model.id > 0 ) ? 'put' : 'post'](href, body).then(response => {
				if ( (response.statusCode === 200 || response.statusCode === 201) && response.response) {
					var retModel = JSON.parse(response.response);
					var m = _.findWhere(this.models, {id: retModel.id});
					if (m) {
						_.merge(m, retModel);
					} else {
						m = retModel;
						var index = 0;
						for (index = 0; index < this.models.length; index++) {
							if (m.name  < this.models[index].name) {
								break;
							}
						}
						index = Math.max(index,this.models.length-1);
						this.models.splice(index,0, m);
					}
					resolve(m);
				} else {
					reject( response );
				}
			}).catch(reason => {
				reject(reason);
			});
		});
	}
}
