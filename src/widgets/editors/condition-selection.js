import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

import {EventManaged} from '../../events/event-managed';
import {KeyCodes, EventNames} from '../../events/event-names';
import {Condition} from '../../util/common-models';

import _ from 'lodash';
import 'resources/styles/widgets/editors/condition-selection.css!';


@inject(Element, EventAggregator)
export class ConditionSelection extends EventManaged {

    conditions = Condition.symbols();
    model;

    constructor(elm, eventBus) {
        super(eventBus);
        this.element = elm;
    }


    activate(model) {
        this.model = model;

    }

    attached() {
        let self = this;
        $(self.element).find('select-picker').on('change', self.cancel.bind(this));
        console.log("attached");
    }

    detached() {
        $(self.element).find('select-picker').off('change');
    }

    handleKeys(evt) {
        if( evt && evt.keyCode === KeyCodes.VK_ESCAPE) {
            this.cancel();
        }
    }

    cancel() {
        _.debounce( () => {
            this.eventBus.publish(EventNames.editorCancel);
        }, 25)(this);


    }
}
