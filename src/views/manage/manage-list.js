import {inject,LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router, activationStrategy} from 'aurelia-router';
import {Countries} from '../../services/countries';
import {Albums} from '../../services/albums';
import {StampCollections} from '../../services/stampCollections';
import {Sellers} from '../../services/sellers';
import {Catalogues} from '../../services/catalogues';
import {Stamps} from '../../services/stamps';
import {EventNames} from '../../event-names';
import  _  from 'lodash';

import 'resources/styles/views/manage/manage.css!';

const logger = LogManager.getLogger('stamp-list');

@inject(EventAggregator, Countries, Albums, StampCollections, Sellers, Catalogues, Stamps)
export class ManageList {

	selectedEntity = undefined;
	entityModels = [];

	constructor(eventBus, countryService, albumService, stampCollectionService, sellerService, catalogueService, stampService) {
		this.eventBus = eventBus;
		this.stampService = stampService;
		this.entityModels = [
			{
				field: 'countryRef',
				collectionName: countryService.getResourceName(),
				label: 'Countries',
				editTitle: 'Edit Country',
				createTitle: 'Create Country',
				service: countryService,
				editor: 'views/countries/country-editor'
			},
			{
				field: 'albumRef',
				collectionName: albumService.getResourceName(),
				label: 'Albums',
				editTitle: 'Edit Album',
				createTitle: 'Create Album',
				service: albumService,
				editor: 'views/albums/album-editor'
			},
			{
				field: 'stampCollectionRef',
				collectionName: stampCollectionService.getResourceName(),
				label: 'Stamp Collections',
				editTitle: 'Edit Stamp Collection',
				createTitle: 'Create Stamp Collection',
				service: stampCollectionService,
				editor: 'views/stamp-collections/stamp-collection-editor'
			},
			{
				field: 'sellerRef',
				collectionName: sellerService.getResourceName(),
				label: 'Sellers',
				editTitle: 'Edit Seller',
				createTitle: 'Create Seller',
				service: sellerService
			},
			{
				field: 'catalogueRef',
				collectionName: catalogueService.getResourceName(),
				label: 'Catalogues',
				editTitle: 'Edit Catalogue',
				createTitle: 'Create Catalogue',
				service: catalogueService
			}
		];

		this.configureSubscriptions();
	}

	configureRouter(config, router) {
		this.router = router;
		config.title = 'Manage';
		config.mapUnknownRoutes(instruction => {
			if( instruction.fragment === '' ) {
				instruction.config.moduleId = './list';
				this._restoreState();
			} else {
				var index = _.findIndex(this.entityModels, {collectionName: instruction.fragment});
				if (index >= 0) {
					this._saveState(this.entityModels[index].field);
					instruction.config.moduleId = './list';
				}
			}
		});
	}

	_saveState(fieldDef) {
		var obj = {
			field: fieldDef
		};
		localStorage.setItem("manage-entities", JSON.stringify(obj));
	}

	_restoreState() {
		var entityCache = localStorage.getItem("manage-entities");
		if (entityCache) {
			var cacheVal = JSON.parse(entityCache);
			if (cacheVal.field) {
				var that = this;
				setTimeout(function() {
					that.setEntity(cacheVal.field);
				}, 250);

			}
		}
	}

	configureSubscriptions() {
		this.eventBus.subscribe(EventNames.entityFilter, opts => {
			this.router.navigate("/stamp-list?$filter=" + encodeURI(opts.$filter));
			//this.router.navigate(this.router.generate('stamp-list', { $filter: opts.$filter }));
		});
		this.eventBus.subscribe(EventNames.selectEntity, collectionName => {
			var fieldDef = _.findWhere(this.entityModels, { collectionName: collectionName });
			if( fieldDef ) {
				this.processField( fieldDef );
			}
		});
		this.eventBus.subscribe(EventNames.save, model => {
			if( this.selectedEntity.service ) {
				this.selectedEntity.service.save(model).then(result => {
					this.eventBus.publish(EventNames.close);
				}).catch(err => {
					this.eventBus.publish(EventNames.actionError, err.message);
				});
			}
		});
		this.eventBus.subscribe(EventNames.edit, config => {
			this.editingModel = config.model;
			this.editorTitle = config.field.editTitle;
		});
	}

	determineActivationStrategy(){
		return activationStrategy.replace;
	}

	getSortCriteria(fieldDef) {
		var opts = {
			$orderby: 'name asc'
		};
		if (fieldDef.field === 'catalogueRef') {
			opts.$orderby = 'issue desc';
		}
		return opts;
	}

	processField( fieldDef ) {
		this.selectedEntity = fieldDef;
		fieldDef.service.find(this.getSortCriteria(fieldDef)).then(result => {
			var that = this;
			Promise.all(result.models.map(function(model) {
				var opts = {
					$filter: '(' + fieldDef.field + ' eq ' + model.id + ')'
				};
				return that.stampService.count(opts).then(result => {
					model.stampCount = +result;
				}).catch(issue => {
					logger.error( issue );
				});
			})).then( function(  ) {
				that.eventBus.publish(EventNames.manageEntity, {
					models : result.models,
					field: that.selectedEntity
				})
			}).catch( issue => {
				logger.error( issue );
			});
		});
	}

	setEntity(entityType) {
		var index = _.findIndex(this.entityModels, {field: entityType});
		if( index >= 0 ) {
			this.router.navigate( this.entityModels[index].collectionName);
		}
	}

	create() {
		var that = this;
		setTimeout( function() {
			that.editingModel = { };
			that.editorTitle = that.selectedEntity.createTitle;
		}, 150);

	}

}
