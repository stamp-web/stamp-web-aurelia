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
import {BindingEngine} from 'aurelia-binding';
import {I18N} from 'aurelia-i18n';

@customElement('ownership-cert')
@inject(Element, I18N, BindingEngine)
@bindable('model')
export class OwnershipCert {

    hasCert = false;
    iconCls = "";

    _modelSubscribers = [];

    constructor(element, i18n, bindingEngine) {
        this.element = element;
        this.i18n = i18n;
        this.bindingEngine = bindingEngine;
    }

    detach() {
        this._dispose();
    }

    modelChanged() {
        this.iconCls = '';
        this._dispose();
        if (this.model) {
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(this.model, 'cert').subscribe(this._calculateCert.bind(this)));
            this._calculateCert();
        }
    }

    _dispose() {
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
        this._modelSubscribers = [];
    }

    _calculateCert() {
        if (this.model) {
            this.hasCert = !!this.model.cert;
            this.iconCls = (this.hasCert) ? 'sw-icon-ribbon' : '';
            this._createTooltip();
        }
    }

    _createTooltip() {
        if (this.tooltip) {
            this.tooltip.dispose();
        }
        if (this.hasCert) {
            let title = this.i18n.tr('tooltip.cert');
            this.tooltip = new window.Bootstrap.Tooltip(this.element, {
                html:      true,
                delay:     {show: 500, hide: 100},
                sanitize:  false,
                placement: 'bottom',
                trigger:   'hover',
                container: 'body',
                title:     title
            });
        }
    }
}
