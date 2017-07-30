/**
 Copyright 2016 Jason Drake

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import {bindable, customElement} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames, EventManaged} from '../../events/event-managed';

@customElement('editor-dialog')
@bindable('model')
@bindable('dialogId')
@bindable('content')
@bindable('title')
@bindable('icon')
export class EditorDialog extends EventManaged {

    static inject = [EventAggregator, I18N];

    errorMsg = '';
    subscriptions = [];
    valid = true;

    constructor(eventBus, i18n) {
        super(eventBus);
        this.i18n = i18n;
        this.eventBus = eventBus;
        this.setupSubscriptions();
    }

    modelChanged() {
        this._resetState();
    }

    _resetState() {
        this.valid = true;
        this.errorMsg = '';
    }

    setupSubscriptions() {
        var that = this;
        this.subscribe(EventNames.close, function () {
            $("#" + that.dialogId).modal('hide');
        });
        this.subscribe(EventNames.actionError, msg => {
            let m = (msg === 'Internal Server Error') ? this.i18n.tr('errors.server-unavailable') : msg;
            this.errorMsg = m;
        });
        this.subscribe(EventNames.valid, val => {
            this.errorMsg = val === true ? '' : this.i18n.tr('messages.resolveErrors');
            this.valid = val === true;
        });
        this.subscribe(EventNames.setAspects, data => {
            this.aspects = data;
        });
    }

    save() {
        this.eventBus.publish(EventNames.save, {model: this.model, aspects: this.aspects});

    }
}
