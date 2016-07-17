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
import {inject, LogManager} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-binding';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../../../events/event-managed';
import {Countries} from '../../../services/countries';
import {Albums} from '../../../services/albums';
import {Sellers} from '../../../services/sellers';
import {Catalogues} from '../../../services/catalogues';
import {StampCollections} from '../../../services/stampCollections';
import {Preferences} from '../../../services/preferences';
import {Condition, Grade, CurrencyCode, UserLocale} from '../../../util/common-models';
import {ObjectUtilities} from '../../../util/object-utilities';

import _ from 'lodash';

const logger = LogManager.getLogger('user-settings');

@inject(BindingEngine, EventAggregator, Preferences, Countries, Albums, Sellers, Catalogues, StampCollections)
export class UserSettings {

    countries = [];
    albums = [];
    sellers = [];
    catalogues = [];
    stampCollections = [];
    preferences = [];
    conditions = Condition.symbols();
    codes = CurrencyCode.symbols();
    grades = Grade.symbols();
    locales = UserLocale.symbols();
    pageSizes = [100, 250, 500, 1000, 2500, 5000];

    model = {};

    preferenceKeys = [
        { name: 'countryRef', category: 'stamps', type: Number},
        { name: 'stampCollectionRef', category: 'stamps', type: Number },
        { name: 'albumRef', category: 'stamps', type: Number},
        { name: 'sellerRef', category: 'stamps', type: Number },
        { name: 'catalogueRef', category: 'stamps', type: Number },
        { name: 'catalogueRefSecondary', category: 'stamps', type: Number },
        { name: 'condition', category: 'stamps', type: Number },
        { name: 'conditionSecondary', category: 'stamps', type: Number },
        { name: 'grade', category: 'stamps', type: Number },
        { name: 'pageSize', category: 'stamps', type: Number, defaultValue: 100 },
        { name: 'CurrencyCode', category: 'currency', type: String, defaultValue: 'USD' },
        { name: 'imagePath', category: 'stamps', type: String },
        { name: 'locale', category: 'user', type: String, defaultValue: 'en' },
        { name: 'applyCatalogueImagePrefix', category: 'stamps', type: Boolean, defaultValue: true }
    ];

    EDITOR = 'settings.editor';
    REFERENCE = 'settings.reference';
    SERVER = 'settings.server';
    USER = 'settings.user';

    viewModels = [ this.EDITOR, this.REFERENCE, this.SERVER, this.USER ];
    selectedView = this.EDITOR;

    servicesLoaded = 0;
    loading = false;
    valid = false;

    constructor($bindingEngine, eventBus, preferenceService, countryService, albumService, sellerService, catalogueService, stampCollectionService) {
        this.bindingEngine = $bindingEngine;
        this.eventBus = eventBus;
        this.preferenceService = preferenceService;
        this.countryService = countryService;
        this.albumService = albumService;
        this.sellerService = sellerService;
        this.catalogueService = catalogueService;
        this.stampCollectionService = stampCollectionService;
    }

    activate() {
        this.loadServices();
    }

    deactivate() {
    }

    selectView(pref) {
        this.selectedView = pref;
    }

    save() {
        let self = this;
        _.each(Object.keys(self.model), function(category) {
            _.each(Object.keys(self.model[category]), function(name) {
                let pref = self.preferenceService.getByNameAndCategory(name, category);
                if( pref ) {
                    if( pref.value === "" + self.model[category][name]) {
                        logger.debug("No update needed for " + name);
                        return;
                    }
                    pref.value = self.model[category][name].toString();
                } else {
                    pref = {
                        name: name,
                        category: category,
                        value: self.model[category][name].toString(),
                        id: 0
                    };
                }
                self.preferenceService.save(pref).then( modifiedPref => {
                    self.eventBus.publish( EventNames.preferenceChanged, modifiedPref);
                });
            });
        });
        self.stateReset();
    }

    stateReset() {
        this.modelClone = {};
        _.forEach(Object.keys(this.model), function(key) {
            this.modelClone[key] = _.clone(this.model[key]);
        }, this);
        this.validate();
    }

    reset() {
        _.forEach(Object.keys(this.model), function(key) {
            _.extend(this.model[key], this.modelClone[key]);
        }, this);
        this.validate();
    }

    validate() {
        let value = true;
        let keys = Object.keys(this.model);
        for(let i = 0; i < keys.length; i++ ) {
            let key = keys[i];
            if( !ObjectUtilities.isEqual(this.model[key], this.modelClone[key])) {
                value = false;
                break;
            }
        }
        this.valid = !value;
    }

    processResults(collectionName, results) {
        this[collectionName] = results.models;
        this.servicesLoaded++;
        if(this.servicesLoaded >= 6 ) {
            this.loading = false;
        }
    }

    processPreferences() {
        let self = this;
        _.forEach(self.preferenceKeys, function (prefKey) {

            let pref = self.preferenceService.getByNameAndCategory(prefKey.name, prefKey.category);
            if (!pref) {
                pref = {
                    value: (prefKey.defaultValue) ? prefKey.defaultValue.toString() : undefined
                };
            }
            if (!self.model[prefKey.category]) {
                self.model[prefKey.category] = {};
            }
            let value;
            switch (prefKey.type) {
                case Number:
                    value = +pref.value;
                    break;
                case Boolean:
                    value = pref.value === "true";
                    break;
                default:
                    value = pref.value;
            }

            self.model[prefKey.category][prefKey.name] = value;
            self.bindingEngine.propertyObserver(self.model[prefKey.category], prefKey.name).subscribe(self.validate.bind(self));
        });
        self.stateReset();
    }

    loadServices() {
        let self = this;
        this.loading = true;
        this.preferenceService.find().then(result => {
            self.processResults('preferences', result);
            self.processPreferences();
        });
        this.countryService.find().then(result => {
            self.processResults('countries', result);
        });
        this.albumService.find().then(result => {
            self.processResults('albums', result);
        });
        this.sellerService.find().then(result => {
            self.processResults('sellers', result);
        });
        this.stampCollectionService.find().then(result => {
            self.processResults('stampCollections', result);
        });
        this.catalogueService.find().then(result => {
            self.processResults('catalogues', result);
        });
    }
}
