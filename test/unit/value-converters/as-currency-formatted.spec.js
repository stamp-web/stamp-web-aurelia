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
import {asCurrencyValueConverter} from 'resources/value-converters/as-currency-formatted';

describe('asCurrencyFormattedConverter test suite', () => {

    describe('toView tests', () => {
        it('test 0 number with null currency', () => {
            expect(new asCurrencyValueConverter().toView(0.0, null)).toBe('-');
        });

        it('test 0 number with USD currency', () => {
            expect(new asCurrencyValueConverter().toView(0.0, 'USD')).toBe('-');
        });

        it('test valid number with USD currency', () => {
            expect(new asCurrencyValueConverter().toView(25.47, 'USD')).toBe('$25.47');
        });

        it('test leading 0 decimal number with CAD currency', () => {
            expect(new asCurrencyValueConverter().toView(.5, 'USD')).toBe('$0.50');
        });

        it('test undefined number', () => {
            expect(new asCurrencyValueConverter().toView(undefined, 'USD')).toBe('-');
        });

        it('test euro currency', () => {
            expect(new asCurrencyValueConverter().toView(67000.75, 'EUR')).toBe('€67,000.75');
        });

        it('test handling of Yen values', () => {
            expect(new asCurrencyValueConverter().toView(5600, 'JPY')).toBe('¥5,600');
        });

        it('test handling of Italian Lira values', () => {
            let value = new asCurrencyValueConverter().toView(5600, 'ITL');
            expect(value).toContain('ITL');
            expect(value).toContain('5,600.00');
        });
    });

});
