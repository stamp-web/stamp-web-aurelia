import {inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {activationStrategy} from 'aurelia-router';
import {Countries} from '../../services/countries';
import {Albums} from '../../services/albums';
import {StampCollections} from '../../services/stampCollections';
import {Sellers} from '../../services/sellers';
import {Catalogues} from '../../services/catalogues';
import {Stamps} from '../../services/stamps';
import {EventNames} from '../../events/event-names';
import _ from 'lodash';

import 'resources/styles/views/manage/manage.css!';

const logger = LogManager.getLogger('manage-list');

@inject(EventAggregator, Countries, Albums, StampCollections, Sellers, Catalogues, Stamps)
export class ManageList {

    selectedEntity = undefined;
    entityModels = [];
    subscriptions = [];

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
                editor: 'views/countries/country-editor',
                icon: 'sw-icon-country'
            },
            {
                field: 'albumRef',
                collectionName: albumService.getResourceName(),
                label: 'Albums',
                editTitle: 'Edit Album',
                createTitle: 'Create Album',
                service: albumService,
                editor: 'views/albums/album-editor',
                icon: 'sw-icon-album'
            },
            {
                field: 'stampCollectionRef',
                collectionName: stampCollectionService.getResourceName(),
                label: 'Stamp Collections',
                editTitle: 'Edit Stamp Collection',
                createTitle: 'Create Stamp Collection',
                service: stampCollectionService,
                editor: 'views/stamp-collections/stamp-collection-editor',
                icon: 'sw-icon-stamp-collection'
            },
            {
                field: 'sellerRef',
                collectionName: sellerService.getResourceName(),
                label: 'Sellers',
                editTitle: 'Edit Seller',
                createTitle: 'Create Seller',
                service: sellerService,
                editor: 'views/sellers/seller-editor',
                icon: 'sw-icon-seller'
            },
            {
                field: 'catalogueRef',
                collectionName: catalogueService.getResourceName(),
                label: 'Catalogues',
                editTitle: 'Edit Catalogue',
                createTitle: 'Create Catalogue',
                service: catalogueService,
                editor: 'views/catalogues/catalogue-editor',
                icon: 'sw-icon-catalogue'
            }
        ];

    }

    configureRouter(config, router) {
        this.router = router;
        config.title = 'Manage';
        config.mapUnknownRoutes(instruction => {
            if (instruction.fragment === '') {
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
                setTimeout(function () {
                    that.setEntity(cacheVal.field);
                }, 250);

            }
        }
    }

    activate() {
        this.configureSubscriptions();
    }

    deactivate() {
        this.subscriptions.forEach(function (subscription) {
            subscription();
        });
        this.subscriptions = [];
    }

    configureSubscriptions() {
        this.subscriptions.push(this.eventBus.subscribe(EventNames.entityFilter, opts => {
            this.router.navigate(this.router.generate('stamp-list', {$filter: opts.$filter}));
        }));
        this.subscriptions.push(this.eventBus.subscribe(EventNames.selectEntity, collectionName => {
            var fieldDef = _.findWhere(this.entityModels, {collectionName: collectionName});
            if (fieldDef) {
                this.processField(fieldDef);
            }
        }));
        this.subscriptions.push(this.eventBus.subscribe(EventNames.save, model => {
            if (this.selectedEntity.service) {
                this.selectedEntity.service.save(model).then(result => {
                    logger.debug( result );
                    this.eventBus.publish(EventNames.close);
                }).catch(err => {
                    this.eventBus.publish(EventNames.actionError, err.message);
                });
            }
        }));
        this.subscriptions.push(this.eventBus.subscribe(EventNames.edit, config => {
            this.editingModel = config.model;
            this.editorTitle = config.field.editTitle;
            this.editorContent = config.field.editor;
            this.editorIcon = config.field.icon;
        }));
        this.subscriptions.push(this.eventBus.subscribe(EventNames.entityDelete, function() {
            throw new Error("Not implemented yet");
        }));
    }

    determineActivationStrategy() {
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

    processField(fieldDef) {
        if(this.selectedEntity === fieldDef) {
            return;
        }
        this.selectedEntity = fieldDef;
        fieldDef.service.find(this.getSortCriteria(fieldDef)).then(result => {
            var that = this;
            that.eventBus.publish(EventNames.manageEntity, {
                models: result.models,
                field: that.selectedEntity
            });
            if( result.models.length > 0 && typeof result.models[0].stampCount === 'undefined') {
                fieldDef.service.countStamps().then( countResults => {
                    _.forEach( countResults, function( r ) {
                        var entity = _.findWhere(result.models, { id: +r.id});
                        if( entity ) {
                            entity.stampCount = +r.count;
                        }
                    });
                });
            }

        });
    }

    setEntity(entityType) {
        var index = _.findIndex(this.entityModels, {field: entityType});
        if (index >= 0) {
            var collectionName = this.entityModels[index].collectionName;
            if (this.router.currentInstruction && this.router.currentInstruction.fragment !== collectionName) {
                this.router.navigate(collectionName);
            }

        }
    }

    create(entity) {
        var that = this;
        setTimeout(function () {
            that.editingModel = {};
            that.editorTitle = entity.createTitle;
            that.editorContent = entity.editor;
            that.editorIcon = entity.icon;
        }, 50);

    }

}
