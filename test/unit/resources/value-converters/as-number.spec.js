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
import {asNumberValueConverter} from 'resources/value-converters/as-number';

describe('asNumberValueConverter test suite', () => {

    describe('toView tests', () => {
        let cmp;

        beforeEach(() => {
            cmp = new asNumberValueConverter();
        });

        it('handles NaN', () => {
            let value = cmp.toView(NaN);
            expect(value).toBeUndefined();
        });

        it('handles integer', () => {
            let value = cmp.toView(53);
            expect(value).toBe(53);
        });

        it('handles real number as integer', () => {
            let value = cmp.toView(21.25, false);
            expect(value).toBe(21);
        });

        it('handles string real number as integer ', () => {
            let value = cmp.toView('42.75', false);
            expect(value).toBe(42);
        });

        it('handles string real number as real number ', () => {
            let value = cmp.toView('63.75', true);
            expect(value).toBe(63.75);
        });
    });

    describe('fromView tests', () => {

        let cmp;

        beforeEach(() => {
            cmp = new asNumberValueConverter();
        });

        it('handles NaN', () => {
            let value = cmp.fromView(NaN);
            expect(value).toBeUndefined();
        });

        it('handles positive integer value', () => {
            let value = cmp.fromView('54');
            expect(value).toBe(54);
        });

        it('handles positive real number value as integer', () => {
            let value = cmp.fromView('52.5');
            expect(value).toBe(52);
        });

        it('handles negative number value', () => {
            let value = cmp.fromView('-23');
            expect(value).toBe(-23);
        });

        it('handles postive real number value as float', () => {
            let value = cmp.fromView('35.25', true);
            expect(value).toBe(35.25);
        });

        it('handles String invalid number', () => {
            let value = cmp.fromView('ThisIsNotANumber');
            expect(value).toBeUndefined();
        });
    });
});
