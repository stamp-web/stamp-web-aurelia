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
import {customElement, bindable, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

import {Catalogues} from '../../../services/catalogues';
import {Preferences} from '../../../services/preferences';
import {EventNames} from '../../../events/event-managed';
import {LocationHelper} from '../../../util/location-helper';

import _ from 'lodash';

const defaultImagePath = 'https://drake-server.ddns.net/Thumbnails/';

@customElement('stamp-table')
@inject(Element, EventAggregator, Catalogues, Preferences)
@bindable('stamps')
@bindable('lastSelected')
@bindable('total')
export class StampTable {

    catalogues = [];
    models = [];
    lastTime = 0;


    constructor(element, eventBus, catalogueService, prefService) {
        this.catalogueService = catalogueService;
        this.prefService = prefService;
        this.eventBus = eventBus;
        this.element = element;
    }

    bind() {

        let cataloguePromise = this.catalogueService.find(this.catalogueService.getDefaultSearchOptions());
        let prefPromise = this.prefService.find(this.prefService.getDefaultSearchOptions());

        Promise.all([cataloguePromise, prefPromise]).then(results => {
            this._processCatalogues(results[0]);
            this._processPreferences();
            this.models = this.stamps;
            this.loading = false;
        });
    }

    _processCatalogues(results) {
        this.catalogues = results.models;

    }

    _processPreferences() {
        let path = this.prefService.getByNameAndCategory('thumbPath', 'stamps');
        this.thumbnailPath = LocationHelper.resolvePath(path, defaultImagePath);
    }

    stampsChanged(newValues) {
        if( this.catalogueService.loaded ) {
            this.models = newValues;
        }
    }

    toggleSelection(evt, stamp) {
        if( this.selectionTimeout ) {
            clearTimeout(this.selectionTimeout);
        }
        if( evt.detail > 1 ) {
            return;
        }
        this.selectionTimeout = setTimeout( () => {
            this.eventBus.publish(EventNames.toggleStampSelection, {model: stamp, shiftKey: evt.shiftKey });
            this.selectionTimeout = undefined;
        }, 200);

    }

    edit(stamp) {
        if( !stamp.selected ) {
            this.eventBus.publish(EventNames.toggleStampSelection, {model: stamp, shiftKey: false});
        }
        this.eventBus.publish(EventNames.stampEdit, stamp);
    }

    getImagePath(stamp) {
        let path = '';
        if( !stamp.wantList && !_.isEmpty(stamp.stampOwnerships && _.first(stamp.stampOwnerships).img)) {
            let img = _.first(stamp.stampOwnerships).img;
            if( img && img !== '' ) {
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
        return StampTable.prototype.imageNotFoundFn;
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

StampTable.prototype.imageNotFoundFn = function () {
    $(this).hide();
};
