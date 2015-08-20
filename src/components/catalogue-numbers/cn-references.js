import {bindable, inject, customElement, ViewCompiler, ViewResources, Container, ViewSlot, LogManager} from 'aurelia-framework';
import {Catalogues} from '../../services/catalogues';
import {Stamps} from '../../services/stamps';
import {CatalogueNumbers} from '../../services/catalogueNumbers';
import {Condition} from '../../util/common-models';
import {I18N} from 'aurelia-i18next';

import _ from 'lodash';
import bootbox from 'bootbox';

import 'resources/styles/components/catalogue-numbers/cn-references.css!';

const logger = LogManager.getLogger('cn-references');


@customElement('catalogue-number-references')
@bindable('model')
@inject(Element, ViewCompiler, Container, I18N, Catalogues, CatalogueNumbers, Stamps)
export class CatalogueNumberReferences {

    modelCopy;
    updateTemplate;
    editSlot;
    catalogues = [];

    conditions = Condition.symbols();
    number;

    constructor(element, $viewCompiler, $container, i18next, catalogueService, catalogueNumberService, stampService) {
        this.element = $(element);
        this.$compiler = null;//$compiler;
        this.$viewCompiler = $viewCompiler;
        this.$container = $container;
        this.$viewResources = new ViewResources();
        this.i18next = i18next;
        this.catalogueService = catalogueService;
        this.catalogueNumberService = catalogueNumberService;
        this.stampService = stampService;
    }

    attached() {
       /* this.$compiler.loadTemplate("./components/catalogue-numbers/cn-updateable-row.html").then(html => {
            this.updateTemplate = html.template.innerHTML;
        }); */
    }

    bind() {
        return this.catalogueService.find(this.catalogueService.getDefaultSearchOptions()).then(results => {
            this.catalogues = results.models;
        });
    }

    modelChanged(newModel) {
        if (newModel) {
            let self = this;
            this.modelCopy = _.clone(newModel, true);
            this.modelCopy.catalogueNumbers.forEach(catNum => {
                catNum.currencyCode = self.determineCurrencyCode(catNum.catalogueRef);
            });
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

    edit(num, index, addRow) {
        if (typeof this.number !== 'undefined') {
            this.cancel(this.number);
        }
        let trs = $(this.element.find('tbody > tr'));
        if (index === -1) {
            index = trs.length - 1;
        }
        let row = $(trs[index]);

        this.number = num;
        let clonedRow = $(this.updateTemplate).clone();
        row.after(clonedRow);
        let tpl = document.createElement('template');
        clonedRow.find('td').each((indx, cell) => {
            tpl.content.appendChild(cell);
        });
        let view = this.$viewCompiler.compile(tpl, this.$viewResources).create(this.$container, this);
        this.insertByViewSlot(clonedRow[0], view);
        if (!addRow) {
            row.addClass("row-being-edited");
        }
    }

    insertByViewSlot(rowDom, compiledView) {
        this.editSlot = new ViewSlot(rowDom, true);
        this.editSlot.add(compiledView);
        this.editSlot.attached();
    }

    cancel(num) {
        if (num === this.number) {
            let row = this.element.find('.row-being-edited');
            if (row.length > 0) {
                $(row).removeClass('row-being-edited');
            }
            let inlineRow = $(this.element.find('.editing-row'));
            inlineRow.remove();
            this.editSlot.unbind();
            this.editSlot.removeAll();
            this.number = undefined;
        }
    }

    save(num) {
        let self = this;
        if( num.id <= 0 ) {
            this.modelCopy.catalogueNumbers.push(num);
        }
        self.stampService.save(this.modelCopy).then( stamp => { //eslint-disable-line no-unused-vars
            self.cancel(num);
        });
    }

    add() {
        let num = {
            id: 0,
            number: "",
            value: 0
        };
        this.edit(num, -1, true);
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
