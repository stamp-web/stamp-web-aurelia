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
import {CatalogueNumberReferences} from '../../../../src/resources/elements/catalogue-numbers/cn-references';

describe('CatalogueNumberReferences test suite', () => {

    describe('revert tests', () => {

        let cmp;

        beforeEach(() => {
            cmp = new CatalogueNumberReferences();
        });

        it('reverts a change', () => {
            let orig = {
                number: '24a',
                condition: 5,
                value: 25.4,
                catalogueRef: 10
            };
            let editing = {
                number: '26',
                condition: 0,
                value: 5.75,
                catalogueRef: 21
            };
            editing.original = orig;

            cmp._revert(editing);

            expect(editing.original).not.toBeDefined();
            expect(editing.number).toEqual('24a');
            expect(editing.condition).toEqual(5);
            expect(editing.value).toEqual(25.4);
            expect(editing.catalogueRef).toEqual(10);
        });
    });
});
