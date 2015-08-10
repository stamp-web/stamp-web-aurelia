import {valueConverter} from 'aurelia-framework';
import {Condition} from '../util/common-models';

@valueConverter("asEnum")
export class asEnumValueConverter {

    toView(value, selector) {
        if (!isNaN(value)) {
            let enumValues;
            switch( selector ) {
                case 'Condition':
                    enumValues = Condition;
                    break;

            }
            if( enumValues ) {
                return enumValues.get(value).display;
            }

        }
        return "";
    }
}
