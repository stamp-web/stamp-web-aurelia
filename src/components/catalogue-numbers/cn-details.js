import {customElement, bindable} from 'aurelia-framework';
import {Validator, ValidationEngine} from 'aurelia-validatejs';
import {BindingEngine} from 'aurelia-binding';
import {I18N} from 'aurelia-i18n';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames, EventManaged} from '../../events/event-managed';
import {Catalogues} from '../../services/catalogues';
import {Condition} from '../../util/common-models';
import _ from 'lodash';
import $ from 'jquery';

@customElement('catalogue-number-details')
@bindable('model')
@bindable('selectedCatalogue')
export class CatalogueNumberDetailsComponent extends EventManaged {

    static inject = [EventAggregator, BindingEngine, I18N, Catalogues];

    catalogues = [];
    icon;
    conflictMessage;
    conversionModel;
    conditions = Condition.symbols();
    loading = true;
    selectedCatalogue;
    showWarning = false;
    isValid = false;

    _modelSubscribers = [];

    constructor(eventBus, $bindingEngine, i18n, catalogueService) {
        super(eventBus);
        this.catalogueService = catalogueService;
        this.bindingEngine = $bindingEngine;
        this.i18n = i18n;
        this.loadCatalogues();
    }

    attached() {
        this.subscribe(EventNames.conflictExists, this.handleConflictExists.bind(this));
    }

    detached() {
        super.detached();
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
        if( this.observer ) {
            this.observer.dispose();
        }
    }

    setupValidation() {
        this.validator = new Validator(this.model)
            .ensure('number')
                .length({ minimum: 1, maximum: 25, message: this.i18n.tr('messages.numberInvalid')})
                .required( { message: this.i18n.tr('messages.numberRequired')});
        this.reporter = ValidationEngine.getValidationReporter(this.model);
        if( this.observer ) {
            this.observer.dispose();
        }
        this.observer = this.reporter.subscribe(this.handleValidation.bind(this));
    }

    validate() {
        this.validator.validate();
    }

    handleValidation(result) {
        this.isValid = result.length === 0;
    }

    handleConflictExists(data) {
        if (data) {
            this.icon = (data.convert) ? 'sw-convert sw-icon-exchange' : 'sw-warning sw-icon-attention';
            this.conflictMessage = (data.convert) ?
                'Click to convert the wanted stamp using the existing country, catalogue and number.' :
                'A stamp with this country, catalogue and number already exists.';
            this.conversionModel = data.conversionModel;
            this.showWarning = true;
            if( this.model.id <= 0 ) {
                this.playConflict(); // only play conflict for new stamps
            }

        }
    }

    playConflict() {
        var audioElm = $('audio#sw-exist-sound');
        if( audioElm.length > 0 ) {
            var audio = audioElm[0];
            if( audio.readyState >= 4 ) {
                audio.play();
            }
        }
    }

    convert() {
        this.eventBus.publish(EventNames.convert, this.conversionModel);
    }

    modelChanged(newValue) {
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
        this._modelSubscribers = [];
        if( newValue ) {
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(newValue, 'catalogueRef').subscribe(this.catalogueChanged.bind(this)));
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(newValue, 'condition').subscribe(this.sendNotifications.bind(this)));
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(newValue, 'number').subscribe(this.sendNotifications.bind(this)));
            this.showWarning = false;
            this.icon = ''; // clear exists icon
            this.conversionModel = undefined; // clear conversion context
            this.setupValidation();
            let self = this;
            setTimeout(() => {
                self.sendNotifications(); // check or initial conversion of wantlist as well as initial validation
            }, 125);
        }
    }

    catalogueChanged(newValue) {
        if (newValue > 0) {
            this.selectedCatalogue = _.findWhere(this.catalogues, {id: +newValue});
            this.sendNotifications();
        }
    }

    sendNotifications() {
        this.validate(); // in theory only number changes need to validate
        if( this.model.number && this.model.number !== '' ) {
            if (this.model.catalogueRef > 0) {
                this.icon = '';
                this.showWarning = false;
                this.eventBus.publish(EventNames.checkExists, {model: this.model});
            }
            if( this.model.id <= 0 && this.model.condition >= 0 ) {
                this.eventBus.publish(EventNames.calculateImagePath, { model: this.model});
            }
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
