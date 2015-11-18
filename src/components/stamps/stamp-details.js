import {customElement, bindable, inject} from 'aurelia-framework';
import {Validation} from 'aurelia-validation';
import {BindingEngine} from 'aurelia-binding'; // technically this is a static not a DI until next release
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../../events/event-names';
import {EventManaged} from '../../events/event-managed';
import {Countries} from '../../services/countries';

import $ from 'jquery';

@customElement('stamp-details')
@bindable('model')
@inject(EventAggregator, BindingEngine, Validation, Countries)
export class StampDetailsComponent extends EventManaged {

    countries = [];
    loading = true;
    editing = false;
    _modelSubscribers = [];

    constructor(eventBus, $bindingEngine, validator, countryService) {
        super(eventBus);
        this.$bindingEngine = $bindingEngine;
        this.validatorDI = validator;
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
            this._modelSubscribers.push(this.$bindingEngine.propertyObserver(newValue, 'countryRef').subscribe(this.countrySelected.bind(this)));
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
