import {customElement, bindable, inject, computedFrom, LogManager} from 'aurelia-framework';
import {CurrencyCode} from '../../util/common-models';
import {Stamps} from '../../services/stamps';
import {Countries} from '../../services/countries';
import {Preferences} from '../../services/preferences';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../../events/event-names';
import {EventManaged} from '../../events/event-managed';
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

function createCatalogueNumber() {
    return {
        id: 0,
        catalogueRef: -1,
        value: 0.0,
        number: '',
        active: true,
        unknown: false
    };
}

function createOwnership() {
    return {
        id: 0,
        albumRef: -1,
        code: CurrencyCode.USD.description,
        purchased: moment(new Date()).format('YYYY-MM-DDT00:00:00Z'),
        pricePaid: 0.0
    };
}


@customElement('stamp-editor')
@bindable('model')
@inject(EventAggregator, Stamps, Countries, Preferences)
export class StampEditorComponent extends EventManaged {

    createMode = false;
    usedInlineImagePath = false;
    preferences = [];
    duplicateModel;

    constructor(eventBus, stampService, countryService, preferenceService) {
        super(eventBus);
        this.stampService = stampService;
        this.countryService = countryService;
        this.preferenceService = preferenceService;
    }

    attached() {
        this.setPreferences();
        this.subscribe(EventNames.checkExists, this.checkExists.bind(this));
        this.subscribe(EventNames.calculateImagePath, this.calculateImagePath.bind(this));
        this.subscribe(EventNames.convert, this.convertToStamp.bind(this));
        this.subscribe(EventNames.changeEditMode, this.changeEditMode.bind(this));
    }

    changeEditMode(mode) {
        if( this.createMode === true && (mode === 'wantList' || mode === 'stamp') ) {
            this.duplicateModel.wantList = !this.duplicateModel.wantList;
            this.duplicateModel.stampOwnership = [];
            if( !this.duplicateModel.wantList ) {
                this.duplicateModel.stampOwnership.push(createOwnership());
            }
        } else if ( this.createMode === false && mode === 'create' ) {
            this.eventBus.publish(EventNames.stampCreate);
        }

    }

    convertToStamp(m) {
        if (this.duplicateModel.id === 0 && m && this.createMode === true) {
            this.duplicateModel = m;
            this.duplicateModel.stampOwnership = [];
            this.duplicateModel.stampOwnership.push(createOwnership());
        }
    }


    calculateImagePath() {
        _.debounce(function (self) {
            var m = self.duplicateModel;
            if( self.createMode === true && m.wantList === false && m.stampOwnerships && m.stampOwnerships.length > 0 ) {
                var cn = m.activeCatalogueNumber;
                if( m.countryRef > 0 && cn.number !== '') {
                    var country = self.countryService.getById( m.countryRef );
                    if( country ) {
                        var path = country.name + '/';
                        if( !self.usedInlineImagePath && (cn.condition === 2 || cn.condition === 3) ) {
                            path += 'used/';
                        }
                        path += cn.number + '.jpg';
                        var owner = _.first(m.stampOwnerships);
                        owner.img = path;
                    }
                }
            }
        }, 500)(this);
    }

    checkExists() {
        _.debounce(function (self) {
            if (self.duplicateModel.countryRef > 0 && self.duplicateModel.activeCatalogueNumber) {
                var cn = self.duplicateModel.activeCatalogueNumber;
                if (cn.catalogueRef > 0 && cn.number && cn.number !== '') {
                    var opts = {
                        $filter: '((countryRef eq ' + self.duplicateModel.countryRef + ') and (catalogueRef eq ' + cn.catalogueRef + ') and (number eq \'' + cn.number + '\'))'
                    };
                    self.stampService.find(opts).then(results => {
                        if (results.models.length > 0) {
                            self.processExistenceResults(results.models);
                        }
                    });
                }
            }
        }, 500)(this);
    }

    processExistenceResults(models) {
        _.remove(models, {id: this.duplicateModel.id});
        if (models.length > 0) {
            var index = _.findIndex(models, {wantList: true});
            var wantList = ( index >= 0 );
            var obj = {
                convert: wantList,
                conversionModel: ( index >= 0 ) ? models[index] : undefined
            };
            this.eventBus.publish(EventNames.conflictExists, obj);
        }
    }

    setPreferences() {
        var self = this;
        this.preferenceService.find().then(results => {
            self.preferences = results.models;
            self.processPreferences();
        });
    }

    processPreferences() {
        if (this.preferences.length > 0) {
            var p = _.findWhere(this.preferences, { name: 'usedInlineImagePath', category: 'stamps'});
            this.usedInlineImagePath = ( p && p.value === 'true');
            if( this.duplicateModel.id <= 0 ) {
                PreferredValues.forEach(function (pref) {
                    var prefValue = _.findWhere(this.preferences, {name: pref.key, category: pref.category});
                    if (prefValue) {
                        var value = prefValue.value;
                        if (pref.type === Number) {
                            value = +value;
                        }
                        var m = this.duplicateModel;
                        if (pref.model) {
                            pref.model.forEach(function (key) {
                                if (key === "activeCatalogueNumber") {
                                    m = this.activeCatalogueNumber;
                                } else if (key === "ownership") {
                                    m = this.ownership;
                                }
                                if (m) {
                                    m[pref.key] = value;
                                }
                            }, this);
                        } else if (m) {
                            m[pref.key] = value;
                        } else {
                            logger.error("The model was not defined");
                        }
                    }
                }, this);
            }
        }
    }

    save(keepOpen) {
        if (this.validate()) {
            this.stampService.save(this.duplicateModel).then(stamp => {
                this.eventBus.publish(EventNames.stampSaved, { stamp: stamp, remainOpen: keepOpen });
            }).catch(err => {
                logger.error(err);
            });
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

    modelChanged(newValue) {
        this.createMode = (newValue && newValue.id <= 0);
        if (newValue) {
            this.duplicateModel = _.clone(newValue, true);
            if( this.preferenceService.loaded ) {
                this.processPreferences();
            }
        } else {
            this.duplicateModel = null;
        }

    }

    @computedFrom('duplicateModel')
    get ownership() {
        if (!this.duplicateModel) {
            return undefined;
        }
        var owners = this.duplicateModel.stampOwnerships;
        var owner;
        if( this.duplicateModel.wantList === false ) {
            if (!owners) {
                this.duplicateModel.stampOwnerships = [];
                owner = createOwnership();
                this.duplicateModel.stampOwnerships.push(owner);
            } else if (this.duplicateModel.stampOwnerships.length > 0) {
                owner = _.first(this.duplicateModel.stampOwnerships);
            } else {
                owner = createOwnership();
                this.duplicateModel.stampOwnerships.push(owner);
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
        var activeNumber = this.duplicateModel.activeCatalogueNumber;
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
