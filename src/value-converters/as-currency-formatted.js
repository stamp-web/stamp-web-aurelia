import {valueConverter} from 'aurelia-framework';


@valueConverter("asCurrencyFormatted")
export class asCurrencyValueConverter {

    toView(value, currency) {
        if (value && currency) {
            return (value).toLocaleString("en", {style: "currency", currency: currency, minimumFractionDigits: 2});
        }
        return value;
    }
}
