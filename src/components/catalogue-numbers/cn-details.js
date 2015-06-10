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
		this.loadCatalogues();
	}

	modelChanged(newValue) {
		this.setSelectedCatalogue(newValue);
	}

	/**
	 * Since the catalogueRef may be in the model prior to the catalogues being loaded, this may be called
	 * upon loading the catalogues to set the selected catalogue which mirrors the model.
	 * @param m
	 */
	setSelectedCatalogue(m) {
		if( m && m.catalogueRef ) {
			this.selectedCatalogue = _.findWhere(this.catalogues, { id : m.catalogueRef}, this);
		} else {
			this.selectedCatalogue = null;
		}
	}

	/**
	 * Bind the catalogue number when it is visually changed.
	 *
	 * @param newValue
	 * @param oldValue
	 */
	selectedCatalogueChanged(newValue, oldValue) {
		if(newValue && newValue !== oldValue ) {
			this.model.catalogueRef = newValue.id;
		}
	}

	loadCatalogues() {
		var self = this;
		this.catalogueService.find().then( results => {
			self.catalogues = _.sortByOrder(results.models,function(cn) {
				return cn.issue;
			}, [false]);
			self.loading = false;
			self.setSelectedCatalogue(self.model);
		})
	}
}
