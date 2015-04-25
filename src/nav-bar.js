import {inject, bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from './event-names';

@inject(EventAggregator)
@bindable('router')
export class NavBar {
  constructor(eventBus) {
    this.eventBus = eventBus;
  }

}
