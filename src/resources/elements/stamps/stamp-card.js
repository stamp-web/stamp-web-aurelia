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
import {bindable, customElement, computedFrom, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {BindingEngine} from 'aurelia-binding';
import {EventNames} from '../../../events/event-managed';
import {Preferences} from '../../../services/preferences';
import {LocationHelper} from '../../../util/location-helper';
import {byNameValueConverter} from '../../../resources/value-converters/by-name';
import {rateFilterValueConverter} from '../../../resources/value-converters/rate-filter';
import _ from 'lodash';
import $ from 'jquery';

var defaultImagePath = "https://drake-server.ddns.net/Thumbnails/";

@customElement('stamp-card')
@inject(Element, EventAggregator, BindingEngine, Preferences, byNameValueConverter)
@bindable('model')
@bindable('selected')
@bindable('highlight')
export class StampCard {

    imageShown = false;
    activeCN;
    imagePath;

    constructor(element, eventBus, $bindingEngine, prefService, byNameConverter) {
        this.element = element;
        this.eventBus = eventBus;
        this.prefService = prefService;
        this.bindingEngine = $bindingEngine;
        this.byNameConverter = byNameConverter;
        this.rateFilter = new rateFilterValueConverter();
    }

    modelChanged(newValue) {
        if (newValue) {
            this.bindActiveNumber();
            this.bindImagePath();
            this.createTooltips();
        }
    }

    /**
     * Bind the card to the active catalogue number and if the active flag of this catalogue number
     * changes due to an update re-calculate the bound active catalogue number
     */
    bindActiveNumber() {
        this.activeCN = this.findActiveCatalogueNumber();
        if( this.activeCN ) {
            let observer = this.bindingEngine.propertyObserver(this.activeCN, 'active').subscribe( () => {
                observer.dispose();
                delete this.model.activeCatalogueNumber; // remove the current active CN
                this.bindActiveNumber();
            });
        }
    }


    findActiveCatalogueNumber() {
        this.activeCN = ( this.model.activeCatalogueNumber ) ? this.model.activeCatalogueNumber : undefined;
        if (!this.activeCN) {
            this.activeCN = _.find(this.model.catalogueNumbers, {active: true});
            this.model.activeCatalogueNumber = this.activeCN;
        }
        return this.activeCN;
    }

    notFoundImage() {
        return StampCard.prototype.imageNotFoundFn;
    }

    bindImagePath() {
        if (this.model && !this.model.wantList && !_.isEmpty(this.model.stampOwnerships)) {
            let owner = _.first(this.model.stampOwnerships);
            if( owner ) {
                let observer = this.bindingEngine.propertyObserver(owner, 'img').subscribe(() => {
                    if (observer) {
                        observer.dispose();
                    }
                    this.imagePath = undefined;
                    this.bindImagePath();
                });
                let path = owner.img;
                if (path) {
                    let index = path.lastIndexOf('/');
                    path = path.substring(0, index + 1) + "thumb-" + path.substring(index + 1);
                    let ppath = this.prefService.getByNameAndCategory('thumbPath', 'stamps');
                    this.imagePath = LocationHelper.resolvePath(ppath, defaultImagePath) + path;
                    return;
                }
            }
        }
        this.imagePath = StampCard.prototype.imageNotFoundFn();
    }

    showFullSizeImage(evt) {
        if (!_.isEmpty(this.model.stampOwnerships) && _.first(this.model.stampOwnerships).img) {
            if( this.model.selected ) {
                evt.cancelBubble = true;  // do not unselect selected stamps on show image
            }
            this.eventBus.publish(EventNames.showImage, this.model);
        }
    }

    remove() {
        this.eventBus.publish(EventNames.stampRemove, this.model);
    }

    toggleActions(show) {
        this.showActions = show;
    }

    toggleSelection(evt) {
        let t = $(evt.target);
        let p = t.parents('button');
        if( this.model.selected && (p.length !== 0 || t.is('button')) ) {
            return;
        }
        this.eventBus.publish(EventNames.toggleStampSelection, {model: this.model, shiftKey: evt.shiftKey} );
    }

    edit() {
        this.eventBus.publish(EventNames.stampEdit, this.model);
    }

    @computedFrom('model', 'model.stampOwnerships', 'model.stampOwnerships.length')
    get ownership() {
        return ( this.model && !_.isEmpty(this.model.stampOwnerships) ) ? _.first(this.model.stampOwnerships) : undefined;
    }

    @computedFrom('model.countryRef')
    get countryName() {
        let name = this.byNameConverter.toView(this.model.countryRef, 'countries');
        return name;
    }

    @computedFrom('model', 'model.stampOwnerships', 'model.stampOwnerships[0].notes', 'model.stampOwnerships[0].defects', 'model.stampOwnerships[0].deception')
    get showNotes() {
        return (this.ownership && (this.ownership.notes || this.ownership.defects > 0 || this.ownership.deception > 0));
    }

    @computedFrom('model.rate')
    get rate() {
        return this.rateFilter.toView(this.model.rate);
    }

    createTooltips() {
        _.defer(() => { // need to defer since we are checking offsetWidth - need it to be rendered
            if (this.model) {
                if (this.tooltip) {
                    this.tooltip.dispose();
                }
                let overflow = (el) => {
                    return (el.offsetWidth < el.scrollWidth);
                };
                if (!overflow($(this.element).find('.description')[0]) && !overflow($(this.element).find('.text')[0])) {
                    return;
                }

                let title = `${this.model.activeCatalogueNumber.number} ${this.countryName}<br/>${this.rate} - ${this.model.description}`;
                this.tooltip = new window.Bootstrap.Tooltip($(this.element).find('.text-block')[0], {
                    html:      true,
                    delay:     {show: 750, hide: 100},
                    sanitize:  false,
                    placement: 'top',
                    trigger:   'hover',
                    container: 'body',
                    title:     title
                });
            }
        });

    }
}


StampCard.prototype.imageNotFoundFn = function () {
    this.src = 'resources/images/not-available.png';
};
