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
import {EnumeratedTypeHelper, Defects, Deceptions} from '../../../util/common-models';

import _ from 'lodash';

@customElement('ownership-notes')
@inject(Element, I18N)
@bindable('model')
export class OwnershipNotesCustomElement {

    hasDefects = false;
    hasDeception = false;
    hasNotes = false;
    iconCls = "";

    constructor(element, i18n) {
        this.element = element;
        this.i18n = i18n;
    }

    modelChanged(newValue) {
        this.iconCls = '';
        let self = this;
        $(self.element).find('.tooltip').remove(); // remove any tooltips
        if( newValue ) {
            self.hasNotes = ( newValue.notes && newValue.notes !== '');
            self.hasDeception = (+newValue.deception > 0 );
            self.hasDefects = (+newValue.defects > 0 );
            self.iconCls = ( self.hasDeception ) ? 'sw-icon-deception' : ( self.hasDefects ) ? 'sw-icon-defect' : ( self.hasNotes ) ? 'sw-icon-info' : '';
            if( self.visible ) {
                $(self.element).tooltip({
                    html: true,
                    container: 'body',
                    title: self.getPopupText.bind(self)
                });
            }
        }
    }

    getPopupText() {
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
    get visible() {
        return this.hasDeception || this.hasDefects || this.hasNotes;
    }

}
