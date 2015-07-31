import {valueConverter} from 'aurelia-framework';
import _ from 'lodash';

@valueConverter("bitwiseToArray")
export class bitwiseToArrayValueConverter {

    toView(value, maxSize) {
        return this.determineShiftedValues(value, maxSize);
    }

    fromView(values) {
        let value = 0;
        if( values ) {
            _.each(values, v => {
                value += +v;
            });
        }
        return value;
    }

    determineShiftedValues(value, maxSize) {
        var values = [];
        var runningTotal = +value;
        for (var i = maxSize; i >= 0; i--) {
            if (runningTotal >> i === 1) {
                var binValue = Math.pow(2, i);
                runningTotal = runningTotal - binValue;
                values.push('' + binValue);
            }
        }
        return values;
    }
}
