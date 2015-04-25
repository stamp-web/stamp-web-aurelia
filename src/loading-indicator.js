import nprogress from 'nprogress';
import {bindable, noView, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from './event-names';


console.log(EventNames);

@noView
@bindable("loading")
@inject(EventAggregator)
export class LoadingIndicator {

    constructor(eventBus) {
      this.eventBus = eventBus;
      this.loadingCount = 0;
      this.subscribe();
    }

    subscribe() {
      this.eventBus.subscribe(EventNames.loadingStarted, options => {
        nprogress.start();
        this.loadingCount++;
      });
      this.eventBus.subscribe(EventNames.loadingFinished, options => {
        this.loadingCount--;
        if( !this.loading && this.loadingCount === 0) {
          nprogress.done();
        }
      });

    }

    loadingChanged(newValue) {
        if(newValue) {
            nprogress.start();
        } else {
            nprogress.done();
        }

    }
}
