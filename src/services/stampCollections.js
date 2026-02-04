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
import {EventNames} from '../events/event-managed';
import {EventAggregator} from 'aurelia-event-aggregator';
import {AppConfig} from "../app-config";

@inject(HttpClient, EventAggregator, AppConfig)
export class StampCollections extends EntityManaged {

    constructor(http, eventBus, appConfig) {
        super(http, eventBus, appConfig);
        this.eventBus.subscribe( EventNames.stampCountForCollection, this.updateFromAlbumCount.bind(this));
    }

    getResourceName() {
        return "stampCollections";
    }

    updateFromAlbumCount(data) {
        if( data && this.loaded === true ) {
            let sc = this.getById( data.stampCollectionRef );
            if( sc ) {
                sc.stampCount = sc.stampCount + data.count;
            }
        }
    }

}
