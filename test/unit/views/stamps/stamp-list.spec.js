/**
 Copyright 2017 Jason Drake

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

import {StampList} from '../../../../src/views/stamps/stamp-list';
import {Stamps} from '../../../../src/services/stamps';
import {EventAggregator} from 'aurelia-event-aggregator';

describe('StampListComponent test suite', () => {

    let list;
    let eventBus = new EventAggregator();
    let http = jasmine.createSpyObj('http', ['configure']);
    let stampService = new Stamps(http, eventBus);

    beforeEach(() => {

        list = new StampList(null, eventBus, null, stampService, null, null, null, null, null);

        list.stamps = [
            {id: 100, type: 'stamp', rate: '1d'},
            {id: 200, type: 'stamp', rate: '2d'},
            {id: 300, type: 'stamp', rate: '3d'}
            ];

    });

    describe('_remove tests', () => {

        it('stamp was in collection', () => {
            let s = list.stamps[1];
            list._removeStamp(s);

            expect(list.stamps.length).toBe(2);
            expect(list.stamps[1].id).toBe(300);
        });

        it('stamp was not in collection', () => {
            list._removeStamp({id: 500, type: 'stamp', rate: 'something'});

            expect(list.stamps.length).toBe(3);
        });

    });
});
