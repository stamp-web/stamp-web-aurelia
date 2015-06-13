import {bindable} from 'aurelia-framework';

@bindable('model')
export class sellerEditor {

    activate(options) {
        this.model = options;
    }
}
