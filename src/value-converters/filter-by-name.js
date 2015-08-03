import {valueConverter} from 'aurelia-framework';


@valueConverter("filterByName")
export class filterByNameValueConverter {

    toView(value, filterText) {
        if( !value || value.length < 1 || (!filterText || filterText.length < 1)) {
            return value;
        }
        return value.filter(item => {
            return item.name.indexOf(filterText) >= 0;
        });
    }
}
