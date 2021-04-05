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
        this.validationController.validateTrigger = validateTrigger.manual;
        this.loadDependentModels();
    }

    setupValidation() {
        ValidationHelper.defineCurrencyValueRule( ValidationRules, 'number-validator');
        ValidationRules.ensure('pricePaid')
            .satisfiesRule( 'number-validator').withMessage(this.i18n.tr('messages.currencyInvalid'))
            .on(this.model);
    }

    _validate() {
        this.validationController.validate().then(result => {
            this.isValid = result.valid;
        });
    }

    modelChanged(newModel) {
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
        this._modelSubscribers = [];
        if( newModel ) {
            //this._modelSubscribers.push(this.bindingEngine.propertyObserver(newModel, 'albumRef').subscribe(this._validate.bind(this)));
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(newModel, 'pricePaid').subscribe(this._validate.bind(this)));
            this.setupValidation();
            _.defer(() => {
                this._validate();
            });
        }

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

    imgPathFocus(evt) {
        let input = evt.target;
        if (input && this.model.img) {
            let idx = this.model.img.lastIndexOf('.');
            if (idx > 0) {
                let elm = $(input)[0];
                elm.scrollLeft = elm.scrollWidth; // scroll to end
                elm.setSelectionRange(idx, idx);
            }
        }
    }
}
