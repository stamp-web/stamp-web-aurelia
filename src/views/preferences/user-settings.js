import {inject, LogManager} from 'aurelia-framework';

import {Countries} from '../../services/countries';
import {Albums} from '../../services/albums';
import {Sellers} from '../../services/sellers';
import {Catalogues} from '../../services/catalogues';
import {StampCollections} from '../../services/stampCollections';
import {Preferences} from '../../services/preferences';
import {Condition, Grade} from '../../util/common-models';

import _ from 'lodash';

import 'resources/styles/views/preferences/user-settings.css!';

const logger = LogManager.getLogger('user-settings');

@inject(Preferences, Countries, Albums, Sellers, Catalogues, StampCollections)
export class UserSettings {

    countries = [];
    albums = [];
    sellers = [];
    catalogues = [];
    stampCollections = [];
    preferences = [];
    conditions = Condition.symbols();
    grades = Grade.symbols();

    model = {};

    preferenceKeys = [
        { name: 'countryRef', category: 'stamps', type: Number},
        { name: 'stampCollectionRef', category: 'stamps', type: Number },
        { name: 'albumRef', category: 'stamps', type: Number},
        { name: 'sellerRef', category: 'stamps', type: Number },
        { name: 'catalogueRef', category: 'stamps', type: Number },
        { name: 'condition', category: 'stamps', type: Number },
        { name: 'grade', category: 'stamps', type: Number }
    ]

    servicesLoaded = 0;
    loading = false;

    constructor(preferenceService, countryService, albumService, sellerService, catalogueService, stampCollectionService) {
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
                self.preferenceService.save(pref);
            });
        });
    }

    checkloadingState() {
        this.servicesLoaded++;
        if(this.servicesLoaded >= 6 ) {
            this.loading = false;
        }
    }

    processPreferences() {
        let self = this;
        _.forEach(self.preferenceKeys, function(prefKey) {
            let pref = self.preferenceService.getByNameAndCategory(prefKey.name, prefKey.category);
            if( pref ) {
                if( !self.model[prefKey.category]) {
                    self.model[prefKey.category] = {};
                }
                self.model[prefKey.category][prefKey.name] = (prefKey.type === Number) ? +pref.value : pref.value;
            }
        });
    }

    loadServices() {
        let self = this;
        this.loading = true;
        this.preferenceService.find().then(result => {
            self.preferences = result.models;
            self.processPreferences();
            self.checkloadingState();
        });
        this.countryService.find({
            $orderby: 'name asc'
        }).then(result => {
            self.countries = result.models;
            self.checkloadingState();
        });
        this.albumService.find({
            $orderby: 'name asc'
        }).then(result => {
            self.albums = result.models;
            self.checkloadingState();
        });
        this.sellerService.find({
            $orderby: 'name asc'
        }).then(result => {
            self.sellers = result.models;
            self.checkloadingState();
        });
        this.stampCollectionService.find({
            $orderby: 'name asc'
        }).then(result => {
            self.stampCollections = result.models;
            self.checkloadingState();
        });
        this.catalogueService.find({
            $orderby: 'issue desc'
        }).then(result => {
            self.catalogues = result.models;
            self.checkloadingState();
        });
    }
}
