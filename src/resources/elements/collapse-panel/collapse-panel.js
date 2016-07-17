import {bindable, customElement, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames, EventManaged} from '../../../events/event-managed';

@bindable('title')
@bindable({
    name: "name",
    defaultValue: "collapsing-panel"
})
@bindable({
    name: "collapsed",
    defaultValue: false
})
@customElement('collapse-panel')
@inject(EventAggregator)
export class CollapsePanel extends EventManaged {


    constructor(eventBus) {
        super(eventBus);
    }

    attached() {
        this.setupSubscriptions();
    }

    setupSubscriptions() {
        this.subscribe(EventNames.collapsePanel, () => {
            this.hide();
        });
    }

    hide() {
        this.collapsed = true;
        this.eventBus.publish(EventNames.panelCollapsed, { name: this.name });
    }


}
