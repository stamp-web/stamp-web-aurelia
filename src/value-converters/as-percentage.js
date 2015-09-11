import {valueConverter} from 'aurelia-framework';

@valueConverter("asPercentage")
export class percentageValueConverter {

    toView(value) {
        if (typeof value !== 'undefined') {
            value = (100.0 * value).toFixed(2) + '%';
        }
        return value;
    }

}
