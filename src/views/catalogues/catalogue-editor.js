import {bindable} from 'aurelia-framework';
import {CurrencyCode, CatalogueType} from '../../util/common-models';

//const logger = LogManager.getLogger('catalogueEditor');

@bindable("model")
export class catalogueEditor {

    model;
    codes = CurrencyCode.symbols();
    catalogueTypes = CatalogueType.symbols();

    constructor() {

    }

    activate(options) {
        this.model = options;
    }
}
