/**
 Copyright 2015 Jason Drake

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
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class EventManaged {

    _subscribers = [];

    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    subscribe(key, func) {
        if (!this._subscribers[key]) {
            this._subscribers[key] = [];
        }
        this._subscribers[key].push(this.eventBus.subscribe(key, func));
    }

    detached() {
        let self = this;
        let channel = Object.keys(self._subscribers);
        channel.forEach(key => {
            self.unsubscribe(key);
        });
    }

    unsubscribe(channel) {
        this._subscribers[channel].forEach(sub => {
            sub.dispose();
        });
    }
}

export var EventNames = {
    calculateImagePath: 'calculate-image-path',
    changeEditMode: 'change-edit-mode',
    checkExists: 'check-exists',
    collapsePanel: 'collapse-panel',
    conflictExists: 'conflict-exists',
    convert: 'convert',
    countryDeleted: 'country-deleted',
    panelCollapsed: "panel-collapsed",
    close: "close-dialog",
    actionError: "action-error",
    keywordSearch: "keywordSearch",
    search: "search",
    showImage: "showImage",
    save: "save",
    edit: 'edit',

    editorCancel: 'editor-cancel',

    deleteSuccessful: "delete-completed",

    create: 'create',
    manageEntity: "manage-entity",
    entityDelete: "entity-delete",
    selectEntity: "select-entity",
    entityFilter: "entity-filter",
    loadingStarted: "loading-started",
    loadingFinished: "loading-finished",
    pageChanged: "page-changed",
    pageRefreshed: "page-refreshed",
    preferenceChanged: "preference-changed",
    saveSuccessful: "save-completed",
    updateFinished: "update-finished",
    stampCount: "stamp-count",
    stampCountForCollection: "stamp-count-for-collection",
    stampCreate: 'stamp-create',
    stampEdit: 'stamp-edit',
    stampEditorCancel: 'stamp-edit-cancel',
    stampRemove: 'stamp-remove',
    stampSaved: 'stamp-saved',
    toggleStampSelection: 'stamp-select'
};

export var StorageKeys = {
    referenceCatalogueNumbers: "referenceCatalogueNumbers",
    manageEntities: "manage-entities"
};

export var KeyCodes = {
    VK_ENTER: 13,
    VK_ESCAPE: 27
};
