import {inject,LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Countries} from '../services/countries';
import {Albums} from '../services/albums';
import {StampCollections} from '../services/stampCollections';
import {Sellers} from '../services/sellers';
import {Catalogues} from '../services/catalogues';
import {Stamps} from '../services/stamps';
import {EventNames} from '../event-names';
import  _  from 'lodash';

const logger = LogManager.getLogger('stamp-list');

@inject(EventAggregator, Countries, Albums, StampCollections, Sellers, Catalogues, Stamps)
export class ManageList {

	selectedModels = [];
	selectedEntity = undefined;

	entityModels = [
		{field: 'countryRef', label: 'Countries', service: undefined},
		{field: 'albumRef', label: 'Albums', service: undefined},
		{field: 'stampCollectionRef', label: 'Stamp Collections', service: undefined},
		{field: 'sellerRef', label: 'Sellers', service: undefined},
		{field: 'catalogueRef', label: 'Catalogues', service: undefined}
	];

	constructor(eventBus, countryService, albumService, stampCollectionService, sellerService, catalogueService, stampService) {
		this.eventBus = eventBus;
		this.entityModels[_.findIndex(this.entityModels, { field: 'countryRef'})].service = countryService;
		this.entityModels[_.findIndex(this.entityModels, { field: 'albumRef'})].service = albumService;
		this.entityModels[_.findIndex(this.entityModels, { field: 'stampCollectionRef'})].service = stampCollectionService;
		this.entityModels[_.findIndex(this.entityModels, { field: 'sellerRef'})].service = sellerService;
		this.entityModels[_.findIndex(this.entityModels, { field: 'catalogueRef'})].service = catalogueService;
		this.stampService = stampService;
	}

	viewStamps(model) {
		this.eventBus.publish(EventNames.search, {
			$filter: '(' + this.selectedEntity.field + ' eq ' + model.id + ')'
		});

	}

	setEntity(entityType) {
		var index = _.findIndex(this.entityModels, {field: entityType });
		this.selectedEntity = this.entityModels[index];
		this.entityModels[index].service.find({ $orderby: 'name asc'}).then(result => {
			this.selectedModels = result.models;
			var count = 0;
			for (var i = 0, len = this.selectedModels.length; i < len; i++) {
				var model = this.selectedModels[i];
				var getCount = function(entityType, model, stampService) {
					var opts = {
						$filter: '(' + entityType + ' eq ' + model.id + ')'
					};
					stampService.count(opts).then(result => {
						model.stampCount = +result;
					}).catch(issue => {
						console.log(issue);
					})
				};
				getCount(entityType, model, this.stampService);
			}
		});
	}

}
