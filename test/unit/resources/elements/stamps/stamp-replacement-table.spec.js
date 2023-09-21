/**
 Copyright 2023 Jason Drake

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
import {StampReplacementTable} from 'resources/elements/stamps/stamp-replacement-table';
import {KeyCodes} from "events/key-codes";

import _ from 'lodash';

describe('StampReplacementTable test suite', () => {

    describe('select tests', () => {
        let cmp;

        beforeEach(() => {
            cmp = new StampReplacementTable();
        });

        it('verify index is selected', () => {
            cmp.select(2);
            expect(cmp.model.editingRow).toBe(2);
        });

    });

    describe('advanceToNextRow tests', () => {
        let cmp;

        beforeEach(() => {
            cmp = new StampReplacementTable();
            cmp.filteredStamps = [
                {
                    id: 50,
                    rate: '1d',
                    description: 'red',
                    catalogueNumbers: [
                        {
                            id: 1000,
                            active: true,
                            catalogueRef: 1
                        }
                    ]
                },
                {
                    id: 60,
                    rate: '2d',
                    description: 'violet',
                    catalogueNumbers: [
                        {
                            id: 1001,
                            active: true,
                            catalogueRef: 1
                        }
                    ]
                },
            ]
        });

        it('will advance to last row', () => {
            let evt = {
                keyCode: KeyCodes.VK_TAB
            };
            cmp.model.editingRow = 0;
            let result = cmp.advanceToNextRow(evt);
            expect(cmp.model.editingRow).toBe(1);
            expect(result).toBe(false);
        });

        it('will not advance if last row', () => {
            let evt = {
                keyCode: KeyCodes.VK_TAB
            };
            cmp.model.editingRow = 1;
            let result = cmp.advanceToNextRow(evt);
            expect(cmp.model.editingRow).toBe(1);
            expect(result).toBe(true);
        });

    });

    describe('getCurrencyCode tests', () => {
        let cmp;

        beforeEach(() => {
            cmp = new StampReplacementTable();

            cmp.catalogues = [
                {
                    id: 5,
                    code: 'USD'
                },
                {
                    id: 6,
                    code: 'EUR'
                },
            ]
        });

        it('verify currency code found', () => {
            let cn = {
                id: 1000,
                number: '12',
                catalogueRef: 6
            }
            expect(cmp.getCurrencyCode(cn)).toBe('EUR');
        });

    });

    describe('filterStamps tests', () => {

        let cmp;

        beforeEach(() => {

            cmp = new StampReplacementTable();

            cmp.stamps = [
                {
                    id: 5,
                    rate: '1d',
                    description: 'red',
                    countryRef: 2,
                    catalogueNumbers: [
                        {
                            id: 1000,
                            value: 23.5,
                            number: '12b',
                            active: true,
                            catalogueRef: 1
                        }
                    ]
                },
                {
                    id: 6,
                    rate: '2d',
                    description: 'violet',
                    countryRef: 2,
                    catalogueNumbers: [
                        {
                            id: 1001,
                            value: 13,
                            number: '17',
                            active: true,
                            catalogueRef: 200
                        }
                    ]
                },
            ]
        });

        it('verify no matches are chosen', () => {
            cmp.model = {
                filterCatalogueRef: 4,
                replacementCatalogueRef: 200
            };
            cmp.filterStamps();
            expect(cmp.model.editCount).toBe(0);
            expect(cmp.filteredStamps.length).toBe(0);
        });

        it('verify only matching catalogueRef is chosen', () => {
            cmp.model = {
                filterCatalogueRef: 1,
                replacementCatalogueRef: 200,
                editCount: 5
            };
            cmp.filterStamps();
            expect(cmp.model.editCount).toBe(0);
            expect(cmp.filteredStamps.length).toBe(1);

            let editingCn = _.first(cmp.filteredStamps[0].catalogueNumbers);
            expect(editingCn.catalogueRef).toBe(200);
            expect(editingCn.replacing).toBe(true);

        });
    });
});
