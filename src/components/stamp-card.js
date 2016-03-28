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
import {bindable, customElement, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {BindingEngine} from 'aurelia-binding';
import {EventNames} from '../events/event-managed';
import {Preferences} from '../services/preferences';
import _ from 'lodash';
import $ from 'jquery';

var defaultImagePath = "http://drake-server.ddns.net:9001/Thumbnails/";

@customElement('stamp-card')
@inject(Element, EventAggregator, BindingEngine, Preferences)
@bindable('model')
@bindable('selected')
@bindable('highlight')
export class StampCard {

    imageShown = false;
    activeCN;
    imagePath;

    constructor(element, eventBus, $bindingEngine, prefService) {
        this.element = element;
        this.eventBus = eventBus;
        this.prefService = prefService;
        this.$bindingEngine = $bindingEngine;
    }

    modelChanged(newValue) {
        if (newValue) {
            this.bindActiveNumber();
            this.bindImagePath();
        }
    }

    /**
     * Bind the card to the active catalogue number and if the active flag of this catalogue number
     * changes due to an update re-calculate the bound active catalogue number
     */
    bindActiveNumber() {
        this.activeCN = this.findActiveCatalogueNumber();
        if( this.activeCN ) {
            let observer = this.$bindingEngine.propertyObserver(this.activeCN, 'active').subscribe( () => {
                observer.dispose();
                delete this.model.activeCatalogueNumber; // remove the current active CN
                this.bindActiveNumber();
            });
        }
    }


    findActiveCatalogueNumber() {
        this.activeCN = ( this.model.activeCatalogueNumber ) ? this.model.activeCatalogueNumber : undefined;
        if (!this.activeCN) {
            this.activeCN = _.findWhere(this.model.catalogueNumbers, {active: true});
            this.model.activeCatalogueNumber = this.activeCN;
        }
        return this.activeCN;
    }

    notFoundImage() {
        return StampCard.prototype.imageNotFoundFn;
    }

    bindImagePath() {
        if (this.model && !_.isEmpty(this.model.stampOwnerships)) {
            let owner = _.first(this.model.stampOwnerships);
            if( owner ) {
                let observer = this.$bindingEngine.propertyObserver(owner, 'img').subscribe(() => {
                    if (observer) {
                        observer.dispose();
                    }
                    this.imagePath = undefined;
                    this.bindImagePath();
                });
                let path = owner.img;
                if (path) {
                    var index = path.lastIndexOf('/');
                    path = path.substring(0, index + 1) + "thumb-" + path.substring(index + 1);
                    this.imagePath = defaultImagePath + path;
                }
            }
        }
    }

    showFullSizeImage(evt) {
        evt.cancelBubble = true;
        if (!_.isEmpty(this.model.stampOwnerships) && _.first(this.model.stampOwnerships).img) {
            this.eventBus.publish(EventNames.showImage, this.model);
        }
    }

    remove() {
        this.eventBus.publish(EventNames.stampRemove, this.model);
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

    get ownership() {
        return ( this.model && !_.isEmpty(this.model.stampOwnerships) ) ? _.first(this.model.stampOwnerships) : undefined;
    }
}


StampCard.prototype.imageNotFoundFn = function () {
    this.src = 'resources/images/not-available.png';
};
