import {customElement, bindable, inject} from 'aurelia-framework';
import {Validation} from 'aurelia-validation';
import {BindingEngine} from 'aurelia-binding'; // technically this is a static not a DI until next release
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames, EventManaged} from '../../events/event-managed';
import {Catalogues} from '../../services/catalogues';
import {Condition} from '../../util/common-models';
import _ from 'lodash';
import $ from 'jquery';

@customElement('catalogue-number-details')
@bindable('model')
@bindable('selectedCatalogue')
@inject(EventAggregator, BindingEngine, Validation, Catalogues)
export class CatalogueNumberDetailsComponent extends EventManaged {

    catalogues = [];
    icon;
    conflictMessage;
    conversionModel;
    conditions = Condition.symbols();
    loading = true;
    selectedCatalogue;
    showWarning = false;

    _modelSubscribers = [];

    constructor(eventBus, $bindingEngine, validation, catalogueService) {
        super(eventBus);
        this.catalogueService = catalogueService;
        this.$bindingEngine = $bindingEngine;
        this.validatorDI = validation;
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
            this._modelSubscribers.push(this.$bindingEngine.propertyObserver(newValue, 'catalogueRef').subscribe(this.catalogueChanged.bind(this)));
            this._modelSubscribers.push(this.$bindingEngine.propertyObserver(newValue, 'condition').subscribe(this.sendNotifications.bind(this)));
            this._modelSubscribers.push(this.$bindingEngine.propertyObserver(newValue, 'number').subscribe(this.sendNotifications.bind(this)));
            this.showWarning = false;
            this.icon = ''; // clear exists icon
            this.conversionModel = undefined; // clear conversion context
            this.setupValidation(this.validatorDI);
            let self = this;
            setTimeout(function() {
                self.sendNotifications(); // check or initial conversion of wantlist
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
