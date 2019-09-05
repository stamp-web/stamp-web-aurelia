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
import {ValidationHelper} from 'util/validation-helper';

describe('validation-helper test-suite', () => {

    describe('_currencyEvaluate', () => {
        it('handles empty', () => {
            expect(ValidationHelper._currencyEvaluate('')).toBe(true);
        });

        it('handles undefined', () => {
           expect(ValidationHelper._currencyEvaluate(undefined)).toBe(true);
        });

        it('handles no leading 0', () => {
            expect(ValidationHelper._currencyEvaluate('.25')).toBe(true);
        });

        it('handles leading 0', () => {
            expect(ValidationHelper._currencyEvaluate('0.25')).toBe(true);
        });

        it('handles more than 3 decimal places', () => {
            expect(ValidationHelper._currencyEvaluate('.253')).toBe(false);
        });

        it('handles proper mantissa', () => {
            expect(ValidationHelper._currencyEvaluate('523')).toBe(true);
        });

        it('handles mantissa with decimals', () => {
            expect(ValidationHelper._currencyEvaluate('723.5')).toBe(true);
        });

        it('handles mantissa with full decimals', () => {
            expect(ValidationHelper._currencyEvaluate('723444.52')).toBe(true);
        });

        it('handles invalid values', () => {
            expect(ValidationHelper._currencyEvaluate('a')).toBe(false);
        });

        it('handles invalid value with valid currency value', () => {
            expect(ValidationHelper._currencyEvaluate('a52.25')).toBe(false);
        });
    });
});
