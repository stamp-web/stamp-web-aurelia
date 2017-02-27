
let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

class AbstractEditor {

    constructor(driver) {
        this.driver = driver;
    }

    cancel( ) {
        this.driver.findElement({css: '.editor-cancel'}).click();
        return this.driver.sleep(125);
    }

    save( ) {
        this.driver.findElement({css: '.editor-save'}).click();
        return this.driver.sleep(125);
    }

    waitFor( ) {
        return this.driver.wait(until.elementLocated({id: 'editor-name'}))
       // return this.driver.wait(until.elementLocated({css: '.modal-title'}));
    }

    hidden() {
        let d = webdriver.promise.defer();
        try {
            this.driver.wait(until.elementIsNotVisible({css: 'editor-dialog'}))
                .then(() => {
                    d.resolve();
                }).catch(() => {
                d.resolve();
            });
        } catch( e ) {
            d.resolve();
        }

        return d;
    }

    setName(name) {
        this.driver.findElement({id: 'editor-name'}).clear();
        return this.driver.findElement({id: 'editor-name'}).sendKeys(name);
    }

    setDescription(desc) {
        this.driver.findElement({css: '#editor-desc'}).clear();
        return this.driver.findElement({css: '#editor-desc'}).sendKeys(desc);
    }

    getEditor() {
        return this.driver.findElement({css: 'editor-dialog'});
    }
}

module.exports = AbstractEditor;
