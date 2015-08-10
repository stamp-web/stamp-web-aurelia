import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

import {EventManaged} from '../../events/event-managed';
import {KeyCodes, EventNames} from '../../events/event-names';

@inject(EventAggregator)
export class TextEditor extends EventManaged{

    model;

    constructor(eventBus) {
        super(eventBus);
    }

    activate(model) {
        this.model = model;
    }

    handleKeys(evt) {
        if( evt && evt.keyCode === KeyCodes.VK_ESCAPE) {
            this.cancel();
        }
    }

    cancel() {
        this.eventBus.publish(EventNames.editorCancel);
    }
}
