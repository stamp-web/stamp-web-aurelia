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
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import _ from 'lodash';

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
        let channels = Object.keys(self._subscribers);
        this.unsubscribe(channels);
    }

    unsubscribe(channels) {
        let remove = (channel) => {
            _.forEach(this._subscribers[channel], sub => {
                sub.dispose();
            });
            this._subscribers[channel] = [];
        };
        _.forEach(channels, ch => {
            remove(ch);
        });
    }
}

export class EventHelper {

    static changeEvent(data) {
        let changeEvent;
        if (window.CustomEvent) {
            changeEvent = new CustomEvent('change', {
                detail: {
                    data
                },
                bubbles: true
            });
        } else {
            changeEvent = document.createEvent('CustomEvent');
            changeEvent.initCustomEvent('change', true, true, {
                detail: data
            });
        }
        return changeEvent;

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
    setAspects: "set-aspects",
    stampCount: "stamp-count",
    stampCountForCollection: "stamp-count-for-collection",
    stampCreate: 'stamp-create',
    stampEdit: 'stamp-edit',
    stampEditorCancel: 'stamp-edit-cancel',
    stampRemove: 'stamp-remove',
    stampSaved: 'stamp-saved',
    toggleStampSelection: 'stamp-select',
    valid: 'is-valid'
};

export var StorageKeys = {
    referenceCatalogueNumbers: "referenceCatalogueNumbers",
    manageEntities: "manage-entities",
    listFiltering: 'list-filtering'
};

export var KeyCodes = {
    VK_TAB: 9,
    VK_ENTER: 13,
    VK_ESCAPE: 27,
    VK_SHIFT: 16
};
