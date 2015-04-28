import {inject,LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Countries} from '../services/countries';
import {Stamps} from '../services/stamps';
import {EventNames} from '../event-names';
import  _  from 'lodash';

const logger = LogManager.getLogger('stamp-list');

@inject(EventAggregator, Stamps, Countries)
export class StampList {

	stamps = [];
	stampCount = 0;
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

	pageInfo = {
		total: 1,
		active: 0
	};

	options = {
		$filter: "(countryRef eq 4552)",
		$top: 250,
		$skip: 0,
		sort: this.sortColumns[0],
		sortDirection: 'asc'
	};

	constructor(eventBus, stampService, countryService) {
		this.stampService = stampService;
		this.countryService = countryService;
		this.eventBus = eventBus;
		this._ = _;
	}

	generatePageModels(total, current) {
		this.pageModels = [];
		for(var i =0; i < total; i++ ) {
			this.pageModels.push({ page: i, current: (current === i)});
		}
		this.pageInfo.total = total;
		this.pageInfo.active = current;
	}

	setSize(size) {
		var active = parseInt((this.pageInfo.active * this.options.$top) / size);
		this.options.$skip = Math.max(0, size * active);
		this.options.$top = size;
		this.pageInfo.active = active;
		this.search();
	}

	setPage(page) {
		this.pageInfo.active = Math.max(0,Math.min(page, this.pageInfo.total-1));
		if( this.options.$top ) {
			this.options.$skip = this.options.$top * this.pageInfo.active;
		}
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
		var c_opts = this.options;
		var opts = {};

		if (c_opts.sort && c_opts.sortDirection) {
			opts.$orderby = c_opts.sort.attr + " " + c_opts.sortDirection;
		}
		opts.$top = c_opts.$top > -1 ? c_opts.$top : 100;
		if (c_opts.$filter) {
			opts.$filter = c_opts.$filter;
		}
		if( c_opts.$skip ) {
			opts.$skip = c_opts.$skip;
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
			this.processStamps(result, opts);
		});
	}

	processStamps(result, opts) {
		this.generatePageModels(1, 0);
		this.stamps = result.models;
		this.stampCount = result.total;
		this.pageInfo.total = 1;
		this.pageInfo.active = 0;
		if( opts.$top ) {
			this.pageInfo.total = parseInt(result.total/opts.$top) + 1;
			if( opts.$skip ) {
				this.pageInfo.active = opts.$skip / opts.$top
			}
		}

	}

	activate() {
		var t = new Date();
		this.subscribe();
		return new Promise((resolve, reject) => {
			this.countryService.find().then(result => {
				this.countries = result;
				var opts = this.buildOptions();
				this.stampService.find(opts).then(result => {
					this.processStamps(result, opts);
					logger.debug("StampGrid initialization time: " + ((new Date().getTime()) - t.getTime()) + "ms");
					resolve();

				});

			})
		})
	}

}

