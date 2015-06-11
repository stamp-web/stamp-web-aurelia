import {customElement,bindable,inject,computedFrom} from 'aurelia-framework';
import {ObserverLocator} from 'aurelia-binding';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../../event-names';
import {Catalogues} from '../../services/catalogues';
import {Condition} from '../../util/common-models';
import  _  from 'lodash';

@customElement('sw-catalogue-number-details')
@bindable('model')
@bindable('selectedCatalogue')
@inject(EventAggregator,ObserverLocator,Catalogues)
export class CatalogueNumberDetailsComponent {

	catalogues = [];
	conditions = Condition.symbols();
	loading = true;
	selectedCatalogue;

	_modelSubscribers = [];
	_subscribers = [];

	constructor(eventBus, observer, catalogueService) {
		this.catalogueService = catalogueService;
		this.eventBus = eventBus;
		this.observer = observer;
		this.loadCatalogues();
	}

	attached() {
		this._subscribers.push(this.eventBus.subscribe(EventNames.conflictExists,this.handleConflictExists.bind(this)));
	}

	handleConflictExists(data) {
		throw new Error("Not implemented yet");
	}

	detached() {
		this._subscribers.forEach(sub => {
			sub();
		});
	}

	modelChanged(newValue) {
		this._modelSubscribers.forEach(sub => {
			sub();
		});
		this._modelSubscribers = [];
		this._modelSubscribers.push(this.observer.getObserver(newValue,'catalogueRef').subscribe(this.catalogueChanged.bind(this)));
		this._modelSubscribers.push(this.observer.getObserver(newValue,'condition').subscribe(this.existencePropertyChanged.bind(this)));
		this._modelSubscribers.push(this.observer.getObserver(newValue,'number').subscribe(this.existencePropertyChanged.bind(this)));
	}

	existencePropertyChanged(newValue) {
		this.sendExistsVerfication();
	}

	catalogueChanged(newValue,oldValue) {
		if( newValue > 0 ) {
			this.selectedCatalogue = _.findWhere(this.catalogues, { id: +newValue });
			this.sendExistsVerfication();
		}
	}

	sendExistsVerfication() {
		this.eventBus.publish(EventNames.checkExists, { model: this.model });
	}

	loadCatalogues() {
		var self = this;
		this.catalogueService.find().then( results => {
			self.catalogues = _.sortByOrder(results.models,function(cn) {
				return cn.issue;
			}, [false]);
			self.loading = false;
		})
	}
}
