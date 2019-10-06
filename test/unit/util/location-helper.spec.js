/**
 Copyright 2019 Jason Drake

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
import {EnumeratedTypeHelper, ConditionHelper, StampHelper, Condition, Defects} from 'util/common-models';
import _ from 'lodash';
import {LocationHelper} from "../../../src/util/location-helper";

describe('LocationHelper test suite', () => {

    describe('resolvePath tests', () => {

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
});
