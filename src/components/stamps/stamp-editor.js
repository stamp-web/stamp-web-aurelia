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
import {customElement, bindable, inject, computedFrom, LogManager} from 'aurelia-framework';
import {CurrencyCode, Condition, CatalogueHelper} from '../../util/common-models';
import {Stamps} from '../../services/stamps';
import {Countries} from '../../services/countries';
import {Catalogues} from '../../services/catalogues';
import {Preferences} from '../../services/preferences';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames, EventManaged} from '../../events/event-managed';
import _ from 'lodash';
import moment from 'moment';

const logger = LogManager.getLogger('stamp-editor');

const PreferredValues = [
    {key: 'countryRef', category: 'stamps', type: Number},
    {key: 'catalogueRef', category: 'stamps', type: Number, model: ['activeCatalogueNumber']},
    {key: 'condition', category: 'stamps', type: Number, model: ['activeCatalogueNumber', 'ownership']},
    {key: 'albumRef', category: 'stamps', type: Number, model: ['ownership']},
    {key: 'sellerRef', category: 'stamps', type: Number, model: ['ownership']},
    {key: 'grade', category: 'stamps', type: Number, model: ['ownership']}
];

const CACHED_PURCHASED = 'stamp-editor.purchased';

function createCatalogueNumber() {
    return {
        id: 0,
        catalogueRef: -1,
        value: 0.0,
        condition: 0,
        number: '',
        active: true,
        unknown: false
    };
}

function createOwnership() {
    return {
        id: 0,
        albumRef: -1,
        sellerRef: -1,
        code: CurrencyCode.USD.keyName,
        purchased: moment(new Date()).format('YYYY-MM-DDT00:00:00Z'),
        pricePaid: 0.0,
        defects: 0,
        deception: 0,
        condition: 0,
        grade: 0,
        img: ''
    };
}


@customElement('stamp-editor')
@bindable('model')
@inject(EventAggregator, Stamps, Countries, Catalogues, Preferences)
export class StampEditorComponent extends EventManaged {

    createMode = false;
    usedInlineImagePath = false;
    useCataloguePrefix = false;
    preferences = [];
    duplicateModel;
    loaded = false;
    usedConditions = [ Condition.USED.ordinal, Condition.CTO.ordinal, Condition.COVER.ordinal, Condition.ON_PAPER.ordinal];
    /* Session cached values (overriding preference values) */
    cachedValues = {
        purchased: null
    };
    catalogues = [];


    constructor(eventBus, stampService, countryService, catalogueService, preferenceService) {
        super(eventBus);
        this.stampService = stampService;
        this.countryService = countryService;
        this.catalogueService = catalogueService;
        this.preferenceService = preferenceService;

        let purchasedValue = localStorage.getItem(CACHED_PURCHASED);
        this.cachedValues.purchased = (purchasedValue) ? new Date(purchasedValue) : null;
    }

    attached() {
        this.setPreferences();
        this.loadServices();
        this.subscribe(EventNames.checkExists, this.checkExists.bind(this));
        this.subscribe(EventNames.calculateImagePath, this.calculateImagePath.bind(this));
        this.subscribe(EventNames.convert, this.convertToStamp.bind(this));
        this.subscribe(EventNames.changeEditMode, this.changeEditMode.bind(this));
    }

    /**
     * These services are used by the image path generation.  It is in all likelihood that they are already
     * initialized, however to ensure this, we'll call find with the default search options - this should return
     * the cached result.  This will trigger the loaded flag which is used by the template to display the content
     */
    loadServices() {
        let self = this;
        let services = [
            this.countryService.find(this.countryService.getDefaultSearchOptions()),
            this.catalogueService.find(this.catalogueService.getDefaultSearchOptions())
        ];
        Promise.all(services).then( (serviceResult) => {
            if( serviceResult && serviceResult.length > 0 ) {
                this.catalogues = serviceResult[1].models;
            }
            self.loaded = true;
        });
    }

    changeEditMode(mode) {
        if( this.createMode === true && (mode === 'wantList' || mode === 'stamp') ) {
            this.duplicateModel.wantList = !this.duplicateModel.wantList;
            if( !this.duplicateModel.wantList ) {
                // will lazy initialize ownership
                this.assignCachedValues();
            } else {
                delete this.duplicateModel.stampOwnerships;
            }
        } else if ( this.createMode === false && mode === 'create' ) {
            this.eventBus.publish(EventNames.stampCreate);
        }
    }

    convertToStamp(m) {
        if (m) {
            this.duplicateModel = m;
            this.duplicateModel.stampOwnerships = [];
            this.duplicateModel.wantList = false;
            // need to ensure ownership is there prior to assigning values
            var owner = this.ownership;  // eslint-disable-line no-unused-vars
            this.processPreferences(true);
            this.calculateImagePath();
        }
    }

    calculateImagePath() {

        if( this.calculateImagePathFn && this.calculateImagePathFn.clearTimeout ) {
            this.calculateImagePathFn.clearTimeout();
            this.calculateImagePathFn = undefined;
        }
        let self = this;
        this.calculateImagePathFn = setTimeout(function () {
            let m = self.duplicateModel;
            if( m.wantList === false && m.stampOwnerships && m.stampOwnerships.length > 0 && (self.createMode === true || _.first(m.stampOwnerships).img === '' ) ) {
                let cn = m.activeCatalogueNumber;
                if( m.countryRef > 0 && cn.number !== '') {
                    let country = self.countryService.getById( m.countryRef );
                    if( country ) {
                        let path = country.name + '/';
                        if( !self.usedInlineImagePath && (self.usedConditions.indexOf(cn.condition) >= 0 ) ) {
                            path += (cn.condition === Condition.COVER.ordinal) ? 'on-cover/' : 'used/';
                        }
                        if( self.useCataloguePrefix === true && cn.catalogueRef > 0 ) {
                            path += CatalogueHelper.getImagePrefix(self.catalogueService.getById( cn.catalogueRef ));
                        }
                        path += cn.number + '.jpg';
                        let owner = _.first(m.stampOwnerships);
                        owner.img = path;
                    }
                }
            }
            this.calculateImagePathFn = undefined;
        }, 500);

    }

    checkExists() {
        if( this.checkExistsFn && this.checkExistsFn.clearTimeout ) {
            this.checkExistsFn.clearTimeout();
            this.checkExistsFn = undefined;
        }
        let self = this;
        this.checkExistsFn = setTimeout(function () {
            if ((self.duplicateModel && (self.duplicateModel.id <= 0 || self.duplicateModel.wantList === true ) && self.duplicateModel.countryRef > 0 && self.duplicateModel.activeCatalogueNumber)) {
                let cn = self.duplicateModel.activeCatalogueNumber;
                if (cn.catalogueRef > 0 && cn.number && cn.number !== '') {
                    let opts = {
                        $filter: '((countryRef eq ' + self.duplicateModel.countryRef + ') and (number eq \'' + cn.number + '\'))'
                    };
                    self.stampService.find(opts).then(results => {
                        if (results.models.length > 0) {
                            self.processExistenceResults(results.models);
                        }
                    });
                }
            }
            this.checkExistsFn = undefined;
        }, 350);
    }

    processExistenceResults(models) {
        if( this.duplicateModel.wantList === false ) { // if the object IS the wantlist leave it there for conversion
            _.remove(models, {id: this.duplicateModel.id});
        }
        if (models && models.length > 0) {
            // Retrieve the current catalogueType of the active number
            let catalogueType = _.find(this.catalogues, { id: this.activeCatalogueNumber.catalogueRef}).type;
            // Pull out only stamps that match the active number's catalogue type.
            let matchingStamps = _.remove(models, m => {
                let cn = _.find(m.catalogueNumbers, { active: true });
                let cnType = _.find(this.catalogues, { id: cn.catalogueRef}).type;
                return ( cnType === catalogueType );
            });
            if( matchingStamps.length > 0 ) {
                let index = _.findIndex(matchingStamps, {wantList: true});
                let wantList = ( index >= 0 );
                let obj = {
                    convert: wantList,
                    conversionModel: ( index >= 0 ) ? matchingStamps[index] : undefined
                };
                this.eventBus.publish(EventNames.conflictExists, obj);
            }
        }
    }

    setPreferences() {
        let self = this;
        this.preferenceService.find().then(results => {
            self.preferences = results.models;
            self.processPreferences((self.duplicateModel && self.duplicateModel.id <= 0 ));
        });
    }

    /**
     *
     * @param alwaysProcess - whether to always process preferences independently of the state of the stamp
     */
    processPreferences(alwaysProcess) {
        if (this.preferences.length > 0) {
            let p = _.findWhere(this.preferences, { name: 'usedInlineImagePath', category: 'stamps'});
            this.usedInlineImagePath = ( p && p.value === 'true');
            let catPrefix = _.findWhere(this.preferences, { name: 'applyCatalogueImagePrefix', category: 'stamps'});
            this.useCataloguePrefix = ( catPrefix && catPrefix.value === 'true');
            if( this.duplicateModel && (this.duplicateModel.id <= 0) || alwaysProcess === true) {
                let m = this.duplicateModel;
                if( m ) {
                    logger.info("Stamp model was available on preferences initialization");
                }
                PreferredValues.forEach(function (pref) {
                    let prefValue = _.findWhere(this.preferences, {name: pref.key, category: pref.category});
                    if (prefValue) {
                        let value = prefValue.value;
                        if (pref.type === Number) {
                            value = +value;
                        }

                        if (pref.model) {
                            pref.model.forEach(function (key) {
                                if (key === "activeCatalogueNumber") {
                                    m = this.activeCatalogueNumber;
                                } else if (key === "ownership") {
                                    m = this.ownership;
                                }
                                if (m && (pref.type === Number && (m[pref.key] === undefined || (m[pref.key] <= 0) && value > 0))) {
                                    m[pref.key] = value;
                                }
                            }, this);
                        } else if (m && (pref.type === Number && (m[pref.key] === undefined || ( m[pref.key] <= 0) && value > 0))) {
                            m[pref.key] = value;
                        } else if (!m) {
                            logger.warn("The stamp model was not defined at the point of preferences initialization.");
                        }
                    }
                }, this);
            }
        }
    }

    save(keepOpen) {
        let self = this;
        if (self.validate() && self.preprocess()) {
            self.stampService.save(self.duplicateModel).then(stamp => {
                if( self.duplicateModel.id <= 0 ) {
                    self.eventBus.publish(EventNames.stampCount, { stamp: self.duplicateModel, increment: true });
                    self.cacheSessionValues(self.duplicateModel);
                }
                self.eventBus.publish(EventNames.stampSaved, { stamp: stamp, remainOpen: keepOpen });
                if( keepOpen) {
                    self.resetModel();
                }
            }).catch(err => {
                logger.error(err);
            });
        }
    }

    cacheSessionValues(m) {
        let owner = (m.stampOwnerships && m.stampOwnerships.length > 0 ) ? m.stampOwnerships[0] : undefined;
        if( owner && owner.id <= 0 ) {
            this.cachedValues.purchased = (owner.purchased) ? owner.purchased : null;
            localStorage.setItem(CACHED_PURCHASED, this.cachedValues.purchased);
        }
    }

    cancel() {
        this.eventBus.publish(EventNames.stampEditorCancel);
    }

    saveAndNew() {
        this.save(true);
    }

    validate() {
        return true;
    }

    preprocess() {
        let owner = this.ownership;
        // remove date objects from model if cleared to avoid server format issues
        if( owner && (owner.purchased === "" || owner.purchased === undefined)) {
            owner.purchased = null;
        }
        return true;
    }

    resetModel() {
        this.duplicateModel.id = 0;
        this.duplicateModel.rate = "";
        this.duplicateModel.description = "";
        this.resetCatalogueNumber(this.activeCatalogueNumber);
        this.resetOwnership(this.ownership);
        this.model = this.duplicateModel;
    }

    resetCatalogueNumber(cn) {
        cn.id = 0;
        cn.number = "";
        cn.unknown = false;
        cn.nospace = false;
        cn.value = 0;
    }

    resetOwnership(owner) {
        if( owner ) {
            owner.notes = undefined;
            owner.cert = false;
            owner.img = undefined;
            owner.certImg = undefined;
            owner.pricePaid = 0.0;
            owner.defects = 0;
            owner.deception = 0;
        }
    }

    modelChanged(newValue) {
        this.createMode = (newValue && newValue.id <= 0);
        if (newValue) {
            this.duplicateModel = _.clone(newValue, true);
            if( this.preferenceService.loaded ) {
                this.processPreferences(this.duplicateModel.id <= 0);
            }
            if( this.createMode ) { // set session purchased date
                let owner = this.ownership; // eslint-disable-line no-unused-vars
            }
        } else {
            this.duplicateModel = null;
        }

    }

    @computedFrom('duplicateModel')
    get ownership() {
        let self = this;
        if (!self.duplicateModel) {
            return undefined;
        }
        let owners = self.duplicateModel.stampOwnerships;
        let owner;
        if( self.duplicateModel.wantList === false ) {
            let configureOwnership = () => {
                self.duplicateModel.stampOwnerships = [];
                owner = createOwnership();
                if( owner && self.cachedValues.purchased ) {
                    owner.purchased = self.cachedValues.purchased;
                }
                self.duplicateModel.stampOwnerships.push(owner);
            };
            if (!owners) {
                configureOwnership();
            } else if (self.duplicateModel.stampOwnerships.length > 0) {
                owner = _.first(self.duplicateModel.stampOwnerships);
            } else {
                configureOwnership();

            }
        }
        return owner;
    }

    /**
     * Will lazily retrieve the active catalogue number from the stamp model.  If one does not exist
     * will create the catalogue numbers array and create an initial catalogue number to put in it.
     *
     * This will be a computed property on model.  It will only calculate if model is updated.
     *
     * @returns {Object} The active catalogue number.
     */
    @computedFrom('duplicateModel')
    get activeCatalogueNumber() {
        if (!this.duplicateModel) {
            return undefined;
        }
        let activeNumber = this.duplicateModel.activeCatalogueNumber;
        if (!activeNumber) {
            if (!this.duplicateModel.catalogueNumbers) {
                this.duplicateModel.catalogueNumbers = [];
            } else {
                activeNumber = _.findWhere(this.duplicateModel.catalogueNumbers, {active: true});
            }
            if (!activeNumber) {
                activeNumber = createCatalogueNumber();
                this.duplicateModel.catalogueNumbers.push(activeNumber);
            }
            this.duplicateModel.activeCatalogueNumber = activeNumber;
        }
        return activeNumber;
    }
}
