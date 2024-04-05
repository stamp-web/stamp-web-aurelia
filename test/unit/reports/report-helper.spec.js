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
import {createSpyObj} from "jest-createspyobj";
import {ReportHelper, ReportValueConverter} from 'reports/report-helper';
import {asCurrencyValueConverter} from "resources/value-converters/as-currency-formatted";
import {Condition,CurrencyCode} from "../../../src/util/common-models";

describe('ReportHelper test suite', () => {

    let i18nSpy = createSpyObj('i18n', ['tr']);
    let reportConverter = new ReportValueConverter(new asCurrencyValueConverter());


    describe('generateText tests', () => {

        let cmp;

        beforeEach(() => {
            cmp = new ReportHelper(reportConverter, i18nSpy);
        });

        it('validate', () => {
            let v = cmp.generateText('sample text', 'body');
            expect(v.style).toBe('body');
            expect(v.text).toBe('sample text');
        });
    });

    describe('generateTableModel', () => {

        let cmp;

        beforeEach(() => {
            cmp = new ReportHelper(reportConverter, i18nSpy);
        });

        it('validate sample table columns', () => {
            let stamps = [
                {id: 5, number: '23', description: '1d red'},
                {id: 7, number: '23 b', description: '1d vermilion'}
            ];
            let config = {
                cols: [
                    {name: 'Number', type: 'text', value: 'number'},
                    {name: 'Description', type: 'text', value: 'description', width: '*'}
                    ]
            };
            let v = cmp.generateTableModel(stamps, [], [], config);
            expect(v).toBeDefined();
            expect(v.body.length).toBe(3);
            let tr = v.body[0];
            expect(tr.length).toBe(2);
            expect(tr[1].text).toBe('Description');
            expect(v.body[1][0]).toBe('23');
            expect(v.body[2][1]).toBe('1d vermilion');
            expect(v.widths).toEqual(['auto','*']);
            expect(v.headerRows).toBe(1);
        });

        it('validate no columns', () => {
            let stamps = [
                {id: 5, number: '23', description: '1d red'},
                {id: 7, number: '23 b', description: '1d vermilion'}
            ];
            let v = cmp.generateTableModel(stamps, [], [], {});
            expect(v).toBeDefined();
            expect(v.body.length).toBe(0);
            expect(v.widths.length).toBe(0);
        });

    });


    describe('getStandardStyleDefinition', () => {

        let cmp;

        beforeEach(() => {
            cmp = new ReportHelper(reportConverter, i18nSpy);
        });

        it('validate', () => {
            let v = cmp.getStandardStyleDefinition();
            expect(v).toBeDefined();
        });

    });

    describe('generateTableCellValue tests', () => {

        let cmp;

        beforeEach(() => {
            cmp = new ReportHelper(reportConverter, i18nSpy);
        });

        it('catalogue number', () => {
            let col = {
                type: 'catalogueNumber',
                value: 'activeCatalogueNumber.number'
            };
            let stamp = {
                activeCatalogueNumber: {
                    number: '45a'
                }
            };
           let result = cmp.generateTableCellValue(stamp, col, []);
           expect(result).toBe('45a');
        });

        it('condition verification', () => {
            let col = {
                type: 'condition',
                value: 'activeCatalogueNumber.condition'
            };
            let stamp = {
                activeCatalogueNumber: {
                    condition: Condition.MINT_NH.ordinal
                }
            };
            let result = cmp.generateTableCellValue(stamp, col, []);
            expect(result).toBe('**');
        });

        it('currencyValue verification', () => {
            let col = {
                type: 'currencyValue',
                value: 'activeCatalogueNumber.catalogueValue',
                additional: ['activeCatalogueNumber.catalogueRef']
            };
            let catalogues = [{id: 22, code: CurrencyCode.EUR.key}]
            let stamp = {
                activeCatalogueNumber: {
                    catalogueValue: 2243.23,
                    catalogueRef: 22
                }
            };
            let result = cmp.generateTableCellValue(stamp, col, [], catalogues );
            expect(result).toBe('€2,243.23');
        });

        it('countries verification', () => {
            let col = {
                type: 'country',
                value: 'countryRef'
            };
            let stamp = {
                countryRef: 7
            };
            let countries = [{ id: 1, name: 'test'}, {id: 7, name: 'Germany'}];
            let result = cmp.generateTableCellValue(stamp, col, countries);
            expect(result).toBe('Germany');
        });

        it('deception verification', () => {
            let col = {
                type: 'issues',
                value: 'stampOwnerships[0]'
            };
            let stamp = {
                stampOwnerships: [{deception: 65, defects: 0}]
            };
            let result = cmp.generateTableCellValue(stamp, col, []);
            expect(result).toBe('\u0394');
        });

        it('defect verification', () => {
            let col = {
                type: 'issues',
                value: 'stampOwnerships[0]'
            };
            let stamp = {
                stampOwnerships: [{deception: 0, defects: 17}]
            };
            let result = cmp.generateTableCellValue(stamp, col, []);
            expect(result).toBe('\u00D7');
        });

        it('defect and deception verification', () => {
            let col = {
                type: 'issues',
                value: 'stampOwnerships[0]'
            };
            let stamp = {
                stampOwnerships: [{deception: 8, defects: 4}]
            };
            let result = cmp.generateTableCellValue(stamp, col, []);
            expect(result).toBe('\u0394');
        });

        it('notes verification', () => {
            let col = {
                type: 'notes',
                value: 'stampOwnerships[0]'
            };
            let stamp = {
                stampOwnerships: [{notes: 'this is a note'}]
            };
            let result = cmp.generateTableCellValue(stamp, col, []);
            expect(result).toBe('this is a note');
        });

        it('text no additional', () => {
            let col = {
                type: 'text',
                value: 'value'
            };
            let stamp = {
                value: '1d'
            };
            let result = cmp.generateTableCellValue(stamp, col, []);
            expect(result).toBe('1d');
        });

        it('text with additional', () => {
            let col = {
                type: 'text',
                value: 'value',
                additional: ['description']
            };
            let stamp = {
                value: '1 Tsd M on 100m',
                description: 'red'
            };
            let result = cmp.generateTableCellValue(stamp, col, []);
            expect(result).toBe('1 Tsd M on 100m red');
        });

    });
});

describe('ReportValueConverter test suite', () => {

    describe('fromCurrencyValue tests', () => {

        let cmp;

        beforeEach(() => {
            cmp = new ReportValueConverter(new asCurrencyValueConverter());
        });

        it('convert USD', () => {
           let v = cmp.fromCurrencyValue(45.3, 'USD');
           expect(v).toBe('$45.30');
        });

        it('convert EUR', () => {
            let v = cmp.fromCurrencyValue(2000.32, 'EUR');
            expect(v).toBe('€2,000.32');
        });

    });

    describe('fromCondition tests', () => {

        let cmp;

        beforeEach(() => {
            cmp = new ReportValueConverter(new asCurrencyValueConverter());
        });

        it('invalid condition', () => {
            const logSpy = jest.spyOn(console, 'log');
            let v = cmp.fromCondition('invalid');
            expect(v).toBe('');
            expect(logSpy).toHaveBeenCalled();
        });

        it('MNH validate', () => {
            let v = cmp.fromCondition(Condition.MINT_NH.ordinal);
            expect(v).toBe('**');
        });

        it('MH validate', () => {
            let v = cmp.fromCondition(Condition.MINT.ordinal);
            expect(v).toBe('*');
        });

        it('MNG validate', () => {
            let v = cmp.fromCondition(Condition.MINT_NG.ordinal);
            expect(v).toBe('(*)');
        });

        it('MHH validate', () => {
            let v = cmp.fromCondition(Condition.MINT_HH.ordinal);
            expect(v).toBe('*');
        });

        it('Used validate', () => {
            let v = cmp.fromCondition(Condition.USED.ordinal);
            expect(v).toBe('u');
        });

        it('CTO validate', () => {
            let v = cmp.fromCondition(Condition.CTO.ordinal);
            expect(v).toBe('u');
        });

        it('Cover validate', () => {
            let v = cmp.fromCondition(Condition.COVER.ordinal);
            expect(v).toBe('op');
        });

        it('On Paper validate', () => {
            let v = cmp.fromCondition(Condition.ON_PAPER.ordinal);
            expect(v).toBe('op');
        });

        it('Manuscript validate', () => {
            let v = cmp.fromCondition(Condition.MANUSCRIPT.ordinal);
            expect(v).toBe('~');
        });

    });
});
