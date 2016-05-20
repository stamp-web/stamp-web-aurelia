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
import {customElement, bindable} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-binding';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames, EventManaged} from '../../events/event-managed';
import {Countries} from '../../services/countries';

import $ from 'jquery';

@customElement('stamp-details')
@bindable('model')
export class StampDetailsComponent extends EventManaged {

    static inject = [EventAggregator, BindingEngine, Countries];

    countries = [];
    loading = true;
    editing = false;
    _modelSubscribers = [];

    constructor(eventBus, $bindingEngine, countryService) {
        super(eventBus);
        this.bindingEngine = $bindingEngine;
        this.countryService = countryService;
        this.loadCountries();
    }

    detached() {
        super.detached();
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
    }

    modelChanged(newValue) {
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
        this._modelSubscribers = [];
        if( newValue ) {
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(newValue, 'countryRef').subscribe(this.countrySelected.bind(this)));
            this.editing = newValue.id > 0;
            if( this.model.id <= 0 ) {
                setTimeout(function () {
                    $('#details-rate').focus();
                }, 25);
            }
        }
    }

    countrySelected() {
        if (this.model.countryRef > 0) {
            this.eventBus.publish(EventNames.checkExists, {model: this.model});
            this.eventBus.publish(EventNames.calculateImagePath, { model: this.model});
        }
    }

    changeEditMode(mode) {
        this.eventBus.publish(EventNames.changeEditMode, mode);
    }

    loadCountries() {
        var self = this;
        this.countryService.find(this.countryService.getDefaultSearchOptions()).then(results => {
            self.countries = results.models;
            self.loading = false;
        });
    }

}
