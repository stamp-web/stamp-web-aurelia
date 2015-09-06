import {customElement, bindable, inject} from 'aurelia-framework';
import {Validation} from 'aurelia-validation';
import {ObserverLocator} from 'aurelia-binding';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../../events/event-names';
import {EventManaged} from '../../events/event-managed';
import {Countries} from '../../services/countries';

import $ from 'jquery';

@customElement('stamp-details')
@bindable('model')
@inject(EventAggregator, ObserverLocator, Validation, Countries)
export class StampDetailsComponent extends EventManaged {

    countries = [];
    loading = true;
    editing = false;
    _modelSubscribers = [];

    constructor(eventBus, observer, validator, countryService) {
        super(eventBus);
        this.observer = observer;
        this.validatorDI = validator;
        this.countryService = countryService;
        this.loadCountries();
    }

    detached() {
        super.detached();
        this._modelSubscribers.forEach(sub => {
            sub();
        });
    }

    modelChanged(newValue) {
        this._modelSubscribers.forEach(sub => {
            sub();
        });
        this._modelSubscribers = [];
        this._modelSubscribers.push(this.observer.getObserver(newValue, 'countryRef').subscribe(this.countrySelected.bind(this)));
        this.editing = newValue.id > 0;
        if( this.model.id <= 0 ) {
            setTimeout(function () {
                $('#details-rate').focus();
            });
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
