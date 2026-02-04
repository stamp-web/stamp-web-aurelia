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
import {Stamps} from "./stamps";

import _ from 'lodash';
import {AppConfig} from "../app-config";

@inject(HttpClient, EventAggregator, AppConfig, Stamps)
export class CatalogueNumbers extends BaseService {

    constructor(http, eventBus, appConfig, stampService) {
        super(http, eventBus, appConfig);
        this.stampService = stampService;
    }

    getResourceName() {
        return "catalogueNumbers";
    }

    updateInternalCount(data) {
        let stamp = (data) ? data.stamp : undefined;
        if( stamp && stamp.catalogueNumbers && this.loaded === true) {
            let index = _.findIndex( stamp.catalogueNumbers, { active: true });
            if( index >= 0 ) {
                let cn = stamp.catalogueNumbers[index];
                let c = this.getById( cn.catalogueRef );
                if( c ) {
                    c.stampCount = c.stampCount + ( (data.increment) ? 1 : -1 );
                }
            }
        }
    }


    /**
     * Will set a catalogue number as active, updating the current catalogue number state (including current active)
     * for the stamp.  The stamp will be returned that is the current/latest state of the stamp.
     *
     * @url POST /rest/catalogueNumbers/%id%/makeActive
     *
     * @param id
     * @returns {Promise}
     */
    makeActive(id) {
        let self = this;
        let q = new Promise((resolve, reject) => {
            let href = this.baseHref + '/rest/' + this.getResourceName() + '/' + id + '/makeActive';
            self.http.post(href).then(response => {
                let stampModel = response.content;
                self.stampService.updateLocalEntry( stampModel );
                resolve(stampModel);
            }).catch(reason => {
                reject(reason);
            });
        });
        return q;
    }

}
