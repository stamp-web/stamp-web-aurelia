let expect = require('expect.js'),
    colors = require('colors'),
    webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    Window = webdriver.Window,
    until = webdriver.until;


let ManageList = require('../model/po-manage-list');
let CountryEditor = require('../model/po-country-editor');
let AlbumEditor = require('../model/po-album-editor');
let TestUtil = require('../model/test-util');

let driver;

before(done => {
    driver = TestUtil.buildChromeDriver(webdriver);

    driver.get('http://localhost:9000/#/manage/countries').then(() => {
        driver.wait(until.elementLocated( By.className('manage-list-contents'))).then(() => {
            done();
        });
    });

});

after(done => {
   driver.quit().then(done);
});

describe('management tests', () => {

    describe('country tests', () => {

        /**
         * Country management Scenario
         * ----------------------------
         *
         * Will perform the following operations
         *
         * Navigate to country list
         * Create a new country
         *    Provide name
         *    Provider description
         *    Click save
         * Filter table for country name (partial)
         * Find the row with the matching country name
         *    Click row delete (cancel)
         *    Click row edit
         *    Provide a new name
         *    Provide a new description
         *    Click save
         * Find the row with the new country name
         *    Click row delete (confirm)
         * Verify country is not in list
         */
        it('country managerment scenario', done => {
            let name = TestUtil.generateName('create');

            let list = new ManageList(driver, 'countryRef');
            list.goto('countryRef');
            list.create('countryRef');
            let editor = new CountryEditor(driver);
            editor.waitFor();
            editor.setName(name);
            editor.setDescription('some description');
            editor.save();
            list.filter('create');
            list.findRow(name).then(row => {
                list.delete(row, false);
                list.edit(row);
                editor.waitFor();
                let newName = name + '-mod';
                editor.setName(newName);
                editor.setDescription('a new description');
                editor.save();
                list.findRow(newName).then(newRow => {
                    list.delete(newRow, true);
                    list.contains(newName).then(c => {
                        expect(c.value).to.not.be.ok();
                        done();
                    });
                });
            });
        });
    });

    describe('album tests', () => {

        it('album management scenario', done => {
            let list = new ManageList(driver, 'countryRef');
            list.goto('albumRef').then(() => {
                let name = TestUtil.generateName('create');
                list.create('albumRef');
                let editor = new AlbumEditor(driver);
                editor.waitFor();
                editor.setName(name);
                editor.setDescription('some description');
                editor.save()
                    .then(() => {
                        done();
                    });

            });
        });
    });
});
