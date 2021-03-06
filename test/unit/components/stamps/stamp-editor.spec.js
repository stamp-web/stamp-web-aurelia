/**
 Copyright 2019 Jason Drake

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
import {StampEditorComponent} from 'resources/elements/stamps/stamp-editor';
import {EventNames} from 'events/event-managed';
import {EventAggregator} from 'aurelia-event-aggregator';

import _ from 'lodash';

class EventBus {
    events = {};
    publish(event, data) {
        let e = this.events[event];
        if ( !e ) {
            e = this.events[event] = [];
        }
        e.push(data);
    }
}

describe('StampEditorComponent test suite', () => {

    describe('processExistenceResults tests', () => {

        let editor;
        let eventBus = new EventAggregator();

        beforeEach(() => {
            let catalogues = [
                {
                    id: 21,
                    type: 2
                },
                {
                    id: 45,
                    type: 4
                },
                {
                    id: 46,
                    type: 2
                }
            ];

            editor = new StampEditorComponent(eventBus,null,null,null,null); // eventBus, stampService, countryService, catalogueService, preferenceService)
            editor.catalogues = catalogues;
            editor.duplicateModel = {
                id: 0,
                wantList: true,
                catalogueNumbers: [{
                    id: 0,
                    catalogueRef: -1,
                    value: 0.0,
                    condition: 2,
                    number: '',
                    active: true,
                    unknown: false
                }],
                rate: '',
                description: ''
            }


        });

        it('match on same exact catalogue reference', (done) => {
            editor.duplicateModel.catalogueNumbers[0].catalogueRef = 21;
            editor.duplicateModel.catalogueNumbers[0].number = '45a';
            let sub = eventBus.subscribe(EventNames.conflictExists, result => {
                expect(result).not.toBe(null);
                expect(result.conversionModel).not.toBe(null);
                sub.dispose();
                done();
            });
            let models = [ _.cloneDeep(editor.duplicateModel) ];
            editor.processExistenceResults(models, editor.duplicateModel.catalogueNumbers[0]);
        });

        it('match on same catalogue type', (done) => {
            editor.duplicateModel.catalogueNumbers[0].catalogueRef = 21;
            editor.duplicateModel.catalogueNumbers[0].number = '45a';
            let sub = eventBus.subscribe(EventNames.conflictExists, result => {
                expect(result).not.toBe(null);
                expect(result.conversionModel).not.toBe(null);
                sub.dispose();
                done();
            });
            let clone = _.cloneDeep( editor.duplicateModel);
            clone.catalogueNumbers[0].catalogueRef = 46;

            let models = [ clone ];
            editor.processExistenceResults(models, editor.duplicateModel.catalogueNumbers[0]);
        });

        it('no match on edit of existing stamp', (done) => {
            editor.duplicateModel.wantList = false;
            editor.duplicateModel.id = 500;
            editor.duplicateModel.catalogueNumbers[0].catalogueRef = 21;
            editor.duplicateModel.catalogueNumbers[0].number = '45a';
            let sub = eventBus.subscribe(EventNames.conflictExists, result => {
                fail("Should not have subscribed");
            });
            let clone = _.cloneDeep( editor.duplicateModel);
            let models = [ clone ];
            editor.processExistenceResults(models, editor.duplicateModel.catalogueNumbers[0]);
            _.delay( () => {
                sub.dispose();
                done();
            }, 500);
        });

        it('no match on edit of stamp with different non-compatible condition', (done) => {
            editor.duplicateModel.wantList = false;
            editor.duplicateModel.id = 500;
            editor.duplicateModel.catalogueNumbers[0].catalogueRef = 21;
            editor.duplicateModel.catalogueNumbers[0].number = '45a';
            let sub = eventBus.subscribe(EventNames.conflictExists, result => {
                fail("Should not have subscribed");
            });
            let clone = _.cloneDeep( editor.duplicateModel);
            clone.catalogueNumbers[0].condition = 0;

            let models = [ clone ];
            editor.processExistenceResults(models, editor.duplicateModel.catalogueNumbers[0]);
            _.delay( () => {
                sub.dispose();
                done();
            }, 500);
        });

    });
});
