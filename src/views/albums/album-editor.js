import {bindable} from 'aurelia-framework';

@bindable("model")
export class albumEditor {

	model;

	activate(options) {
		this.model = options;
	}
}
