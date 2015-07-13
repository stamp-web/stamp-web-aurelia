import {inject} from "aurelia-framework";
import {HttpClient} from "aurelia-http-client";
import {BaseService} from "services/base-service";
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(HttpClient, EventAggregator)
export class Preferences extends BaseService {

    constructor(http, eventBus) {
        super(http, eventBus);
    }

    getResourceName() {
        return "preferences";
    }

    getByNameAndCategory(name, category) {
        if (!this.loaded) {
            throw new Error("Requires the service to be loaded first.");
        }
        let result = null;
        for (var i = 0, len = this.models.length; i < len; i++) {
            if (this.models[i].name === name && this.models[i].category === category) {
                result = this.models[i];
            }
        }
        return result;
    }


}
