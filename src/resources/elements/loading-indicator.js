import nprogress from 'nprogress';
import {bindable, noView, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames, EventManaged} from '../../events/event-managed';

@noView
@bindable("loading")
@inject(EventAggregator)
export class LoadingIndicator extends EventManaged {

    constructor(eventBus) {
        super(eventBus);
        this.loadingCount = 0;

        nprogress.configure({
            showSpinner: false
        });
    }

    attached() {
        this.setupSubscriptions();
    }

    setupSubscriptions() {
        let self = this;
        this.subscribe(EventNames.loadingStarted, function() {
            nprogress.start();
            self.loadingCount++;
        });
        this.subscribe(EventNames.loadingFinished, function() {
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
