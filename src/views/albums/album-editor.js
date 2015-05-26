import {bindable,inject} from 'aurelia-framework';
import {StampCollections} from '../../services/stampCollections';
import {LogManager} from 'aurelia-framework';

const logger = LogManager.getLogger('albumEditor');

@inject(StampCollections)
@bindable("model")
export class albumEditor {

	model;
	stampCollections = [];

	constructor(stampCollections) {
		this.stampCollectionService = stampCollections;
	}

	activate(options) {
		this.model = options;
		var that = this;
		var p = this.stampCollectionService.find();
		p.then( results => {
			that.stampCollections = results.models;
		}).catch( err => {
			logger.error("Error with stamp collections", err);
		});
		return p;
	}
}
