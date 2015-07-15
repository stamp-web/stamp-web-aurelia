import {valueConverter} from 'aurelia-framework';

@valueConverter("zeroBased")
export class zeroBasedValueConverter {

    toView(value) {
        if (!isNaN(parseInt(value))) {
            value = value + 1;
        }
        return value;
    }

    fromView(value) {
        if( !isNaN(parseInt(value)) ) {
            value = value - 1;
        }
        return value;
    }

}
