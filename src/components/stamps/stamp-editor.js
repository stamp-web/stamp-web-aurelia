import {customElement,bindable,inject,computedFrom,LogManager} from 'aurelia-framework';
import {ObserverLocator} from 'aurelia-binding';
import {Stamps} from '../../services/stamps';
import {Preferences} from '../../services/preferences';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../../event-names';

import 'resources/styles/components/stamps/stamps.css!';
import  _  from 'lodash';

const logger = LogManager.getLogger('stamp-editor');

const PreferredValues = [
	{ key: 'countryRef', category: 'stamps', type: Number },
	{ key: 'catalogueRef', category: 'stamps', type: Number, model: 'activeCatalogueNumber' },
	{ key: 'condition', category: 'stamps', type: Number, model: 'activeCatalogueNumber' }
];


@customElement('stamp-editor')
@bindable('model')
@inject(EventAggregator, Stamps, Preferences)
export class StampEditorComponent {

	createMode = false;
	preferences = [];
	duplicateModel;

	constructor(eventBus,stampService, preferenceService) {
		this.eventBus = eventBus;
		this.stampService = stampService;
		this.preferenceService = preferenceService;

	}

	attached() {
		this.setPreferences();
	}

	setPreferences() {
		var self = this;
		this.preferenceService.find().then(results => {
			self.preferences = results.models;
			self.processPreferences();
		})
	}

	processPreferences() {
		if( this.preferences.length > 0 && this.model.id <= 0 ) {
			PreferredValues.forEach(function(pref) {
				var prefValue = _.findWhere(this.preferences, { name: pref.key, category: pref.category});
				if( prefValue ) {
					var value = prefValue.value;
					if( pref.type === Number ) {
						value = +value;
					}
					var m = this.duplicateModel;
					if( pref.model === "activeCatalogueNumber" ) {
						m = this.activeCatalogueNumber;
					}
					if( m ) {
						m[pref.key] = value;
					} else {
						logger.error("The model was not defined");
					}
				}
			}, this);
		}
	}

	save() {
		if( this.validate() ) {
			this.stampService.save(this.duplicateModel).then(stamp => {
				this.eventBus.publish(EventNames.stampSaved, stamp);
			}).catch(err => {
				logger.error(err);
			});
		}
	}

	cancel() {
		this.eventBus.publish(EventNames.stampEditorCancel);
	}
	saveAndNew() {
		this.save();
	}

	validate() {
		return true;
	}

	modelChanged(newValue) {
		this.createMode = (newValue && newValue.id <= 0);
		if( newValue ) {
			this.duplicateModel = _.clone(newValue,true);
		} else {
			this.duplicateModel = null;
		}

	}

	/**
	 * Will lazily retrieve the active catalogue number from the stamp model.  If one does not exist
	 * will create the catalogue numbers array and create an initial catalogue number to put in it.
	 *
	 * This will be a computed property on model.  It will only calculate if model is updated.
	 *
	 * @returns {Object} The active catalogue number.
	 */
	@computedFrom('duplicateModel')
	get activeCatalogueNumber() {
		if( !this.duplicateModel ) {
			return undefined;
		}
		var activeNumber = this.duplicateModel.activeCatalogueNumber;
		if( !activeNumber ) {
			if( !this.duplicateModel.catalogueNumbers ) {
				this.duplicateModel.catalogueNumbers = [];
			} else {
				activeNumber = _.findWhere(this.duplicateModel.catalogueNumbers, { active: true });
			}
			if( !activeNumber ) {
				activeNumber = createCatalogueNumber();
				this.duplicateModel.catalogueNumbers.push(activeNumber);
			}
			this.duplicateModel.activeCatalogueNumber = activeNumber;
		}
		return activeNumber;
	}
}

function createCatalogueNumber() {
	return {
		id: 0,
		catalogueRef: -1,
		value: 0.0,
		number: '',
		active: true,
		unknown: false
	};
};
