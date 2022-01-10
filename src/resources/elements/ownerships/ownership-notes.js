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

import {customElement, inject, computedFrom, bindable} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-binding';
import {I18N} from 'aurelia-i18n';
import {EnumeratedTypeHelper, Defects, Deceptions} from '../../../util/common-models';

import _ from 'lodash';

@customElement('ownership-notes')
@inject(Element, I18N, BindingEngine)
@bindable('model')
export class OwnershipNotes {

    hasDefects = false;
    hasDeception = false;
    hasNotes = false;
    iconCls = "";

    tooltip;

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
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(this.model, 'notes').subscribe(this._calculateNotes.bind(this)));
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(this.model, 'defects').subscribe(this._calculateNotes.bind(this)));
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(this.model, 'deception').subscribe(this._calculateNotes.bind(this)));
            this._calculateNotes();
        }
    }

    _dispose() {
        this._modelSubscribers.forEach(sub => {
            sub.dispose();
        });
        this._modelSubscribers = [];
    }

    _calculateNotes() {
        this.hasNotes = !!(this.model.notes && this.model.notes !== '');
        this.hasDeception = (+this.model.deception > 0);
        this.hasDefects = (+this.model.defects > 0);
        this.iconCls = (this.hasDeception) ? 'sw-icon-deception' : (this.hasDefects) ? 'sw-icon-defect' : (this.hasNotes) ? 'sw-icon-info' : '';
        if (this.visible) {
            this._createTooltip();
        }
    }

    _createTooltip() {
        if(this.visible) {
            if(this.tooltip) {
                this.tooltip.dispose();
            }
            let title = this.popupText;
            this.tooltip = new window.Bootstrap.Tooltip(this.element, {
                html: true,
                delay: {show: 500, hide: 100},
                sanitize: false,
                placement: 'bottom',
                trigger: 'hover',
                container: 'body',
                title: title
            });
        }
    }

    @computedFrom('model.defects', 'model.deception', 'model.notes')
    get popupText() {
        let text = '';
        if( this.hasDefects) {
            let values = EnumeratedTypeHelper.asEnumArray( Defects, this.model.defects );
            let dText = '';
            if( values && values.length > 0 ) {
                _.forEach( values, (val, index) => {
                    dText += this.i18n.tr(val.description) + (( index < values.length - 1) ? ', ' : '');
                });
            }
            text += (text.length > 0 ) ? '<br/>' : '';
            text += '<label class="tooltip-label">' + this.i18n.tr('tooltip.defects') + '</label>' + dText;
        }
        if( this.hasDeception) {
            let values = EnumeratedTypeHelper.asEnumArray( Deceptions, this.model.deception );
            let dText = '';
            if( values && values.length > 0 ) {
                _.forEach( values, (val, index) => {
                    dText += this.i18n.tr(val.description) + (( index < values.length - 1) ? ', ' : '');
                });
            }
            text += (text.length > 0 ) ? '<br/>' : '';
            text += '<label class="tooltip-label">' + this.i18n.tr('tooltip.deception') + '</label>' + dText;
        }
        if( this.hasNotes) {
            text += (text.length > 0 ) ? '<br/>' : '';
            text += '<label class="tooltip-label">' + this.i18n.tr('tooltip.notes') + '</label>' + this.model.notes;
        }
        return text;
    }

    @computedFrom('iconCls')
    get visible() {
        return !_.isEmpty(this.iconCls);
    }

}
