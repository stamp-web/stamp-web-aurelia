import {bindable, inject, customElement, LogManager} from 'aurelia-framework';
import {Catalogues} from '../../services/catalogues';
import {Stamps} from '../../services/stamps';
import {CatalogueNumbers} from '../../services/catalogueNumbers';
import {Preferences} from '../../services/preferences';
import {Condition} from '../../util/common-models';
import {I18N} from 'aurelia-i18n';

import _ from 'lodash';
import bootbox from 'bootbox';

import 'resources/styles/components/catalogue-numbers/cn-references.css!';

const logger = LogManager.getLogger('cn-references');


@customElement('catalogue-number-references')
@bindable('model')
@inject(Element, I18N, Catalogues, CatalogueNumbers, Stamps, Preferences)
export class CatalogueNumberReferences {

    modelCopy;
    updateTemplate;
    editSlot;
    catalogues = [];

    defaultCondition = -1;
    defaultCatalogue = null;

    conditions = Condition.symbols();
    number;

    constructor(element, i18next, catalogueService, catalogueNumberService, stampService, preferenceService) {
        this.element = $(element);
        this.i18next = i18next;
        this.catalogueService = catalogueService;
        this.catalogueNumberService = catalogueNumberService;
        this.stampService = stampService;
        this.preferenceService = preferenceService;
    }

    bind() {
        let self = this;
        // Using a promise here, but not bind (view-models) do not use promises to block
        Promise.all([
            self.catalogueService.find(self.catalogueService.getDefaultSearchOptions()).then(results => {
                self.catalogues = results.models;
            }),
            self.preferenceService.find(self.preferenceService.getDefaultSearchOptions()).then(results => { //eslint-disable-line no-unused-vars
                let cond = self.preferenceService.getByNameAndCategory('condition', 'stamps');
                if( cond ) {
                    self.defaultCondition = +cond.value;
                }
                let cat = self.preferenceService.getByNameAndCategory('catalogueRefSecondary', 'stamps');
                if( cat ) {
                    self.defaultCatalogue = +cat.value;
                }
            })
        ]);
    }

    modelChanged(newModel) {
        if (newModel) {
            let self = this;
            this.modelCopy = _.clone(newModel, true);
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
        num.editing = true;
    }

    cancel(num) {
        let inlineRow = $(this.element.find('.editing-row'));
        if (num.id === 0) {
            inlineRow.remove();
            let index = _.findIndex(this.modelCopy.catalogueNumbers, {id: 0});
            if (index >= 0) {
                this.modelCopy.catalogueNumbers.splice(1, index);
            }
        }
        num.editing = false;
    }

    save(num) { //eslint-disable-line no-unused-vars
        let self = this;
        self.stampService.save(this.modelCopy).then( stamp => {
            self.modelChanged(stamp);
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
    }

    remove(num) {
        let self = this;
        let _remove = function(m) {
            self.catalogueNumberService.remove(m).then( result => {
                if( result === true ) {
                    let index = _.findIndex(self.modelCopy.catalogueNumbers, { id: m.id });
                    self.modelCopy.catalogueNumbers.splice(index, 1);
                }
            }).catch( err => {
                logger.debug("Error removing", err);
            });
        };
        bootbox.confirm({
            size: 'small',
            message: self.i18next.tr("prompts.delete-catalogue-number", { number: num.number } ),
            callback: function (result) {
                if (result === true) {
                    _remove.call(self, num);

                }
            }
        });

    }

    makeActive(num) {
        let activeNum;
        for( let i = 0; i < this.modelCopy.catalogueNumbers.length; i++ ) {
            let cn = this.modelCopy.catalogueNumbers[i];
            if( cn.active === true ) {
                activeNum = cn;
                break;
            }
        }
        if( activeNum.id === num.id ) {
            throw new Error("Can not set active as active!");
        } else {
            this.catalogueNumberService.makeActive(num.id).then( stamp => { //eslint-disable-line no-unused-vars
                activeNum.active = false;
                num.active = true;
            }).catch( err => {
                logger.error(err);
            });
        }
    }
}
