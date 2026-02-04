import {inject, bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import { AppConfig } from 'app-config';

@inject(EventAggregator, AppConfig)
@bindable('router')
export class NavBar {

    config = null;

    constructor(eventBus, appConfig) {
        this.eventBus = eventBus;
        this.appConfig = appConfig;
    }

    get stampWebHref( ) {
        return this.appConfig.stampWebUrl;
    }
}
