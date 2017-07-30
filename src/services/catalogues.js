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
import {EntityManaged} from "./entity-managed";
import {EventAggregator} from 'aurelia-event-aggregator';

import _ from 'lodash';

@inject(HttpClient, EventAggregator)
export class Catalogues extends EntityManaged {

    constructor(http, eventBus) {
        super(http, eventBus);
    }

    getDefaultSearchOptions() {
        return {
            $orderby: 'issue desc'
        };
    }

    sortFunc(m) {
        return -1 * m.issue;
    }


    getResourceName() {
        return "catalogues";
    }

    _generateDisplayName(catalogue) {
        catalogue.displayName = catalogue.issue + " - " + catalogue.name;
    }

    _postSave(model) {
        this._generateDisplayName(model);
    }

    _postfind(models) {
        _.each(models, catalogue => {
            this._generateDisplayName(catalogue);
        });
    }

}
