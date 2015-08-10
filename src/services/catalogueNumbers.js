import {inject} from "aurelia-framework";
import {HttpClient} from "aurelia-http-client";
import {BaseService} from "services/base-service";
import {EventAggregator} from 'aurelia-event-aggregator';
import {Stamps} from "services/stamps";

@inject(HttpClient, EventAggregator, Stamps)
export class CatalogueNumbers extends BaseService {

    constructor(http, eventBus, stampService) {
        super(http, eventBus);
        this.stampService = stampService;
    }

    getResourceName() {
        return "catalogueNumbers";
    }

    /**
     * Will set a catalogue number as active, updating the current catalogue number state (including current active)
     * for the stamp.  The stamp will be returned that is the current/latest state of the stamp.
     *
     * @url POST /rest/catalogueNumbers/%id%/makeActive
     *
     * @param id
     * @returns {Promise}
     */
    makeActive(id) {
        let self = this;
        let q = new Promise((resolve, reject) => {
            let href = this.baseHref + '/rest/' + this.getResourceName() + '/' + id + '/makeActive';
            self.http.post(href).then(response => {
                let stampModel = response.content;
                self.stampService.updateLocalEntry( stampModel );
                resolve(stampModel);
            }).catch(reason => {
                reject(reason);
            });
        });
        return q;
    }

}
