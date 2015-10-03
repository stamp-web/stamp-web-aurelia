import {bindable, customElement, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../../events/event-names';

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
export class CollapsePanel {


    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    hide() {
        this.collapsed = true;
        this.eventBus.publish(EventNames.panelCollapsed, { name: this.name });
    }


}
