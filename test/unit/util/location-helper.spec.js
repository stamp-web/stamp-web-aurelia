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
import {LocationHelper} from "../../../src/util/location-helper";

describe('LocationHelper test suite', () => {

    describe('resolvePath', () => {

        it('use default for empty', () => {
            let v = LocationHelper.resolvePath(undefined, 'default');
            expect(v).toBe('default/');
            v = LocationHelper.resolvePath(null, 'default');
            expect(v).toBe('default/');
            v = LocationHelper.resolvePath('', 'default');
            expect(v).toBe('default/');
        });

        it('use path over', () => {
            let v = LocationHelper.resolvePath({value: 'some/path/'}, 'default');
            expect(v).toBe('some/path/');
        });

        it('ensure / added', () => {
            let v = LocationHelper.resolvePath({value: 'https://site.com/some/path'}, 'default');
            expect(v).toBe('https://site.com/some/path/');
        });
    });

    describe('getQueryParameter', () => {

        afterEach(() => {
           jest.resetAllMocks();
        });

        let mockLocation = loc => {
            const location = new URL(loc);
            location.assign = jest.fn();
            location.replace = jest.fn();
            location.reload = jest.fn();

            delete window.location;
            window.location = location;
        };

        it('verify extraction of $filter parameter with $filter in parameter value', () => {
            mockLocation('http://localhost:9000/#/?$filter=(countryName%20eq%20%27$filter%27)&$orderby=number%20asc&$top=1000');
            let q = LocationHelper.getQueryParameter('$filter');
            expect(q).toBe('(countryName eq \'$filter\')');
        });

        it('no parameter in location', () => {
            mockLocation('http://localhost:9000/#/?$orderby=number%20asc&$top=1000');
            let q = LocationHelper.getQueryParameter('$filter');
            expect(q).toBeNull();
        });

        it('no parameter in location with a default', () => {
            mockLocation('http://localhost:9000/#/?$orderby=number%20asc&$top=1000');
            let q = LocationHelper.getQueryParameter('$filter', 'someDefault');
            expect(q).toBe('someDefault');
        });
    });
});
