/**
 Copyright 2022 Jason Drake

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
import {DateUtil} from "../../../src/util/object-utilities";

describe('DateHelper test suite', () => {

    describe('isValidDate', () => {

        it('valid date object', () => {
            let d = new Date();
            expect(DateUtil.isValidDate(d)).toBe(true);
        });

        it('string null', () => {
            let d = 'null';
            expect(DateUtil.isValidDate(d)).toBe(false);
        });

        it('undefined', () => {
            let d = 'null';
            expect(DateUtil.isValidDate(d)).toBe(false);
        });

        it('invalid date', () => {
            let d = new Date('foo');
            expect(DateUtil.isValidDate(d)).toBe(false);
        });
    });
});
