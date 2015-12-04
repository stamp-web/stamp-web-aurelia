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
        this.eventBus.publish(ImagePreviewEvents.closeImagePreview);
    }
}

