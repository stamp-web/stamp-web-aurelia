import {bindable, inject, customElement, LogManager} from 'aurelia-framework';
import {Catalogues} from '../../../services/catalogues';
import {Stamps} from '../../../services/stamps';
import {Countries} from '../../../services/countries';
import {CatalogueNumbers} from '../../../services/catalogueNumbers';
import {Preferences} from '../../../services/preferences';
import {Condition, StampHelper} from '../../../util/common-models';
import {I18N} from 'aurelia-i18n';

import $ from 'jquery';
import _ from 'lodash';

const logger = LogManager.getLogger('cn-references');


@customElement('catalogue-number-references')
@bindable('model')
@inject(Element, I18N, Catalogues, CatalogueNumbers, Stamps, Countries, Preferences)
export class CatalogueNumberReferences {

    modelCopy;

    catalogues = [];

    defaultCondition = -1;
    defaultCatalogue = null;
    updateImagePath = false;
    usedInlineImagePath = false;
    useCataloguePrefix = false;

    conditions = Condition.symbols();
    number;

    constructor(element, i18next, catalogueService, catalogueNumberService, stampService, countryService, preferenceService) {
        this.element = $(element);
        this.i18next = i18next;
        this.catalogueService = catalogueService;
        this.catalogueNumberService = catalogueNumberService;
        this.stampService = stampService;
        this.countryService = countryService;
        this.preferenceService = preferenceService;
    }

    bind() {
        // Using a promise here, but not bind (view-models) do not use promises to block
        Promise.all([
            this.catalogueService.find(this.catalogueService.getDefaultSearchOptions()).then(results => {
                this.catalogues = results.models;
            }),
            // image calculation will require them to be initialized
            this.countryService.find(this.countryService.getDefaultSearchOptions()),
            this.preferenceService.find(this.preferenceService.getDefaultSearchOptions()).then(results => { //eslint-disable-line no-unused-vars
                let cond = this.preferenceService.getByNameAndCategory('condition', 'stamps');
                if( cond ) {
                    this.defaultCondition = +cond.value;
                }
                let cat = this.preferenceService.getByNameAndCategory('catalogueRefSecondary', 'stamps');
                if( cat ) {
                    this.defaultCatalogue = +cat.value;
                }
                this.updateImagePath = this.preferenceService.getByNameAndCategory('updateNumberOnEdit', 'stamps') || false;
                this.useCataloguePrefix = this.preferenceService.getByNameAndCategory('applyCatalogueImagePrefix', 'stamps') || false;
                this.usedInlineImagePath = this.preferenceService.getByNameAndCategory('usedInlineImagePath', 'stamps') || false;
            })
        ]);
    }

    modelChanged(newModel) {
        if (newModel) {
            let self = this;
            this.modelCopy = _.cloneDeep(newModel);
            this.modelCopy.catalogueNumbers.forEach(catNum => {
                catNum.currencyCode = self.determineCurrencyCode(catNum.catalogueRef);
            });
        } else {
            this.modelCopy = {};
        }
    }

    determineCurrencyCode(catalogueRef) {
        let code = 'USD';
        let cat = this.catalogueService.getById(catalogueRef);
        if (cat) {
            code = cat.code;
        }
        return code;
    }

    edit(num, index) { //eslint-disable-line no-unused-vars
        num.original = _.clone(num);
        num.editing = true;
    }

    cancel(num) {
        let inlineRow = $(this.element.find('.editing-row'));
        if (num.id === 0) {
            inlineRow.remove();
            let index = _.findIndex(this.modelCopy.catalogueNumbers, {id: 0});
            if (index >= 0) {
                this.modelCopy.catalogueNumbers.splice(index, 1);
            }
        } else {
            this._revert(num);
        }
    }

    _revert(num) {
        num.editing = false;
        let orig = num.original;
        delete num.original;
        _.merge(num, orig);
    }

    calculateImagePath(stamp) {
        if(!_.isEmpty(stamp.stampOwnerships)) {
            let path = StampHelper.calculateImagePath(stamp, this.usedInlineImagePath, this.useCataloguePrefix, this.countryService, this.catalogueService);
            let owner = _.first(stamp.stampOwnerships);
            owner.img = path;
        }
    }

    save(num) { //eslint-disable-line no-unused-vars
        if( this.updateImagePath && num.active ) {
            this.calculateImagePath(this.modelCopy);
        }
        this.stampService.save(this.modelCopy).then( stamp => {
            delete num.original;
            num.editing = false;
            this.modelChanged(stamp);
        });
    }

    add() {
        let num = {
            id: 0,
            active: false,
            catalogueRef: this.defaultCatalogue,
            condition: this.defaultCondition,
            number: "",
            value: 0
        };
        num.editing = true;
        this.modelCopy.catalogueNumbers.push(num);
        setTimeout( () => {
            let el = this.element.find('#cn-number');
            $(el).focus();
        }, 250);
    }

    remove(num) {
        let self = this;
        let _remove = m => {
            this.catalogueNumberService.remove(m).then(result => {
                if (result === true) {
                    let index = _.findIndex(this.modelCopy.catalogueNumbers, {id: m.id});
                    this.modelCopy.catalogueNumbers.splice(index, 1);
                }
            }).catch(err => {
                logger.debug("Error removing", err);
            });
        };
        let msg = this.i18next.tr("prompts.delete-catalogue-number", {number: num.number});
        if(window.confirm(msg)) {
            _remove.call(self, num);
        }
    }

    makeActive(num) {
        let activeNum = _.find(this.modelCopy.catalogueNumbers, {active: true});;
        if( activeNum.id === num.id ) {
            throw new Error("Can not set active as active!");
        } else {
            activeNum.active = false;
            num.active = true;
            this.save(num);
        }
    }
}
