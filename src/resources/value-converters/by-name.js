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
import {inject, valueConverter} from 'aurelia-framework';
import {Countries} from '../../services/countries';
import {Catalogues} from '../../services/catalogues';
import {Albums} from '../../services/albums';
import {StampCollections} from '../../services/stampCollections';


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
