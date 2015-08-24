/**
 Copyright 2015 Jason Drake

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
import {bindable, customElement, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../events/event-names';

@customElement('editor-dialog')
@bindable('model')
@bindable('dialogId')
@bindable('content')
@bindable('title')
@bindable('icon')
@inject(EventAggregator)
export class EditorDialog {

    errorMsg = "None";

    constructor(eventBus) {
        this.eventBus = eventBus;
        this.setupSubscriptions();
    }

    setupSubscriptions() {
        var that = this;
        this.eventBus.subscribe(EventNames.close, function () {
            $("#" + that.dialogId).modal('hide');
        });
        this.eventBus.subscribe(EventNames.actionError, msg => {
            this.errorMsg = msg;
        });
    }

    save() {
        this.eventBus.publish(EventNames.save, this.model);

    }
}
