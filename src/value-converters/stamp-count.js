import {valueConverter} from 'aurelia-framework';
import {StringUtil} from '../util/object-utilities';

@valueConverter("stampCount")
export class stampCountValueConverter {

    toView(value) {
        return ( value && +value > 0 ) ? value + StringUtil.pluralize(' stamp', +value) : '';
    }
}
