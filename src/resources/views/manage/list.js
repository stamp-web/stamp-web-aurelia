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
import {EventAggregator} from 'aurelia-event-aggregator';
import {I18N} from 'aurelia-i18n';
import {LogManager, bindable} from 'aurelia-framework';
import {EventNames, StorageKeys, KeyCodes} from '../../../events/event-managed';
import {Operators, Predicate} from 'odata-filter-parser';
import _ from 'lodash';

const logger = LogManager.getLogger('manage-list-table');


/*
 * Handle the escaping in the filter box and have it clear the field.
 */
let handleKeyDown = function(e) {
    var self = this;
    if (e.keyCode === 27) {
        self.clear();
    } else if (e.keyCode === KeyCodes.VK_ENTER ) {
        e.preventDefault();
    }
};

export class EntityListManage {

    static inject = [EventAggregator, I18N];

    @bindable models;
    @bindable field;

    subscriptions = [];
    filterText = "";
    filterInput; // The input for filter text
    hasIssue = false;
    editingModel;

    constructor(eventBus, i18n) {
        this.eventBus = eventBus;
        this.i18n = i18n;
        this.configureSubscriptions();
    }

    configureSubscriptions() {
        this.subscriptions.push(
            this.eventBus.subscribe(EventNames.manageEntity, data => {
                if (data) {
                    if (data.models) {
                        this.models = data.models;
                    }
                    if (data.field) {
                        this.field = data.field;
                    }
                }
            })
        );
    }

    fieldChanged(newVal,oldVal) {
        this.hasIssue = ( newVal && newVal.field === 'catalogueRef');
        // The field is changed, so we need to remember the old field if defined (switching between field types)
        if( oldVal ) {
            this._saveState(oldVal);
        }
        this._restoreState(newVal);
    }

    viewStamps(model) {
        var p = new Predicate( {
            subject: this.field.field,
            operator: Operators.EQUALS,
            value: model.id
        });
        this.eventBus.publish(EventNames.entityFilter, p);
    }

    edit(model) {
        this.eventBus.publish(EventNames.edit, {field: this.field, model: _.clone(model)});
    }

    remove(model) {
        let self = this;
        let _remove = (m) => {
            self.field.service.remove(m).then(function() {
                let index = _.findIndex(self.models, {id: m.id});
                self.models.splice(index, 1);
            }).catch(err => {
                logger.error(err);
            });
        };
        let msg = this.i18n.tr('prompts.delete-item', {name: model.name});

        if(window.confirm(msg)) {
            _remove.call(self, model);
        }
    }

    clear() {
        this.filterText = "";
    }

    activate(obj) {
        this.models = [];
        this.eventBus.publish(EventNames.selectEntity, obj.path);
    }

    /**
     * On bind, force the update to the hasIssue definition
     */
    bind() {
        if( this.field ) {
            this.fieldChanged(this.field);
        }
    }

    _saveState(fieldDef) {
        if( fieldDef && fieldDef.field ) {
            let obj = {};
            var filterCache = localStorage.getItem(StorageKeys.listFiltering);
            if (filterCache) {
                obj = JSON.parse(filterCache);
            }
            obj[fieldDef.field] = this.filterText;
            localStorage.setItem(StorageKeys.listFiltering, JSON.stringify(obj));
        }
    }

    _restoreState(fieldDef) {
        if( fieldDef &&fieldDef.field ) {
            var filterCache = localStorage.getItem(StorageKeys.listFiltering);
            if (filterCache) {
                var cacheVal = JSON.parse(filterCache);
                if(cacheVal[fieldDef.field]) {
                    this.filterText = cacheVal[fieldDef.field];
                }
            }
        }
    }

    attached() {
        let self = this;
        setTimeout( () => { // bind this in a timeout to make sure the detached has fired to remove the listener first
            let id = (self.filterInput) ? self.filterInput.id : 'filter-text';
            $('#' + id).on('keydown', handleKeyDown.bind(self));
        }, 250);
    }

    detached() {
        $('#' + this.filterInput.id).off('keydown', handleKeyDown.bind(this));
        this.subscriptions.forEach(function (sub) {
            sub.dispose();
        });
        this._saveState(this.field);
    }

}
