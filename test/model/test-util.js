let temp = require("temp").track();
let fs = require('fs');

class TestUtil {

    static generateName(prefix = 'test') {
        return prefix + '-' + (new Date()).getTime();
    }

    static buildChromeDriver(webdriver) {
        var chromeCapabilities = webdriver.Capabilities.chrome();
        var chromeOptions = {
            'args': ['--test-type', '--start-maximized']
        };
        chromeCapabilities.set('chromeOptions', chromeOptions);

        let driver =  new webdriver.Builder()
            .forBrowser('chrome')
            .withCapabilities(chromeCapabilities)
            .build();

        process.on('uncaughtException', err => {
            console.log('Uncaught exception from selenium...', err);
            if( driver ) {
                driver.takeScreenshot().then(img => {
                    var tempName = temp.path({suffix: '.png'});
                    fs.writeFileSync(tempName, new Buffer(img, 'Base64'));
                });
            }
        });
        return driver;
    }
}

module.exports = TestUtil;
