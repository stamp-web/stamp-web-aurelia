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
import {EventAggregator} from 'aurelia-event-aggregator';
import {BindingEngine} from 'aurelia-binding';
import {Stamps} from '../../../services/stamps';
import {EventNames, KeyCodes} from '../../../events/event-managed';
import {Catalogues} from '../../../services/catalogues';
import {Condition} from '../../../util/common-models';

import _ from 'lodash';
import $ from 'jquery';

const defaultImagePath = "http://drake-server.ddns.net:9001/Thumbnails/";
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
    editCount = 0;


    static inject() {
        return [Element, BindingEngine, EventAggregator, Catalogues, Stamps];
    }

    constructor(element, bindingEngine, eventBus, catalogues, stamps) {
        this.element = element;
        this.bindingEngine = bindingEngine;
        this.eventBus = eventBus;
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
        if( this.editingCatalogueNumber ) {
            this._setupEditSubscribers(this.filteredStamps[newIndex], this.editingCatalogueNumber);
        }
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
        this._editSubscribers = [];
        this._modelSubscribers = [];
        this._modelSubscribers.push(this.bindingEngine.propertyObserver(this, 'editingRow').subscribe(this.editingRowChanged.bind(this)));
    }

    detached( ) {
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
        this._clearEditSubscribers();
    }



    filterStamps( ) {
        this.filteredStamps.splice(0, this.filteredStamps.length);
        let self = this;
        _.each( this.stamps, stamp => {
            let index = _.findIndex( stamp.catalogueNumbers, { catalogueRef: self.model.filterCatalogueRef});
            if( index >= 0 ) {
                let s = _.clone(stamp, true);
                let cn = s.catalogueNumbers[index];
                self._storeOriginalValues(cn);
                cn.catalogueRef = self.model.replacementCatalogueRef;
                cn.replacing = true;
                self.filteredStamps.push( s );
            }
        });
        if( this.filteredStamps.length > 0 ) {
            _.debounce( context => {
                context.editingRow = 0;
            })(this);
        }
    }

    select($index) {
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


    getImagePath(stamp) {
        let path = '';
        if( !stamp.wantList && !_.isEmpty(stamp.stampOwnerships && _.first(stamp.stampOwnerships).img)) {
            let img = _.first(stamp.stampOwnerships).img;
            if( img && img !== '' ) {
                var index = img.lastIndexOf('/');
                img = img.substring(0, index + 1) + "thumb-" + img.substring(index + 1);
                path = defaultImagePath + img;
            }
        }
        return path;
    }

    showFullSizeImage(evt, stamp) {
        evt.cancelBubble = true;
        if (!_.isEmpty(stamp.stampOwnerships) && _.first(stamp.stampOwnerships).img) {
            this.eventBus.publish(EventNames.showImage, stamp);
        }
        return false;
    }

    notFoundImage() {
        return StampReplacementTable.prototype.imageNotFoundFn;
    }

    advanceToNextRow($event) {
        if( $event.keyCode === KeyCodes.VK_TAB && this.editingRow < this.filteredStamps.length - 2) {
            this.select(this.editingRow + 1);
            return false;
        }
        return true;
    }

    saveAll() {
        let modified = _.filter(this.filteredStamps, { __modified__: true});
        let savePromises = [];
        _.each(modified, (stamp) => {
            savePromises.push(this.stampsService.save(stamp));
        });
        Promise.all(savePromises).then(result => {
            if( result ) {
                _.each(result, s => { //eslint-disable-line no-unused-vars
                    this.filterStamps();
                });
            }
        });
    }

    _setupEditSubscribers(stamp, cn) {
        this._clearEditSubscribers();
        this._editSubscribers.push(this.bindingEngine.propertyObserver(cn, 'number').subscribe(this._checkForModifiedStamp.bind(this)));
        this._editSubscribers.push(this.bindingEngine.propertyObserver(cn, 'value').subscribe(this._checkForModifiedStamp.bind(this)));
        this._editSubscribers.push(this.bindingEngine.propertyObserver(cn, 'condition').subscribe(this._checkForModifiedStamp.bind(this)));
    }

    _clearEditSubscribers() {
        if( this._editSubscribers ) {
            this._editSubscribers.forEach(sub => {
                sub.dispose();
            });
        }
        this._editSubscribers = [];
    }

    _checkForModifiedStamp() {
        let stamp = this.filteredStamps[this.editingRow];
        let currentModified = stamp.__modified__;
        let modified = this._markedAsModified(stamp, this.getReplacementCatalogueNumber(stamp));
        if( modified !== currentModified ) {
            this.editCount += (modified) ? 1 : -1;
        }

    }

    _storeOriginalValues(cn) {
        cn.__orig__ = {
            catalogueRef: cn.catalogueRef,
            condition: cn.condition,
            number: cn.number,
            value: cn.value,
            unknown: cn.unknown
        };
    }

    _markedAsModified(stamp, cn) {
        stamp.__modified__ = ( cn.__orig__.number !== cn.number ||
            cn.__orig__.condition !== cn.condition ||
            cn.__orig__.value !== cn.value ||
            cn.__orig__.unknown !== cn.unknown );
        return (stamp.__modified__ );
    }

    setAsModified(stamp) {
        stamp.__modified__ = true;
        this.editCount++;
    }



}

/**
 * Provide a single prototype based function for the unfound image
 */
StampReplacementTable.prototype.imageNotFoundFn = function () {
    $(this).hide();
};
