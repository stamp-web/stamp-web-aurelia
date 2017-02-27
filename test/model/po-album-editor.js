'use strict';

let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let AbstractEditor = require('./abstract-editor');

class AlbumEditor extends AbstractEditor {

    constructor(driver) {
        super(driver);
        this.driver = driver;
    }


    setCollection(name) {
        // editor-stampCollection
    }
}

module.exports = AlbumEditor;
