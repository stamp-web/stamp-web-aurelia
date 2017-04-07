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
import {EnumeratedTypeHelper, ConditionHelper, Condition, Defects} from '../../../src/util/common-models';
import _ from 'lodash';

describe('EnumeratedTypeHelper test suite', () => {

    describe('asArray tests', () => {

        it('empty defects nothing is determined', () => {
            let v = EnumeratedTypeHelper.asArray(Defects, undefined);
            expect(v).not.toBe(null);
            expect(_.isEmpty(v)).toBe(true);
        });

        it('single defect is determined', () => {
            let v = EnumeratedTypeHelper.asArray(Defects, Defects.CLIPPED.ordinal);
            expect(v).not.toBe(null);
            expect(v.length).toBe(1);
            expect(v[0]).toBe(Defects.CLIPPED);

            v = EnumeratedTypeHelper.asArray(Defects, Defects.FADING.ordinal);
            expect(v).not.toBe(null);
            expect(v.length).toBe(1);
            expect(v[0]).toBe(Defects.FADING);
        });

        it('multiple defects are determined', () => {
            let v = EnumeratedTypeHelper.asArray(Defects, Defects.CLIPPED.ordinal + Defects.BLEEDING.ordinal + Defects.CREASED.ordinal);
            expect(v).not.toBe(null);
            expect(v.length).toBe(3);
            expect(_.findIndex(v, Defects.CLIPPED)).toBeGreaterThan(-1);
            expect(_.findIndex(v, Defects.BLEEDING)).toBeGreaterThan(-1);
            expect(_.findIndex(v, Defects.CREASED)).toBeGreaterThan(-1);
        });
    });
});

describe('ConditionHelper test suite', () => {

    describe('matchesByClassification tests', () => {

        it('matches the same mint hinged', () => {
            let v = ConditionHelper.matchesByClassification(Condition.MINT.ordinal, Condition.MINT.ordinal);
            expect(v).toBe(true);
        });

        it('matches the mint but different types', () => {
            let v = ConditionHelper.matchesByClassification(Condition.MINT.ordinal, Condition.MINT_NH.ordinal);
            expect(v).toBe(true);
        });

        it('no match for mint and used', () => {
            let v = ConditionHelper.matchesByClassification(Condition.MINT.ordinal, Condition.USED.ordinal);
            expect(v).toBe(false);
        });


        it('matches the same used', () => {
            let v = ConditionHelper.matchesByClassification(Condition.USED.ordinal, Condition.USED.ordinal);
            expect(v).toBe(true);
        });

        it('matches the same used with different types', () => {
            let v = ConditionHelper.matchesByClassification(Condition.USED.ordinal, Condition.CTO.ordinal);
            expect(v).toBe(true);
        });

        it('matches the different on-paper', () => {
            let v = ConditionHelper.matchesByClassification(Condition.COVER.ordinal, Condition.ON_PAPER.ordinal);
            expect(v).toBe(true);
        });

    });
});

