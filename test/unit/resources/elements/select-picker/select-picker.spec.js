/**
 Copyright 2022 Jason Drake

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
import {Select2Picker} from 'resources/elements/select-picker/select-picker';
import {createSpyObj} from 'jest-createspyobj';
import _ from 'lodash';

describe('SelectPicker test suite', () => {

    describe('onSelect', () => {
        let selectPicker;

        beforeEach(() => {
            let elm = {
                dispatchEvent: jest.fn()
            }
            selectPicker = new Select2Picker(elm);
        });

        it('single selected for String', () => {
            let evt = {};
            _.defer = jest.fn().mockImplementation(f => f());
            _.set(evt, 'params.data.id', '32');
            selectPicker.value = '16';
            selectPicker.valueType = 'String';
            selectPicker.onSelect(evt);
            expect(selectPicker.value).toBe('32');
            _.delay(() => {
                expect(selectPicker.value).toBe('32');
                expect(selectPicker.element.dispatchEvent).toHaveBeenCalled();
            }, 125);
        });

        it('single selected for Number', () => {
            let evt = {};
            _.defer = jest.fn().mockImplementation(f => f());
            _.set(evt, 'params.data.id', 32);
            selectPicker.value = 16;
            selectPicker.onSelect(evt);
            expect(selectPicker.value).toBe(32);
            _.delay(() => {
                expect(selectPicker.value).toBe(32);
                expect(selectPicker.element.dispatchEvent).toHaveBeenCalled();
            }, 125);
        });

        it('multiple selected from empty', () => {
            let evt = {};
            _.set(evt, 'params.data.id', '32');
            selectPicker.value = []
            selectPicker.multiple = true;
            selectPicker.onSelect(evt);
            expect(selectPicker.value.length).toBe(0);
            _.delay(() => {
                expect(selectPicker.value.length).toBe(1);
                expect(selectPicker.element.dispatchEvent).toHaveBeenCalled();
            }, 125);
        });

        it('multiple selected with existing', () => {
            let evt = {};
            _.set(evt, 'params.data.id', '32');
            selectPicker.value = ['4']
            selectPicker.multiple = true;
            selectPicker.onSelect(evt);
            expect(selectPicker.value.length).toBe(0);
            _.delay(() => {
                expect(selectPicker.value.length).toBe(2);
                expect(selectPicker.element.dispatchEvent).toHaveBeenCalled();
            }, 125);
        });
    });

    describe('onUnselecting', () => {
        let selectPicker;

        beforeEach(() => {
            let elm = {
                dispatchEvent: jest.fn()
            }
            selectPicker = new Select2Picker(elm);
        });

        it('single removed', () => {
            let evt = {};
            _.defer = jest.fn().mockImplementation(f => f());
            _.set(evt, 'params.args.data', '32');
            selectPicker.value = '32';
            selectPicker.valueType = 'String';
            selectPicker.onUnselecting(evt);
            expect(selectPicker.value).toBe('');
            _.delay(() => {
                expect(selectPicker.value).toBe('');
                expect(selectPicker.element.dispatchEvent).toHaveBeenCalled();
            }, 125);
        });

        it('single removed as numeric', () => {
            let evt = {};
            _.set(evt, 'params.args.data', 64);
            selectPicker.value = 64;
            selectPicker.valueType = 'Number';
            selectPicker.onUnselecting(evt);
            expect(selectPicker.value).toBe(64);
            _.delay(() => {
                expect(selectPicker.value).toBe(-1);
                expect(selectPicker.element.dispatchEvent).toHaveBeenCalled();
            }, 125);
        });

        it('multiple removed one from list', () => {
            let evt = {};
            _.set(evt, 'params.args.data', '32');
            selectPicker.multiple = true;
            selectPicker.value = ['2', '32', '64'];
            selectPicker.onUnselecting(evt);
            expect(selectPicker.value.length).toBe(0);
            _.delay(() => {
               expect(selectPicker.value.length).toBe(2);
               expect(selectPicker.element.dispatchEvent).toHaveBeenCalled();
            }, 125);
        });

        it('multiple removed last from list', () => {
            let evt = {};
            _.set(evt, 'params.args.data', '32');
            selectPicker.multiple = true;
            selectPicker.value = ['32'];
            selectPicker.onUnselecting(evt);
            expect(selectPicker.value.length).toBe(0);
            _.delay(() => {
                expect(selectPicker.value.length).toBe(0);
                expect(selectPicker.element.dispatchEvent).toHaveBeenCalled();
            }, 125);

        });
    });


});
