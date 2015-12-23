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

    getResourceName() {
        return "catalogues";
    }

    _postfind(models) {
        _.each(models, catalogue => {
            catalogue.displayName = catalogue.issue + " - " + catalogue.name;
        });
    }

}
