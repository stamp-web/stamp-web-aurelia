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
import {bindable, inject, customElement} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-binding'; // technically this is a static not a DI until next release
import {EventAggregator} from 'aurelia-event-aggregator';
import {Countries} from '../../services/countries';
import {Albums} from '../../services/albums';
import {Sellers} from '../../services/sellers';
import {StampCollections} from '../../services/stampCollections';
import {Predicate, Operators} from 'odata-filter-parser';
import {SessionContext} from '../../services/session-context';

import _ from 'lodash';

@customElement("search-form")
@bindable({
    name: 'model',
    defaultValue: {}
})
@inject(EventAggregator, BindingEngine, Countries, StampCollections, Albums, Sellers)
export class SearchForm {

    loading = true;
    minimizeOnSearch = true;

    searchFields = ['countryRef', 'stampCollectionRef', 'albumRef', 'sellerRef'];
    dateFields = ['purchased', 'createTimestamp', 'modifyTimestamp'];

    constructor(eventBus, bindingEngine, countries, stampCollections, albums, sellers) {
        this.eventBus = eventBus;
        this.$bindingEngine = bindingEngine;
        this.countryServices = countries;
        this.stampCollectionService = stampCollections;
        this.albumServices = albums;
        this.sellerServices = sellers;
    }

    bind() {
        let self = this;

        self.loading = true;
        let conditions = SessionContext.getSearchCondition();
        if( conditions !== undefined ) {
            _.forEach(conditions.flatten(), filter => {
                self.model[filter.subject] = filter.value;
            });
        }

        return Promise.all( [
            this.loadService(this.countryServices, 'countries'),
            this.loadService(this.stampCollectionService, 'stampCollections'),
            this.loadService(this.albumServices, 'albums'),
            this.loadService(this.sellerServices, 'sellers')
        ]).then( () => {
            self.loading = false;
        });
    };

    unbind() { };

    reset() {
        _.forOwn( this.model, (value, key) => {
            if( _.isNumber(value) ) {
                this.model[key] = -1;
            }
        });
    };

    search() {
        let predicates = [];
        _.forOwn( this.model, (value, key) => {
            if( _.isNumber(value) && value > -1 ) {
                predicates.push( new Predicate({
                    subject: key,
                    value: value
                }));
            } else {
                let match = key.match(/^.*(Start|End)$/);
                if( match && match.length > 1 && (match[1] === 'Start' || match[1] === 'End') && value ) {
                    let nkey = key.substring(0, key.length - match[1].length);
                    predicates.push( new Predicate({
                        subject: nkey,
                        value: _.indexOf(this.dateFields, nkey) >= 0 ? new Date(value) : value,
                        operator: (key.endsWith("Start") ? Operators.GREATER_THAN_EQUAL : Operators.LESS_THAN_EQUAL)
                    }));
                }
            }
        });
        if( predicates.length > 0 ) {
            let p = (predicates.length > 1) ? Predicate.concat(Operators.AND, predicates) : predicates[0];
            SessionContext.setSearchCondition(p);
        }

    }

    loadService(svc, collectionName) {
        var self = this;
        return new Promise(resolve => {
            svc.find(svc.getDefaultSearchOptions()).then(results => {
                self[collectionName] = results.models;
                resolve();
            });
        });

    }
}
