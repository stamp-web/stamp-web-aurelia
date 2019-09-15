/**
 Copyright 2018 Jason Drake

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
import {valueConverter} from 'aurelia-framework';


@valueConverter('asCurrencyFormatted')
export class asCurrencyValueConverter {

    toView(value, currency = 'USD') {
        if (typeof value !== 'undefined') {
            let minFractions = (currency === 'JPY') ? 0 : 2;
            if( +value > 0 && currency ) {
                return value.toLocaleString('en', {
                    style: 'currency',
                    currencyDisplay: 'symbol',
                    currency: currency,
                    minimumFractionDigits: minFractions
                });
            }
        }
        return '-';
    }
}
