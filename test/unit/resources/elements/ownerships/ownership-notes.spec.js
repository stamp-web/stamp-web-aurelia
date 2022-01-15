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
import {OwnershipNotes} from 'resources/elements/ownerships/ownership-notes';
import {createSpyObj} from 'jest-createspyobj';

describe('OwnershipNotes test suite', () => {

    let ownershipNotes;
    let bindingEngineSpy = createSpyObj('bindingEngine', ['propertyObserver']);
    let i18nSpy = createSpyObj('i18n', ['tr']);
    let bootstrapSpy = createSpyObj('Bootstrap', ['Tooltip']);

    beforeEach(() => {
        ownershipNotes = new OwnershipNotes(null, i18nSpy, bindingEngineSpy);
        window.Bootstrap = bootstrapSpy;
    });

    describe('detach', () => {

        beforeEach(() => {
            ownershipNotes.model = {};
            ownershipNotes._modelSubscribers = [];
        })

        it('verify subscribers cleared on detach', () => {
            let count = 0;
           ownershipNotes._modelSubscribers.push({
               dispose: () => {
                   count++;
               }
           });
           ownershipNotes.detach();
           expect(ownershipNotes._modelSubscribers.length).toBe(0);
           expect(count).toBe(1);

        });
    });

    describe('modelChanged', () => {

        beforeEach(() => {
            ownershipNotes.model = {};
            ownershipNotes._modelSubscribers = [];
            bindingEngineSpy.propertyObserver.mockReturnValue({
                subscribe: (v) => {}
            });
            jest.spyOn(ownershipNotes, '_dispose');
        })

        it('verify empty model', () => {
            ownershipNotes.model = undefined;
            ownershipNotes.modelChanged();
            expect(ownershipNotes._dispose).toHaveBeenCalled();
            expect(ownershipNotes.iconCls).toBe('');
            expect(ownershipNotes._modelSubscribers.length).toBe(0);
        });

        it('verify model sets up listeners', () => {
            ownershipNotes.model = {
                notes: 'some notes',
                defects: 0,
                deception: 0
            };
            ownershipNotes.modelChanged();
            expect(ownershipNotes._dispose).toHaveBeenCalled();
            expect(ownershipNotes._modelSubscribers.length).toBe(3);
            expect(ownershipNotes.iconCls).toBe('sw-icon-info');

        });
    });

    describe('_calculateNotes', () => {

        beforeEach(() => {
            bootstrapSpy.Tooltip.mockReset();
            ownershipNotes.model = {};
        });

        it('no notes', () => {
            ownershipNotes._calculateNotes();
            expect(ownershipNotes.hasNotes).toBe(false);
            expect(ownershipNotes.hasDeception).toBe(false);
            expect(ownershipNotes.hasDefects).toBe(false);
            expect(ownershipNotes.iconCls).toEqual('');
            expect(window.Bootstrap.Tooltip).not.toHaveBeenCalled();
        });

        it('has notes', () => {
            ownershipNotes.model.notes = 'this is a test note';
            ownershipNotes._calculateNotes();
            expect(ownershipNotes.hasNotes).toBe(true);
            expect(ownershipNotes.hasDeception).toBe(false);
            expect(ownershipNotes.hasDefects).toBe(false);
            expect(ownershipNotes.iconCls).toEqual('sw-icon-info');
            expect(window.Bootstrap.Tooltip).toHaveBeenCalled();
        });

        it('has notes and defect', () => {
            ownershipNotes.model.notes = 'this is a test note';
            ownershipNotes.model.defects = 2;
            ownershipNotes._calculateNotes();
            expect(ownershipNotes.hasNotes).toBe(true);
            expect(ownershipNotes.hasDeception).toBe(false);
            expect(ownershipNotes.hasDefects).toBe(true);
            expect(ownershipNotes.iconCls).toEqual('sw-icon-defect');
            expect(window.Bootstrap.Tooltip).toHaveBeenCalled();
        });

        it('has notes deception and defect', () => {
            ownershipNotes.model.notes = 'this is a test note';
            ownershipNotes.model.defects = 2;
            ownershipNotes.model.deception = 2;
            ownershipNotes._calculateNotes();
            expect(ownershipNotes.hasNotes).toBe(true);
            expect(ownershipNotes.hasDeception).toBe(true);
            expect(ownershipNotes.hasDefects).toBe(true);
            expect(ownershipNotes.iconCls).toEqual('sw-icon-deception');
            expect(window.Bootstrap.Tooltip).toHaveBeenCalled();
        });

        it('has notes and deception', () => {
            ownershipNotes.model.notes = 'this is a test note';
            ownershipNotes.model.deception = 2;
            ownershipNotes._calculateNotes();
            expect(ownershipNotes.hasNotes).toBe(true);
            expect(ownershipNotes.hasDeception).toBe(true);
            expect(ownershipNotes.hasDefects).toBe(false);
            expect(ownershipNotes.iconCls).toEqual('sw-icon-deception');
            expect(window.Bootstrap.Tooltip).toHaveBeenCalled();
        });

        it('deception and defect', () => {
            ownershipNotes.model.defects = 2;
            ownershipNotes.model.deception = 2;
            ownershipNotes._calculateNotes();
            expect(ownershipNotes.hasNotes).toBe(false);
            expect(ownershipNotes.hasDeception).toBe(true);
            expect(ownershipNotes.hasDefects).toBe(true);
            expect(ownershipNotes.iconCls).toEqual('sw-icon-deception');
            expect(window.Bootstrap.Tooltip).toHaveBeenCalled();
        });
    });

    describe('_createTooltip', () => {

        beforeEach(() => {
            bootstrapSpy.Tooltip.mockReset();
        });

        it('disposing existing tooltips', () => {
            let oldDispose = jest.fn();
            ownershipNotes.tooltip = {
                dispose: oldDispose
            };
            ownershipNotes.iconCls = 'sw-icon-deception';
            ownershipNotes.hasNotes = true;
            ownershipNotes.model = {
                notes: 'message'
            };
            ownershipNotes._createTooltip();
            expect(oldDispose).toHaveBeenCalled();
        });

    });
});
