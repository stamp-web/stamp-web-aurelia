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
import {bindable, inject} from 'aurelia-framework';
import {StampCollections} from '../../../services/stampCollections';
import {LogManager} from 'aurelia-framework';
import $ from 'jquery';
import _ from 'lodash';
import {EventAggregator} from "aurelia-event-aggregator";
import {BindingEngine} from "aurelia-binding";
import {I18N} from "aurelia-i18n";
import {NewInstance} from "aurelia-dependency-injection";
import {validateTrigger, ValidationController, ValidationRules} from "aurelia-validation";
import {EventNames} from "../../../events/event-managed";
import {ValidationHelper} from "../../../util/validation-helper";

const logger = LogManager.getLogger('albumEditor');

export class albumEditor {

    static inject = [EventAggregator, BindingEngine, I18N, NewInstance.of(ValidationController), StampCollections];

    @bindable model;

    stampCollections = [];
    _modelSubscribers = [];

    constructor(eventBus, bindingEngine, i18n, validationController, stampCollectionService) {
        this.eventBus = eventBus;
        this.bindingEngine = bindingEngine;
        this.i18n = i18n;
        this.validationController = validationController;
        this.validationController.validationTigger = validateTrigger.manual;
        this.stampCollectionService = stampCollectionService;
    }

    deactivate() {
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
    }

    activate(options) {
        this.model = options;
        var p = this.stampCollectionService.find();
        p.then(results => {
            this.stampCollections = results.models;
        }).catch(err => {
            logger.error("Error with stamp collections", err);
        });
        this.setupValidation();
        if( !this.model.id > 0 ) {
            this.model.name = '';
            _.debounce( () => {
                $('#editor-name').focus();
            }, 125)();
        }
        this._modelSubscribers.push(this.bindingEngine.propertyObserver(this.model, 'name').subscribe(this._validate.bind(this)));
        this._modelSubscribers.push(this.bindingEngine.propertyObserver(this.model, 'stampCollectionRef').subscribe(this._stampCollectionChanged.bind(this)));
        _.debounce( () => {
            this._validate();
        }, 125)();
        return p;
    }

    _validate() {
        this.validationController.validate().then( result => {
            this.eventBus.publish(EventNames.valid, result.valid);
        });
    }

    _stampCollectionChanged(collectionRef) {
        if (collectionRef > 0) {
            this.selectedCatalogue = _.find(this.stampCollections, {id: +collectionRef});
            if( this.selectedCatalogue ) {
                this._validate();
            }
        } else {
            this._validate();
        }
    }

    setupValidation() {
        ValidationHelper.defineNumericRangeRule( ValidationRules, 'collection-selection',0);
        ValidationRules
            .ensure('name')
            .required().withMessage(this.i18n.tr('messages.nameRequired'))
            .ensure('stampCollectionRef')
            .required().withMessage(this.i18n.tr('messages.stampCollectionRequired'))
            .satisfiesRule('collection-selection').withMessage(this.i18n.tr('messages.stampCollectionRequired'))
            .on(this.model);

    }

}
