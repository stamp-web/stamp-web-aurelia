import {valueConverter} from 'aurelia-framework';

@valueConverter("defaultValue")
export class defaultValueConverter {

    toView(value, defValue) {
        return ( !value ) ? defValue : value;
    }
}
