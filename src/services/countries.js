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
import {EntityManaged} from "./entity-managed";
import {EventNames} from '../events/event-managed';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(HttpClient, EventAggregator)
export class Countries extends EntityManaged {

    constructor(http, eventBus) {
        super(http, eventBus);
    }

    getResourceName() {
        return "countries";
    }

    updateInternalCount(data) {
        if( data && data.stamp && this.loaded === true ) {
            let country = this.getById( data.stamp.countryRef );
            if( country ) {
                country.stampCount = country.stampCount + ((data.increment) ? 1 : -1);
            }
        }
    }

    /**
     * Will emit an event that a country has been deleted.
     * This particular implementation differs from the entity-managed implementation as
     * it will notify the album service of changes.  Since it is expensive on the client
     * to calculate which albums contain which stamps from the deleting country, simply
     * the count is sent along.
     *
     * @param model
     * @returns {Promise}
     */
    remove(model) {
        var q = new Promise((resolve, reject) => {
            let count = (model && model.stampCount > 0 ) ? -1 * model.stampCount : 0;
            super.remove(model).then(result => {
                this.eventBus.publish( EventNames.countryDeleted, { id: model.id, count: count } );
                resolve(result);
            }).catch( err => {
                reject(err);
            });
        });
        return q;
    }

}
