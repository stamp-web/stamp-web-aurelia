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
import {inject, customElement, bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {bindingMode} from 'aurelia-binding';

import _ from 'lodash';
import loadImage from 'blueimp-load-image';

export const ImagePreviewEvents = {
    close: "closeImagePreview",
    show: "showImagePreview"
};

@customElement('image-preview')
@inject(Element, EventAggregator)
export class ImagePreviewer {

    @bindable({defaultBindingMode: bindingMode.twoWay}) shown = false; // show causes binding issues
    @bindable image;
    @bindable boundsSelector;

    constructor(element, eventBus) {
        this.element = element;
        this.eventBus = eventBus;
    }

    imageChanged(fullSizeImage) {
        let oldImage = this.fullImage;
        this.fullImage = fullSizeImage;
        if( this.fullImage ) {
            this.showFullSizeImage();
        }
    }

    showFullSizeImage() {
        if(  this.fullImage &&  this.fullImage !== '' ) {
            _.defer(() => {
                let container = $(this.element).parents().find(this.boundsSelector);
                loadImage(  this.fullImage, img => {
                    if(img.type === "error") {
                        this.closeFullSizeImage();
                    } else {
                        $(this.element).find('div').html(img);
                    }
                }, {
                    maxWidth: +container.width(),
                    maxHeight: +container.height(),
                    contain: true
                } );
            });
        } else {
            this.closeFullSizeImage();
        }
    }

    shownChanged(showIt) {
        if(showIt) {
            this.showFullSizeImage();
        } else {
            this.closeFullSizeImage();
        }
    }

    closeFullSizeImage() {
        $(this.element).find('div').empty();
        this.eventBus.publish(ImagePreviewEvents.close);
    }
}

