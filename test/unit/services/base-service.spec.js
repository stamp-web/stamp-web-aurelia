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
import {createSpyObj} from 'jest-createspyobj';
import {BaseService} from 'services/base-service';

describe('BaseService service test suite', () => {

    let http = createSpyObj('http', ['configure']);

    describe('_augmentModel', () => {
        let svc;
        beforeEach(() => {
            svc = new BaseService(http, {});
        });

        it('correctly added null or empty properties missing', () => {
            let newModel = {
                id: 56
            }
            let m = {
                id: 56,
                condition: 2,
                purchased: '2022-01-12'
            };
            svc._augmentModel(newModel, m);
            expect(newModel.purchased).toBeNull();
            expect(newModel.condition).toBe(0);
        });

        it('correctly adds missing arrays', () => {
            let newModel = {
                id: 56
            }
            let m = {
                id: 56,
                catalogueNumbers: [{
                    id: 47
                }]
            };
            svc._augmentModel(newModel, m);
            expect(newModel.catalogueNumbers.length).toBe(0);
        });

        it('correctly adds missing objects', () => {
            let newModel = {
                id: 56
            }
            let m = {
                id: 56,
                activeCatalogueNumber: {
                    id: 43
                }
            };
            svc._augmentModel(newModel, m);
            expect(newModel.activeCatalogueNumber).toStrictEqual({});
        });

        it('adds missing values in child objects', () => {
            let newModel = {
                id: 56,
                stampOwnerships: [{
                    id: 43
                }]
            }
            let m = {
                id: 56,
                stampOwnerships: [{
                    id: 43,
                    pricePaid: '2021-12-31',
                    condition: 2
                }]
            };
            svc._augmentModel(newModel, m);
            expect(newModel.stampOwnerships.length).toBe(1);
            expect(newModel.stampOwnerships[0].id).toBe(43);
            expect(newModel.stampOwnerships[0].condition).toBe(0);
            expect(newModel.stampOwnerships[0].pricePaid).toBe(null);
        });

    });
});
