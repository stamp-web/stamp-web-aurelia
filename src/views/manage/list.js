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
import {inject, LogManager, bindable} from 'aurelia-framework';
import {EventNames} from '../../events/event-names';
import bootbox from 'bootbox';
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
    } else if (e.keyCode === 13 ) {
        e.preventDefault();
    }
};


@inject(EventAggregator)
@bindable('models')
@bindable('field')
export class EntityListManage {

    subscriptions = [];
    filterText = "";
    filterInput; // The input for filter text
    hasIssue = false;
    editingModel;

    constructor(eventBus) {
        this.eventBus = eventBus;
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

    fieldChanged(newVal) {
        this.hasIssue = ( newVal && newVal.field === 'catalogueRef');
    }

    viewStamps(model) {
        var p = new Predicate( {
            subject: this.field.field,
            operator: Operators.EQUALS,
            value: model.id
        });
        this.eventBus.publish(EventNames.entityFilter, {
            $filter: p.serialize()
        });
    }

    edit(model) {
        this.eventBus.publish(EventNames.edit, {field: this.field, model: _.clone(model)});
    }

    remove(model) {
        var self = this;
        var _remove = function (m) {
            self.field.service.remove(m).then(function() {
                var index = _.findIndex(self.models, {id: m.id});
                self.models.splice(index, 1);
            }).catch(err => {
                logger.error(err);
            });
        };
        bootbox.confirm({
            size: 'small',
            message: "Delete " + model.name + "?",
            callback: function (result) {
                if (result === true) {
                    _remove.call(self, model);

                }
            }
        });
    }

    clear() {
        this.filterText = "";
    }

    activate(obj) {
        this.models = [];
        var that = this;
        that.eventBus.publish(EventNames.selectEntity, obj.path);
    }

    /**
     * On bind, force the update to the hasIssue definition
     */
    bind() {
        if( this.field ) {
            this.fieldChanged(this.field);
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
    }

}
