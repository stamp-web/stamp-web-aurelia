import {bindable,customElement,inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../../event-names';
import  _  from 'lodash';

@customElement('entity-list')
@bindable('models')
@bindable('field')
@inject(EventAggregator)
export class EntityList {

	hasIssue = false;
	editingModel;

	constructor(eventBus) {
		this.eventBus = eventBus;
	}

	fieldChanged(newVal) {
		this.hasIssue = ( newVal && newVal.field === 'catalogueRef');
	}

	viewStamps(model) {
		this.eventBus.publish(EventNames.entityFilter, {
			$filter: '(' + this.field.field + ' eq ' + model.id + ')'
		});

	}

	edit(model) {
		this.editingModel = _.clone(model);
	}

}
