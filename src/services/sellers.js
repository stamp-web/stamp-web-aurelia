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

@inject(HttpClient, EventAggregator)
export class Sellers extends EntityManaged {

    constructor(http, eventBus) {
        super(http, eventBus);
    }

    getResourceName() {
        return "sellers";
    }

    updateInternalCount(data) {
        let stamp = (data) ? data.stamp : undefined;
        if( stamp && !stamp.wantList && stamp.stampOwnerships && stamp.stampOwnerships.length > 0 && this.loaded === true ) {
            let owner = stamp.stampOwnerships[0];
            let seller = this.getById( owner.sellerRef );
            if( seller ) {
                seller.stampCount = seller.stampCount + ((data.increment) ? 1 : -1);
            }
        }
    }

}
