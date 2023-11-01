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
import {LogManager} from 'aurelia-framework';
import {Condition, CurrencyCode} from '../util/common-models';
import {asCurrencyValueConverter} from '../resources/value-converters/as-currency-formatted';
import {I18N} from 'aurelia-i18n';
import * as reportStyles from './report-styles.json';

import _ from 'lodash';

const logger = LogManager.getLogger('report-helper');

export class ReportHelper {

    countries = [];

    static inject() {
        return [ReportValueConverter, I18N];
    }

    constructor(reportValueConverter, i18next) {
        this.converter = reportValueConverter;
        this.i18next = i18next;
    }

    buildReport(stamps, countries, reportValue, options) {
        let reportModel = _.get(options, 'model', {});
        let title = _.get(reportModel, 'title', this.i18next.tr('reports.defaultTitle'));
        let includeCountries = _.get(reportModel, 'includeCountries', false);
        let includeNotes = _.get(reportModel, 'includeNotes', false);

        let columns = [
            {name: ' ', type: 'issues', value: 'stampOwnerships[0]'},
            {name: this.i18next.tr('reports.number'), type: 'catalogueNumber', value: 'activeCatalogueNumber.number'},
            {name: this.i18next.tr('reports.description'), type: 'text', value: 'rate', additional: ['description'], width: '*'},
            {name: this.i18next.tr('reports.condition'), type: 'condition', value: 'activeCatalogueNumber.condition'},
            {
                name: this.i18next.tr('reports.value'),
                type: 'currencyValue',
                value: 'activeCatalogueNumber.value',
                additional: ['activeCatalogueNumber.code']
            }
        ];
        if(includeCountries) {
            columns.splice(1,0, {name: this.i18next.tr('reports.country'), type: 'country', value: 'countryRef'});
        }
        if(includeNotes) {
            let index = includeCountries ? 4 : 3;
            columns.splice(index,0, {name: this.i18next.tr('reports.notes'), type: 'notes', value: 'stampOwnerships[0]', width: '*'});
        }

        let tmodel = this.generateTableModel(stamps, countries,{
            cols: columns
        });
        let styles = this.getStandardStyleDefinition();
        let opts = {
            content: []
        };

        opts.content.push(this.generateText(`Report: ${title}`, 'header'));
        opts.content.push(this.generateText(`Total number of stamps: ${stamps.length}`, 'text'));
        opts.content.push(this.generateText(`Total value: ${reportValue}`, 'text'));
        opts.content.push({
            table: tmodel, style: 'table', layout: {
                hLineColor: (i, node) => {
                    return '#aaa';
                },
                vLineColor: (i, node) => {
                    return '#aaa';
                }
            }
        });
        opts.styles = styles;
        return opts;
    }


    getStandardStyleDefinition() {
        return reportStyles;
    }

    generateText(text, style = 'header') {
        return {
            text:  text,
            style: style
        };
    }

    generateTableModel(stamps, countries, config) {
        let model = {
            body: [],
            widths: []
        };
        if (!_.isEmpty(config.cols)) {
            let tr = [];

            _.forEach(config.cols, col => {
                tr.push({ text: col.name || col.type, style: 'tableHeader'});
                model.widths.push(col.width || 'auto');
            });
            model.headerRows = 1;
            model.body.push(tr);

            _.forEach(stamps, stamp => {
                let row = [];
                _.forEach(config.cols, col => {
                    row.push(this.generateTableCellValue(stamp, col, countries));
                });
                model.body.push(row);
            });
        }
        return model;
    }

    generateTableCellValue(stamp, col, countries) {
        let val = _.get(stamp, col.value);
        let result = '';
        switch (col.type) {
            case 'catalogueNumber':
                result = val;
                break;
            case 'condition':
                result = this.converter.fromCondition(val);
                break;
            case 'currencyValue':
                let currencyCode = _.get(stamp, col.code, CurrencyCode.USD.key);
                result = this.converter.fromCurrencyValue(val, currencyCode);
                break;
            case 'country':
                let c = _.find(countries, {id: val});
                result = c ? c.name : '';
                break;
            case 'issues':
                if (val && val.deception > 0) {
                   result = '\u0394';
                } else if (val && val.defects > 0) {
                    result = '\u00D7';
                }
                break;
            case 'notes':
                result = (val && val.notes) ? val.notes : '';
                break;
            case 'text':
                _.forEach(col.additional, a => {
                    val += ' ' + _.get(stamp, a, '');
                });
                result = val;
                break;
        }
        return result;
    }
}

export class ReportValueConverter {

    converter;

    static inject() {
        return [asCurrencyValueConverter];
    }

    constructor(converter) {
        this.converter = converter;
    }

    fromCurrencyValue(price, currencyCode) {
        return this.converter.toView(price, currencyCode);
    };

    fromCondition(condition) {
        let value = '';
        switch (condition) {
            case Condition.MINT.ordinal:
            case Condition.MINT_HH.ordinal:
                value = '*';
                break;
            case Condition.MINT_NH.ordinal:
                value = '**';
                break;
            case Condition.MINT_NG.ordinal:
                value = '(*)';
                break;
            case Condition.USED.ordinal:
            case Condition.CTO.ordinal:
                value = 'u'; // '\u00f8';
                break;
            case Condition.MANUSCRIPT.ordinal:
                value = '~';
                break;
            case Condition.COVER.ordinal:
            case Condition.ON_PAPER.ordinal:
                value = 'op';
                break;
            default:
                console.log('no condition converter for ', condition);

        }
        return value;
    }
}
