/**
 Copyright 2016 Jason Drake

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

import {asCurrencyValueConverter} from "../resources/value-converters/as-currency-formatted";
import {byNameValueConverter} from "../resources/value-converters/by-name";
import _ from 'lodash';
import $ from 'jquery';

export class ReportGenerator {

    constructor() {

    }

    generateTable( colModel, stamps ) {
        let table = $("<table/>");
        let headerRow = $('<tr/>');
        table.append(headerRow);
        _.each(colModel, col => {
            headerRow.append('<th>' + col.title + '</th>');
        });

        return table;
    }
}
