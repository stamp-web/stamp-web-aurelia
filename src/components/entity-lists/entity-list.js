import {bindable,customElement,inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../../event-names';

@customElement('entity-list')
@bindable('models')
@bindable('field')
@inject(EventAggregator)
export class EntityList {

	hasIssue = false;

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
}
