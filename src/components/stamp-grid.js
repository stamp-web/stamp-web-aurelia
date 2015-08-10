import {bindable, inject, customElement} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../events/event-names';
import {EventManaged} from '../events/event-managed';

import 'resources/styles/components/stamp-grid.css!';

@customElement('stamp-grid')
@bindable('stamps')
@bindable('editId')
@bindable('showCatalogueNumbers')
@inject(EventAggregator)
export class StampGrid extends EventManaged {

    selection;

    constructor(eventBus) {
        super(eventBus);
    }

    attached() {
        this.subscribe(EventNames.stampSelect, this.stampSelected.bind(this));
    }

    stampSelected(stamp) {
        this.selection = stamp;
    }
}
