import {inject} from "aurelia-framework";
import {HttpClient} from "aurelia-http-client";
import {EntityManaged} from "services/entity-managed";
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(HttpClient, EventAggregator)
export class Albums extends EntityManaged {

    constructor(http, eventBus) {
        super(http, eventBus);
    }

    getResourceName() {
        return "albums";
    }

}
