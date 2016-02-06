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
import {inject, customElement, bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

import _ from 'lodash';
import loadImage from 'blueimp/JavaScript-Load-Image';

export const ImagePreviewEvents = {
    close: "closeImagePreview",
    show: "showImagePreview"
};

@customElement('image-preview')
@inject(Element, EventAggregator)
@bindable("image")
@bindable("boundsSelector")
@bindable({
    name: "show",
    defaultValue: false
})
export class ImagePreviewer {

    constructor(element, eventBus) {
        this.element = element;
        this.eventBus = eventBus;
    }

    imageChanged(fullSizeImage) {
        if( fullSizeImage && fullSizeImage !== '' ) {
            let self = this;
            _.debounce(function () {
                let container = $(self.element).parents().find(self.boundsSelector);
                loadImage( fullSizeImage, img => {
                    if(img.type === "error") {
                        self.closeFullSizeImage();
                    } else {
                        $(self.element).find('div').html(img);
                    }
                }, {
                    maxWidth: +container.width(),
                    maxHeight: +container.height(),
                    contain: true
                } );
            })(this);
        } else {
            this.closeFullSizeImage();
        }
    }

    closeFullSizeImage() {
        $(this.element).find('div').empty();
        this.eventBus.publish(ImagePreviewEvents.close);
    }
}

