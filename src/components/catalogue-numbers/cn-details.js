import {customElement,bindable,inject} from 'aurelia-framework';
import {Catalogues} from '../../services/catalogues';
import {Condition} from '../../util/common-models';
import  _  from 'lodash';

@customElement('sw-catalogue-number-details')
@bindable('model')
@bindable('selectedCatalogue')
@inject(Catalogues)
export class CatalogueNumberDetailsComponent {

	catalogues = [];
	conditions = Condition.symbols();
	loading = true;

	constructor(catalogueService) {
		this.catalogueService = catalogueService;
		this.loadCountries();
	}

	modelChanged(newValue) {
		"use strict";
		if( newValue && newValue.catalogueRef) {
			this.selectedCatalogue = _.findWhere(this.catalogues, { id : newValue.catalogueRef}, this);
		} else {
			this.selectedCatalogue = null;
		}
	}

	selectedCatalogueChanged(newValue, oldValue) {
		"use strict";
		if(newValue && newValue !== oldValue ) {
			this.model.catalogueRef = newValue.id;
		}
	}

	loadCountries() {
		var self = this;
		this.catalogueService.find().then( results => {
			self.catalogues = _.sortByOrder(results.models,function(cn) {
				"use strict";
				return cn.issue;
			}, [false]);
			self.loading = false;
		})
	}
}
