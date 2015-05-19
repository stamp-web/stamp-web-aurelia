import {bindable,customElement,inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../../event-names';
import  _  from 'lodash';

import 'resources/styles/components/entity-lists/entity-list.css!';

@customElement('entity-list')
@bindable('models')
@bindable('field')
@inject(EventAggregator)
export class EntityList {

	hasIssue = false;
	editingModel;


	constructor(eventBus) {
		this.eventBus = eventBus;
		this.configureSubscriptions();
	}

	fieldChanged(newVal) {
		this.hasIssue = ( newVal && newVal.field === 'catalogueRef');
	}

	viewStamps(model) {
		this.eventBus.publish(EventNames.entityFilter, {
			$filter: '(' + this.field.field + ' eq ' + model.id + ')'
		});
	}

	configureSubscriptions() {
		this.eventBus.subscribe(EventNames.save, model => {
			if( this.field.service ) {
				this.field.service.save(model).then(result => {
					this.eventBus.publish(EventNames.close);
				}).catch(err => {
					this.eventBus.publish(EventNames.actionError, err.message);
				});
			}
		});
	}
	edit(model) {
		this.editingModel = _.clone(model);
		this.editorContent=this.field.editor;

	}

}
