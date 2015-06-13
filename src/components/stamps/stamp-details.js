import {customElement, bindable, inject} from 'aurelia-framework';
import {ObserverLocator} from 'aurelia-binding';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EventNames} from '../../events/event-names';
import {EventManaged} from '../../events/event-managed';
import {Countries} from '../../services/countries';

@customElement('stamp-details')
@bindable('model')
@inject(EventAggregator, ObserverLocator, Countries)
export class StampDetailsComponent extends EventManaged {

    countries = [];
    loading = true;

    _modelSubscribers = [];

    constructor(eventBus, observer, countryService) {
        super(eventBus);
        this.observer = observer;
        this.countryService = countryService;
        this.loadCountries();
    }

    modelChanged(newValue) {
        this._modelSubscribers.forEach(sub => {
            sub();
        });
        this._modelSubscribers = [];
        this._modelSubscribers.push(this.observer.getObserver(newValue, 'countryRef').subscribe(this.sendExistsVerfication.bind(this)));
    }

    sendExistsVerfication() {
        if (this.model.countryRef > 0) {
            this.eventBus.publish(EventNames.checkExists, {model: this.model});
        }
    }

    loadCountries() {
        var self = this;
        this.countryService.find({
            $orderby: 'name asc'
        }).then(results => {
            self.countries = results.models;
            self.loading = false;
        });
    }

}
