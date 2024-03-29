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
import {createSpyObj} from 'jest-createspyobj';
import {EnumeratedTypeHelper, ConditionHelper, StampHelper, Condition, Defects} from 'util/common-models';
import _ from 'lodash';

describe('EnumeratedTypeHelper test suite', () => {

    describe('asEnumArray tests', () => {

        it('empty defects nothing is determined', () => {
            let v = EnumeratedTypeHelper.asEnumArray(Defects, undefined);
            expect(v).not.toBe(null);
            expect(_.isEmpty(v)).toBe(true);
        });

        it('single defect is determined', () => {
            let v = EnumeratedTypeHelper.asEnumArray(Defects, Defects.CLIPPED.ordinal);
            expect(v.length).toBe(1);
            expect(v[0].toString()).toEqual(Defects.CLIPPED.toString());

            v = EnumeratedTypeHelper.asEnumArray(Defects, Defects.FADING.ordinal);
            expect(v.length).toBe(1);
            expect(v[0].toString()).toBe(Defects.FADING.toString());
        });

        it('multiple defects are determined', () => {
            let v = EnumeratedTypeHelper.asEnumArray(Defects, Defects.CLIPPED.ordinal + Defects.BLEEDING.ordinal + Defects.CREASED.ordinal);
            expect(v.length).toBe(3);
            expect(_.findIndex(v, Defects.CLIPPED)).toBeGreaterThan(-1);
            expect(_.findIndex(v, Defects.BLEEDING)).toBeGreaterThan(-1);
            expect(_.findIndex(v, Defects.CREASED)).toBeGreaterThan(-1);
        });
    });
});

describe('StampHelper test suite', () => {

    describe('createEmptyStamp test', () => {
        it('as wantlist', () => {
            let stamp = StampHelper.createEmptyStamp(true);
            expect(stamp.rate).toBe('');
            expect(stamp.description).toBe('');
            expect(stamp.id).toBe(0);
            expect(stamp.wantList).toBe(true);
            expect(stamp.countryRef).toBe(-1);
            expect(stamp.catalogueNumbers).toEqual([]);
            expect(stamp.stampOwnerships).toEqual([]);
        });

        it('as stamp', () => {
            let stamp = StampHelper.createEmptyStamp(false);
            expect(stamp.rate).toBe('');
            expect(stamp.description).toBe('');
            expect(stamp.id).toBe(0);
            expect(stamp.wantList).toBe(false);
            expect(stamp.countryRef).toBe(-1);
            expect(stamp.catalogueNumbers).toEqual([]);
            expect(stamp.stampOwnerships).toEqual([]);
        });
    });

    describe('calculateImagePath test', () => {

        let countryServiceSpy;
        let catalogueServiceSpy;
        let stamp;
        let country;
        let michelCatalogue;
        let scottCatalogue;

        beforeEach(() => {
            countryServiceSpy = createSpyObj('countryService', ['getById']);
            catalogueServiceSpy = createSpyObj('catalogueService', ['getById']);

            country = {
                name: 'Germany',
                id:   45
            };

            michelCatalogue = {
                id:   21,
                type: 2,
                name: 'Michel Specialized'
            };

            scottCatalogue = {
                id:   15,
                type: 1,
                name: 'Scott Specialized'
            };

            stamp = {
                countryRef:       45,
                wantList:         false,
                catalogueNumbers: [
                    {
                        active:       true,
                        number:       '26a',
                        condition:    0,
                        catalogueRef: 21
                    }
                ]
            };

        });

        it('proper matches for mint stamp', () => {
            countryServiceSpy.getById.mockReturnValue(country);
            catalogueServiceSpy.getById.mockReturnValue(michelCatalogue);

            let path = StampHelper.calculateImagePath(stamp, true, true, countryServiceSpy, catalogueServiceSpy);
            expect(path).toEqual('Germany/26a.jpg');
        });

        it('proper matches for used stamp with path', () => {
            countryServiceSpy.getById.mockReturnValue(country);
            catalogueServiceSpy.getById.mockReturnValue(michelCatalogue);
            stamp.catalogueNumbers[0].condition = 2;

            let path = StampHelper.calculateImagePath(stamp, true, false, countryServiceSpy, catalogueServiceSpy);
            expect(path).toEqual('Germany/used/26a.jpg');

        });

        it('proper matches for used stamp without path', () => {
            countryServiceSpy.getById.mockReturnValue(country);
            catalogueServiceSpy.getById.mockReturnValue(michelCatalogue);
            stamp.catalogueNumbers[0].condition = 2;

            let path = StampHelper.calculateImagePath(stamp, false, false, countryServiceSpy, catalogueServiceSpy);
            expect(path).toEqual('Germany/26a.jpg');

        });

        it('proper matches for on cover stamp with path', () => {
            countryServiceSpy.getById.mockReturnValue(country);
            catalogueServiceSpy.getById.mockReturnValue(michelCatalogue);
            stamp.catalogueNumbers[0].condition = 6;

            let path = StampHelper.calculateImagePath(stamp, true, false, countryServiceSpy, catalogueServiceSpy);
            expect(path).toEqual('Germany/on-cover/26a.jpg');

        });

        it('proper matches for used stamp with path and scott catalogue', () => {
            countryServiceSpy.getById.mockReturnValue(country);
            catalogueServiceSpy.getById.mockReturnValue(scottCatalogue);
            stamp.catalogueNumbers[0].condition = 6;
            stamp.catalogueNumbers[0].catalogueRef = 15;

            let path = StampHelper.calculateImagePath(stamp, true, true, countryServiceSpy, catalogueServiceSpy);
            expect(path).toEqual('Germany/on-cover/sc26a.jpg');

        });

    })
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

    describe('isUsed test', () => {
        it('verify all used stamps are true', () => {
            expect(ConditionHelper.isUsed(Condition.USED.ordinal)).toBe(true);
            expect(ConditionHelper.isUsed(Condition.CTO.ordinal)).toBe(true);
            expect(ConditionHelper.isUsed(Condition.MANUSCRIPT.ordinal)).toBe(true);
        });

        it('verify non-used stamps are false', () => {
            expect(ConditionHelper.isUsed(Condition.ON_PAPER.ordinal)).toBe(false);
            expect(ConditionHelper.isUsed(Condition.COVER.ordinal)).toBe(false);
            expect(ConditionHelper.isUsed(Condition.MINT.ordinal)).toBe(false);
            expect(ConditionHelper.isUsed(Condition.MINT_NG.ordinal)).toBe(false);
            expect(ConditionHelper.isUsed(Condition.MINT_NH.ordinal)).toBe(false);
            expect(ConditionHelper.isUsed(Condition.MINT_HH.ordinal)).toBe(false);
        });
    });

    describe('isOnCover test', () => {
        it('verify all on cover stamps are true', () => {
            expect(ConditionHelper.isOnCover(Condition.ON_PAPER.ordinal)).toBe(true);
            expect(ConditionHelper.isOnCover(Condition.COVER.ordinal)).toBe(true);
        });

        it('verify non-cover stamps are false', () => {
            expect(ConditionHelper.isOnCover(Condition.USED.ordinal)).toBe(false);
            expect(ConditionHelper.isOnCover(Condition.CTO.ordinal)).toBe(false);
            expect(ConditionHelper.isOnCover(Condition.MANUSCRIPT.ordinal)).toBe(false);
            expect(ConditionHelper.isOnCover(Condition.MINT.ordinal)).toBe(false);
            expect(ConditionHelper.isOnCover(Condition.MINT_NG.ordinal)).toBe(false);
            expect(ConditionHelper.isOnCover(Condition.MINT_NH.ordinal)).toBe(false);
            expect(ConditionHelper.isOnCover(Condition.MINT_HH.ordinal)).toBe(false);
        });
    });
});

