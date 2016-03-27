import {inject, bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
@bindable('router')
export class NavBar {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

}
