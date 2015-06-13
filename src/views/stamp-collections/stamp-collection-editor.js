import {bindable} from 'aurelia-framework';

@bindable("model")
export class stampCollectionEditor {

    model;

    activate(options) {
        this.model = options;
    }
}
