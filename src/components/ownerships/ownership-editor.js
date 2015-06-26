import {customElement, bindable, inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../../events/event-names';
import {EventManaged} from '../../events/event-managed';
import {Albums} from '../../services/albums';
import {Sellers} from '../../services/sellers';
import {Condition, Grade, CurrencyCode} from '../../util/common-models';

import 'resources/styles/components/ownerships/ownership-editor.css!';

const logger = LogManager.getLogger('ownership-editor');

@customElement('ownership-editor')
@bindable('model')
@inject(EventAggregator, Albums, Sellers)
export class OwnershipEditor extends EventManaged {

    loading = true;
    albums = [];
    conditions = Condition.symbols();
    grades = Grade.symbols();
    codes = CurrencyCode.symbols();
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
