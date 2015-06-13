import {valueConverter} from 'aurelia-framework';

@valueConverter("emptyText")
export class emptyTextValueConverter {

    toView(value, def) {
        return ( !value ) ? ((def) ? def : "") : value;
    }
}
