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
import {inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {I18N} from 'aurelia-i18n';
import {Countries} from '../../services/countries';
import {Router} from 'aurelia-router';
import {Stamps} from '../../services/stamps';
import {PurchaseForm} from './purchase-form';
import {EventNames, StorageKeys} from '../../events/event-names';
import {EventManaged} from '../../events/event-managed';
import {LocationHelper} from '../../util/location-helper';
import {StampFilter, /*ConditionFilter, */CurrencyCode} from '../../util/common-models';
import {ODataParser, Operation, Predicate} from '../../util/odata-parser';
import {asCurrencyValueConverter} from '../../value-converters/as-currency-formatted';
import bootbox from 'bootbox';
import {DialogService} from 'aurelia-dialog';
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

@inject(EventAggregator, Router, Stamps, Countries, asCurrencyValueConverter, I18N, DialogService)
export class StampList extends EventManaged {

    stamps = [];
    editingStamp = undefined;
    latestSelected = undefined;
    stampCount = 0;
    countries = [];
    heading = "Stamp List";
    gridMode = true;
    imageShown = false;
    editorShown = false;
    panelContents = "stamp-editor";
    subscribers = [];
    referenceMode = false;
    reportValue = "";
    reportType = "CatalogueValue";

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

//   conditionFilters = ConditionFilter.symbols();
//    conditionFilter = ConditionFilter.ALL;

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

    constructor(eventBus, router, stampService, countryService, currencyFormatter, i18next, dialogService) {
        super(eventBus);
        this.stampService = stampService;
        this.countryService = countryService;
        this.eventBus = eventBus;
        this._ = _;
        this.currencyFormatter = currencyFormatter;
        this.router = router;
        this.i18next = i18next;
        this.dialogService = dialogService;
    }

    purchase() {
        let selected = this.stampService.getSelected();
        if( selected && selected.length > 0 ) {
            selected = _.filter(selected, { wantList: false });
            if( selected.length > 0 ) {
                let purchaseModel = {
                    price: 0.0,
                    currency: CurrencyCode.USD,
                    updateExisting: true,
                    selectedStamps: selected
                };
                this.dialogService.open({ viewModel: PurchaseForm, model: purchaseModel}).then(() => {
                    // post-process any purchases
                }).catch(() => {
                    // handle cancel
                });
            }
        }
    }

    getFilterText(filter) {
        return filter.description;
    }

    setStatistics(reportType) {
        let self = this;
        self.reportType = reportType;
        var opt = self.buildOptions();
        opt.$reportType = reportType;
        self.reportValue = self.i18next.tr('footer-statistics.calculating');

        self.stampService.executeReport(opt).then( result => {
            if( +result.value > 0 ) {
                self.reportValue = self.currencyFormatter.toView(+result.value, result.code);
            } else {
                self.reportValue = "";
            }

        });
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

    get selectedCount() {
        return this.stampService.getSelected().length;
    }

/*    setConditionFilter(ordinal) {
        let index = _.findIndex(this.currentFilters, { subject: 'condition'});
        if( index >= 0 ) {
            this.currentFilters.splice(index, 1);
        } else {
            let orMatches = _.filter(this.currentFilters, { operator: 'or'});
            if( orMatches.length > 0 ) {
                _.each( orMatches, (match) => {
                   if ( match.value.subject = 'condition') {
                       _.remove(this.currentFilters, match);
                   }
                });
            }
        }
        this.conditionFilter = ConditionFilter.get(ordinal);
        let conditions = [];

        switch(ordinal) {
            case 1:
                conditions = [ 0, 1, 4, 5];
                break;
            case 2:
                conditions = [ 2, 3, 7];
                break;
            case 3:
                conditions = [6];
                break;
        }
        if( conditions.length > 0 ) {
            if( conditions.length === 1 ) {
                this.currentFilters.push(new Predicate({
                    subject: 'condition',
                    value: conditions[0]
                }));
            } else {
                let predicates = [];
                for( let i = 0; i < conditions.length; i++ ) {
                    predicates.push(new Predicate({
                        subject: 'condition',
                        value: conditions[i]
                    }));
                }
                this.currentFilters.push(Predicate.logical(Operation.OR, predicates));
            }
        }
        this.search();

    }
    */

    setFilter(ordinal) {
        var index = _.findIndex(this.currentFilters, { subject: 'wantList'});
        if( index >= 0 ) {
            this.currentFilters.splice(index, 1);
        }
        this.stampFilter = StampFilter.get(ordinal);

        let theFilter = new Predicate({
            subject: 'wantList'
        });
        switch(ordinal) {
            case 1:
                theFilter.value = 0;
                break;
            case 2:
                theFilter.value = 1;
                break;
            default:
                theFilter = null;
        }
        if( theFilter ) {
            this.currentFilters.push(theFilter);
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

    showEditor(action) {
        if (action === 'create-stamp' || action === 'create-wantList') {
            this.editingStamp = createStamp((action === 'create-wantList'));
            this.panelContents = "stamp-editor";
        } else if ( action === 'search-panel' ) {
            this.panelContents = action;
        }
        this.editorShown = true;
    }

    setViewMode(mode) {
        var m = ( mode === 'Grid');
        this.gridMode = m;
        this.listMode = !m;
    }

    toggleCatalogueNumbers() {
        this.referenceMode = !this.referenceMode;
        localStorage.setItem(StorageKeys.referenceCatalogueNumbers, this.referenceMode);
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
        this.subscribe(EventNames.stampCreate, () => {
            self.editingStamp = createStamp(false /* Not a wantlist */);
            self.editorShown = true;
        });

        this.subscribe(EventNames.panelCollapsed, config => {
            if( config.name === "stamp-list-editor-panel") {
                self.editorShown = false;
            }
        });
        this.subscribe(EventNames.showImage, stamp => {
            this.handleFullSizeImage(stamp);
        });
        this.subscribe(EventNames.stampEdit, stamp => {
            self.editingStamp = stamp;
            self.editorShown = true;
        });
        this.subscribe(EventNames.stampEditorCancel, () => {
            self.editorShown = false;
         //   self.editingStamp = null;

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
        this.subscribe(EventNames.toggleStampSelection, this.stampSelected.bind(this));

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
                    logger.error(err);
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

    stampSelected(obj) {
        if (obj) {
            if (this.stampService.isSelected(obj)) {
                this.stampService.unselect(obj);
                let selected = this.stampService.getSelected();
                this.lastSelected = ( selected && selected.length > 0) ? selected[selected.length - 1] : undefined;
            } else {
                this.stampService.select(obj);
                this.lastSelected = obj;
            }
        }
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
        this.stampService.clearSelected();
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
        this.setStatistics(this.reportType);

    }

    attached() {
        this.setupSubscriptions();
    }

    activate() {
        var t = new Date();
        var self = this;
        this.referenceMode = (localStorage.getItem(StorageKeys.referenceCatalogueNumbers) === 'true');

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
                // this really should be consolidated with sendSearch() above.
                this.stampService.clearSelected();
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

