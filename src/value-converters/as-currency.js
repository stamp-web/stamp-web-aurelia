import {inject, valueConverter} from 'aurelia-framework';


@valueConverter("asCurrency")
export class asCurrencyValueConverter {

	constructor() {

	}

	toView(value, selector) {
		if (value && value[selector]) {
			return '(' + value[selector] + ')';
		}
		return "";
	}
}
