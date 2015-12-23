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
import {BaseService} from "./base-service";
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../events/event-managed';

@inject(HttpClient, EventAggregator)
export class EntityManaged extends BaseService {

    constructor(http, eventBus) {
        super(http, eventBus);
        if( this.updateInternalCount ) {
            this.eventBus.subscribe(EventNames.stampCount, this.updateInternalCount.bind(this));
        }
    }

    getDefaultSearchOptions() {
        return {
            $orderby: 'name asc'
        };
    }

    countStamps() {
        var q = new Promise((resolve, reject) => {
            let href = this.baseHref + '/rest/' + this.getResourceName() + '/!countStamps';
            this.http.get(href).then(response => {
                let retModel = response.content;
                resolve(retModel);
            }).catch(reason => {
                reject(reason);
            });
        });
        return q;
    }
}
