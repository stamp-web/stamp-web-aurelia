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
import {inject} from "aurelia-framework";
import {HttpClient} from "aurelia-http-client";
import {BaseService} from "./base-service";
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../events/event-managed';

import _ from 'lodash';
import {AppConfig} from "../app-config";

@inject(HttpClient, EventAggregator, AppConfig)
export class Stamps extends BaseService {

    constructor(http, eventBus, appConfig) {
        super(http, eventBus, appConfig);
        this.setupListeners();

    }

    setupListeners() {
        this.eventBus.subscribe( EventNames.deleteSuccessful, this.handleDelete.bind(this));
    }

    getResourceName() {
        return "stamps";
    }

    purchase(stamps, purchasePrice, currencyCode) {
        let q = new Promise((resolve, reject) => {
            let ids = _.map(stamps, s => s.id);
            let body = JSON.stringify({stamps: ids, pricePaid: purchasePrice, currencyCode});
            let href = this.baseHref + '/rest/' + this.getResourceName() + '/purchase';
            this.http.post(href, body).then(response => {
                resolve();
            }).catch(reason => {
                reject(reason);
            });
        });
        return q;
    }

    executeReport(options) {
        let opts = _.extend({}, this.getDefaultSearchOptions(), options);
        let self = this;
        let q = new Promise((resolve, reject) => {
            let href = self.baseHref + '/rest/reports?' + self.paramHelper.toParameters(opts);
            self.http.get(href).then(response => {
                let retModel = response.content;
                resolve(retModel);
            }).catch(reason => {
                reject(reason);
            });
        });
        return q;
    }

    handleDelete(obj) {
        if( obj && obj.type === 'catalogueNumbers' && obj.id >= 0 ) {
            for(let i = 0, len = this.models.length; i < len; i++ ) {
                let index = _.findIndex(this.models[i].catalogueNumbers, { id: +obj.id });
                if( index >= 0 ) {
                    this.models[i].catalogueNumbers.splice(1, index);
                    break;
                }
            }

        }
    }
}
