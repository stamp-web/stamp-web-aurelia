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
        if (this.model && this.model.stampOwnerships && this.model.stampOwnerships.length > 0) {
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

    showFullSizeImage() {
        if (this.model.stampOwnerships && this.model.stampOwnerships.length > 0 && this.model.stampOwnerships[0].img) {
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
        this.eventBus.publish(EventNames.toggleStampSelection, this.model);
    }

    edit() {
        this.eventBus.publish(EventNames.stampEdit, this.model);
    }
}


StampCard.prototype.imageNotFoundFn = function () {
    this.src = 'resources/images/not-available.png';
};
