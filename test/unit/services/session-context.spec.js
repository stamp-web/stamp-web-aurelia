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
import {SessionContext} from '../../../src/services/session-context';

describe('SessionContext test suite', () => {
    let obj;

    beforeEach( () => {
        obj = {
            fn: () => { }
        };
        spyOn(obj, 'fn');
    });

    it('add a callback and verify proper removal', () => {
        SessionContext.addContextListener("event-1", obj.fn);
        SessionContext.removeContextListener("event-1",obj.fn);
        SessionContext.publish("event-1");
        expect( obj.fn.calls.any()).toEqual(false);
    });

    it('add a callback and verify proper publish', () => {
        SessionContext.addContextListener("event-2", obj.fn);
        SessionContext.publish("event-2");
        expect( obj.fn.calls.count()).toEqual(1);
    });

    it('remove a callback that is not mapped', () => {
        SessionContext.removeContextListener("event-3",obj.fn);
        SessionContext.publish("event-3");
        expect( obj.fn.calls.any()).toEqual(false);
    });

});
