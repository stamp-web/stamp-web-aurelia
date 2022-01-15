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
import {OwnershipCert} from 'resources/elements/ownerships/ownership-cert';
import {createSpyObj} from 'jest-createspyobj';

describe('OwnershipCert test suite', () => {

    let ownershipCert;
    let bindingEngineSpy = createSpyObj('bindingEngine', ['propertyObserver']);
    let i18nSpy = createSpyObj('i18n', ['tr']);
    let bootstrapSpy = createSpyObj('Bootstrap', ['Tooltip']);

    beforeEach(() => {
        ownershipCert = new OwnershipCert(null, i18nSpy, bindingEngineSpy);
        window.Bootstrap = bootstrapSpy;
    });

    describe('detach', () => {

        beforeEach(() => {
            ownershipCert._modelSubscribers = [];
        })

        it('verify subscribers cleared on detach', () => {
            let count = 0;
            ownershipCert._modelSubscribers.push({
               dispose: () => {
                   count++;
               }
           });
            ownershipCert.detach();
           expect(ownershipCert._modelSubscribers.length).toBe(0);
           expect(count).toBe(1);

        });
    });

    describe('modelChanged', () => {

        beforeEach(() => {
            ownershipCert.model = {};
            ownershipCert._modelSubscribers = [];
            bindingEngineSpy.propertyObserver.mockReturnValue({
                subscribe: (v) => {}
            });
            jest.spyOn(ownershipCert, '_dispose');
        })

        it('verify empty model', () => {
            ownershipCert.model = undefined;
            ownershipCert.modelChanged();
            expect(ownershipCert._dispose).toHaveBeenCalled();
            expect(ownershipCert.iconCls).toBe('');
            expect(ownershipCert._modelSubscribers.length).toBe(0);
        });

        it('verify model sets up listeners', () => {
            ownershipCert.model = {
                cert: true
            };
            ownershipCert.modelChanged();
            expect(ownershipCert._dispose).toHaveBeenCalled();
            expect(ownershipCert._modelSubscribers.length).toBe(1);
            expect(ownershipCert.iconCls).toBe('sw-icon-ribbon');

        });
    });

    describe('_calculateCert', () => {

        beforeEach(() => {
            ownershipCert.model = {};
            bootstrapSpy.Tooltip.mockReset();
        });

        it('no certs', () => {
            ownershipCert._calculateCert();
            expect(ownershipCert.hasCert).toBe(false);
            expect(ownershipCert.iconCls).toEqual('');
            expect(window.Bootstrap.Tooltip).not.toHaveBeenCalled();
        });

        it('has cert', () => {
            ownershipCert.model.cert = true;
            ownershipCert._calculateCert();
            expect(ownershipCert.hasCert).toBe(true);
            expect(ownershipCert.iconCls).toEqual('sw-icon-ribbon');
            expect(window.Bootstrap.Tooltip).toHaveBeenCalled();
        });

    });

    describe('_createTooltip', () => {

        beforeEach(() => {
            bootstrapSpy.Tooltip.mockReset();
        });

        it('disposing existing tooltips', () => {
            ownershipCert.hasCert = false;
            ownershipCert.tooltip = {
                dispose: jest.fn()
            };
            ownershipCert._createTooltip();
            expect(ownershipCert.tooltip.dispose).toHaveBeenCalled();
        });

    });
});
