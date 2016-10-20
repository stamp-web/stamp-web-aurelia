/**
 Copyright 2016 Jason Drake

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
import {Countries} from '../../../services/countries';
import {Albums} from '../../../services/albums';
import {Sellers} from '../../../services/sellers';
import {Catalogues} from '../../../services/catalogues';
import {StampCollections} from '../../../services/stampCollections';
import {Predicate, Operators} from 'odata-filter-parser';
import {SessionContext} from '../../../services/session-context';
import {EventNames} from '../../../events/event-managed';

import _ from 'lodash';

@customElement("search-form")
@inject(Element, EventAggregator, BindingEngine, Countries, StampCollections, Albums, Sellers, Catalogues)
export class SearchForm {

    @bindable model = {};
    @bindable showMinimize = true;

    loading = true;
    minimizeOnSearch = true;

    searchFields = ['countryRef', 'stampCollectionRef', 'albumRef', 'sellerRef'];
    dateFields = ['purchased', 'createTimestamp', 'modifyTimestamp'];
    booleanFields = ['defects', 'deception'];

    subscribers = [];
    valid = false;

    constructor(element, eventBus, bindingEngine, countries, stampCollections, albums, sellers, catalogueService) {
        this.element = element;
        this.eventBus = eventBus;
        this.bindingEngine = bindingEngine;
        this.countryServices = countries;
        this.stampCollectionService = stampCollections;
        this.albumService = albums;
        this.sellerService = sellers;
        this.catalogueService = catalogueService;
    }

    bind() {
        this.loading = true;
        let searchConditions = SessionContext.getSearchCondition();
        if( searchConditions !== undefined ) {
            _.forEach(searchConditions.flatten(), filter => {
                if( _.find( this.dateFields, filter.subject ) === filter.subject ) {
                    let key = filter.subject + ((filter.operator === Operators.GREATER_THAN_EQUAL) ? 'Start' : 'End');
                    this.model[key] = filter.value;
                } else if (_.find( this.booleanFields, filter.subject) === filter.subject) {
                    this.model[filter.subject] = ( +filter.value > 0 ) ? true : false;
                } else {
                    this.model[filter.subject] = filter.value;
                }
            });
        }
        return Promise.all( [
            this.loadService(this.countryServices, 'countries'),
            this.loadService(this.stampCollectionService, 'stampCollections'),
            this.loadService(this.albumService, 'albums'),
            this.loadService(this.sellerService, 'sellers'),
            this.loadService(this.catalogueService, 'catalogues')
        ]).then( () => {
            this.loading = false;
            this._validate();
        });
    };

    unbind() { };

    attached( ) {
        _.forOwn( this.model, (value, key) => {
           this.subscribers.push( this.bindingEngine.propertyObserver(this.model,key).subscribe( val => {
               this._validate();
           }));
        });
    }

    detached( ) {
        _.forEach( this.subscribers, sub => {
            sub.dispose();
        });
    }

    reset() {
        _.forOwn( this.model, (value, key) => {
            if( _.isNumber(value) ) {
                this.model[key] = -1;
            } else if (_.isBoolean(value) ) {
                this.model[key] = false;
            } else {
                this.model[key] = undefined;
            }
        });
    };

    search() {
        let predicates = [];
        _.forOwn( this.model, (value, key) => {
            let bool = _.isBoolean(value);
            if( (_.isNumber(value) || bool) && value > 0 ) {
                predicates.push( new Predicate({
                    subject: key,
                    value: bool ? 1 : value,
                    operator: bool ? Operators.GREATER_THAN_EQUAL : Operators.EQUALS
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
            if( this.minimizeOnSearch === true ) {
                this.eventBus.publish(EventNames.collapsePanel);
            }
        }
    }

    _validate() {
        this.valid = false;
        _.forOwn( this.model, (value,key) => {
            if( value && value !== -1 ) {
                this.valid = true;
                return false;
            }
            return true;

        });

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
