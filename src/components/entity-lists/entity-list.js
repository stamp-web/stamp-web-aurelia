import {bindable,customElement,inject} from 'aurelia-framework';


@customElement('entity-list')
@bindable('models')
@bindable('field')
export class EntityList {

	getSearchQuery(model) {
		return '$filter=(' + this.field.field + ' eq ' + model.id + ')';
	}
}
