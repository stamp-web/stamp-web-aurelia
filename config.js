System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "es7.decorators",
      "es7.classProperties",
      "runtime"
    ]
  },
  paths: {
    "*": "dist/*",
    "resources/*.css": "resources/*.css",
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  bundles: {
    "stampweb-libs": [
      "github:blueimp/JavaScript-Load-Image@1.14.0",
      "github:blueimp/JavaScript-Load-Image@1.14.0/js/load-image",
      "github:components/jquery@2.1.4",
      "github:components/jquery@2.1.4/jquery",
      "github:i18next/i18next@1.11.2",
      "github:i18next/i18next@1.11.2/i18next",
      "github:jspm/nodelibs-process@0.1.2",
      "github:jspm/nodelibs-process@0.1.2/index",
      "github:moment/moment@2.10.3",
      "github:moment/moment@2.10.3/moment",
      "github:polymer/mutationobservers@0.4.2",
      "github:polymer/mutationobservers@0.4.2/MutationObserver",
      "github:rstacruz/nprogress@0.1.6",
      "github:rstacruz/nprogress@0.1.6/nprogress",
      "github:rstacruz/nprogress@0.1.6/nprogress.css!github:systemjs/plugin-css@0.1.20",
      "github:systemjs/plugin-css@0.1.20",
      "github:systemjs/plugin-css@0.1.20/css",
      "github:twbs/bootstrap@3.3.6",
      "github:twbs/bootstrap@3.3.6/js/bootstrap",
      "npm:aurelia-animator-css@1.0.0-beta.1.0.2",
      "npm:aurelia-animator-css@1.0.0-beta.1.0.2/aurelia-animator-css",
      "npm:aurelia-binding@1.0.0-beta.1.0.3",
      "npm:aurelia-binding@1.0.0-beta.1.0.3/aurelia-binding",
      "npm:aurelia-bootstrapper@1.0.0-beta.1",
      "npm:aurelia-bootstrapper@1.0.0-beta.1/aurelia-bootstrapper",
      "npm:aurelia-dependency-injection@1.0.0-beta.1",
      "npm:aurelia-dependency-injection@1.0.0-beta.1/aurelia-dependency-injection",
      "npm:aurelia-dialog@0.5.1",
      "npm:aurelia-dialog@0.5.1/ai-dialog",
      "npm:aurelia-dialog@0.5.1/ai-dialog-body",
      "npm:aurelia-dialog@0.5.1/ai-dialog-body.html!npm:system-text@0.1.0",
      "npm:aurelia-dialog@0.5.1/ai-dialog-footer",
      "npm:aurelia-dialog@0.5.1/ai-dialog-footer.html!npm:system-text@0.1.0",
      "npm:aurelia-dialog@0.5.1/ai-dialog-header",
      "npm:aurelia-dialog@0.5.1/ai-dialog-header.html!npm:system-text@0.1.0",
      "npm:aurelia-dialog@0.5.1/ai-dialog.html!npm:system-text@0.1.0",
      "npm:aurelia-dialog@0.5.1/attach-focus",
      "npm:aurelia-dialog@0.5.1/dialog-controller",
      "npm:aurelia-dialog@0.5.1/dialog-renderer",
      "npm:aurelia-dialog@0.5.1/dialog-service",
      "npm:aurelia-dialog@0.5.1/index",
      "npm:aurelia-dialog@0.5.1/lifecycle",
      "npm:aurelia-event-aggregator@1.0.0-beta.1",
      "npm:aurelia-event-aggregator@1.0.0-beta.1/aurelia-event-aggregator",
      "npm:aurelia-framework@1.0.0-beta.1.0.6",
      "npm:aurelia-framework@1.0.0-beta.1.0.6/aurelia-framework",
      "npm:aurelia-history-browser@1.0.0-beta.1.0.1",
      "npm:aurelia-history-browser@1.0.0-beta.1.0.1/aurelia-history-browser",
      "npm:aurelia-history@1.0.0-beta.1",
      "npm:aurelia-history@1.0.0-beta.1/aurelia-history",
      "npm:aurelia-http-client@1.0.0-beta.1",
      "npm:aurelia-http-client@1.0.0-beta.1/aurelia-http-client",
      "npm:aurelia-i18n@0.4.4",
      "npm:aurelia-i18n@0.4.4/aurelia-i18n",
      "npm:aurelia-i18n@0.4.4/base-i18n",
      "npm:aurelia-i18n@0.4.4/defaultTranslations/relative.time",
      "npm:aurelia-i18n@0.4.4/df",
      "npm:aurelia-i18n@0.4.4/i18n",
      "npm:aurelia-i18n@0.4.4/nf",
      "npm:aurelia-i18n@0.4.4/relativeTime",
      "npm:aurelia-i18n@0.4.4/rt",
      "npm:aurelia-i18n@0.4.4/t",
      "npm:aurelia-i18n@0.4.4/utils",
      "npm:aurelia-loader-default@1.0.0-beta.1.0.1",
      "npm:aurelia-loader-default@1.0.0-beta.1.0.1/aurelia-loader-default",
      "npm:aurelia-loader@1.0.0-beta.1",
      "npm:aurelia-loader@1.0.0-beta.1/aurelia-loader",
      "npm:aurelia-logging-console@1.0.0-beta.1",
      "npm:aurelia-logging-console@1.0.0-beta.1/aurelia-logging-console",
      "npm:aurelia-logging@1.0.0-beta.1",
      "npm:aurelia-logging@1.0.0-beta.1/aurelia-logging",
      "npm:aurelia-metadata@1.0.0-beta.1",
      "npm:aurelia-metadata@1.0.0-beta.1/aurelia-metadata",
      "npm:aurelia-pal-browser@1.0.0-beta.1.0.1",
      "npm:aurelia-pal-browser@1.0.0-beta.1.0.1/aurelia-pal-browser",
      "npm:aurelia-pal@1.0.0-beta.1.0.1",
      "npm:aurelia-pal@1.0.0-beta.1.0.1/aurelia-pal",
      "npm:aurelia-path@1.0.0-beta.1",
      "npm:aurelia-path@1.0.0-beta.1/aurelia-path",
      "npm:aurelia-route-recognizer@1.0.0-beta.1",
      "npm:aurelia-route-recognizer@1.0.0-beta.1/aurelia-route-recognizer",
      "npm:aurelia-router@1.0.0-beta.1",
      "npm:aurelia-router@1.0.0-beta.1/aurelia-router",
      "npm:aurelia-task-queue@1.0.0-beta.1.0.1",
      "npm:aurelia-task-queue@1.0.0-beta.1.0.1/aurelia-task-queue",
      "npm:aurelia-templating-binding@1.0.0-beta.1.0.2",
      "npm:aurelia-templating-binding@1.0.0-beta.1.0.2/aurelia-templating-binding",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/analyze-view-factory",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/array-repeat-strategy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/aurelia-templating-resources",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/binding-mode-behaviors",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/binding-signaler",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/compile-spy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/compose",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/css-resource",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/debounce-binding-behavior",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/dynamic-element",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/focus",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/html-sanitizer",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/if",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/map-repeat-strategy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/null-repeat-strategy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/number-repeat-strategy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/repeat",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/repeat-strategy-locator",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/repeat-utilities",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/replaceable",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/sanitize-html",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/show",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/signal-binding-behavior",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/throttle-binding-behavior",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/update-trigger-binding-behavior",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/view-spy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.3/with",
      "npm:aurelia-templating-router@1.0.0-beta.1.0.4",
      "npm:aurelia-templating-router@1.0.0-beta.1.0.4/aurelia-templating-router",
      "npm:aurelia-templating-router@1.0.0-beta.1.0.4/route-href",
      "npm:aurelia-templating-router@1.0.0-beta.1.0.4/route-loader",
      "npm:aurelia-templating-router@1.0.0-beta.1.0.4/router-view",
      "npm:aurelia-templating@1.0.0-beta.1.0.2",
      "npm:aurelia-templating@1.0.0-beta.1.0.2/aurelia-templating",
      "npm:aurelia-validation@0.6.0",
      "npm:aurelia-validation@0.6.0/debouncer",
      "npm:aurelia-validation@0.6.0/decorators",
      "npm:aurelia-validation@0.6.0/index",
      "npm:aurelia-validation@0.6.0/path-observer",
      "npm:aurelia-validation@0.6.0/strategies/twbootstrap-view-strategy",
      "npm:aurelia-validation@0.6.0/utilities",
      "npm:aurelia-validation@0.6.0/validate-custom-attribute",
      "npm:aurelia-validation@0.6.0/validation",
      "npm:aurelia-validation@0.6.0/validation-config",
      "npm:aurelia-validation@0.6.0/validation-group",
      "npm:aurelia-validation@0.6.0/validation-group-builder",
      "npm:aurelia-validation@0.6.0/validation-locale",
      "npm:aurelia-validation@0.6.0/validation-property",
      "npm:aurelia-validation@0.6.0/validation-result",
      "npm:aurelia-validation@0.6.0/validation-rules",
      "npm:aurelia-validation@0.6.0/validation-rules-collection",
      "npm:aurelia-validation@0.6.0/validation-view-strategy",
      "npm:bootbox@4.4.0",
      "npm:bootbox@4.4.0/bootbox",
      "npm:core-js@1.2.6",
      "npm:core-js@1.2.6/client/shim.min",
      "npm:lodash@3.10.1",
      "npm:lodash@3.10.1/index",
      "npm:process@0.11.2",
      "npm:process@0.11.2/browser",
      "npm:system-text@0.1.0",
      "npm:system-text@0.1.0/text"
    ],
    "stampweb-common": [
      "components/editor-dialog",
      "components/editor-dialog.html!npm:system-text@0.1.0",
      "components/loading-indicator",
      "components/nav/nav-bar",
      "components/nav/nav-bar.html!npm:system-text@0.1.0",
      "events/event-managed",
      "global-resources/default-value",
      "global-resources/index",
      "npm:odata-filter-parser@0.2.8",
      "npm:odata-filter-parser@0.2.8/dist/odata-parser",
      "npm:odata-filter-parser@0.2.8/index",
      "resources/styles/components/loading-indicator.css!github:systemjs/plugin-css@0.1.20",
      "resources/styles/components/nav/nav-bar.css!github:systemjs/plugin-css@0.1.20",
      "services/albums",
      "services/base-service",
      "services/catalogueNumbers",
      "services/catalogues",
      "services/countries",
      "services/entity-managed",
      "services/preferences",
      "services/sellers",
      "services/session-context",
      "services/stampCollections",
      "services/stamps",
      "util/common-models",
      "util/find-target",
      "util/location-helper",
      "util/object-utilities",
      "value-converters/as-currency",
      "value-converters/as-currency-formatted",
      "value-converters/as-enum",
      "value-converters/as-number",
      "value-converters/as-percentage",
      "value-converters/bitwise-to-array",
      "value-converters/by-name",
      "value-converters/date-formatter",
      "value-converters/empty-text",
      "value-converters/filter-by-name",
      "value-converters/rate-filter",
      "value-converters/stamp-count",
      "value-converters/zero-based"
    ],
    "stampweb-list": [
      "components/catalogue-numbers/cn-details",
      "components/catalogue-numbers/cn-details.html!npm:system-text@0.1.0",
      "components/catalogue-numbers/cn-references",
      "components/catalogue-numbers/cn-references.html!npm:system-text@0.1.0",
      "components/ownerships/ownership-editor",
      "components/ownerships/ownership-editor.html!npm:system-text@0.1.0",
      "components/search/search-form",
      "components/search/search-form.html!npm:system-text@0.1.0",
      "components/stamp-card",
      "components/stamp-card.html!npm:system-text@0.1.0",
      "components/stamp-grid",
      "components/stamp-grid.html!npm:system-text@0.1.0",
      "components/stamps/stamp-details",
      "components/stamps/stamp-details.html!npm:system-text@0.1.0",
      "components/stamps/stamp-editor",
      "components/stamps/stamp-editor.html!npm:system-text@0.1.0",
      "components/stamps/stamp-table",
      "components/stamps/stamp-table.html!npm:system-text@0.1.0",
      "resources/styles/components/catalogue-numbers/cn-references.css!github:systemjs/plugin-css@0.1.20",
      "resources/styles/components/ownerships/ownership-editor.css!github:systemjs/plugin-css@0.1.20",
      "resources/styles/components/stamp-grid.css!github:systemjs/plugin-css@0.1.20",
      "resources/styles/components/stamps/stamp-table.css!github:systemjs/plugin-css@0.1.20",
      "resources/styles/views/stamps/stamp-list.css!github:systemjs/plugin-css@0.1.20",
      "views/stamps/purchase-form",
      "views/stamps/purchase-form.html!npm:system-text@0.1.0",
      "views/stamps/stamp-list",
      "views/stamps/stamp-list.html!npm:system-text@0.1.0"
    ],
    "stampweb-settings": [
      "resources/styles/views/preferences/user-settings.css!github:systemjs/plugin-css@0.1.20",
      "views/preferences/user-settings",
      "views/preferences/user-settings.html!npm:system-text@0.1.0"
    ],
    "stampweb-widgets": [
      "github:components/jqueryui@1.11.4/ui/core",
      "github:components/jqueryui@1.11.4/ui/datepicker",
      "github:select2/select2@4.0.0",
      "github:select2/select2@4.0.0/css/select2.css!github:systemjs/plugin-css@0.1.20",
      "github:select2/select2@4.0.0/js/select2",
      "resources/styles/widgets/select-picker/select-picker.css!github:systemjs/plugin-css@0.1.20",
      "widgets/collapse-panel/collapse-panel",
      "widgets/collapse-panel/collapse-panel.html!npm:system-text@0.1.0",
      "widgets/date-picker/jq-date-picker",
      "widgets/date-picker/jq-date-picker.html!npm:system-text@0.1.0",
      "widgets/image-preview/image-preview",
      "widgets/image-preview/image-preview.html!npm:system-text@0.1.0",
      "widgets/paging/paging-toolbar",
      "widgets/paging/paging-toolbar.html!npm:system-text@0.1.0",
      "widgets/select-picker/select-picker",
      "widgets/select-picker/select-picker.html!npm:system-text@0.1.0"
    ],
    "stampweb-manage": [
      "resources/styles/views/manage/manage.css!github:systemjs/plugin-css@0.1.20",
      "views/albums/album-editor",
      "views/albums/album-editor.html!npm:system-text@0.1.0",
      "views/catalogues/catalogue-editor",
      "views/catalogues/catalogue-editor.html!npm:system-text@0.1.0",
      "views/countries/country-editor",
      "views/countries/country-editor.html!npm:system-text@0.1.0",
      "views/manage/list",
      "views/manage/list.html!npm:system-text@0.1.0",
      "views/manage/manage-list",
      "views/manage/manage-list.html!npm:system-text@0.1.0",
      "views/sellers/seller-editor",
      "views/sellers/seller-editor.html!npm:system-text@0.1.0",
      "views/stamp-collections/stamp-collection-editor",
      "views/stamp-collections/stamp-collection-editor.html!npm:system-text@0.1.0"
    ]
  },

  map: {
    "aurelia-animator-css": "npm:aurelia-animator-css@1.0.0-beta.1.0.2",
    "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.0.3",
    "aurelia-bootstrapper": "npm:aurelia-bootstrapper@1.0.0-beta.1",
    "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1",
    "aurelia-dialog": "npm:aurelia-dialog@0.5.1",
    "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-beta.1",
    "aurelia-framework": "npm:aurelia-framework@1.0.0-beta.1.0.6",
    "aurelia-history": "npm:aurelia-history@1.0.0-beta.1",
    "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0-beta.1.0.1",
    "aurelia-http-client": "npm:aurelia-http-client@1.0.0-beta.1",
    "aurelia-i18n": "npm:aurelia-i18n@0.4.4",
    "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1",
    "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0-beta.1.0.1",
    "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
    "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0-beta.1",
    "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
    "aurelia-path": "npm:aurelia-path@1.0.0-beta.1",
    "aurelia-route-recognizer": "npm:aurelia-route-recognizer@1.0.0-beta.1",
    "aurelia-router": "npm:aurelia-router@1.0.0-beta.1",
    "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.0.1",
    "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.2",
    "aurelia-templating-binding": "npm:aurelia-templating-binding@1.0.0-beta.1.0.2",
    "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0-beta.1.0.3",
    "aurelia-templating-router": "npm:aurelia-templating-router@1.0.0-beta.1.0.4",
    "aurelia-validation": "npm:aurelia-validation@0.6.0",
    "babel": "npm:babel-core@5.8.34",
    "babel-runtime": "npm:babel-runtime@5.8.34",
    "blueimp/JavaScript-Load-Image": "github:blueimp/JavaScript-Load-Image@1.14.0",
    "bootbox": "npm:bootbox@4.4.0",
    "bootstrap": "github:twbs/bootstrap@3.3.6",
    "clean-css": "npm:clean-css@3.4.8",
    "components/jquery": "github:components/jquery@2.1.4",
    "core-js": "npm:core-js@1.2.6",
    "css": "github:systemjs/plugin-css@0.1.20",
    "jquery": "github:components/jquery@2.1.4",
    "jquery-ui": "github:components/jqueryui@1.11.4",
    "less": "github:aaike/jspm-less-plugin@0.0.5",
    "lodash": "npm:lodash@3.10.1",
    "moment": "github:moment/moment@2.10.3",
    "nprogress": "github:rstacruz/nprogress@0.1.6",
    "odata-filter-parser": "npm:odata-filter-parser@0.2.8",
    "polymer/mutationobservers": "github:polymer/mutationobservers@0.4.2",
    "select2/select2": "github:select2/select2@4.0.0",
    "text": "npm:system-text@0.1.0",
    "github:aaike/jspm-less-plugin@0.0.5": {
      "less.js": "github:distros/less@2.4.0"
    },
    "github:components/jqueryui@1.11.4": {
      "jquery": "github:components/jquery@2.1.4"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.5.5"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-https@0.1.0": {
      "https-browserify": "npm:https-browserify@0.0.0"
    },
    "github:jspm/nodelibs-os@0.1.0": {
      "os-browserify": "npm:os-browserify@0.1.2"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:rstacruz/nprogress@0.1.6": {
      "css": "github:systemjs/plugin-css@0.1.20"
    },
    "github:twbs/bootstrap@3.3.6": {
      "jquery": "github:components/jquery@2.1.4"
    },
    "npm:amdefine@1.0.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:aurelia-animator-css@1.0.0-beta.1.0.2": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.2"
    },
    "npm:aurelia-binding@1.0.0-beta.1.0.3": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.0.1",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-bootstrapper@1.0.0-beta.1": {
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-beta.1",
      "aurelia-framework": "npm:aurelia-framework@1.0.0-beta.1.0.6",
      "aurelia-history": "npm:aurelia-history@1.0.0-beta.1",
      "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0-beta.1.0.1",
      "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0-beta.1.0.1",
      "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1",
      "aurelia-pal-browser": "npm:aurelia-pal-browser@1.0.0-beta.1.0.1",
      "aurelia-router": "npm:aurelia-router@1.0.0-beta.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.2",
      "aurelia-templating-binding": "npm:aurelia-templating-binding@1.0.0-beta.1.0.2",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0-beta.1.0.3",
      "aurelia-templating-router": "npm:aurelia-templating-router@1.0.0-beta.1.0.4",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-dependency-injection@1.0.0-beta.1": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-dialog@0.5.1": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1",
      "aurelia-framework": "npm:aurelia-framework@1.0.0-beta.1.0.6",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.2",
      "text": "github:systemjs/plugin-text@0.0.2"
    },
    "npm:aurelia-event-aggregator@1.0.0-beta.1": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1"
    },
    "npm:aurelia-framework@1.0.0-beta.1.0.6": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.0.3",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.2",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-history-browser@1.0.0-beta.1.0.1": {
      "aurelia-history": "npm:aurelia-history@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-http-client@1.0.0-beta.1": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-i18n@0.4.4": {
      "Intl.js": "github:andyearnshaw/Intl.js@0.1.4",
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.0.3",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-beta.1",
      "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0-beta.1.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.2",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0-beta.1.0.3",
      "i18next": "github:i18next/i18next@1.11.2"
    },
    "npm:aurelia-loader-default@1.0.0-beta.1.0.1": {
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1"
    },
    "npm:aurelia-loader@1.0.0-beta.1": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1"
    },
    "npm:aurelia-logging-console@1.0.0-beta.1": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1"
    },
    "npm:aurelia-metadata@1.0.0-beta.1": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-pal-browser@1.0.0-beta.1.0.1": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1"
    },
    "npm:aurelia-route-recognizer@1.0.0-beta.1": {
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-router@1.0.0-beta.1": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-beta.1",
      "aurelia-history": "npm:aurelia-history@1.0.0-beta.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1",
      "aurelia-route-recognizer": "npm:aurelia-route-recognizer@1.0.0-beta.1",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-task-queue@1.0.0-beta.1.0.1": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1"
    },
    "npm:aurelia-templating-binding@1.0.0-beta.1.0.2": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.0.3",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.2"
    },
    "npm:aurelia-templating-resources@1.0.0-beta.1.0.3": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.0.3",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.2",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-templating-router@1.0.0-beta.1.0.4": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1",
      "aurelia-router": "npm:aurelia-router@1.0.0-beta.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.2"
    },
    "npm:aurelia-templating@1.0.0-beta.1.0.2": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.0.3",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.0.1",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-validation@0.6.0": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.0.3",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.2"
    },
    "npm:babel-runtime@5.8.34": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:bootbox@4.4.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@3.5.5": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:clean-css@3.4.8": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "commander": "npm:commander@2.8.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "os": "github:jspm/nodelibs-os@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "source-map": "npm:source-map@0.4.4",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:commander@2.8.1": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "graceful-readlink": "npm:graceful-readlink@1.0.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-js@1.2.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:core-util-is@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:graceful-readlink@1.0.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "npm:https-browserify@0.0.0": {
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:lodash@3.10.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:readable-stream@1.1.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:source-map@0.4.4": {
      "amdefine": "npm:amdefine@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.13"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
