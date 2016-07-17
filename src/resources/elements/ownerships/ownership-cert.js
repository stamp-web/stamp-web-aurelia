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
import {customElement, inject, bindable} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';

@customElement('ownership-cert')
@inject(Element, I18N)
@bindable('model')
export class OwnershipCertCustomElement {

    hasCert = false;
    iconCls = "";

    constructor(element, i18n) {
        this.element = element;
        this.i18n = i18n;
    }

    modelChanged(newValue) {
        this.iconCls = '';
        let self = this;
        $(self.element).find('.tooltip').remove(); // remove any tooltips
        if (newValue) {
            self.hasCert = ( newValue.cert);
            self.iconCls = ( self.hasCert ) ? 'sw-icon-ribbon' : '';
            if (self.hasCert) {
                $(self.element).tooltip({
                    html: true,
                    container: 'body',
                    title: self.i18n.tr('tooltip.cert')
                });
            }
        }
    }
}
