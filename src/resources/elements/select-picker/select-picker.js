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
import {customElement, bindable, LogManager} from 'aurelia-framework';
import {bindingMode} from 'aurelia-binding';
import {EventHelper} from '../../../events/event-managed';
import {I18N} from 'aurelia-i18n';
import $ from 'jquery';
import _ from 'lodash';
import select2 from 'select2'; //eslint-disable-line no-unused-vars


const logger = LogManager.getLogger('select-picker');

@customElement('select-picker')
export class Select2Picker {

    @bindable({defaultBindingMode : bindingMode.twoWay}) value;
    @bindable valueType = 'Number';
    @bindable valueProperty = 'id';
    @bindable labelProperty = 'name';
    @bindable items;
    @bindable config;
    @bindable multiple = false;

    static inject = [Element, I18N];

    firedCollectionChanged = false;

    constructor(element, i18n) {
        this.element = element;
        this.i18n = i18n;
    }

    bind() {
        let select = this.element.firstElementChild;
        this.config = this.config || {};
        let caption = this.config.caption;
        if (caption && caption.indexOf('.') > 0) {
            caption = this.i18n.tr(caption);
        }

        let options = {
            placeholder: caption,
            allowClear: true
         };

        if( typeof this.config.filterSearch !== 'undefined' && this.config.filterSearch === false ) {
            options.minimumResultsForSearch = Infinity;
        }

        if( this.config.valueProperty ) {
            this.valueProperty = this.config.valueProperty;
        }
        if( this.config.labelProperty ) {
            this.labelProperty = this.config.labelProperty;
        }
        if( this.config.valueType ) {
            this.valueType = this.config.valueType;
        }
        if( typeof this.config.allowClear !== 'undefined') {
            options.allowClear = this.config.allowClear;
        }

        if( typeof this.config.noSearch !== 'undefined') {
            options.minimumResultsForSearch = Infinity;
        }

        if( this.config.id ) {
            this.id = this.config.id;
        } else {
            this.id = "select-" + parseInt(Math.random() * 16384, 10);
        }

        if( this.config.multiple === true || this.multiple === 'true' ) {
            options.multiple = true;
            this.multiple = true;
        }

        const $select = $(select);
        $select.css('width', '100%');
        $select.on("select2:unselect", this.onUnselect.bind(this));
        $select.on("select2:select", this.onSelect.bind(this));
        // the old values may have been assigned to the selector from previous edits
        $select.val(undefined);
        this.select2 = $select.select2(options);

        let tabIndex = this.config.tabIndex;
        if( typeof tabIndex === 'undefined' ) {
            tabIndex = -1;
        }

        $select.attr('tabindex', -1);
        // Need to debounce in order to implement the tabindex change
        _.debounce((selectTarget, index) => {
            selectTarget.parent().find('.select2-selection').attr('tabindex', index);
        })($select, tabIndex);
    }

    unbind() {
        let select = this.element.firstElementChild;
        if( select ) {
            const $select = $(select);
            if( $select.data('select2')) { // depending on the destory state need to check whether it still thinks it is a select2
                $select.select2("destroy");
            }
        }
    }

    /**
     * Take the selected value and properly set the bound value by converting to the appropriate supported type.
     * @param e selection event.
     */
    onSelect(e) {
        if( e.params && e.params.data ) {
            let data = e.params.data.id;
            if( this.multiple === true && typeof data === 'string' ) {
                let val = data;
                data = (this.value) ? _.clone(this.value) : [];
                data.push(val);
                this.value = _.uniq(data); // prevent duplicates
            } else if ( this.valueType === 'Number') {
                this.value = data ? Number.parseInt(data) : -1;
            } else {
                this.value = data;
            }
            let changeEvent = EventHelper.changeEvent(data);
            this.element.dispatchEvent(changeEvent);
        }
    }

    getBoundValue(item) {
        return item[this.valueProperty];
    }

    getBoundText(item) {
        return item[this.labelProperty];
    }

    onUnselect(e) {
        if( e.params && e.params.data ) {
            if( this.multiple) {
                let newArr = [];
                if( this.value) {
                    newArr = _.clone(this.value);
                    _.remove(newArr, el => {
                        return el === e.params.data.id;
                    });
                }
                this.value = newArr;
            } else {
                let newValue = "";
                switch(this.valueType) {
                    case 'Number':
                        newValue = -1;
                        break;
                }
                this.value = newValue;
            }
        }
    }

    valueChanged(newVal, oldValue) {
        if (newVal !== oldValue) {
            if (typeof newVal !== 'undefined') {
                let val = newVal;
                if (this.multiple) {
                    if (_.xor((oldValue === null ? [] : oldValue), newVal).length > 0) {
                        let v = [];
                        _.forEach(newVal, vEntry => {
                            v.push(this._convertToInternal(vEntry));
                        });
                        val = v;
                    }
                } else {
                    val = this._convertToInternal(newVal);
                }
                if (this.select2.data('select2')) {
                    this.select2.val(val).trigger('change');
                }
            }
        }
    }

    /**
     * Handle the conversion of the type from the modeled value to the String equivalence of the value used by select2
     */
    _convertToInternal(val) {
        if( typeof val === 'undefined') {
            return undefined;
        }
        let retValue = val;
        switch(this.valueType) {
            case 'Number':
                retValue = val.toString();
                break;
        }
        return retValue;
    }

    /**
     * Need to fire to select the first copy
     */
    attached() {
        _.debounce( self => {
           if( self.items && self.items.length > 0 ) { // cached items are loaded
               self.valueChanged(self.value);
           }
        }, 125)(this);
    }

    /**
     * Will listen for a change in the collection and if the new collection has content will fire a value change event
     * Should only fire on load.
     *
     * @param newValue
     * @param oldValue
     */
    itemsChanged(newValue, oldValue) { //eslint-disable-line no-unused-vars
        if( newValue && newValue.length > 0 ) {
            _.defer(() => {
                this.valueChanged(this.value);
            });

        }
    }

}
