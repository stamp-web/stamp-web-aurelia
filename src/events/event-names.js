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
export var EventNames = {
    calculateImagePath: 'calculate-image-path',
    changeEditMode: 'change-edit-mode',
    checkExists: 'check-exists',
    conflictExists: 'conflict-exists',
    convert: 'convert',
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
    stampCreate: 'stamp-create',
    stampEdit: 'stamp-edit',
    stampEditorCancel: 'stamp-edit-cancel',
    stampRemove: 'stamp-remove',
    stampSaved: 'stamp-saved',
    stampSelect: 'stamp-select'
};

export var StorageKeys = {
    referenceCatalogueNumbers: "referenceCatalogueNumbers",
    manageEntities: "manage-entities"
};

export var KeyCodes = {
    VK_ENTER: 13,
    VK_ESCAPE: 27
};
