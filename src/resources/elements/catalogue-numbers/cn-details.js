import {customElement, bindable} from 'aurelia-framework';
import {NewInstance} from 'aurelia-dependency-injection';
import {ValidationController, ValidationRules, validateTrigger} from 'aurelia-validation';
import {BindingEngine, bindingMode} from 'aurelia-binding';
import {I18N} from 'aurelia-i18n';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames, EventManaged} from '../../../events/event-managed';
import {Catalogues} from '../../../services/catalogues';
import {Condition} from '../../../util/common-models';
import {ValidationHelper} from '../../../util/validation-helper';
import _ from 'lodash';
import $ from 'jquery';

@customElement('catalogue-number-details')
export class CatalogueNumberDetailsComponent extends EventManaged {

    static inject = [EventAggregator, BindingEngine, I18N, Catalogues, NewInstance.of(ValidationController)];

    @bindable model;
    @bindable({defaultBindingMode : bindingMode.twoWay}) isValid = true;

    catalogues = [];
    icon;
    conflictMessage;
    conversionModel;
    conditions = Condition.symbols();
    loading = true;
    selectedCatalogue;
    showWarning = false;
    validationSubscriber;

    _modelSubscribers = [];

    constructor(eventBus, bindingEngine, i18n, catalogueService, validationController) {
        super(eventBus);
        this.catalogueService = catalogueService;
        this.bindingEngine = bindingEngine;
        this.i18n = i18n;
        validationController.validateTrigger = validateTrigger.manual;
        this.validationController = validationController;
        this._loadCatalogues();
    }

    attached() {
        this.subscribe(EventNames.conflictExists, this.handleConflictExists.bind(this));
    }

    detached() {
        super.detached();
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
    }

    /**
     * Reset the value when the unknown is selected to a value of 0
     */
    unknownChanged( ) {
        if( this.model.unknown === true ) {
            this.model.value = 0.0;
        }
    }

    setupValidation() {
        ValidationHelper.defineCurrencyValueRule( ValidationRules, 'number-validator');
        ValidationRules.ensure('number')
            .maxLength(25).withMessage(this.i18n.tr('messages.numberInvalid'))
            .required().withMessage(this.i18n.tr('messages.numberRequired'))
            .ensure('value')
            .satisfiesRule( 'number-validator').withMessage(this.i18n.tr('messages.currencyInvalid'))
            .on(this.model);

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

    /**
     * The model will not be "changed" on a save and new.  Only updated/cleared.  So this is only guaranteed to run once.
     * @param newValue
     */
    modelChanged(newValue) {
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
        this._modelSubscribers = [];
        if( newValue ) {
            this.showWarning = false;
            this.icon = ''; // clear exists icon
            this.conversionModel = undefined; // clear conversion context
            this.setupValidation();
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(newValue, 'catalogueRef').subscribe(this._catalogueChanged.bind(this)));
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(newValue, 'condition').subscribe(this._sendNotifications.bind(this)));
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(newValue, 'number').subscribe(this._validateAndSendNotifiation.bind(this)));
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(newValue, 'value').subscribe(this._validate.bind(this)));
            _.defer(() => {
                this._catalogueChanged(newValue.catalogueRef);
                this._validate();
            }, 50);
        }
    }

    _catalogueChanged(newValue) {
        if (newValue > 0) {
            this.selectedCatalogue = _.find(this.catalogues, {id: +newValue});
            if( this.selectedCatalogue ) {
                this._sendNotifications();
            }
        }
    }

    _validate() {
        this.validationController.validate().then( result => {
           this.isValid = result.length === 0;
        });
    }

    _validateAndSendNotifiation() {
        this._validate();
        this._sendNotifications();
    }

    _sendNotifications() {
        // in theory only number changes need to validate
        if( this.model.number && this.model.number !== '' ) {
            if (this.model.catalogueRef > 0) {
                this.icon = '';
                this.showWarning = false;
                this.eventBus.publish(EventNames.checkExists, {model: this.model});
            }
            if( this.model.id <= 0 && this.model.condition >= 0 ) {
                this.eventBus.publish(EventNames.calculateImagePath, { model: this.model});
            }
        } else {
            this.icon = '';
            this.showWarning = false;
        }
    }

    _loadCatalogues() {
        var self = this;
        this.catalogueService.find(this.catalogueService.getDefaultSearchOptions()).then(results => {
            self.catalogues = results.models;
            self.loading = false;
            if( this.model.catalogueRef > 0 ) {
                this._catalogueChanged(this.model.catalogueRef);
            }
        });
    }
}
