/**
 Copyright 2016 Jason Drake

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import {inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {activationStrategy} from 'aurelia-router';
import {Countries} from '../../../services/countries';
import {Albums} from '../../../services/albums';
import {StampCollections} from '../../../services/stampCollections';
import {Sellers} from '../../../services/sellers';
import {Catalogues} from '../../../services/catalogues';
import {Stamps} from '../../../services/stamps';
import {EventNames, StorageKeys} from '../../../events/event-managed';
import {SessionContext} from '../../../services/session-context';
import _ from 'lodash';

const logger = LogManager.getLogger('manage-list');

@inject(EventAggregator, Countries, Albums, StampCollections, Sellers, Catalogues, Stamps)
export class ManageList {

    selectedEntity;
    editingEntity;
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
                editor: 'resources/views/countries/country-editor',
                icon: 'sw-icon-country'
            },
            {
                field: 'albumRef',
                collectionName: albumService.getResourceName(),
                label: 'Albums',
                editTitle: 'Edit Album',
                createTitle: 'Create Album',
                service: albumService,
                editor: 'resources/views/albums/album-editor',
                icon: 'sw-icon-album'
            },
            {
                field: 'stampCollectionRef',
                collectionName: stampCollectionService.getResourceName(),
                label: 'Stamp Collections',
                editTitle: 'Edit Stamp Collection',
                createTitle: 'Create Stamp Collection',
                service: stampCollectionService,
                editor: 'resources/views/stamp-collections/stamp-collection-editor',
                icon: 'sw-icon-stamp-collection'
            },
            {
                field: 'sellerRef',
                collectionName: sellerService.getResourceName(),
                label: 'Sellers',
                editTitle: 'Edit Seller',
                createTitle: 'Create Seller',
                service: sellerService,
                editor: 'resources/views/sellers/seller-editor',
                icon: 'sw-icon-seller'
            },
            {
                field: 'catalogueRef',
                collectionName: catalogueService.getResourceName(),
                label: 'Catalogues',
                editTitle: 'Edit Catalogue',
                createTitle: 'Create Catalogue',
                service: catalogueService,
                editor: 'resources/views/catalogues/catalogue-editor',
                icon: 'sw-icon-catalogue'
            }
        ];

    }

    configureRouter(config, router) {
        this.router = router;
        config.mapUnknownRoutes(instruction => {
            if (instruction.fragment === '') {
                this._restoreState();
            } else {
                let index = _.findIndex(this.entityModels, {collectionName: instruction.fragment});
                if (index >= 0) {
                    this._saveState(this.entityModels[index].field);
                }
            }
            return {
                moduleId: './list'
            };
        });
    }

    _saveState(fieldDef) {
        let obj = {
            field: fieldDef
        };
        localStorage.setItem(StorageKeys.manageEntities, JSON.stringify(obj));
    }

    _restoreState() {
        let entityCache = localStorage.getItem(StorageKeys.manageEntities);
        if (entityCache) {
            let cacheVal = JSON.parse(entityCache);
            if (cacheVal.field) {
                _.debounce( that => {
                   that.selectedEntityChanged(cacheVal.field);
                },125)(this);
            }
        }
    }

    activate() {
        this.configureSubscriptions();
        this._restoreState();
    }

    deactivate() {
        this.subscriptions.forEach(function (subscription) {
            subscription.dispose();
        });
        this.subscriptions = [];
    }

    configureSubscriptions() {
        this.subscriptions.push(this.eventBus.subscribe(EventNames.entityFilter, opts => {
            SessionContext.setSearchCondition(opts);
            this.router.navigate(this.router.generate('stamp-list', {$filter: opts.serialize()}));
        }));
        this.subscriptions.push(this.eventBus.subscribe(EventNames.selectEntity, collectionName => {
            let fieldDef = _.find(this.entityModels, {collectionName: collectionName});
            if (fieldDef) {
                this.processField(fieldDef);
            }
        }));
        this.subscriptions.push(this.eventBus.subscribe(EventNames.save, data => {
            if (this.editingEntity.service) {
                this.editingEntity.service.save(data.model, data.aspects).then(result => {
                    logger.debug( result );
                    this.eventBus.publish(EventNames.close);
                }).catch(err => {
                    logger.debug(err);
                    this.eventBus.publish(EventNames.actionError, err.message);
                });
            }
        }));
        this.subscriptions.push(this.eventBus.subscribe(EventNames.edit, config => {
            this.editingModel = config.model;
            this.editingEntity = config.field;
            this.editorTitle = this.editingEntity.editTitle;
            this.editorContent = this.editingEntity.editor;
            this.editorIcon = this.editingEntity.icon;

        }));
        this.subscriptions.push(this.eventBus.subscribe(EventNames.entityDelete, function() {
            throw new Error("Not implemented yet");
        }));
    }

    determineActivationStrategy() {
        return activationStrategy.replace;
    }

    getSortCriteria(fieldDef) {
        let opts = {
            $orderby: 'name asc'
        };
        if (fieldDef.field === 'catalogueRef') {
            opts.$orderby = 'issue desc';
        }
        return opts;
    }

    processField(fieldDef) {
        if(this.selectedEntity === fieldDef.field) {
            return;
        }
        this.selectedEntity = fieldDef.field;
        fieldDef.service.find(this.getSortCriteria(fieldDef)).then(result => {
            this.eventBus.publish(EventNames.manageEntity, {
                models: result.models,
                field: fieldDef
            });
            if( result.models.length > 0 && typeof result.models[0].stampCount === 'undefined') {
                fieldDef.service.countStamps().then( countResults => {
                    _.forEach( countResults, function( r ) {
                        let entity = _.find(result.models, { id: +r.id});
                        if( entity ) {
                            entity.stampCount = +r.count;
                        }
                    });
                });
            }

        });
    }

    selectionChanged(event) {
        if (event.originalEvent) return;
        this.selectedEntity = event.detail.data;
        this.selectedEntityChanged(this.selectedEntity);
    }

    selectedEntityChanged(entityType) {
        let index = _.findIndex(this.entityModels, {field: entityType});
        if (index >= 0) {
            let collectionName = this.entityModels[index].collectionName;
            if (this.router.currentInstruction && this.router.currentInstruction.fragment !== collectionName) {
                this.router.navigate(collectionName);
            }

        }
    }

    create(entity) {
        this.editingEntity = entity;
        _.defer(() => {
            this.editingModel = {
                id: 0
            };
            this.editorTitle = entity.createTitle;
            this.editorContent = entity.editor;
            this.editorIcon = entity.icon;
        });

    }

}
