import {inject, customElement, bindable} from 'aurelia-framework';
import {I18N} from 'aurelia-i18next';
import $ from 'jquery';
import _ from 'lodash';
import select2 from 'select2/select2'; //eslint-disable-line no-unused-vars

import "select2/select2@4.0.0/css/select2.css!";
import 'resources/styles/widgets/select-picker/select-picker.css!';

@customElement('select-picker')
@bindable('items')
@bindable('config')
@bindable('value')
@bindable('multiple')
@bindable({
    name: 'valueProperty',
    defaultValue: 'id'
})
@bindable({
    name: 'labelProperty',
    defaultValue: 'name'
})
@inject(Element, I18N)
export class Select2Picker {


    constructor(element, i18n) {
        this.element = element;
        this.i18n = i18n;
    }

    bind() {
        let self = this;
        var select = this.element.firstElementChild;
        this.config = this.config || {};
        let caption = this.config.caption;
        if (caption && caption.indexOf('.') > 0) {
            caption = this.i18n.tr(caption);
        }

        var options = {
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
        this.select2 = $select.select2(options);

        let tabIndex = this.config.tabIndex;
        if( !tabIndex ) {
            tabIndex = -1;
        }
        $select.attr('tabindex', -1);
        // Need to debounce in order to implement the tabindex change
        _.debounce((selectTarget, index) => {
            selectTarget.parent().find('.select2-selection').attr('tabindex', index);
        })($select, tabIndex);


        $select.on("select2:unselect", function(e) {
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
                    self.valueChanged(-1, self.value);
                }

            }
        });

        $select.on("select2:select", function (e) {
            if( e.params && e.params.data ) {
                var data = e.params.data.id;
                if( self.multiple === true && typeof data === 'string' ) {
                    var val = data;
                    data = (self.value) ? _.clone(self.value) : [];
                    data.push(val);
                }
                self.valueChanged(data, self.value);  // even though we have a value property, select is tracking as an id
            }
        });
    }

    /**
     * Need to fire to select the first copy
     */
    attached() {
        _.debounce(self => {
            if (self.value) {
                self.valueChanged(self.value, []);
            }
        }, 250)(this);
    }

    valueChanged(newValue, oldValue) {
        if (newValue === undefined) {
            throw new Error("value may not be undefined");
        }
        if (this.multiple) {
            if( oldValue === null ) {
                oldValue = [];
            }
            if( _.xor(oldValue, newValue).length > 0 ) {
                this.select2.select2('val', newValue);
                if( this.value !== newValue ) {
                    this.value = newValue;
                }
                this.element.dispatchEvent(new Event("change"));
            }
        } else {
            var newValueInt = parseInt(Number(newValue), 10);

            if (isNaN(newValueInt)) {
                throw new Error('Item Id must be null or an integer!');
            }
            if (newValueInt !== Number(oldValue)) {
                this.select2.select2('val', newValueInt);
                if (this.value !== newValueInt) {
                    this.value = newValueInt;
                }
                this.element.dispatchEvent(new Event("change"));
            }
        }
    }
}
