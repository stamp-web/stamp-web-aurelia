import {valueConverter} from 'aurelia-framework';
import XDate from 'arshaw/xdate';

@valueConverter("jsonDateFormat")
export class jsonDateFormatValueConverter {

    toView(value) {
        if (value) {
            value = new XDate(value).toLocaleDateString();
        }
        return value;
    }

    fromView(value) {
        if( value ) {
            value = new XDate(value).toISOString();
        }
        return value;
    }

}
