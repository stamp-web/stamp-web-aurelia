import {bindable} from 'aurelia-framework';

export class countryEditor {

	model;
	updateCountries = true;

	activate(options) {
		this.model = options;
	}
}
