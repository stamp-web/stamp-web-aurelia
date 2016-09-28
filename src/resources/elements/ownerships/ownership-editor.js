import {customElement, bindable, LogManager} from 'aurelia-framework';
import {NewInstance} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';
import {I18N} from 'aurelia-i18n';
import {BindingEngine, bindingMode} from 'aurelia-binding';
import {ValidationController, ValidationRules, validateTrigger} from 'aurelia-validation';
import {EventManaged} from '../../../events/event-managed';
import {Albums} from '../../../services/albums';
import {Sellers} from '../../../services/sellers';
import {ValidationHelper} from '../../../util/validation-helper';
import {Condition, Grade, CurrencyCode, Defects, Deceptions} from '../../../util/common-models';

const logger = LogManager.getLogger('ownership-editor');

@customElement('ownership-editor')
export class OwnershipEditor extends EventManaged {

    @bindable model;
    @bindable({defaultBindingMode : bindingMode.twoWay}) isValid = true;

    static inject = [EventAggregator, BindingEngine, Albums, Sellers, I18N, NewInstance.of(ValidationController)];

    loading = true;
    albums = [];
    conditions = Condition.symbols();
    grades = Grade.symbols();
    codes = CurrencyCode.symbols();
    defects = Defects.symbols();
    deceptions = Deceptions.symbols();
    sellers = [];

    _modelSubscribers = [];


    constructor(eventBus, bindingEngine, albumService, sellerService, i18n, validationController) {
        super(eventBus);
        this.bindingEngine = bindingEngine;
        this.albumService = albumService;
        this.sellerService = sellerService;
        this.i18n = i18n;
        this.validationController = validationController;
        this.validationController.validateTrigger = validateTrigger.change;
        this.loadDependentModels();
    }

    setupValidation() {
        ValidationHelper.defineCurrencyValueRule( ValidationRules, 'number-validator');
        ValidationHelper.defineIdSelection( ValidationRules, 'album-id');
        ValidationRules.ensure('pricePaid')
            .satisfiesRule( 'number-validator').withMessage(this.i18n.tr('messages.currencyInvalid'))
            .ensure('albumRef')
            .satisfiesRule( 'album-id').withMessage( this.i18n.tr('messages.valueInvalid'))
            .on(this.model);
    }

    validationChanged() {
        this.isValid = (!this.validationController.errors || this.validationController.errors.length === 0);
    }

    isValidChanged() {
        this.validationController.validate();
    }

    modelChanged() {
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
        this._modelSubscribers = [];
        this.setupValidation();
        this._modelSubscribers.push(this.bindingEngine.collectionObserver(this.validationController.errors).subscribe(this.validationChanged.bind(this)));

        _.defer(() => {
            this.validationController.validate();
        }, 50);
    }

    loadDependentModels() {
        var self = this;
        var albumPromise = this.albumService.find({
            $orderby: 'name asc'
        });
        var sellerPromise = this.sellerService.find({
            $orderby: 'name asc'
        });
        Promise.all([albumPromise, sellerPromise]).then(values => {
            for (var i = 0; i < values.length; i++) {
                switch (i) {
                    case 0:
                        self.albums = values[i].models;
                        break;
                    case 1:
                        self.sellers = values[i].models;
                        break;
                }
            }
            self.loading = false;
        }).catch(err => {
            logger.error(err);
        });
    }
}
