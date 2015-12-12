/**
 Copyright 2015 Jason Drake

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
import {BaseService} from "services/base-service";
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../events/event-managed';

import _ from 'lodash';

@inject(HttpClient, EventAggregator)
export class Stamps extends BaseService {

    constructor(http, eventBus) {
        super(http, eventBus);
        this.setupListeners();

    }

    setupListeners() {
        this.eventBus.subscribe( EventNames.deleteSuccessful, this.handleDelete.bind(this));
    }

    getResourceName() {
        return "stamps";
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
