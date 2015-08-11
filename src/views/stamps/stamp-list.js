import {inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Countries} from '../../services/countries';
import {Router} from 'aurelia-router';
import {Stamps} from '../../services/stamps';
import {EventNames} from '../../events/event-names';
import {EventManaged} from '../../events/event-managed';
import {LocationHelper} from '../../util/location-helper';
import {StampFilter} from '../../util/common-models';
import {ODataParser, Operation, Predicate} from '../../util/odata-parser';

import bootbox from 'bootbox';
import _ from 'lodash';

import "resources/styles/views/stamps/stamp-list.css!";

const logger = LogManager.getLogger('stamp-list');

function createStamp(wantList) {
    return {
        id: 0,
        wantList: wantList,
        countryRef: -1,
        catalogueNumbers: [],
        stampOwnerships: []
    };
}

@inject(EventAggregator, Router, Stamps, Countries)
export class StampList extends EventManaged {

    stamps = [];
    editingStamp = undefined;
    stampCount = 0;
    countries = [];
    heading = "Stamp List";
    gridMode = true;
    imageShown = false;
    editorShown = false;
    createWantList = false;
    subscribers = [];
    referenceMode = false;

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

    filters = StampFilter.symbols();
    stampFilter = StampFilter.ALL;


    currentFilters = [];

    pageSizes = [100, 250, 500, 1000, 2500, 5000];

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
        super(eventBus);
        this.stampService = stampService;
        this.countryService = countryService;
        this.eventBus = eventBus;
        this._ = _;
        this.router = router;
    }

    generatePageModels(total, current) {
        this.pageModels = [];
        for (var i = 0; i < total; i++) {
            this.pageModels.push({page: i, current: (current === i)});
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

    setFilter(ordinal) {
        var index = _.findIndex(this.currentFilters, { subject: 'wantList'});
        if( index >= 0 ) {
            this.currentFilters.splice(index, 1);
        }
        this.stampFilter = StampFilter.get(ordinal);

        let the_filter = new Predicate({
            subject: 'wantList'
        });
        switch(ordinal) {
            case 1:
                the_filter.value = 0;
                break;
            case 2:
                the_filter.value = 1;
                break;
            default:
                the_filter = null;
        }
        if( the_filter ) {
            this.currentFilters.push(the_filter);
        }
        this.search();
    }

    setPage(page) {
        this.pageInfo.active = Math.max(0, Math.min(page, this.pageInfo.total - 1));
        if (this.options.$top) {
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
        if (action === 'create-stamp' || action === 'create-wantList') {
            this.editingStamp = createStamp((action === 'create-wantList'));
            var toggle = (this.createWantList === this.editingStamp.wantList || !this.editorShown);
            this.createWantList = this.editingStamp.wantList;
            if (toggle) {
                this.editorShown = !this.editorShown;
            }
        }
    }

    setViewMode(mode) {
        var m = ( mode === 'Grid');
        this.gridMode = m;
        this.listMode = !m;
    }

    toggleCatalogueNumbers() {
        this.referenceMode = !this.referenceMode;
    }

    clearSearch() {
        this.searchText = "";
        this.sendSearch();
    }

    sendSearch() {
        for( let i = 0; i < this.currentFilters.length; i++ ) {
            if( this.currentFilters[i].subject.startsWith('description' /*'contains(description'*/)) {
                this.currentFilters.splice(i, 1);
                break;
            }
        }
        if( this.searchText && this.searchText !== "") {
            this.currentFilters.unshift( new Predicate({
                subject: 'description',
                value: this.searchText
            })/*Predicate.contains( 'description', this.searchText )*/);
        }
        this.search();
    }

    buildOptions() {
        let cOpts = this.options;
        let opts = {};

        if (cOpts.sort && cOpts.sortDirection) {
            opts.$orderby = cOpts.sort.attr + " " + cOpts.sortDirection;
        }
        opts.$top = cOpts.$top > -1 ? cOpts.$top : 100;
        if( this.currentFilters && this.currentFilters.length > 0 ) {
            let current = [];
            this.currentFilters.forEach( f => {
                current.push( f );
            });
            let predicate = (current.length > 1) ? Predicate.logical(Operation.AND, current) : this.currentFilters[0];
            opts.$filter = predicate.serialize();
            logger.debug("$filter=" + opts.$filter);
        }
        if (cOpts.$skip) {
            opts.$skip = cOpts.$skip;
        }
        return opts;
    }

    setupSubscriptions() {
        var self = this;

        this.subscribe(EventNames.search, options => {
            this.options = _.merge(this.options, options);
            this.search();
        });
        this.subscribe(EventNames.pageChanged, page => {
            this.setPage(page);
        });
        this.subscribe(EventNames.pageRefreshed, page => {
            this.options._ul = (new Date()).getTime();
            this.setPage(page);
        });
        this.subscribe(EventNames.stampCreate, function() {
            self.editingStamp = createStamp(false /* Not a wantlist */);
            self.editorShown = true;
        });
        this.subscribe(EventNames.showImage, stamp => {
            this.handleFullSizeImage(stamp);
        });
        this.subscribe(EventNames.stampEdit, stamp => {
            self.editingStamp = stamp;
            self.createWantList = stamp.wantList;
            self.editorShown = true;
        });
        this.subscribe(EventNames.stampEditorCancel, function() {
            self.editingStamp = null;
            self.editorShown = false;
        });
        this.subscribe(EventNames.stampSaved, result => {
            if( !result.remainOpen) {
                self.editorShown = false;
            }
            // TODO Need to toggle editor without toggling
        });

        this.subscribe(EventNames.saveSuccessful, obj => {
            if( obj && obj.type === self.stampService.getCollectionName() ) {
                let stamp = obj.model;
                // need to check whether it is filtered...
                let index = _.findIndex(this.stamps, { id: stamp.id });
                if( index >= 0 ) {
                    this.stamps[index] = stamp;
                }
            }
        });
        this.subscribe(EventNames.deleteSuccessful, obj => {
            if (obj && obj.type === self.stampService.getCollectionName()) {
                _.remove(this.stamps, {id: obj.id});
            }
        });
        this.subscribe(EventNames.stampRemove, stamp => {
            var _remove = function (model) {
                if (this.editingStamp && stamp.id === this.editingStamp.id) { // remove editing stamp
                    this.editingStamp = null;
                    this.editorShown = false;
                }
                this.stampService.remove(model).then(function() {
                    var index = _.findIndex(this.stamps, {id: model.id});
                    this.stamps.splice(index, 1);
                }).catch(err => {
                    console.log(err);
                });
            };
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
        });
    }

    handleFullSizeImage(stamp) {
        if (stamp && stamp.stampOwnerships && stamp.stampOwnerships.length > 0) {
            this.imageShown = true;
            let elm = $($.find('.sw-fullsize-image'));
            elm.css({
                'max-width': '',
                'max-height': ''
            });
            this.fullSizeImage = "http://drake-server.ddns.net:9001/Pictures/Stamps/" + stamp.stampOwnerships[0].img;
            _.debounce(function () {
                let container = $($.find('.stamp-content'));
                elm = $($.find('.sw-fullsize-image'));
                elm.css('height', +container.height());
                elm.css('max-width', +container.width() );
                elm.css('max-height', +container.height());
            }, 50)(this);
        }
    }

    closeFullSizeImage() {
        this.imageShown = false;
    }

    search() {
        var opts = this.buildOptions();
        this.stampService.find(opts).then(result => {
            this.processStamps(result, opts);
        }).catch(err => {
            logger.debug(err);
        });
    }

    processStamps(result, opts) {
        this.generatePageModels(1, 0);
        this.stamps = result.models;
        this.stampCount = result.total;
        this.pageInfo.total = 1;
        this.pageInfo.active = 0;
        if (opts.$top) {
            this.pageInfo.total = parseInt(result.total / opts.$top) + 1;
            if (opts.$skip) {
                this.pageInfo.active = opts.$skip / opts.$top;
            }
        }

    }

    activate() {
        var t = new Date();
        var self = this;
        this.setupSubscriptions();
        return new Promise((resolve, reject) => {
            this.countryService.find().then(result => {
                this.countries = result.models;

                var $filter = LocationHelper.getQueryParameter("$filter");
                if ($filter) {
                    let f = ODataParser.parse(decodeURI($filter));
                    if (f) {
                        self.currentFilters = ODataParser.flatten(f);
                        logger.debug(self.currentFilters);
                    }
                } else if (result && result.total > 0) {
                    var indx = Math.floor(Math.random() * result.total);
                    self.currentFilters.push(new Predicate({
                        subject: 'countryRef',
                        value: self.countries[indx].id
                    }));
                }
                var opts = this.buildOptions();

                this.stampService.find(opts).then(stamps => {
                    this.processStamps(stamps, opts);
                    logger.debug("StampGrid initialization time: " + ((new Date().getTime()) - t.getTime()) + "ms");
                    resolve();

                });

            }).catch(err => {
                reject(err);
            });
        });
    }

}

