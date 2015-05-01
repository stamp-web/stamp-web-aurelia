import {bindable,customElement,inject} from 'aurelia-framework';


@customElement('entity-list')
@bindable('models')
@bindable('field')
export class EntityList {

	hasIssue = false;

	fieldChanged(newVal) {
		this.hasIssue = ( newVal && newVal.field === 'catalogueRef');
	}
	getSearchQuery(model) {
		return '$filter=(' + this.field.field + ' eq ' + model.id + ')';
	}
}
