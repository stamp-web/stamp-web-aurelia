import {valueConverter} from 'aurelia-framework';


@valueConverter("asCurrency")
export class asCurrencyValueConverter {

    toView(value, selector) {
        if (value && value[selector]) {
            return '(' + value[selector] + ')';
        }
        return "";
    }
}
