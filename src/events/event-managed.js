import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class EventManaged {

    _subscribers = [];

    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    subscribe(key, func) {
        if (!this._subscribers[key]) {
            this._subscribers[key] = [];
        }
        this._subscribers[key].push(this.eventBus.subscribe(key, func));
    }

    detached() {
        let self = this;
        self._subscribers.forEach(key => {
            self.unsubscribe(key);
        });
    }

    unsubscribe(key) {
        this._subscribers[key].forEach(sub => {
            sub();
        });
    }
}
