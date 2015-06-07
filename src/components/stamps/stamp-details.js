import {customElement,bindable,inject} from 'aurelia-framework';
import {Countries} from '../../services/countries';

@customElement('sw-stamp-details')
@bindable('model')
@inject(Countries)
export class StampDetailsComponent {

	countries = [];
	loading = true;

	constructor(countryService) {
		this.countryService = countryService;
		this.loadCountries();
	}

	loadCountries() {
		var self = this;
		this.countryService.find().then( results => {
			self.countries = results.models;
			self.loading = false;
		})
	}

}
