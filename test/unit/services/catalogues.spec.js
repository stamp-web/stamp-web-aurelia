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
import {Catalogues} from '../../../src/services/catalogues';

describe('Catalogue service test suite', () => {

    let http = jasmine.createSpyObj('http', ['configure']);

    describe('sortFn validation', () => {
        it('correctly ensures older issues are lower than newer issues', () => {
            let c = new Catalogues(http, {});
            let m = {
                issue: 1928,
                name: 'test catalogue'
            };
            let result = c.sortFunc(m);
            expect(result).toBe(-1928);
        });

    });
});
