'use strict';

let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let AbstractEditor = require('./abstract-editor');

class CountryEditor extends AbstractEditor {

    constructor(driver) {
        super(driver);
        this.driver = driver;
    }



}

module.exports = CountryEditor;
