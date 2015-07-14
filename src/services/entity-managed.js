import {inject} from "aurelia-framework";
import {HttpClient} from "aurelia-http-client";
import {BaseService} from "services/base-service";
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(HttpClient, EventAggregator)
export class EntityManaged extends BaseService {

    constructor(http, eventBus) {
        super(http, eventBus);
    }

    getDefaultSearchOptions() {
        return {
            $orderby: 'name asc'
        };
    }

    countStamps() {
        var q = new Promise((resolve, reject) => {
            let href = this.baseHref + '/rest/' + this.getResourceName() + '/!countStamps';
            this.http.get(href).then(response => {
                let retModel = response.content;
                resolve(retModel);
            }).catch(reason => {
                reject(reason);
            });
        });
        return q;
    }
}
