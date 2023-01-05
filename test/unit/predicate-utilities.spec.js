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
import {PredicateUtilities} from 'util/object-utilities';
import ODataParser from 'odata-filter-parser';

let Predicate = ODataParser.Predicate;
let Operators = ODataParser.Operators;

describe('PredicateUtilities test suite', () => {

    describe('concat tests', () => {
        it('verify undefined dropped', () => {
           let arr = [undefined, new Predicate({subject: 'test', value: 'test-v'})];
           let result = PredicateUtilities.concat(Operators.AND, arr);
           expect(result.flatten().length).toBe(1);
        });

        it('verify multiple concatentated', () => {
            let arr = [new Predicate({subject: 'p1', value: 'v1'}), new Predicate({subject: 'test', value: 'test-v'})];
            let result = PredicateUtilities.concat(Operators.AND, arr);
            expect(result.flatten().length).toBe(2);
        });

        it('verify multiple undefines are not concatentated', () => {
            let arr = [new Predicate({subject: 'p1', value: 'v1'}), undefined, new Predicate({subject: 'test', value: 'test-v'}), undefined];
            let result = PredicateUtilities.concat(Operators.AND, arr);
            expect(result.flatten().length).toBe(2);
        });
    });

    describe('removeMatches tests', () => {
        it('remove single matching item from array', () => {
            let ps = new Predicate({ subject: 'my-subject', value: 'something'});
            let result = PredicateUtilities.removeMatches('my-subject', ps);
            expect(result).toBe(undefined);
        });

        it('no removal without matching item from single array', () => {
            let ps = new Predicate({ subject: 'my-subject', value: 'something'});
            let result = PredicateUtilities.removeMatches('no removal', ps);
            expect(result.flatten().length).toBe(1);
        });

        it('no removal without matching item from array', () => {
            let result = PredicateUtilities.removeMatches('no removal', Predicate.concat(Operators.AND, [
                new Predicate({ subject: 'my-subject', value: 'something'}),
                new Predicate({ subject: 'another-subject', value: 'something'}),
                new Predicate({ subject: 'yet-again-subject', value: 'something'})
            ]));
            expect(result.flatten().length).toBe(3);
        });

        it('removal matching first item from array', () => {
            let result = PredicateUtilities.removeMatches('my-subject', Predicate.concat(Operators.AND, [
                new Predicate({ subject: 'my-subject', value: 'something'}),
                new Predicate({ subject: 'another-subject', value: 'something'}),
                new Predicate({ subject: 'yet-again-subject', value: 'something'})
            ]));
            expect(result.flatten().length).toBe(2);
        });

        it('removal matching last item from array', () => {
            let result = PredicateUtilities.removeMatches('yet-again-subject', Predicate.concat(Operators.AND, [
                new Predicate({ subject: 'my-subject', value: 'something'}),
                new Predicate({ subject: 'another-subject', value: 'something'}),
                new Predicate({ subject: 'yet-again-subject', value: 'something'})
            ]));
            expect(result.flatten().length).toBe(2);
        });

        it('removal matching OR condition', () => {
            let result = PredicateUtilities.removeMatches('condition', Predicate.concat(Operators.AND, [
                new Predicate({ subject: 'my-subject', value: 'something'}),
                new Predicate({
                    subject: new Predicate({subject:'condition', value: 1}),
                    operator: Operators.OR,
                    value: new Predicate({subject:'condition', value: 4})}),
                new Predicate({ subject: 'yet-again-subject', value: 'something'})
            ]));
            expect(result.flatten().length).toBe(2);
        });

        it('removal matching only AND condition', () => {
            let result = PredicateUtilities.removeMatches('condition', new Predicate({
                    subject: new Predicate({subject:'condition', value: 1}),
                    operator: Operators.AND,
                    value: new Predicate({subject:'condition', value: 4})
            }));
            expect(result).toBe(undefined);
        });
    });
});
