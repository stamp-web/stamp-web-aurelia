import {customElement, bindable, inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../../events/event-names';
import {EventManaged} from '../../events/event-managed';
import {Albums} from '../../services/albums';
import {Sellers} from '../../services/sellers';
import {Condition, Grade} from '../../util/common-models';

import 'resources/styles/components/ownerships/ownership-editor.css!';
import datePicker from 'eternicode/bootstrap-datepicker/js/bootstrap-datepicker';
import XDate from 'arshaw/xdate';

const logger = LogManager.getLogger('ownership-editor');

@customElement('ownership-editor')
@bindable('model')
@inject(EventAggregator, Albums, Sellers)
export class OwnershipEditor extends EventManaged {

    loading = true;
    albums = [];
    conditions = Condition.symbols();
    grades = Grade.symbols();
    sellers = [];


    constructor(eventBus, albumService, sellerService) {
        super(eventBus);
        this.albumService = albumService;
        this.sellerService = sellerService;
        this.loadDependentModels();
    }

    attached( ) {
        this.subscribe(EventNames.updateImagePath, function(path) {
            this.model.img = path;
        });
        var self = this;
        if( datePicker ) {
            $('.input-group.date').datepicker({
                format: "mm/dd/yyyy",
                todayHighlight: true,
                todayBtn: "linked",
                autoclose: true
            }).on('changeDate', function(e) {
                var purchased = (e.date) ? e.date : null;
                self.model.purchased = purchased;
            });
        }
    }

    loadDependentModels() {
        var self = this;
        var albumPromise = this.albumService.find({
            $orderby: 'name asc'
        });
        var sellerPromise = this.sellerService.find({
            $orderby: 'name asc'
        });
        Promise.all([albumPromise, sellerPromise]).then(values => {
            for (var i = 0; i < values.length; i++) {
                switch (i) {
                    case 0:
                        self.albums = values[i].models;
                        break;
                    case 1:
                        self.sellers = values[i].models;
                        break;
                }
            }
            self.loading = false;
        }).catch(err => {
            logger.debug(err);
        });
    }
}
