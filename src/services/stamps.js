import {inject} from "aurelia-framework";
import {HttpClient} from "aurelia-http-client";
import {BaseService} from "services/base-service";
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../events/event-names';

import _ from 'lodash';

@inject(HttpClient, EventAggregator)
export class Stamps extends BaseService {

    constructor(http, eventBus) {
        super(http, eventBus);
        this.setupListeners();

    }

    setupListeners() {
        this.eventBus.subscribe( EventNames.deleteSuccessful, this.handleDelete.bind(this));
    }

    getResourceName() {
        return "stamps";
    }

    executeReport(options) {
        let opts = _.extend({}, this.getDefaultSearchOptions(), options);
        let self = this;
        let q = new Promise((resolve, reject) => {
            let href = self.baseHref + '/rest/reports?' + self.paramHelper.toParameters(opts);
            self.http.get(href).then(response => {
                let retModel = response.content;
                resolve(retModel);
            }).catch(reason => {
                reject(reason);
            });
        });
        return q;
    }

    handleDelete(obj) {
        if( obj && obj.type === 'catalogueNumbers' && obj.id >= 0 ) {
            for(let i = 0, len = this.models.length; i < len; i++ ) {
                let index = _.findIndex(this.models[i].catalogueNumbers, { id: +obj.id });
                if( index >= 0 ) {
                    this.models[i].catalogueNumbers.splice(1, index);
                    break;
                }
            }

        }
    }
}
