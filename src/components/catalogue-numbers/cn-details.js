import {customElement, bindable, inject} from 'aurelia-framework';
import {Validation} from 'aurelia-validation';
import {ObserverLocator} from 'aurelia-binding';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../../events/event-names';
import {EventManaged} from '../../events/event-managed';
import {Catalogues} from '../../services/catalogues';
import {Condition} from '../../util/common-models';
import _ from 'lodash';

import 'resources/styles/components/catalogue-numbers/cn-details.css!';

@customElement('catalogue-number-details')
@bindable('model')
@bindable('selectedCatalogue')
@inject(EventAggregator, ObserverLocator, Validation, Catalogues)
export class CatalogueNumberDetailsComponent extends EventManaged {

    catalogues = [];
    icon;
    conversionModel;
    conditions = Condition.symbols();
    loading = true;
    selectedCatalogue;

    _modelSubscribers = [];

    constructor(eventBus, observer, validation, catalogueService) {
        super(eventBus);
        this.catalogueService = catalogueService;
        this.observer = observer;
        this.validatorDI = validation;
        this.loadCatalogues();
    }

    attached() {
        this.subscribe(EventNames.conflictExists, this.handleConflictExists.bind(this));
    }

    setupValidation(validation) {
        this.validation = validation.on(this.model)
            .ensure('number')
            .isNotEmpty()
            .hasMinLength(1)
            .hasMaxLength(25)
            .ensure('catalogueRef')
            .isNotEmpty()
            .isGreaterThan(0);
    }


    handleConflictExists(data) {
        if (data) {
            console.log(data);
            this.icon = (data.convert) ? 'sw-convert sw-icon-exchange' : 'sw-warning sw-icon-attention';
            this.conversionModel = data.conversionModel;
        }
    }

    convert() {
        this.eventBus.publish(EventNames.convert, this.conversionModel);
    }

    modelChanged(newValue) {
        this._modelSubscribers.forEach(sub => {
            sub();
        });
        this._modelSubscribers = [];
        this._modelSubscribers.push(this.observer.getObserver(newValue, 'catalogueRef').subscribe(this.catalogueChanged.bind(this)));
        this._modelSubscribers.push(this.observer.getObserver(newValue, 'condition').subscribe(this.sendExistsVerfication.bind(this)));
        this._modelSubscribers.push(this.observer.getObserver(newValue, 'number').subscribe(this.sendExistsVerfication.bind(this)));
        this.setupValidation(this.validatorDI);
    }

    catalogueChanged(newValue) {
        if (newValue > 0) {
            this.selectedCatalogue = _.findWhere(this.catalogues, {id: +newValue});
            this.sendExistsVerfication();
        }
    }

    sendExistsVerfication() {
        if (this.model.catalogueRef > 0 && this.model.number && this.model.number !== '') {
            this.icon = '';
            this.eventBus.publish(EventNames.checkExists, {model: this.model});
        }
    }

    loadCatalogues() {
        var self = this;
        this.catalogueService.find({
            $orderby: 'issue desc'
        }).then(results => {
            self.catalogues = results.models;
            self.loading = false;
        });
    }
}
