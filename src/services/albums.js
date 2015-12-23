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
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../events/event-managed';

@inject(HttpClient, EventAggregator)
export class Albums extends EntityManaged {

    constructor(http, eventBus) {
        super(http, eventBus);
        this.eventBus.subscribe(EventNames.countryDeleted, this.handleCountryDelete.bind(this));
    }

    getResourceName() {
        return "albums";
    }

    /**
     *
     * @param data contains the country id via "id" and count of deleted stamps.
     */
    handleCountryDelete(data) { //eslint-disable-line no-unused-vars
        if( this.loaded && this.models.length > 0 ) {
            delete this.models[0].stampCount;
        }
        //this.loaded = false;
    }

    updateInternalCount(data) {
        let stamp = (data) ? data.stamp : undefined;
        if( stamp && !stamp.wantList && stamp.stampOwnerships && stamp.stampOwnerships.length > 0 && this.loaded === true) {
            let owner = stamp.stampOwnerships[0];
            let album = this.getById( owner.albumRef );
            if( album ) {
                let delta = (data.increment) ? 1 : -1;
                album.stampCount = album.stampCount + delta;
                this.eventBus.publish( EventNames.stampCountForCollection, { stampCollectionRef: album.stampCollectionRef, count: delta});
            }
        }
    }

    /**
     * Will remove an album from the system.  This particular implementation differs from
     * the entity-managed implementation as it will notify the stamp collection service
     * through events (if loaded) of the removal of an album along with all the stamps
     * of that collection such that it can be properly updated.
     *
     * @param model
     * @returns {Promise}
     */
    remove(model) {
        var q = new Promise((resolve, reject) => {
            let count = (model && model.stampCount > 0 ) ? -1 * model.stampCount : 0;
            let stampCollectionRef = ( model && model.stampCollectionRef ) ? model.stampCollectionRef : 0;
            super.remove(model).then(result => {
                if( stampCollectionRef > 0 ) {
                    this.eventBus.publish( EventNames.stampCountForCollection, { stampCollectionRef: stampCollectionRef, count: count});
                }
                resolve(result);
            }).catch( err => {
                reject(err);
            });
        });
        return q;
    }
}
