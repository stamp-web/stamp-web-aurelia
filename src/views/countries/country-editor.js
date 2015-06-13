import {bindable} from 'aurelia-framework';

@bindable("model")
export class countryEditor {

    updateCountries = true;

    activate(options) {
        this.model = options;
    }
}
