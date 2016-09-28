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
        if( this.valueType === Number ) {
            $select.val(0);
        } else {
            $select.val(undefined);
        }
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

    onSelect(e) {
        let self = this;
        if( e.params && e.params.data ) {
            let data = e.params.data.id;
            if( self.multiple === true && typeof data === 'string' ) {
                let val = data;
                data = (self.value) ? _.clone(self.value) : [];
                data.push(val);
            }
            self.valueChanged(data, self.value);  // even though we have a value property, select is tracking as an id
        }
    }

    getBoundValue(item) {
        return item[this.valueProperty];
    }

    getBoundText(item) {
        return item[this.labelProperty];
    }

    onUnselect(e) {
        let self = this;
        if( e.params && e.params.data ) {
            if( self.multiple) {
                let newArr = [];
                if( self.value) {
                    newArr = _.clone(self.value);
                    _.remove(newArr, el => {
                        return el === e.params.data.id;
                    });
                }
                self.valueChanged(newArr, self.value);
            } else {
                let newValue = "";
                switch(self.valueType) {
                    case Number:
                        newValue = -1;
                        break;
                }
                self.valueChanged(newValue, self.value);
            }
        }
    }

    /**
     * Need to fire to select the first copy
     */
    attached() {
        _.debounce(self => {
            if (self.value !== undefined && self.items && self.items.length > 0 ) { // the cached collections may not have been loaded yet
                self.valueChanged(self.value, undefined);
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
            _.debounce(self => {
                if( self.value ) {
                    self.valueChanged(self.value, undefined);
                    if( self.firedCollectionChanged ) {
                        logger.debug("Collections was changed after initial binding");
                    }
                    self.firedCollectionChanged = true;
                }
            })(this);

        }
    }

    selectAndFire(newValue, finalNewValue) {
        if( !finalNewValue ) {
            finalNewValue = newValue;
        }
        // need to handle the case where it is destroyed and listeners are clearing out
        if( this.select2.data('select2') !== undefined ) {
            this.select2.val(newValue).trigger('change');
        }
        if( this.value !== finalNewValue ) {
            this.value = finalNewValue;
        }
        this.element.dispatchEvent(new Event("change"));
    }

    valueChanged(newValue, oldValue) {
        if (newValue === undefined) {
            logger.warn("value is undefined for " + this.valueProperty );
            return;
        }
        if (this.multiple) {
            if( oldValue === null ) {
                oldValue = [];
            }
            if( _.xor(oldValue, newValue).length > 0 ) {
                this.selectAndFire(newValue);
            }
        } else {
            if( this.valueType === "String" ) {
                this.selectAndFire(newValue);
            }
            else if( this.valueType === "Number" ) {
                var newValueInt = parseInt(Number(newValue), 10);
                if (isNaN(newValueInt)) {
                    throw new Error('Item Id must be null or an integer!');
                }
                if (newValueInt === 0 || newValueInt !== Number(oldValue)) { // oldValue may be 0 on initialization
                    this.selectAndFire('' + newValue, newValueInt);
                }
            }
        }
    }
}
