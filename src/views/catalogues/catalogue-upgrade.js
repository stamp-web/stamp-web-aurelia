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
import {LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {SessionContext} from '../../services/session-context';
import {Stamps} from '../../services/stamps';

const logger = LogManager.getLogger('catalogue-upgrade');

export class CatalogueUpgradeManager {

    stamps = [];
    currentFilters = [];

    static inject() {
        return [Router, Stamps];
    }

    constructor(router, stampService) {
        this.router = router;
        this.stampService = stampService;
    }

    attached() {
        this._searchHandle = this.processSearchRequest.bind(this);
        SessionContext.addContextListener(SessionContext.SEARCH_CHANGE, this._searchHandle );
    };

    detached() {
        SessionContext.removeContextListener(SessionContext.SEARCH_CHANGE, this._searchHandle );
    };

    processSearchRequest(data, oldData) { //eslint-disable-line no-unused-vars
        let self = this;
        let options = (!self.options) ? {} : self.options;
        if( data ) {
            options.$filter = data.serialize();
            self.currentFilters = data.flatten();
            logger.debug(self.currentFilters);
        }
        self.search(options);
    }

    search(options) {
        return new Promise((resolve, reject) => {
            //var opts = this.options; // this.buildOptions();
            //this.stampService.clearSelected();
            this.stampService.find(options).then(result => {
                this.router.navigate(this.router.generate('upgrade', options));
                this.processStamps(result, options);
                resolve();
            }).catch(err => {
                logger.debug(err);
                reject(err);
            });
        });
    }

    processStamps(result, opts) {
        this.stamps = result.models;
        console.table(opts);
    }


}
