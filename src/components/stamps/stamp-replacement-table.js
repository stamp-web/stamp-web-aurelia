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
import {customElement, bindable, computedFrom, LogManager} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-binding';
import {Stamps} from '../../services/stamps';
import {Catalogues} from '../../services/catalogues';
import {Condition} from '../../util/common-models';

import _ from 'lodash';
import $ from 'jquery';


const logger = LogManager.getLogger('stamp-replacement-table');

@customElement('stamp-replacement-table')
@bindable( {
    name: 'stamps',
    defaultValue: []
})
export class StampReplacementTable {

    model = {
        filterCatalogueRef: -1,
        replacementCatalogueRef: -1
    };
    catalogues = [];
    filteredStamps = [];
    editingRow = -1;
    conditions = Condition.symbols();
    editingCatalogueNumber;


    static inject() {
        return [Element, BindingEngine, Catalogues, Stamps];
    }

    constructor(element, bindingEngine, catalogues, stamps) {
        this.element = element;
        this.bindingEngine = bindingEngine;
        this.catalogueService = catalogues;
        this.stampsService = stamps;
    }

    stampsChanged(newList, oldList) {
        if( newList !== oldList ) {
            this.filterStamps();
        }
    }

    editingRowChanged(newIndex) {
        this.editingCatalogueNumber = this.getReplacementCatalogueNumber( this.filteredStamps[newIndex]);
        logger.debug(this.editingCatalogueNumber);
        _.debounce( () => {
            $('.replacement-number-input').focus();
        }, 250)();
    }

    attached( ) {
        this.loading = true;
        this.catalogueService.find(this.catalogueService.getDefaultSearchOptions()).then(results => {
            this.catalogues = results.models;
            this.loading = false;
        });
        this._modelSubscribers = [];
        this._modelSubscribers.push(this.bindingEngine.propertyObserver(this, 'editingRow').subscribe(this.editingRowChanged.bind(this)));
    }

    detached( ) {
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
    }

    filterStamps( ) {
        this.filteredStamps.splice(0, this.filteredStamps.length);
        let self = this;
        _.each( this.stamps, stamp => {
            let index = _.findIndex( stamp.catalogueNumbers, { catalogueRef: self.model.filterCatalogueRef});
            if( index >= 0 ) {
                let s = _.clone(stamp, true);
                s.catalogueNumbers[index].catalogueRef = self.model.replacementCatalogueRef;
                s.catalogueNumbers[index].replacing = true;
                self.filteredStamps.push( s );
            }
        });
        if( this.filteredStamps.length > 0 ) {
            _.debounce( context => {
                context.editingRow = 0;
            })(this);
        }
    }

    select($event, $index) {
        this.editingRow = $index;
    }

    getCurrencyCode(cn) {
        if( cn ) {
            if( !cn.currencyCode ) {
                cn.currencyCode = _.find( this.catalogues, { id: cn.catalogueRef }).code;
            }
            return cn.currencyCode;
        }
    }

    getReplacementCatalogueNumber(stamp) {
        return _.find( stamp.catalogueNumbers, {replacing: true});
    }

    @computedFrom('model.filterCatalogueRef', 'model.replacementCatalogueRef')
    get filterReady() {
        return ( this.model.filterCatalogueRef >= 0 && this.model.replacementCatalogueRef >= 0 );
    }

}
