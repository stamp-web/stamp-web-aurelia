import {inject,LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Countries} from 'services/countries';
import {Stamps} from 'services/stamps';
import {EventNames} from './event-names';

const logger = LogManager.getLogger('stamp-grid');

@inject(EventAggregator, Stamps, Countries)
export class StampGrid {

  stamps = [];
  countries = [];
  heading = "Stamp List";

  countryCache = {
    countryRef: -1,
    name: undefined
  };

  constructor(eventBus, stampService, countryService) {
    this.stampService = stampService;
    this.countryService = countryService;
    this.eventBus = eventBus;

  }

  subscribe() {
    this.eventBus.subscribe(EventNames.keywordSearch, options => {
      var opts = {
        $filter: "(contains(description,'" + options.searchText + "'))",
        $orderby: "number asc",
        $top: 500
      }
      console.log(opts);
      this.stampService.find(opts).then(result => {
        this.stamps = result;
      });
    });
  }

  activate() {
    var t = new Date();
    this.subscribe();
    return new Promise((resolve, reject) => {
      this.countryService.find().then(result => {
        this.countries = result;
        var options = {
          "$filter": "(countryRef eq 4552)",
          "$top": 200,
          "$orderby": "number asc"
        }
        this.stampService.find(options).then(result => {
          this.stamps = result;
          logger.debug("StampGrid initialization time: " + ((new Date().getTime()) - t.getTime()) + "ms");
          resolve();

        });

      })
    })
  }

}

