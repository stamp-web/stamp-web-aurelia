/**
 Copyright 2015 Jason Drake

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
import {StringUtil} from 'util/object-utilities';

describe('StringUtil test suite', () => {

    describe('pluralize tests', () => {
        it('pluralize country for multiple countries', () => {
            let str = StringUtil.pluralize("country", 2);
            expect(str).toBe('countries');
        });

        it('pluralize country for single country', () => {
            let str = StringUtil.pluralize("country", 1);
            expect(str).toBe('country');
        });

        it('pluralize album', () => {
            let str = StringUtil.pluralize("album", 2);
            expect(str).toBe('albums');
        });
    });
});
