import {inject, valueConverter} from 'aurelia-framework';
import {Countries} from '../services/countries';
import {Catalogues} from '../services/catalogues';
import {Albums} from '../services/albums';
import {StampCollections} from '../services/stampCollections';


@inject(Countries, Catalogues, Albums, StampCollections)
@valueConverter("byName")
export class byNameValueConverter {

    constructor(countryService, catalogueService, albumService, stampCollectionService) {
        this.services = {
            countries: countryService,
            catalogues: catalogueService,
            albums: albumService,
            stampCollectionService: stampCollectionService
        };
    }

    toView(value, serviceName) {
        if (value && value > 0) {
            var model = this.services[serviceName].getById(value);
            if (model) {
                return (model.displayName) ? model.displayName : model.name;
            }

        }
        return "";
    }
}
