System.config({
  "transpiler": "traceur",
  "paths": {
    "*": "*.js",
    "src/*": "src/*.js",
    "resources/*.css": "resources/*.css",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js",
    "navigation/*": "dist/*.js"
  }
});

System.config({
  "map": {
    "aurelia-binding": "github:aurelia/binding@0.8.2",
    "aurelia-bootstrapper": "github:aurelia/bootstrapper@0.14.0",
    "aurelia-bs-modal": "github:pwkad/aurelia-bs-modal@master",
    "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.0",
    "aurelia-framework": "github:aurelia/framework@0.13.3",
    "aurelia-http-client": "github:aurelia/http-client@0.10.0",
    "aurelia-i18next": "github:zewa666/aurelia-i18next@master",
    "aurelia-loader-default": "github:aurelia/loader-default@0.9.0",
    "aurelia-router": "github:aurelia/router@0.10.2",
    "aurelia-validation": "github:aurelia/validation@0.2.7",
    "bootbox": "npm:bootbox@4.4.0",
    "bootstrap": "github:twbs/bootstrap@3.3.5",
    "components/jquery": "github:components/jquery@2.1.4",
    "core-js": "npm:core-js@0.9.18",
    "css": "github:systemjs/plugin-css@0.1.13",
    "eonasdan/bootstrap-datetimepicker": "github:eonasdan/bootstrap-datetimepicker@4.14.30",
    "eternicode/bootstrap-datepicker": "github:eternicode/bootstrap-datepicker@1.4.0",
    "font-awesome": "npm:font-awesome@4.3.0",
    "jquery": "github:components/jquery@2.1.4",
    "less": "github:aaike/jspm-less-plugin@0.0.5",
    "lodash": "npm:lodash@3.10.0",
    "moment": "github:moment/moment@2.10.3",
    "nprogress": "github:rstacruz/nprogress@0.1.6",
    "polymer/mutationobservers": "github:polymer/mutationobservers@0.4.2",
    "thomaspark/bootswatch": "github:thomaspark/bootswatch@3.3.5",
    "traceur": "github:jmcriffey/bower-traceur@0.0.88",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.88",
    "github:aaike/jspm-less-plugin@0.0.5": {
      "less.js": "github:distros/less@2.4.0"
    },
    "github:aurelia/binding@0.8.2": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.0",
      "aurelia-metadata": "github:aurelia/metadata@0.7.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.6.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/bootstrapper@0.14.0": {
      "aurelia-event-aggregator": "github:aurelia/event-aggregator@0.6.1",
      "aurelia-framework": "github:aurelia/framework@0.13.3",
      "aurelia-history": "github:aurelia/history@0.6.0",
      "aurelia-history-browser": "github:aurelia/history-browser@0.6.1",
      "aurelia-loader-default": "github:aurelia/loader-default@0.9.0",
      "aurelia-logging-console": "github:aurelia/logging-console@0.6.0",
      "aurelia-router": "github:aurelia/router@0.10.2",
      "aurelia-templating": "github:aurelia/templating@0.13.3",
      "aurelia-templating-binding": "github:aurelia/templating-binding@0.13.1",
      "aurelia-templating-resources": "github:aurelia/templating-resources@0.13.1",
      "aurelia-templating-router": "github:aurelia/templating-router@0.14.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/dependency-injection@0.9.0": {
      "aurelia-logging": "github:aurelia/logging@0.6.1",
      "aurelia-metadata": "github:aurelia/metadata@0.7.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/event-aggregator@0.6.1": {
      "aurelia-logging": "github:aurelia/logging@0.6.1"
    },
    "github:aurelia/framework@0.13.3": {
      "aurelia-binding": "github:aurelia/binding@0.8.2",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.0",
      "aurelia-loader": "github:aurelia/loader@0.8.1",
      "aurelia-logging": "github:aurelia/logging@0.6.1",
      "aurelia-metadata": "github:aurelia/metadata@0.7.0",
      "aurelia-path": "github:aurelia/path@0.8.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.6.0",
      "aurelia-templating": "github:aurelia/templating@0.13.3",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/history-browser@0.6.1": {
      "aurelia-history": "github:aurelia/history@0.6.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/http-client@0.10.0": {
      "aurelia-path": "github:aurelia/path@0.8.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/loader-default@0.9.0": {
      "aurelia-loader": "github:aurelia/loader@0.8.1",
      "aurelia-metadata": "github:aurelia/metadata@0.7.0"
    },
    "github:aurelia/loader@0.8.1": {
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.2.0",
      "aurelia-path": "github:aurelia/path@0.8.0",
      "core-js": "npm:core-js@0.9.18",
      "webcomponentsjs": "github:webcomponents/webcomponentsjs@0.6.3"
    },
    "github:aurelia/metadata@0.7.0": {
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/route-recognizer@0.6.0": {
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/router@0.10.2": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.0",
      "aurelia-event-aggregator": "github:aurelia/event-aggregator@0.6.1",
      "aurelia-history": "github:aurelia/history@0.6.0",
      "aurelia-logging": "github:aurelia/logging@0.6.1",
      "aurelia-path": "github:aurelia/path@0.8.0",
      "aurelia-route-recognizer": "github:aurelia/route-recognizer@0.6.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/templating-binding@0.13.1": {
      "aurelia-binding": "github:aurelia/binding@0.8.2",
      "aurelia-logging": "github:aurelia/logging@0.6.1",
      "aurelia-templating": "github:aurelia/templating@0.13.3"
    },
    "github:aurelia/templating-resources@0.13.1": {
      "aurelia-binding": "github:aurelia/binding@0.8.2",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.0",
      "aurelia-logging": "github:aurelia/logging@0.6.1",
      "aurelia-task-queue": "github:aurelia/task-queue@0.6.0",
      "aurelia-templating": "github:aurelia/templating@0.13.3",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/templating-router@0.14.0": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.0",
      "aurelia-metadata": "github:aurelia/metadata@0.7.0",
      "aurelia-path": "github:aurelia/path@0.8.0",
      "aurelia-router": "github:aurelia/router@0.10.2",
      "aurelia-templating": "github:aurelia/templating@0.13.3"
    },
    "github:aurelia/templating@0.13.3": {
      "aurelia-binding": "github:aurelia/binding@0.8.2",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.0",
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.2.0",
      "aurelia-loader": "github:aurelia/loader@0.8.1",
      "aurelia-logging": "github:aurelia/logging@0.6.1",
      "aurelia-metadata": "github:aurelia/metadata@0.7.0",
      "aurelia-path": "github:aurelia/path@0.8.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.6.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/validation@0.2.7": {
      "aurelia-binding": "github:aurelia/binding@0.8.2",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.0",
      "aurelia-templating": "github:aurelia/templating@0.13.3"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:pwkad/aurelia-bs-modal@master": {
      "aurelia-bs-modal": "github:pwkad/aurelia-bs-modal@master",
      "babel": "npm:babel-core@5.5.6",
      "jquery": "github:components/jquery@2.1.4"
    },
    "github:rstacruz/nprogress@0.1.6": {
      "css": "github:systemjs/plugin-css@0.1.13"
    },
    "github:twbs/bootstrap@3.3.5": {
      "jquery": "github:components/jquery@2.1.4"
    },
    "github:zewa666/aurelia-i18next@master": {
      "Intl.js": "github:andyearnshaw/Intl.js@0.1.4",
      "aurelia-event-aggregator": "github:aurelia/event-aggregator@0.6.1",
      "i18next": "github:i18next/i18next@1.10.2"
    },
    "npm:bootbox@4.4.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.9.18": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:font-awesome@4.3.0": {
      "css": "github:systemjs/plugin-css@0.1.13"
    },
    "npm:lodash@3.10.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

