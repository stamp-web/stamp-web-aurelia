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

import _ from 'lodash';
import {AppConfig} from "../app-config";

@inject(HttpClient, EventAggregator, AppConfig)
export class Preferences extends BaseService {

    constructor(http, eventBus,appConfig) {
        super(http, eventBus, appConfig);
    }

    getDefaultSearchOptions() {
        return {
            $orderby: 'name asc'
        };
    }

    getResourceName() {
        return "preferences";
    }

    getByNameAndCategory(name, category) {
        if (!this.loaded) {
            throw new Error("Requires the service to be loaded first.");
        }
        let index = _.findIndex( this.models, { name: name, category: category });
        return ( index >= 0 ) ? this.models[index] : null;
    }


}
