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
import {PredicateUtilities} from '../../src/util/object-utilities';
import ODataParser from 'odata-filter-parser';

let Predicate = ODataParser.Predicate;
let Operators = ODataParser.Operators;

describe('PredicateUtilities test suite', () => {

    describe('removeMatches tests', () => {
        it('remove single matching item from array', () => {
            let ps = new Predicate({ subject: 'my-subject', value: 'something'});
            let result = PredicateUtilities.removeMatches('my-subject', [ps]);
            expect(result.length).toBe(0);
        });

        it('no removal without matching item from single array', () => {
            let ps = new Predicate({ subject: 'my-subject', value: 'something'});
            let result = PredicateUtilities.removeMatches('no removal', [ps]);
            expect(result.length).toBe(1);
        });

        it('no removal without matching item from array', () => {
            let result = PredicateUtilities.removeMatches('no removal', [
                new Predicate({ subject: 'my-subject', value: 'something'}),
                new Predicate({ subject: 'another-subject', value: 'something'}),
                new Predicate({ subject: 'yet-again-subject', value: 'something'})
            ]);
            expect(result.length).toBe(3);
        });

        it('removal matching first item from array', () => {
            let result = PredicateUtilities.removeMatches('my-subject', [
                new Predicate({ subject: 'my-subject', value: 'something'}),
                new Predicate({ subject: 'another-subject', value: 'something'}),
                new Predicate({ subject: 'yet-again-subject', value: 'something'})
            ]);
            expect(result.length).toBe(2);
        });

        it('removal matching last item from array', () => {
            let result = PredicateUtilities.removeMatches('yet-again-subject', [
                new Predicate({ subject: 'my-subject', value: 'something'}),
                new Predicate({ subject: 'another-subject', value: 'something'}),
                new Predicate({ subject: 'yet-again-subject', value: 'something'})
            ]);
            expect(result.length).toBe(2);
        });

        it('removal matching OR condition', () => {
            let result = PredicateUtilities.removeMatches('condition', [
                new Predicate({ subject: 'my-subject', value: 'something'}),
                new Predicate({
                    subject: new Predicate({subject:'condition', value: 1}),
                    operator: Operators.OR,
                    value: new Predicate({subject:'condition', value: 4})}),
                new Predicate({ subject: 'yet-again-subject', value: 'something'})
            ]);
            expect(result.length).toBe(2);
        });

        it('removal matching only AND condition', () => {
            let result = PredicateUtilities.removeMatches('condition', [
                new Predicate({
                    subject: new Predicate({subject:'condition', value: 1}),
                    operator: Operators.AND,
                    value: new Predicate({subject:'condition', value: 4})})
            ]);
            expect(result.length).toBe(0);
        });
    });
});
