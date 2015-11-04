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
import {inject} from 'aurelia-framework';
import {StampCollections} from '../../services/stampCollections';
import {LogManager} from 'aurelia-framework';
import $ from 'jquery';
import _ from 'lodash';

const logger = LogManager.getLogger('albumEditor');

@inject(StampCollections)
export class albumEditor {

    model;
    stampCollections = [];

    constructor(stampCollections) {
        this.stampCollectionService = stampCollections;
    }

    activate(options) {
        this.model = options;
        var that = this;
        var p = this.stampCollectionService.find();
        p.then(results => {
            that.stampCollections = results.models;
        }).catch(err => {
            logger.error("Error with stamp collections", err);
        });
        if( !(this.model.id > 0) ) {
            _.debounce( () => {
                $('#editor-name').focus();
            }, 125)(this);
        }
        return p;
    }
}
