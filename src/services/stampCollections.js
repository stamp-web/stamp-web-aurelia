import {inject} from "aurelia-framework";
import {HttpClient} from "aurelia-http-client";
import {BaseService} from "services/base-service";
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(HttpClient, EventAggregator)
export class StampCollections extends BaseService {

    constructor(http, eventBus) {
        super(http, eventBus);
    }

    getResourceName() {
        return "stampCollections";
    }

}
