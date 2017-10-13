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

import reportStyles from 'text!./report-styles.json';

import _ from 'lodash';

const logger = LogManager.getLogger('report-helper');

export class ReportHelper {

    static inject() {
        return [ReportValueConverter];
    }

    constructor(reportValueConverter) {
        this.converter = reportValueConverter;
    }

    getStandardStyleDefinition() {
        return JSON.parse(reportStyles);
    }

    generateText(text, style = 'header') {
        return {
            text:  text,
            style: style
        };
    }

    generateTableModel(stamps, config) {
        let model = {
            body: []
        };
        if (!_.isEmpty(config.cols)) {
            let tr = [];
            _.forEach(config.cols, col => {
                tr.push({ text: col.name || col.type, style: 'tableHeader'});
            });
            model.headerRows = 1;
            model.widths = ['*', 'auto', 'auto'];
            model.body.push(tr);
        }

        _.forEach(stamps, stamp => {
            let row = [];
            _.forEach(config.cols, col => {
                let val = _.get(stamp, col.value);
                switch (col.type) {
                    case 'condition':
                        row.push(this.converter.fromCondition(val));
                        break;
                    case 'currencyValue':
                        let currencyCode = _.get(stamp, col.code);
                        let v = this.converter.fromCurrencyValue(val, currencyCode);
                        row.push(v);
                        break;
                    case 'text':
                        _.forEach(col.additional, a => {
                            val += ' ' + _.get(stamp, a, '');
                        });
                        row.push(val);
                        break;
                }
            });
            model.body.push(row);
        });
        return model;
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
            case Condition.MINT_HH:
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
                value = '(.)';
                break;
            case Condition.MANUSCRIPT.ordinal:
                value = '~';
                break;
            case Condition.COVER.ordinal:
            case Condition.ON_PAPER.ordinal:
                value = '[.]';
                break;
            default:
                console.log('no condition converter for ', condition);

        }
        return value;
    }
}
