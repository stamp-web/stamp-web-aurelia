import {inject} from "aurelia-framework";
import {HttpClient} from "aurelia-http-client";
import {BaseService} from "./base-service";
import {EventAggregator} from 'aurelia-event-aggregator';

import _ from 'lodash';

@inject(HttpClient, EventAggregator)
export class Preferences extends BaseService {

    constructor(http, eventBus) {
        super(http, eventBus);
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
