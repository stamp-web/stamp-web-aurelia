import {bindable,customElement,inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../event-names';

@customElement('editor-dialog')
@bindable('model')
@bindable('dialogId')
@bindable('content')
@bindable('title')
@bindable('collection')
@inject(EventAggregator)
export class EditorDialog {

	errorMsg = "None";

	constructor(eventBus) {
		this.eventBus = eventBus;
		this.setupSubscriptions();
	}

	setupSubscriptions() {
		var that = this;
		this.eventBus.subscribe(EventNames.close, function() {
			$("#" + that.dialogId).modal('hide');
		});
		this.eventBus.subscribe(EventNames.actionError, msg =>  {
			this.errorMsg = msg;
		});
	}

	save() {
		this.eventBus.publish(EventNames.save, this.model);

	}
}
