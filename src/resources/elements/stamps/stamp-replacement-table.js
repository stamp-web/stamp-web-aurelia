/**
 Copyright 2019 Jason Drake

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
import {Preferences} from '../../../services/preferences';
import {EventNames} from '../../../events/event-managed';
import {KeyCodes} from '../../../events/key-codes';
import {Catalogues} from '../../../services/catalogues';
import {Condition} from '../../../util/common-models';
import {LocationHelper} from '../../../util/location-helper';

import _ from 'lodash';
import $ from 'jquery';


const defaultImagePath = "https://drake-server.ddns.net/Thumbnails/";
const logger = LogManager.getLogger('stamp-replacement-table');

@customElement('stamp-replacement-table')
@bindable({
    name: 'stamps',
    defaultValue: []
})
export class StampReplacementTable {

    model = {
        filterCatalogueRef: -1,
        replacementCatalogueRef: -1,
        editCount: 0,
        editingRow: -1
    };
    catalogues = [];
    filteredStamps = [];
    conditions = Condition.symbols();
    editingCatalogueNumber;


    static inject() {
        return [Element, BindingEngine, EventAggregator, Catalogues, Stamps, Preferences];
    }

    constructor(element, bindingEngine, eventBus, catalogues, stamps, prefService) {
        this.element = element;
        this.bindingEngine = bindingEngine;
        this.eventBus = eventBus;
        this.catalogueService = catalogues;
        this.stampsService = stamps;
        this.prefService = prefService;
    }

    stampsChanged(newList, oldList) {
        if (newList !== oldList) {
            this.filterStamps();
        }
    }

    editingRowChanged(newIndex) {
        // index may be empty
        if (this.model.editingRow < 0 || _.isEmpty(this.filteredStamps)) {
            return;
        }
        let stamp = this.filteredStamps[newIndex];
        this.editingCatalogueNumber = this.getReplacementCatalogueNumber(stamp);
        logger.debug(this.editingCatalogueNumber);
        if (this.editingCatalogueNumber) {
            this._setupEditSubscribers(stamp, this.editingCatalogueNumber);
        }
        _.debounce(() => {
            $('.replacement-number-input').focus();
        }, 250)();
    }

    attached() {
        this.loading = true;
        let cataloguePromise = this.catalogueService.find(this.catalogueService.getDefaultSearchOptions());
        let prefPromise = this.prefService.find(this.prefService.getDefaultSearchOptions());

        Promise.all([cataloguePromise, prefPromise]).then(results => {
            this._processCatalogues(results[0]);
            this._processPreferences();
            this.loading = false;
        });

        this._editSubscribers = [];
        this._modelSubscribers = [];
        this._modelSubscribers.push(this.bindingEngine.propertyObserver(this.model, 'editingRow').subscribe(this.editingRowChanged.bind(this)));
    }

    _processCatalogues(results) {
        this.catalogues = results.models;
    }

    _processPreferences() {
        let path = this.prefService.getByNameAndCategory('thumbPath', 'stamps');
        this.thumbnailPath = LocationHelper.resolvePath(path, defaultImagePath);
    }

    detached() {
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
        this._clearEditSubscribers();
    }


    filterStamps() {
        this.filteredStamps = [];
        this.model.editCount = 0;
        this.model.editingRow = -1;
        //_.debounce(() => {
        _.each(this.stamps, stamp => {
            let index = _.findIndex(stamp.catalogueNumbers, (_cn) => {
                return _cn.catalogueRef === this.model.filterCatalogueRef;
            });
            if (index > -1) {
                let s = _.cloneDeep(stamp);
                let cn = s.catalogueNumbers[index];
                this._storeOriginalValues(cn);
                cn.catalogueRef = this.model.replacementCatalogueRef;
                cn.replacing = true;
                this.filteredStamps.push(s);
            }
        });
        if (this.filteredStamps.length > 0) {
            this.model.editingRow = 0;
        }
        // })();

    }

    select($index) {
        this.model.editingRow = $index;
    }

    getCurrencyCode(cn) {
        if (cn) {
            if (!cn.currencyCode) {
                cn.currencyCode = _.find(this.catalogues, {id: cn.catalogueRef}).code;
            }
            return cn.currencyCode;
        }
    }

    getReplacementCatalogueNumber(stamp) {
        return _.find(stamp.catalogueNumbers, {replacing: true});
    }

    @computedFrom('model.filterCatalogueRef', 'model.replacementCatalogueRef')
    get filterReady() {
        return (this.model.filterCatalogueRef >= 0 && this.model.replacementCatalogueRef >= 0);
    }


    getImagePath(stamp) {
        let path = '';
        if (!stamp.wantList && !_.isEmpty(stamp.stampOwnerships && _.first(stamp.stampOwnerships).img)) {
            let img = _.first(stamp.stampOwnerships).img;
            if (img && img !== '') {
                var index = img.lastIndexOf('/');
                img = img.substring(0, index + 1) + "thumb-" + img.substring(index + 1);
                path = this.thumbnailPath + img;
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
        if ($event.keyCode === KeyCodes.VK_TAB && this.model.editingRow < this.filteredStamps.length - 1) {
            this.select(this.model.editingRow + 1);
            return false;
        }
        return true;
    }

    saveAll() {
        let modified = _.filter(this.filteredStamps, {__modified__: true});
        let savePromises = [];
        _.each(modified, (stamp) => {
            savePromises.push(this.stampsService.save(stamp));
        });
        Promise.all(savePromises).then(result => {
            if (result) {
                _.each(result, s => { //eslint-disable-line no-unused-vars
                    let index = _.findIndex(this.stamps, (s2) => {
                        return s2.id === s.id;
                    });
                    if (index > -1) {
                        this.stamps[index] = s;
                    }
                });
                this.filterStamps();
            }
        });
    }

    _setupEditSubscribers(stamp, cn) {
        this._clearEditSubscribers();
        this._editSubscribers.push(this.bindingEngine.propertyObserver(cn, 'number').subscribe(this._checkForModifiedStamp.bind(this)));
        this._editSubscribers.push(this.bindingEngine.propertyObserver(cn, 'value').subscribe(this._checkForModifiedStamp.bind(this)));
        this._editSubscribers.push(this.bindingEngine.propertyObserver(cn, 'condition').subscribe(this._checkForModifiedStamp.bind(this)));
    }

    changeUnknown() {
        _.defer(() => {
            if (this.model.editingRow > -1) {
                let stamp = this.filteredStamps[this.model.editingRow];
                let cn = this.getReplacementCatalogueNumber(stamp);
                cn.unknown = (!cn.unknown && true);
                this._checkForModifiedStamp();
            }
        });

    }

    _clearEditSubscribers() {
        if (this._editSubscribers) {
            this._editSubscribers.forEach(sub => {
                sub.dispose();
            });
        }
        this._editSubscribers = [];
    }

    _checkForModifiedStamp() {
        if (this.model.editingRow < 0) {
            return;
        }
        let stamp = this.filteredStamps[this.model.editingRow];
        let cn = this.getReplacementCatalogueNumber(stamp);
        let currentModified = stamp.__modified__;
        let modified = this._markedAsModified(stamp, cn);
        if (modified !== currentModified) {
            this.model.editCount += (modified) ? 1 : -1;
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
        stamp.__modified__ = (cn.__orig__.number !== cn.number ||
            cn.__orig__.condition !== cn.condition ||
            cn.__orig__.value !== cn.value ||
            cn.__orig__.unknown !== cn.unknown);
        return (stamp.__modified__);
    }

    setAsModified(stamp) {
        stamp.__modified__ = true;
        this.model.editCount++;
    }


}

/**
 * Provide a single prototype based function for the unfound image
 */
StampReplacementTable.prototype.imageNotFoundFn = function () {
    $(this).hide();
};
