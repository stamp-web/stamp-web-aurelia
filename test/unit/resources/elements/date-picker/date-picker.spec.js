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
import {DatePicker} from 'resources/elements/date-picker/date-picker';
import {createSpyObj} from 'jest-createspyobj';
import {KeyCodes} from 'events/key-codes';

import moment from 'moment';

describe('DatePicker test suite', () => {

    describe('attached', () => {
        let datePicker;

        beforeEach(() => {
            datePicker = new DatePicker(null);
            datePicker._initDatePicker = jest.fn();
        });

        it('verify it', () => {
            datePicker.attached();
            expect(datePicker._initDatePicker).toHaveBeenCalled();
        });
    });

    describe('getInputSelector', () => {
        let datePicker;

        beforeEach(() => {
            datePicker = new DatePicker(null);
        });

        it('verify it', () => {
            let selector = datePicker.getInputSelector();
            expect(selector).toBeDefined();
            expect(selector).toBe('.date-picker-wrapper > input');
        });
    });

    describe('valueChanged', () => {
        let datePicker;

        beforeEach(() => {
            datePicker = new DatePicker(null);
            datePicker._setValueInPicker = jest.fn();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('no changes', () => {
            datePicker.valueChanged(undefined, undefined);
            expect(datePicker._setValueInPicker).not.toHaveBeenCalled();
            let date = new Date();
            datePicker.valueChanged(date, date);
            expect(datePicker._setValueInPicker).not.toHaveBeenCalled();
        });

        it('initial new date', () => {
            let date = new Date();
            datePicker.value = date;
            datePicker.displayValue = undefined;
            datePicker.valueChanged(date, undefined);
            expect(datePicker._setValueInPicker).toHaveBeenCalled();
            expect(datePicker.displayValue).toBeDefined();
        });

        it('different dates', () => {
            let date = new Date();
            let oldDate = moment('2008-04-19').toDate();
            datePicker.value = date;
            datePicker.displayValue = undefined;
            datePicker.valueChanged(date, oldDate);
            expect(datePicker._setValueInPicker).toHaveBeenCalled();
            let output = moment(date).format('YYYY-MM-DD');
            expect(datePicker.displayValue).toBeDefined();
            expect(datePicker.displayValue).toBe(output);
        });
    });

    describe('handleKeyUp', () => {

        let datePicker;

        beforeEach(() => {
            datePicker = new DatePicker(null);
            datePicker.change = jest.fn();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('change not called for other keys', () => {
            let evt = {
                keyCode: KeyCodes.VK_SHIFT
            };
             expect(datePicker.handleKeyUp(evt)).toBe(true);
             expect(datePicker.change).not.toHaveBeenCalled();
        });

        it('change called for ENTER', () => {
            let evt = {
                keyCode: KeyCodes.VK_ENTER
            };
            expect(datePicker.handleKeyUp(evt)).toBe(true);
            expect(datePicker.change).toHaveBeenCalled();
        });

        it('change sets date picker when valid formatted date', () => {
            let evt = {
                keyCode: KeyCodes.VK_0
            };
            datePicker.displayValue = '2011-05-20';
            datePicker.datePicker = {
                setDate: jest.fn()
            };
            let d = moment(datePicker.displayValue).toDate();
            expect(datePicker.handleKeyUp(evt)).toBe(true);
            expect(datePicker.datePicker.setDate).toHaveBeenCalledWith(d, true, 'Y-m-d');
        });
    });

    describe('change', () => {

        let datePicker;

        beforeEach(() => {
            datePicker = new DatePicker(null);
            datePicker.datePicker = jest.fn();
            datePicker.datePicker.close = jest.fn();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('sets date when changed', () => {
            let evt = {
                stopPropagation: jest.fn()
            };
            datePicker.displayValue = '2011-07-11';
            datePicker.datePicker.selectedDates = [new Date()];
            datePicker.datePicker.setDate = jest.fn();

            datePicker.change(evt);
            expect(datePicker.datePicker.setDate).toHaveBeenCalledWith(moment(datePicker.displayValue).toDate(), true, 'Y-m-d');
            expect(datePicker.datePicker.close).toHaveBeenCalled();
            expect(evt.stopPropagation).toHaveBeenCalled();
        });

        it('handle invalid value', () => {
            let evt = {
                stopPropagation: jest.fn()
            };
            datePicker.displayValue = 'this is not a date';
            datePicker.datePicker = undefined;

            datePicker.change(evt);
            expect(datePicker.displayValue).toBe('');
            expect(evt.stopPropagation).toHaveBeenCalled();
        });
    });

    describe('_initDatePicker', () => {
        let datePicker;

        beforeEach(() => {
            datePicker = new DatePicker(null);
            datePicker._getDatePicker = jest.fn();
        });

        it('initialize with default value', () => {
            datePicker.value = new Date();
            let _setDateMock = jest.fn();
            datePicker._getDatePicker.mockReturnValue({
                setDate: _setDateMock
            });

            datePicker._initDatePicker();
            expect(datePicker._getDatePicker).toHaveBeenCalled();
            expect(_setDateMock).toHaveBeenCalledWith(datePicker.value, true, 'Y-m-d');
        });
    });

    describe('_dateChanged', () => {
        let datePicker;

        beforeEach(() => {
            datePicker = new DatePicker(null);
        });

        it('nothing selected', () => {
            datePicker.value = undefined;
            datePicker._dateChanged(undefined);
            expect(datePicker.value).toBeUndefined();
            datePicker._dateChanged([]);
            expect(datePicker.value).toBeUndefined();
        });

        it('selected with date', () => {
            datePicker.value = undefined;
            let d = new Date();
            datePicker._dateChanged([d, moment('2011-09-11').toDate()]);
            expect(datePicker.value).toBe(d);
        });
    });

    describe('clear', () => {
        let datePicker;

        beforeEach(() => {
            datePicker = new DatePicker(null);
            datePicker.datePicker = jest.fn();
            datePicker.datePicker.close = jest.fn();
            datePicker.datePicker.clear = jest.fn();
        });

        it('all elements modified', () => {
            datePicker.value = new Date();
            datePicker.displayValue = '2022-01-15';

            let evt = {
                stopPropagation: jest.fn()
            };

            datePicker.clear(evt);
            expect(datePicker.value).toBeUndefined();
            expect(datePicker.displayValue).toBe('');
            expect(evt.stopPropagation).toHaveBeenCalled();
            expect(datePicker.datePicker.close).toHaveBeenCalled();
            expect(datePicker.datePicker.clear).toHaveBeenCalled();
        });
    });

});
