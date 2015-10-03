import nprogress from 'nprogress';
import {bindable, noView, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../events/event-names';

import 'resources/styles/components/loading-indicator.css!';

@noView
@bindable("loading")
@inject(EventAggregator)
export class LoadingIndicator {

    constructor(eventBus) {
        this.eventBus = eventBus;
        this.loadingCount = 0;
        this.subscribe();
        nprogress.configure({
            showSpinner: false
        });
    }

    subscribe() {
        let self = this;
        this.eventBus.subscribe(EventNames.loadingStarted, function() {
            nprogress.start();
            self.loadingCount++;
        });
        this.eventBus.subscribe(EventNames.loadingFinished, function() {
            self.loadingCount--;
            if (!self.loading && self.loadingCount <= 0) {
                nprogress.done();
                self.loadingCount = 0;
            }
        });

    }

    loadingChanged(newValue) {
        if (newValue) {
            nprogress.start();
        } else {
            nprogress.done();
        }

    }
}
