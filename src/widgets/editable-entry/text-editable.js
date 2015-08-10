import {customElement, bindable, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../../events/event-names';
import {EventManaged} from '../../events/event-managed';

import _ from 'lodash';
import $ from 'jquery';

import 'resources/styles/widgets/editable-entry/text-editable.css!';

/**
 * This is not being used and is a prototype only
 */
@customElement('text-editable')
@bindable('value')
@bindable({
    name: 'editor',
    defaultValue: 'widgets/editors/text'
})
@inject(Element, EventAggregator)
export class TextEditableCustomElement extends EventManaged {
    editing = false;

    constructor(elm, eventBus) {
        super(eventBus);
        this.element = elm;

    }

    startEdit() {
        this.editing = true;
        this.subscribe(EventNames.editorCancel, this.stopEdit.bind(this));
        _.debounce(() => {
            $(this.element).parent().find('.text-editable').focus();
        }, 25)(this);
    }

    valueChanged(newVal) {
        console.log(newVal);
    }

    stopEdit() {
        this.editing = false;
        this.unsubscribe(EventNames.editorCancel);
    }

}
