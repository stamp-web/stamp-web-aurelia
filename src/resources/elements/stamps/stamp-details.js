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
import {customElement, bindable} from 'aurelia-framework';
import {NewInstance} from 'aurelia-dependency-injection';
import {ValidationRules, ValidationController, validateTrigger} from 'aurelia-validation';
import {BindingEngine, bindingMode} from 'aurelia-binding';
import {I18N} from 'aurelia-i18n';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames, EventManaged} from '../../../events/event-managed';
import {Countries} from '../../../services/countries';
import {ValidationHelper} from '../../../util/validation-helper';

import $ from 'jquery';

@customElement('stamp-details')

export class StampDetailsComponent extends EventManaged {

    static inject = [EventAggregator, BindingEngine, I18N, Countries,  NewInstance.of(ValidationController)];

    @bindable model;
    @bindable({defaultBindingMode : bindingMode.twoWay}) isValid = true;

    countries = [];
    loading = true;
    editing = false;
    _modelSubscribers = [];

    constructor(eventBus, bindingEngine, i18n, countryService, validationController) {
        super(eventBus);
        this.bindingEngine = bindingEngine;
        this.i18n = i18n;
        this.countryService = countryService;
        this.validationController = validationController;
        this.validationController.validateTrigger = validateTrigger.manual;
        this.loadCountries();
    }

    detached() {
        super.detached();
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
    }

    modelChanged(newModel) {
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
        this._modelSubscribers = [];
        if( newModel ) {
            this.setupValidation();
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(newModel, 'countryRef').subscribe(this.countrySelected.bind(this)));
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(newModel, 'rate').subscribe(this._validate.bind(this)));
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(newModel, 'description').subscribe(this._validate.bind(this)));
            this.editing = newModel.id > 0;
            if( this.model.id <= 0 ) {
                _.debounce(() => {
                    $('#details-rate').focus();
                }, 50)(this);
            }
            _.defer( () => {
                this._validate();
            })
        }
    }

    _validate() {
        this.validationController.validate().then( result => {
           this.isValid = result.valid;
        });
    }


    countrySelected() {
        if (this.model.countryRef > 0) {
            this.eventBus.publish(EventNames.checkExists, {model: this.model});
            this.eventBus.publish(EventNames.calculateImagePath, { model: this.model});
        }
        this._validate();
    }

    changeEditMode(mode) {
        this.eventBus.publish(EventNames.changeEditMode, mode);
    }

    setupValidation() {
        ValidationHelper.defineNumericRangeRule( ValidationRules, 'country-selection',0);
        ValidationRules
            .ensure('rate')
            .required().withMessage(this.i18n.tr('messages.rateRequired'))
            .maxLength(25).withMessage(this.i18n.tr('messages.rateMaxLength'))
            .ensure('description')
            .required().withMessage(this.i18n.tr('messages.descriptionRequired'))
            .ensure('countryRef')
            .required().withMessage(this.i18n.tr('messages.countryRequired'))
            .satisfiesRule('country-selection').withMessage(this.i18n.tr('messages.countryRequired'))
            .on(this.model);
    }

    loadCountries() {
        var self = this;
        this.countryService.find(this.countryService.getDefaultSearchOptions()).then(results => {
            self.countries = results.models;
            self.loading = false;
        });
    }

}
