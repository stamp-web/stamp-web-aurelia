/**
 Copyright 2015 Jason Drake

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
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
        if( value === 'Invalid date') { // this will force the text to be "" for invalid dates
            value = null;
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
                value = null;
                logger.warn("invalid value from view: " + value, dateErr);
            }
        }
        return value;
    }

}
