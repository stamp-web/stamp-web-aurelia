import {bindable,customElement} from 'aurelia-framework';

@customElement('sort-dialog')
@bindable('sort')
@bindable('sortOptions')
@bindable('dialogId')
export class SortDialog {
	chooseSort(s) {
		this.sort = s;
	}
	close() {

	}
}
