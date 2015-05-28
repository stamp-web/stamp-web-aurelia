import {EventAggregator} from 'aurelia-event-aggregator';
import {inject,LogManager,bindable} from 'aurelia-framework';
import {EventNames} from '../../event-names';

@inject(EventAggregator)
@bindable('models')
@bindable('field')
export class EntityListManage {

	subscriptions = [];

	constructor(eventBus) {
		this.eventBus = eventBus;
		this.configureSubscriptions();
	}

	configureSubscriptions() {
		this.subscriptions.push(
			this.eventBus.subscribe(EventNames.manageEntity, data => {
				if (data) {
					if (data.models) {
						this.models = data.models;
					}
					if (data.field) {
						this.field = data.field;
					}
				}
			})
		);
	}

	activate(obj, instructions) {
		this.models = [];
		var that = this;
		that.eventBus.publish( EventNames.selectEntity, instructions.route);
	}

	detached() {
		this.subscriptions.forEach(function(sub) {
			sub();
		});
	}

}
