import {inject,LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';
import {Countries} from '../services/countries';
import {Albums} from '../services/albums';
import {StampCollections} from '../services/stampCollections';
import {Sellers} from '../services/sellers';
import {Catalogues} from '../services/catalogues';
import {Stamps} from '../services/stamps';
import {EventNames} from '../event-names';
import  _  from 'lodash';

import 'resources/styles/views/manage-list.css!';

const logger = LogManager.getLogger('stamp-list');

@inject(EventAggregator, Router, Countries, Albums, StampCollections, Sellers, Catalogues, Stamps)
export class ManageList {

	selectedModels = [];
	selectedEntity = undefined;

	entityModels = [
		{field: 'countryRef', label: 'Countries', editTitle: 'Edit Country', service: undefined, editor: 'views/countries/country-editor'},
		{field: 'albumRef', label: 'Albums', editTitle: 'Edit Album', service: undefined, editor: 'views/albums/album-editor'},
		{field: 'stampCollectionRef', label: 'Stamp Collections', editTitle: 'Edit Stamp Collection',
			service: undefined, editor: 'views/stamp-collections/stamp-collection-editor'},
		{field: 'sellerRef', label: 'Sellers', editTitle: 'Edit Seller', service: undefined},
		{field: 'catalogueRef', label: 'Catalogues', editTitle: 'Edit Catlaogue', service: undefined}
	];

	constructor(eventBus, router, countryService, albumService, stampCollectionService, sellerService, catalogueService, stampService) {
		this.eventBus = eventBus;
		this.router = router;
		this.entityModels[_.findIndex(this.entityModels, {field: 'countryRef'})].service = countryService;
		this.entityModels[_.findIndex(this.entityModels, {field: 'albumRef'})].service = albumService;
		this.entityModels[_.findIndex(this.entityModels, {field: 'stampCollectionRef'})].service = stampCollectionService;
		this.entityModels[_.findIndex(this.entityModels, {field: 'sellerRef'})].service = sellerService;
		this.entityModels[_.findIndex(this.entityModels, {field: 'catalogueRef'})].service = catalogueService;
		this.stampService = stampService;
	}

	setEntity(entityType) {
		var index = _.findIndex(this.entityModels, {field: entityType});
		this.selectedEntity = this.entityModels[index];
		var opts = {
			$orderby: 'name asc'
		};
		if (entityType === 'catalogueRef') {
			opts.$orderby = 'issue desc';
		}
		this._saveState();

		this.entityModels[index].service.find(opts).then(result => {
			this.selectedModels = result.models;
			var count = 0;
			for (var i = 0, len = this.selectedModels.length; i < len; i++) {
				var model = this.selectedModels[i];
				var getCount = function (entityType, model, stampService) {
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

	create() {
		throw new Error("This is not implemented");
	}

	_saveState() {
		var obj = {
			field: this.selectedEntity.field
		};
		localStorage.setItem("manage-entities", JSON.stringify(obj));
	}

	_restoreState() {
		var entityCache = localStorage.getItem("manage-entities");
		if (entityCache) {
			var cacheVal = JSON.parse(entityCache);
			if (cacheVal.field) {
				this.setEntity(cacheVal.field);
			}
		}
	}

	activate() {
		this.eventBus.subscribe(EventNames.entityFilter, opts => {
			this.router.navigate("/stamp-list?$filter=" + encodeURI(opts.$filter));
			//this.router.navigate(this.router.generate('stamp-list', { $filter: opts.$filter }));
		});

		this._restoreState();
	}

}
