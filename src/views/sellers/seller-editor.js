import {bindable} from 'aurelia-framework';

@bindable('model')
export class sellerEditor {

	activate(options) {
		console.log(arguments);
		this.model = options;
	}
}
