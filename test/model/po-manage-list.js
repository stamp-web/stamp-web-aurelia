'use strict';

let _ = require('lodash');
let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

class ManageList {

    constructor(driver, entityType) {
        this.driver = driver;
        this.entityType = entityType;
        this.goto(entityType);
    }

    _getNameElements() {
        return this.getTable().findElements({css: 'tr td:first-child'});
    }

    contains(name) {
        let d = webdriver.promise.defer();
        let content = this._getNameElements().then(cells => {
            let result = { value: false };
            cells.map(elm => {
                return elm.getAttribute('textContent').then(text => {
                    if (text === name) {
                        result.value = true;
                    }
                    return result;
                });
            });
            return result;
        }).then(res => {
            d.fulfill(res.value);
        });
        return d.promise;
    }

    findRow(name) {
        let d = webdriver.promise.defer();
        let content = this._getNameElements().then(cells => {
            let result = { idx: -1 };
            cells.map((elm,idx) => {
                return elm.getAttribute('textContent').then(text => {
                    if (text === name) {
                        result.idx = idx;
                    }
                    return result;
                });
            });
            return result;
        }).then(res => {
            d.fulfill(res.idx);
        });
        return d.promise;
    }

    goto(entityType) {
        let d = webdriver.promise.defer();
        let li = this.driver.findElement({css: 'ul.entity-type li.select-' + entityType});
        li.getAttribute('class').then(classes => {
            this.setContext(entityType);
            if (classes.indexOf(' selected ') >= 0) {
                d.fulfill();
            } else {
                li.click();
                this.driver.sleep(125);
                this.driver.wait(until.elementIsVisible(this.getTable()), 250);
                d.fulfill();
            }
        });
        return d.promise;
    }

    setContext(entityType) {
        this.entityType = entityType;
    }

    filter(text) {
        return this.getList().findElement({css: '#filter-text'}).sendKeys(text);
    }

    edit(row) {
        return this.getTable().findElement({css: 'tr:nth-child(' + (row) +') button.edit-action'}).click();
    }

    delete(row, confirm = 'cancel') {
        this.getList().findElement({css: '.manage-list-contents table tr:nth-child(' + (row) +') button.delete-action'}).click();
        let dialog = this.driver.findElement({css: '.bootbox-confirm'});
        this.driver.wait(until.elementIsVisible(dialog), 500);
        let handler = confirm ? 'confirm' : 'cancel';
        dialog.findElement({css: 'button[data-bb-handler="' + handler + '"]'}).click();
        this.driver.wait(until.elementIsNotVisible(dialog), 500);
        this.driver.sleep(125);
        return  this.driver.wait(until.elementIsVisible(this.getTable()), 250);
    }

    getTable() {
        return this.getList().findElement({css: '.manage-list-contents table'});
    }

    getList() {
        return this.driver.findElement(By.className('list-' + this.entityType));
    }

    create(eType) {
        return this.driver.wait(until.elementLocated({css: '.select-' + eType})).findElement({css: '.sw-icon-plus'}).click();
    }
}

module.exports = ManageList;
