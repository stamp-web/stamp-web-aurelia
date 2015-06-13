import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class EventManaged {

    _subscribers = [];

    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    subscribe(key, func) {
        this._subscribers.push(this.eventBus.subscribe(key, func));
    }

    detached() {
        this._subscribers.forEach(sub => {
            sub();
        });
    }
}
