import {inject,LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Countries} from '../../services/countries';
import {Router} from 'aurelia-router';
import {Stamps} from '../../services/stamps';
import {EventNames} from '../../event-names';
import {LocationHelper} from '../../util/location-helper';
import {ODataParser} from '../../util/odata-parser';
import bootbox from 'bootbox';
import  _  from 'lodash';

import "resources/styles/views/stamps/stamp-list.css!";

const logger = LogManager.getLogger('stamp-list');

@inject(EventAggregator, Router, Stamps, Countries)
export class StampList {

	stamps = [];
	editingStamp = undefined;
	stampCount = 0;
	countries = [];
	heading = "Stamp List";
	gridMode = true;
	imageShown = false;
	editorShown = false;
	subscribers = [];

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
		$filter: "",
		$top: 250,
		$skip: 0,
		sort: this.sortColumns[0],
		sortDirection: 'asc'
	};

	constructor(eventBus, router, stampService, countryService) {
		this.stampService = stampService;
		this.countryService = countryService;
		this.eventBus = eventBus;
		this._ = _;
		this.router = router;
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

	toggleEditor(action) {
		if( action === 'create-stamp' || action === 'create-wantList') {
			this.editingStamp = {
				id: 0,
				wantList: (action === 'create-wantList')
			};
		}
		this.editorShown = !this.editorShown;
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
		this.subscribers.push(this.eventBus.subscribe(EventNames.keywordSearch, options => {
			if( options.searchText) {
				this.options.$filter = "(contains(description,'" + options.searchText + "'))";
			}
			this.search();
		}));
		this.subscribers.push(this.eventBus.subscribe(EventNames.search, options => {
			this.options = _.merge(this.options, options);
			this.search();
		}));
		this.subscribers.push(this.eventBus.subscribe(EventNames.showImage, stamp => {
			this.handleFullSizeImage(stamp);
		}));
		this.subscribers.push(this.eventBus.subscribe(EventNames.stampEdit, stamp => {
			"use strict";
			this.editingStamp = stamp;
			this.editorShown = true;
		}));
		this.subscribers.push(this.eventBus.subscribe(EventNames.stampRemove, stamp => {
			"use strict";

			var _remove = function (model) {
				if( this.editingStamp && stamp.id === this.editingStamp.id ) { // remove editing stamp
					this.editingStamp = null;
					this.editorShown = false;
				}
				this.stampService.remove(model).then(result => {
					var index = _.findIndex(this.stamps, {id: model.id});
					this.stamps.splice(index, 1);
				}).catch(err => {
					console.log(err);
				})
			}
			var self = this;
			console.log("in stamps remove");
			bootbox.confirm({
				size: 'large',
				className: 'sw-dialog-wrapper',
				message: "Delete " + stamp.rate + ' - ' + stamp.description + "?",
				callback: function (result) {
					if (result === true) {
						_remove.call(self, stamp);

					}
				}
			});
		}));
	}

	handleFullSizeImage(stamp) {
		if (stamp && stamp.stampOwnerships && stamp.stampOwnerships.length > 0 ) {
			this.imageShown = true;
			var elm = $($.find('.sw-fullsize-image'));
			elm.css( {
				'max-width': '',
				'max-height': ''
			});
			this.fullSizeImage = "http://drake-server.ddns.net:9001/Pictures/Stamps/" + stamp.stampOwnerships[0].img;
			setTimeout(function() {
				var container = $($.find('.page-host'));
				elm.css( {
					'max-width': container.width() + 'px',
					'max-height': container.height() + 'px'
				});
			}, 50);
		}
	}

	closeFullSizeImage() {
		this.imageShown = false;
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

	detached(){
		this.subscribers.forEach(sub => {sub();});
		this.subscribers = [];
	}

	activate() {
		var t = new Date();
		this.subscribe();
		return new Promise((resolve, reject) => {
			this.countryService.find().then(result => {
				this.countries = result.models;

				var $filter = LocationHelper.getQueryParameter("$filter");
				if( $filter ) {
					this.options.$filter = decodeURI($filter);
				} else if( result && result.total > 0 ) {
					var indx = Math.floor(Math.random() * result.total);
					this.options.$filter = "(countryRef eq " + this.countries[indx].id + ")";
				}
				var opts = this.buildOptions();

				this.stampService.find(opts).then(result => {
					this.processStamps(result, opts);
					logger.debug("StampGrid initialization time: " + ((new Date().getTime()) - t.getTime()) + "ms");
					resolve();

				});

			}).catch(err => {
				reject(err);
			})
		})
	}

}

