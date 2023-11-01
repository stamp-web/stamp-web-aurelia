/**
 Copyright 2023 Jason Drake

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
import $ from 'jquery';
import _ from 'lodash';
import {EventAggregator} from "aurelia-event-aggregator";
import {BindingEngine} from "aurelia-binding";
import {I18N} from "aurelia-i18n";
import {NewInstance} from "aurelia-dependency-injection";
import {validateTrigger, ValidationController, ValidationRules} from "aurelia-validation";
import {bindable} from "aurelia-framework";
import {EventNames} from "../../../events/event-managed";

export class sellerEditor {

    static inject = [EventAggregator, BindingEngine,  I18N, NewInstance.of(ValidationController)];

    @bindable model;

    _modelSubscribers = [];

    constructor(eventBus, bindingEngine, i18n, validationController) {
        this.eventBus = eventBus;
        this.bindingEngine = bindingEngine;
        this.i18n = i18n;
        this.validationController = validationController;
        this.validationController.validationTigger = validateTrigger.manual;
    }

    deactivate() {
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
    }

    activate(options) {
        this.model = options;
        this.setupValidation();
        if( !this.model.id > 0 ) {
            this.model.name = '';
            _.debounce( () => {
                $('#editor-name').focus();
            }, 125)();
        }
        this._modelSubscribers.push(this.bindingEngine.propertyObserver(this.model, 'name').subscribe(this._validate.bind(this)));
        _.debounce( () => {
            this._validate();
        }, 125)();
    }

    _validate() {
        this.validationController.validate().then( result => {
            this.eventBus.publish(EventNames.valid, result.valid);
        });
    }

    setupValidation() {
        ValidationRules
            .ensure('name')
            .required().withMessage(this.i18n.tr('messages.nameRequired'))
            .on(this.model);
    }

}
