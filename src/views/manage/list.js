import {EventAggregator} from 'aurelia-event-aggregator';
import {inject,LogManager,bindable} from 'aurelia-framework';
import {EventNames} from '../../event-names';

@inject(EventAggregator)
@bindable('models')
@bindable('field')
export class EntityListManage {

	constructor(eventBus) {
		this.eventBus = eventBus;
		this.configureSubscriptions();
	}

	configureSubscriptions() {
		this.eventBus.subscribe(EventNames.manageEntity, data => {
			if( data ) {
				if( data.models ) {
					this.models = data.models;
				}
				if ( data.field ) {
					this.field = data.field;
				}
			}
		});
	}

	activate(obj, instructions) {
		this.models = [];
		this.eventBus.publish( EventNames.selectEntity, instructions.route);
	}

}
