import {bindable,customElement,inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../event-names';
import {Preferences} from '../services/preferences';
import 'resources/styles/components/stamp-card.css!';

@customElement('stamp-card')
@inject(EventAggregator, Preferences)
@bindable('model')

export class StampCard {

	imageShown = false;

	constructor(eventBus, prefService) {
		this.eventBus = eventBus;
		this.prefService = prefService;
	}

	getCatalogueNumber() {
		var s = "";
		if (this.model) {
			var activeCN = this.findActiveCatalogueNumber(this.model);
			s = activeCN.number;
		}
		return s;
	}

	findActiveCatalogueNumber() {
		var activeCN = ( this.model.activeCatalogueNumber ) ? this.model.activeCatalogueNumber : undefined;
		if (!activeCN) {
			for (var i = 0, len = this.model.catalogueNumbers.length; i < len; i++) {
				if (this.model.catalogueNumbers[i].active === true) {
					this.model.activeCatalogueNumber = this.model.catalogueNumbers[i];
					activeCN = this.model.activeCatalogueNumber;
					break;
				}
			}
		}
		return activeCN;
	}

	notFoundImage() {
		return StampCard.prototype.imageNotFoundFn;
	}

	getImagePath() {
		if (this.model && this.model.stampOwnerships && this.model.stampOwnerships.length > 0) {
			var path = this.model.stampOwnerships[0].img;
			if (path) {
				var index = path.lastIndexOf('/');
				path = path.substring(0, index + 1) + "thumb-" + path.substring(index + 1);
				return "http://drake-server.ddns.net:9001/Thumbnails/" + path;
			}

		}
		return null;
	}

	showFullSizeImage() {
		if (this.model.stampOwnerships && this.model.stampOwnerships.length > 0 && this.model.stampOwnerships[0].img) {
			this.eventBus.publish(EventNames.showImage, this.model);
		}
	}

	remove() {
		this.eventBus.publish(EventNames.stampRemove, this.model);
	}

	edit() {
		this.eventBus.publish(EventNames.stampEdit, this.model);
	}
}


StampCard.prototype.imageNotFoundFn = function () {
	this.src = 'resources/images/not-available.png';
};
