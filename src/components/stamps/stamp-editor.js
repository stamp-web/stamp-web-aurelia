import {customElement,bindable,inject,computedFrom,LogManager} from 'aurelia-framework';
import {Stamps} from '../../services/stamps';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../../event-names';

import 'resources/styles/components/stamps/stamps.css!';
import  _  from 'lodash';

const logger = LogManager.getLogger('stamp-editor');

@customElement('stamp-editor')
@bindable('model')
@inject(EventAggregator, Stamps)
export class StampEditorComponent {

	constructor(eventBus,stampService) {
		this.eventBus = eventBus;
		this.stampService = stampService;
	}

	save() {
		"use strict";
		if( this.validate() ) {
			this.stampService.save(this.model).then(stamp => {
				this.eventBus.publish(EventNames.stampSaved, stamp);
			}).catch(err => {
				logger.error(err);
			});
		}
	}

	validate() {
		"use strict";
		return true;
	}

	/**
	 * Will lazily retrieve the active catalogue number from the stamp model.  If one does not exist
	 * will create the catalogue numbers array and create an initial catalogue number to put in it.
	 *
	 * This will be a computed property on model.  It will only calculate if model is updated.
	 *
	 * @returns {Object} The active catalogue number.
	 */
	@computedFrom('model')
	get activeCatalogueNumber() {
		if( !this.model ) {
			return undefined;
		}
		var activeNumber = this.model.activeCatalogueNumber;
		if( !activeNumber ) {
			if( !this.model.catalogueNumbers ) {
				this.model.catalogueNumbers = [];
			} else {
				activeNumber = _.findWhere(this.model.catalogueNumbers, { active: true });
			}
			if( !activeNumber ) {
				activeNumber = createCatalogueNumber();
				this.model.catalogueNumbers.push(activeNumber);
			}
			this.model.activeCatalogueNumber = activeNumber;
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
