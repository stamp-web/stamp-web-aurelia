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
import {customElement, bindable, inject} from 'aurelia-framework';
import {Catalogues} from '../../services/catalogues';

import _ from 'lodash';

import 'resources/styles/components/stamps/stamp-table.css!';

@customElement('stamp-table')
@inject(Catalogues)
@bindable('stamps')
@bindable('total')
export class StampTable {

    catalogues = [];
    models;

    constructor(catalogueService) {
        this.catalogueService = catalogueService;
    }

    bind() {
        this.catalogueService.find(this.catalogueService.getDefaultSearchOptions).then(result => {
            this.catalogues = result.models;
            this.models = this.stamps;
        });
    }

    stampsChanged(newValues) {
        if( this.catalogueService.loaded ) {
            this.models = newValues;
        }
    }

    getActiveCatalogueNumber(stamp) {
        if (stamp) {
            if (!stamp.activeCatalogueNumber) {
                let index = _.findIndex( stamp.catalogueNumbers, { active: true });
                stamp.activeCatalogueNumber = stamp.catalogueNumbers[index];
            }
            return stamp.activeCatalogueNumber;
        }
        return {};
    }

    getOwnership(stamp) {
        if( stamp.stampOwnerships && stamp.stampOwnerships.length > 0 ) {
            return stamp.stampOwnerships[0];
        }
        return {};
    }

    getCurrencyCode(cn) {
        if( cn ) {
            if( !cn.currencyCode ) {
                let indx = _.findIndex( this.catalogues, { id: cn.catalogueRef });
                cn.currencyCode = this.catalogues[indx].code;
            }
            return cn.currencyCode;
        }
    }


}
