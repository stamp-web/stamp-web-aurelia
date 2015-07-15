import {inject, bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

import 'resources/styles/components/nav/nav-bar.css!';

@inject(EventAggregator)
@bindable('router')
export class NavBar {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

}
