import {inject,LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Countries} from '../services/countries';
import {Stamps} from '../services/stamps';
import {EventNames} from '../event-names';

const logger = LogManager.getLogger('stamp-list');

@inject(EventAggregator, Stamps, Countries)
export class StampList {

	stamps = [];
	countries = [];
	heading = "Stamp List";
	gridMode = true;
	listMode = false;

	sortColumns = [{
		attr: 'number',
		text: 'Catalogue number'
	}, {
		attr: 'value',
		text: 'Catalogue value'
	}, {
		attr: 'pricePaid',
		text: 'Price paid'
	}];

	pageSizes = [ 100, 250, 500, 1000, 2500, 5000 ];

	options = {
		$filter: "(countryRef eq 4552)",
		$top: 250,
		sort: this.sortColumns[0],
		sortDirection: 'asc'
	};

	constructor(eventBus, stampService, countryService) {
		this.stampService = stampService;
		this.countryService = countryService;
		this.eventBus = eventBus;
	}

	setSize(size) {
		this.options.$top = size;
		this.search();
	}

	setSort(attr) {
		this.options.sort = attr;
		this.search();
	}

	clearSort() {
		this.options.sort = undefined;
		this.search();
	}

	toggleSortDirection() {
		this.options.sortDirection = (this.options.sortDirection === 'asc') ? 'desc' : 'asc';
		this.search();
	}

	setViewMode(mode) {
		var m = ( mode === 'Grid');
		this.gridMode = m;
		this.listMode = !m;
	}


	sendSearch() {
		var options = {
			searchText: this.searchText
		};
		this.eventBus.publish(EventNames.keywordSearch, options);
	}

	buildOptions() {
		var opts = {};
		if (this.options.sort && this.options.sortDirection) {
			opts.$orderby = this.options.sort.attr + " " + this.options.sortDirection;
		}
		opts.$top = this.options.$top > -1 ? this.options.$top : 100;
		if (this.options.$filter) {
			opts.$filter = this.options.$filter;
		}
		return opts;
	}

	subscribe() {
		this.eventBus.subscribe(EventNames.keywordSearch, options => {
			if( options.searchText) {
				this.options.$filter = "(contains(description,'" + options.searchText + "'))";
			}
			this.search();
		});
	}

	search() {
		var opts = this.buildOptions();
		this.stampService.find(opts).then(result => {
			this.stamps = result;
		});
	}

	activate() {
		var t = new Date();
		this.subscribe();
		return new Promise((resolve, reject) => {
			this.countryService.find().then(result => {
				this.countries = result;
				this.stampService.find(this.buildOptions()).then(result => {
					this.stamps = result;
					logger.debug("StampGrid initialization time: " + ((new Date().getTime()) - t.getTime()) + "ms");
					resolve();

				});

			})
		})
	}

}

