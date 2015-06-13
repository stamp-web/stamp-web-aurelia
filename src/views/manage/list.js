import {EventAggregator} from 'aurelia-event-aggregator';
import {inject, LogManager, bindable} from 'aurelia-framework';
import {EventNames} from '../../events/event-names';
import bootbox from 'bootbox';
import _ from 'lodash';

const logger = LogManager.getLogger('manage-list-table');

@inject(EventAggregator)
@bindable('models')
@bindable('field')
export class EntityListManage {

    subscriptions = [];
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
        this.eventBus.publish(EventNames.entityFilter, {
            $filter: '(' + this.field.field + ' eq ' + model.id + ')'
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

    activate(obj, instructions) {
        this.models = [];
        var that = this;
        that.eventBus.publish(EventNames.selectEntity, instructions.route);
    }

    detached() {
        this.subscriptions.forEach(function (sub) {
            sub();
        });
    }

}
