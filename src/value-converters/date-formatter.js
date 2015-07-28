import {valueConverter, LogManager} from 'aurelia-framework';
import moment from 'moment';

const logger = LogManager.getLogger('dateFormatter');

@valueConverter("dateFormatter")
export class dateFormatterValueConverter {

    toView(value) {
        if (value) {
            try {
                var d = new Date(value);
                value = moment(d).format('MM/DD/YYYY');
            } catch( dateErr ) {
                logger.warn( "Invalid value for view:" + value, dateErr );
            }
        }
        return value;
    }

    fromView(value) {
        if (value) {
            if( value === 'Invalid date') { // this will force the text to be "" for invalid dates
                return null;
            }
            try {
                value = moment(new Date(value)).format('YYYY-MM-DDTHH:mm:ssZ');
            } catch (dateErr) {
                logger.warn("invalid value from view: " + value, dateErr);
            }
        }
        return value;
    }

}
