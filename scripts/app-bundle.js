define('app',['exports', 'aurelia-framework', 'aurelia-i18n', 'aurelia-router', 'bootstrap'], function (exports, _aureliaFramework, _aureliaI18n, _aureliaRouter) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.App = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var logger = _aureliaFramework.LogManager.getLogger('stamp-web');

    var App = exports.App = function () {
        App.inject = function inject() {
            return [_aureliaRouter.Router, _aureliaI18n.I18N];
        };

        function App(router, i18n) {
            _classCallCheck(this, App);

            this.i18n = i18n;
        }

        App.prototype.configureRouter = function configureRouter(config, router) {
            config.title = 'Stamp Web Editor';
            config.map([{
                route: ['', 'stamp-list'],
                name: 'stamp-list',
                moduleId: './resources/views/stamps/stamp-list',
                nav: true,
                title: this.i18n.tr('nav.stamps')
            }, { route: 'manage', moduleId: './resources/views/manage/manage-list', nav: true, title: this.i18n.tr('nav.manage') }, { route: 'settings', moduleId: './resources/views/preferences/user-settings', nav: false, title: this.i18n.tr('nav.settings-short') }]);
            this.router = router;
        };

        App.prototype.activate = function activate() {
            logger.info("Application is activated");
        };

        return App;
    }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', 'aurelia-framework', './environment', 'i18next-xhr-backend'], function (exports, _aureliaFramework, _environment, _i18nextXhrBackend) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.configure = configure;

    var _environment2 = _interopRequireDefault(_environment);

    var _i18nextXhrBackend2 = _interopRequireDefault(_i18nextXhrBackend);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var logger = _aureliaFramework.LogManager.getLogger('stamp-web');

    if (window.location.href.indexOf('debug=true') >= 0) {
        _aureliaFramework.LogManager.setLevel(_aureliaFramework.LogManager.logLevel.debug);
    }

    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });

    function setRoot(aurelia) {
        logger.info('bootstrapped:' + aurelia.setupAureliaFinished + ", localization:" + aurelia.setupI18NFinished);
        if (aurelia.setupAureliaFinished && aurelia.setupI18NFinished) {
            aurelia.setRoot('app');
        }
    }

    function configure(aurelia) {
        aurelia.setupAureliaFinished = false;
        aurelia.setupI18NFinished = false;

        aurelia.use.standardConfiguration().feature('resources').plugin('aurelia-dialog', function (config) {
            config.useDefaults();
            config.settings.lock = true;
            config.settings.centerHorizontalOnly = false;
            config.settings.startingZIndex = 1000;
        }).plugin('aurelia-validation').plugin('aurelia-validatejs').feature('bootstrap-validation').plugin('aurelia-i18n', function (instance) {
            instance.i18next.use(_i18nextXhrBackend2.default);

            instance.setup({
                backend: {
                    loadPath: 'resources/locales/{{lng}}/{{ns}}.json' },
                lng: 'en',
                attributes: ['t', 'i18n'],
                fallbackLng: 'en',
                ns: ['stamp-web'],
                fallbackNS: ['stamp-web'],
                defaultNS: 'stamp-web',
                debug: false }).then(function () {
                aurelia.setupI18NFinished = true;
                setRoot(aurelia);
            });
        });
        if (_environment2.default.debug) {
            aurelia.use.developmentLogging();
        }

        if (_environment2.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }

        aurelia.start().then(function () {
            aurelia.setupAureliaFinished = true;
            setRoot(aurelia);
        });
    }
});
define('bootstrap-validation/bootstrap-form-validation-renderer',['exports', 'aurelia-dependency-injection', 'aurelia-validation'], function (exports, _aureliaDependencyInjection, _aureliaValidation) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.BootstrapFormValidationRenderer = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var BootstrapFormValidationRenderer = exports.BootstrapFormValidationRenderer = (_dec = (0, _aureliaDependencyInjection.inject)(Element), (0, _aureliaValidation.validationRenderer)(_class = _dec(_class = function () {
        function BootstrapFormValidationRenderer(boundaryElement) {
            _classCallCheck(this, BootstrapFormValidationRenderer);

            this.boundaryElement = boundaryElement;
        }

        BootstrapFormValidationRenderer.prototype.render = function render(error, target) {
            if (!target || !(this.boundaryElement === target || this.boundaryElement.contains(target))) {
                return;
            }

            target.errors = target.errors || new Map();
            target.errors.set(error);

            var formGroup = target.querySelector('.form-group') || target.closest('.form-group');
            formGroup.classList.add('has-error');

            var message = document.createElement('span');
            message.classList.add('help-block');
            message.classList.add('validation-error');
            message.textContent = error.message;
            message.error = error;
            formGroup.appendChild(message);
        };

        BootstrapFormValidationRenderer.prototype.unrender = function unrender(error, target) {
            if (!target || !target.errors || !target.errors.has(error)) {
                return;
            }
            target.errors.delete(error);

            var formGroup = target.querySelector('.form-group') || target.closest('.form-group');
            formGroup.classList.remove('has-error');

            var messages = formGroup.querySelectorAll('.validation-error');
            var i = messages.length;
            while (i--) {
                var message = messages[i];
                if (message.error !== error) {
                    continue;
                }
                message.error = null;
                message.remove();
            }
        };

        return BootstrapFormValidationRenderer;
    }()) || _class) || _class);

    (function (ELEMENT) {
        ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;

        ELEMENT.closest = ELEMENT.closest || function closest(selector) {
            var element = this;

            while (element) {
                if (element.matches(selector)) {
                    break;
                }

                element = element.parentElement;
            }

            return element;
        };
    })(Element.prototype);
});
define('bootstrap-validation/index',['exports', './bootstrap-form-validation-renderer'], function (exports, _bootstrapFormValidationRenderer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {
    config.container.registerHandler('bootstrap-form', function (container) {
      return container.get(_bootstrapFormValidationRenderer.BootstrapFormValidationRenderer);
    });
  }
});
define('events/event-managed',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.KeyCodes = exports.StorageKeys = exports.EventNames = exports.EventManaged = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var EventManaged = exports.EventManaged = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function EventManaged(eventBus) {
            _classCallCheck(this, EventManaged);

            this._subscribers = [];

            this.eventBus = eventBus;
        }

        EventManaged.prototype.subscribe = function subscribe(key, func) {
            if (!this._subscribers[key]) {
                this._subscribers[key] = [];
            }
            this._subscribers[key].push(this.eventBus.subscribe(key, func));
        };

        EventManaged.prototype.detached = function detached() {
            var self = this;
            var channel = Object.keys(self._subscribers);
            channel.forEach(function (key) {
                self.unsubscribe(key);
            });
        };

        EventManaged.prototype.unsubscribe = function unsubscribe(channel) {
            this._subscribers[channel].forEach(function (sub) {
                sub.dispose();
            });
        };

        return EventManaged;
    }()) || _class);
    var EventNames = exports.EventNames = {
        calculateImagePath: 'calculate-image-path',
        changeEditMode: 'change-edit-mode',
        checkExists: 'check-exists',
        collapsePanel: 'collapse-panel',
        conflictExists: 'conflict-exists',
        convert: 'convert',
        countryDeleted: 'country-deleted',
        panelCollapsed: "panel-collapsed",
        close: "close-dialog",
        actionError: "action-error",
        keywordSearch: "keywordSearch",
        search: "search",
        showImage: "showImage",
        save: "save",
        edit: 'edit',

        editorCancel: 'editor-cancel',

        deleteSuccessful: "delete-completed",

        create: 'create',
        manageEntity: "manage-entity",
        entityDelete: "entity-delete",
        selectEntity: "select-entity",
        entityFilter: "entity-filter",
        loadingStarted: "loading-started",
        loadingFinished: "loading-finished",
        pageChanged: "page-changed",
        pageRefreshed: "page-refreshed",
        preferenceChanged: "preference-changed",
        saveSuccessful: "save-completed",
        updateFinished: "update-finished",
        stampCount: "stamp-count",
        stampCountForCollection: "stamp-count-for-collection",
        stampCreate: 'stamp-create',
        stampEdit: 'stamp-edit',
        stampEditorCancel: 'stamp-edit-cancel',
        stampRemove: 'stamp-remove',
        stampSaved: 'stamp-saved',
        toggleStampSelection: 'stamp-select'
    };

    var StorageKeys = exports.StorageKeys = {
        referenceCatalogueNumbers: "referenceCatalogueNumbers",
        manageEntities: "manage-entities"
    };

    var KeyCodes = exports.KeyCodes = {
        VK_TAB: 9,
        VK_ENTER: 13,
        VK_ESCAPE: 27,
        VK_SHIFT: 16
    };
});
define('resources/index',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.configure = configure;
    function configure(config) {
        config.globalResources(['./value-converters/default-value']);
    }
});
define('services/albums',["exports", "aurelia-framework", "aurelia-http-client", "./entity-managed", "aurelia-event-aggregator", "../events/event-managed"], function (exports, _aureliaFramework, _aureliaHttpClient, _entityManaged, _aureliaEventAggregator, _eventManaged) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Albums = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _dec, _class;

    var Albums = exports.Albums = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function (_EntityManaged) {
        _inherits(Albums, _EntityManaged);

        function Albums(http, eventBus) {
            _classCallCheck(this, Albums);

            var _this = _possibleConstructorReturn(this, _EntityManaged.call(this, http, eventBus));

            _this.eventBus.subscribe(_eventManaged.EventNames.countryDeleted, _this.handleCountryDelete.bind(_this));
            return _this;
        }

        Albums.prototype.getResourceName = function getResourceName() {
            return "albums";
        };

        Albums.prototype.handleCountryDelete = function handleCountryDelete(data) {
            if (this.loaded && this.models.length > 0) {
                delete this.models[0].stampCount;
            }
        };

        Albums.prototype.updateInternalCount = function updateInternalCount(data) {
            var stamp = data ? data.stamp : undefined;
            if (stamp && !stamp.wantList && stamp.stampOwnerships && stamp.stampOwnerships.length > 0 && this.loaded === true) {
                var owner = stamp.stampOwnerships[0];
                var album = this.getById(owner.albumRef);
                if (album) {
                    var delta = data.increment ? 1 : -1;
                    album.stampCount = album.stampCount + delta;
                    this.eventBus.publish(_eventManaged.EventNames.stampCountForCollection, { stampCollectionRef: album.stampCollectionRef, count: delta });
                }
            }
        };

        Albums.prototype.remove = function remove(model) {
            var _this2 = this;

            var q = new Promise(function (resolve, reject) {
                var count = model && model.stampCount > 0 ? -1 * model.stampCount : 0;
                var stampCollectionRef = model && model.stampCollectionRef ? model.stampCollectionRef : 0;
                _EntityManaged.prototype.remove.call(_this2, model).then(function (result) {
                    if (stampCollectionRef > 0) {
                        _this2.eventBus.publish(_eventManaged.EventNames.stampCountForCollection, { stampCollectionRef: stampCollectionRef, count: count });
                    }
                    resolve(result);
                }).catch(function (err) {
                    reject(err);
                });
            });
            return q;
        };

        return Albums;
    }(_entityManaged.EntityManaged)) || _class);
});
define('services/base-service',['exports', 'aurelia-framework', 'aurelia-http-client', 'aurelia-event-aggregator', '../util/object-utilities', '../events/event-managed', 'lodash'], function (exports, _aureliaFramework, _aureliaHttpClient, _aureliaEventAggregator, _objectUtilities, _eventManaged, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.BaseService = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _dec, _class;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var logger = _aureliaFramework.LogManager.getLogger('services');

    var ParameterHelper = function () {
        function ParameterHelper() {
            _classCallCheck(this, ParameterHelper);
        }

        ParameterHelper.prototype.toParameters = function toParameters(options) {
            var s = "";
            var keys = Object.keys(options);
            for (var k = 0; k < keys.length; k++) {
                if (s.length > 1) {
                    s += "&";
                }
                s += keys[k] + '=' + encodeURIComponent(options[keys[k]]);
            }
            return s;
        };

        return ParameterHelper;
    }();

    var BaseService = exports.BaseService = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function BaseService(http, eventBus) {
            _classCallCheck(this, BaseService);

            this.baseHref = "/stamp-webservices";
            this.parameters = {};
            this.models = [];
            this.total = 0;
            this.lastCache = {
                id: 0,
                model: null
            };
            this.loaded = false;
            this.selections = [];

            this.http = http;
            this.paramHelper = new ParameterHelper();
            this.eventBus = eventBus;
            this.http.configure(function (x) {
                x.withHeader('Accept', 'application/json');
                x.withHeader('Content-Type', 'application/json');
            });
        }

        BaseService.prototype.monitoredParams = function monitoredParams(params) {
            var p = {};
            var reservedKeys = ['$filter', '$top', '$orderby', '$skip'];
            if (params) {
                _lodash2.default.forEach(reservedKeys, function (key) {
                    if (key in params) {
                        p[key] = params[key];
                    }
                });
            }
            return p;
        };

        BaseService.prototype.useCachedResult = function useCachedResult(params) {
            var theParams = this.monitoredParams(params);
            var cacheAndNew = function cacheAndNew(newParams, currentParams) {
                return typeof newParams._dc === 'undefined' && typeof currentParams._dc !== 'undefined';
            };
            var sameCache = function sameCache(newParams, currentParams) {
                return newParams._dc === currentParams._dc;
            };
            if (this.models.length > 0 && _objectUtilities.ObjectUtilities.isEqual(theParams, this.parameters) && ((!this.parameters || Object.keys(this.parameters).length === 0) && params === undefined || this.parameters !== undefined && params !== undefined && (cacheAndNew(params, this.parameters) || sameCache(params, this.parameters)))) {
                return true;
            }
            return false;
        };

        BaseService.prototype.getDefaultSearchOptions = function getDefaultSearchOptions() {
            return {};
        };

        BaseService.prototype.getResourceName = function getResourceName() {
            throw new Error("Unimplemented resource name.");
        };

        BaseService.prototype.getCollectionName = function getCollectionName() {
            return this.getResourceName();
        };

        BaseService.prototype.getById = function getById(id) {
            if (!this.loaded) {
                throw new Error('Requires ' + this.getCollectionName() + ' to be loaded first.');
            }
            if (this.lastCache.id === +id) {
                return this.lastCache.model;
            }
            for (var i = 0, len = this.models.length; i < len; i++) {
                if (this.models[i].id === +id) {
                    this.lastCache.id = +id;
                    this.lastCache.model = this.models[i];
                    return this.lastCache.model;
                }
            }
            return null;
        };

        BaseService.prototype.count = function count(options) {
            var _this = this;

            var q = new Promise(function (resolve, reject) {
                var href = _this.baseHref + '/rest/' + _this.getResourceName() + '/!count?' + _this.paramHelper.toParameters(options);
                _this.http.get(href).then(function (response) {
                    var retModel = response.content;
                    resolve(+retModel.count);
                }).catch(function (reason) {
                    reject(reason);
                });
            });
            return q;
        };

        BaseService.prototype.remove = function remove(model) {
            var _this2 = this;

            var self = this;
            return new Promise(function (resolve, reject) {
                if (model.id <= 0) {
                    reject("Can not delete a non-persisted item from " + self.getCollectionName());
                    return;
                }
                var href = self.baseHref + '/rest/' + _this2.getResourceName() + "/" + model.id;
                self.http.delete(href).then(function (response) {
                    if (response.statusCode === 204) {
                        self.eventBus.publish(_eventManaged.EventNames.deleteSuccessful, { type: self.getCollectionName(), id: model.id });
                        resolve(true);
                    } else {
                        reject(response);
                    }
                }).catch(function (reason) {
                    reject(reason);
                });
            });
        };

        BaseService.prototype._postfind = function _postfind(models) {};

        BaseService.prototype.updateLocalEntry = function updateLocalEntry(model) {
            if (this.loaded && this.models.length > 0) {
                var m = _lodash2.default.findWhere(this.models, { id: model.id });
                if (m) {
                    _lodash2.default.merge(m, model);

                    this.eventBus.publish(_eventManaged.EventNames.updateFinished, { type: this.getCollectionName(), model: m });
                } else {
                    logger.debug("Could not locate id " + model.id + " in " + this.getCollectionName());
                }
            }
        };

        BaseService.prototype.find = function find(options) {
            var self = this;
            var q = new Promise(function (resolve, reject) {
                var opts = _lodash2.default.extend({}, self.getDefaultSearchOptions(), options);
                if (!self.loaded || !self.useCachedResult(opts)) {
                    logger.debug("[" + self.getCollectionName() + "] retrieving items");
                    self.eventBus.publish(_eventManaged.EventNames.loadingStarted);
                    var href = self.baseHref + '/rest/' + self.getResourceName();
                    if (opts) {
                        href += '?' + self.paramHelper.toParameters(opts);
                    }
                    self.http.get(href).then(function (response) {
                        self.loaded = true;
                        if (response.statusCode === 200 && response.response) {
                            var resp = response.content;
                            self.models = resp[self.getCollectionName()];
                            self._postfind(self.models);
                            self.total = resp.total;
                        }
                        self.eventBus.publish(_eventManaged.EventNames.loadingFinished);
                        self.parameters = opts;
                        resolve({ models: self.models, total: self.total });
                    }).catch(function (reason) {
                        self.eventBus.publish(_eventManaged.EventNames.loadingFinished);
                        reject(reason);
                    });
                } else {
                    logger.debug("[" + self.getCollectionName() + "] Using cached result with " + self.total + " items.");
                    resolve({ models: self.models, total: self.total });
                }
            });
            return q;
        };

        BaseService.prototype.select = function select(model) {
            model.selected = true;
        };

        BaseService.prototype.unselect = function unselect(model) {
            model.selected = false;
        };

        BaseService.prototype.selectAll = function selectAll() {
            _lodash2.default.each(this.models, function (model) {
                model.selected = true;
            });
        };

        BaseService.prototype.clearSelected = function clearSelected() {
            _lodash2.default.each(this.models, function (model) {
                model.selected = false;
            });
        };

        BaseService.prototype.isSelected = function isSelected(model) {
            return model.selected === true;
        };

        BaseService.prototype.getSelected = function getSelected() {
            var retVal = [];
            _lodash2.default.each(this.models, function (model) {
                if (model.selected) {
                    retVal.push(model);
                }
            });
            return retVal;
        };

        BaseService.prototype.save = function save(model) {
            var _this3 = this;

            var self = this;
            return new Promise(function (resolve, reject) {
                var href = _this3.baseHref + '/rest/' + self.getResourceName() + (model.id > 0 ? "/" + model.id : "");
                var body = JSON.stringify(model);
                _this3.http[model.id > 0 ? 'put' : 'post'](href, body).then(function (response) {
                    if ((response.statusCode === 200 || response.statusCode === 201) && response.response) {
                        var retModel = response.content;
                        var m = _lodash2.default.findWhere(self.models, { id: retModel.id });
                        if (m) {
                            _lodash2.default.merge(m, retModel);
                        } else {
                            m = retModel;
                            var index = 0;
                            for (index = 0; index < self.models.length; index++) {
                                if (m.name < self.models[index].name) {
                                    break;
                                }
                            }
                            index = Math.max(index, self.models.length - 1);
                            self.models.splice(index, 0, m);
                        }
                        self.eventBus.publish(_eventManaged.EventNames.saveSuccessful, { type: self.getCollectionName(), model: m });
                        resolve(m);
                    } else {
                        reject(response);
                    }
                }).catch(function (reason) {
                    reject(reason);
                });
            });
        };

        return BaseService;
    }()) || _class);
});
define('services/catalogueNumbers',["exports", "aurelia-framework", "aurelia-http-client", "./base-service", "aurelia-event-aggregator", "./stamps", "lodash"], function (exports, _aureliaFramework, _aureliaHttpClient, _baseService, _aureliaEventAggregator, _stamps, _lodash) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.CatalogueNumbers = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _dec, _class;

    var CatalogueNumbers = exports.CatalogueNumbers = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _aureliaEventAggregator.EventAggregator, _stamps.Stamps), _dec(_class = function (_BaseService) {
        _inherits(CatalogueNumbers, _BaseService);

        function CatalogueNumbers(http, eventBus, stampService) {
            _classCallCheck(this, CatalogueNumbers);

            var _this = _possibleConstructorReturn(this, _BaseService.call(this, http, eventBus));

            _this.stampService = stampService;
            return _this;
        }

        CatalogueNumbers.prototype.getResourceName = function getResourceName() {
            return "catalogueNumbers";
        };

        CatalogueNumbers.prototype.updateInternalCount = function updateInternalCount(data) {
            var stamp = data ? data.stamp : undefined;
            if (stamp && stamp.catalogueNumbers && this.loaded === true) {
                var index = _lodash2.default.findIndex(stamp.catalogueNumbers, { active: true });
                if (index >= 0) {
                    var cn = stamp.catalogueNumbers[index];
                    var c = this.getById(cn.catalogueRef);
                    if (c) {
                        c.stampCount = c.stampCount + (data.increment ? 1 : -1);
                    }
                }
            }
        };

        CatalogueNumbers.prototype.makeActive = function makeActive(id) {
            var _this2 = this;

            var self = this;
            var q = new Promise(function (resolve, reject) {
                var href = _this2.baseHref + '/rest/' + _this2.getResourceName() + '/' + id + '/makeActive';
                self.http.post(href).then(function (response) {
                    var stampModel = response.content;
                    self.stampService.updateLocalEntry(stampModel);
                    resolve(stampModel);
                }).catch(function (reason) {
                    reject(reason);
                });
            });
            return q;
        };

        return CatalogueNumbers;
    }(_baseService.BaseService)) || _class);
});
define('services/catalogues',["exports", "aurelia-framework", "aurelia-http-client", "./entity-managed", "aurelia-event-aggregator", "lodash"], function (exports, _aureliaFramework, _aureliaHttpClient, _entityManaged, _aureliaEventAggregator, _lodash) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Catalogues = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _dec, _class;

    var Catalogues = exports.Catalogues = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function (_EntityManaged) {
        _inherits(Catalogues, _EntityManaged);

        function Catalogues(http, eventBus) {
            _classCallCheck(this, Catalogues);

            return _possibleConstructorReturn(this, _EntityManaged.call(this, http, eventBus));
        }

        Catalogues.prototype.getDefaultSearchOptions = function getDefaultSearchOptions() {
            return {
                $orderby: 'issue desc'
            };
        };

        Catalogues.prototype.getResourceName = function getResourceName() {
            return "catalogues";
        };

        Catalogues.prototype._postfind = function _postfind(models) {
            _lodash2.default.each(models, function (catalogue) {
                catalogue.displayName = catalogue.issue + " - " + catalogue.name;
            });
        };

        return Catalogues;
    }(_entityManaged.EntityManaged)) || _class);
});
define('services/countries',["exports", "aurelia-framework", "aurelia-http-client", "./entity-managed", "../events/event-managed", "aurelia-event-aggregator"], function (exports, _aureliaFramework, _aureliaHttpClient, _entityManaged, _eventManaged, _aureliaEventAggregator) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Countries = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _dec, _class;

    var Countries = exports.Countries = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function (_EntityManaged) {
        _inherits(Countries, _EntityManaged);

        function Countries(http, eventBus) {
            _classCallCheck(this, Countries);

            return _possibleConstructorReturn(this, _EntityManaged.call(this, http, eventBus));
        }

        Countries.prototype.getResourceName = function getResourceName() {
            return "countries";
        };

        Countries.prototype.updateInternalCount = function updateInternalCount(data) {
            if (data && data.stamp && this.loaded === true) {
                var country = this.getById(data.stamp.countryRef);
                if (country) {
                    country.stampCount = country.stampCount + (data.increment ? 1 : -1);
                }
            }
        };

        Countries.prototype.remove = function remove(model) {
            var _this2 = this;

            var q = new Promise(function (resolve, reject) {
                var count = model && model.stampCount > 0 ? -1 * model.stampCount : 0;
                _EntityManaged.prototype.remove.call(_this2, model).then(function (result) {
                    _this2.eventBus.publish(_eventManaged.EventNames.countryDeleted, { id: model.id, count: count });
                    resolve(result);
                }).catch(function (err) {
                    reject(err);
                });
            });
            return q;
        };

        return Countries;
    }(_entityManaged.EntityManaged)) || _class);
});
define('services/entity-managed',["exports", "aurelia-framework", "aurelia-http-client", "./base-service", "aurelia-event-aggregator", "../events/event-managed"], function (exports, _aureliaFramework, _aureliaHttpClient, _baseService, _aureliaEventAggregator, _eventManaged) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.EntityManaged = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _dec, _class;

    var EntityManaged = exports.EntityManaged = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function (_BaseService) {
        _inherits(EntityManaged, _BaseService);

        function EntityManaged(http, eventBus) {
            _classCallCheck(this, EntityManaged);

            var _this = _possibleConstructorReturn(this, _BaseService.call(this, http, eventBus));

            if (_this.updateInternalCount) {
                _this.eventBus.subscribe(_eventManaged.EventNames.stampCount, _this.updateInternalCount.bind(_this));
            }
            return _this;
        }

        EntityManaged.prototype.getDefaultSearchOptions = function getDefaultSearchOptions() {
            return {
                $orderby: 'name asc'
            };
        };

        EntityManaged.prototype.countStamps = function countStamps() {
            var _this2 = this;

            var q = new Promise(function (resolve, reject) {
                var href = _this2.baseHref + '/rest/' + _this2.getResourceName() + '/!countStamps';
                _this2.http.get(href).then(function (response) {
                    var retModel = response.content;
                    resolve(retModel);
                }).catch(function (reason) {
                    reject(reason);
                });
            });
            return q;
        };

        return EntityManaged;
    }(_baseService.BaseService)) || _class);
});
define('services/preferences',["exports", "aurelia-framework", "aurelia-http-client", "./base-service", "aurelia-event-aggregator", "lodash"], function (exports, _aureliaFramework, _aureliaHttpClient, _baseService, _aureliaEventAggregator, _lodash) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Preferences = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _dec, _class;

    var Preferences = exports.Preferences = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function (_BaseService) {
        _inherits(Preferences, _BaseService);

        function Preferences(http, eventBus) {
            _classCallCheck(this, Preferences);

            return _possibleConstructorReturn(this, _BaseService.call(this, http, eventBus));
        }

        Preferences.prototype.getDefaultSearchOptions = function getDefaultSearchOptions() {
            return {
                $orderby: 'name asc'
            };
        };

        Preferences.prototype.getResourceName = function getResourceName() {
            return "preferences";
        };

        Preferences.prototype.getByNameAndCategory = function getByNameAndCategory(name, category) {
            if (!this.loaded) {
                throw new Error("Requires the service to be loaded first.");
            }
            var index = _lodash2.default.findIndex(this.models, { name: name, category: category });
            return index >= 0 ? this.models[index] : null;
        };

        return Preferences;
    }(_baseService.BaseService)) || _class);
});
define('services/sellers',["exports", "aurelia-framework", "aurelia-http-client", "./entity-managed", "aurelia-event-aggregator"], function (exports, _aureliaFramework, _aureliaHttpClient, _entityManaged, _aureliaEventAggregator) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Sellers = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _dec, _class;

    var Sellers = exports.Sellers = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function (_EntityManaged) {
        _inherits(Sellers, _EntityManaged);

        function Sellers(http, eventBus) {
            _classCallCheck(this, Sellers);

            return _possibleConstructorReturn(this, _EntityManaged.call(this, http, eventBus));
        }

        Sellers.prototype.getResourceName = function getResourceName() {
            return "sellers";
        };

        Sellers.prototype.updateInternalCount = function updateInternalCount(data) {
            var stamp = data ? data.stamp : undefined;
            if (stamp && !stamp.wantList && stamp.stampOwnerships && stamp.stampOwnerships.length > 0 && this.loaded === true) {
                var owner = stamp.stampOwnerships[0];
                var seller = this.getById(owner.sellerRef);
                if (seller) {
                    seller.stampCount = seller.stampCount + (data.increment ? 1 : -1);
                }
            }
        };

        return Sellers;
    }(_entityManaged.EntityManaged)) || _class);
});
define('services/session-context',['exports', 'lodash'], function (exports, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SessionContext = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var SessionContext = exports.SessionContext = function () {

        return {

            SEARCH_CHANGE: 'search-change',

            searchConditions: undefined,
            contextListeners: {},

            constructor: function constructor() {},


            addContextListener: function addContextListener(eventName, callback) {
                if (this.contextListeners[eventName] === undefined) {
                    this.contextListeners[eventName] = [];
                }
                this.contextListeners[eventName].push(callback);
            },

            removeContextListener: function removeContextListener(eventName, callback) {
                if (this.contextListeners[eventName]) {
                    var index = -1;
                    _lodash2.default.forEach(this.contextListeners[eventName], function (listener, idx) {
                        if (listener === callback) {
                            index = idx;
                            return;
                        }
                    });
                    if (index >= 0) {
                        this.contextListeners[eventName].splice(index, 1);
                    }
                }
            },

            publish: function publish(eventName, data, oldData) {
                if (this.contextListeners[eventName]) {
                    _lodash2.default.forEach(this.contextListeners[eventName], function (listener) {
                        listener(data, oldData);
                    });
                }
            },

            getSearchCondition: function getSearchCondition() {
                return this.searchConditions;
            },

            setSearchCondition: function setSearchCondition(predicate) {
                var oldCondition = this.searchConditions;
                this.searchConditions = predicate;
                this.publish(this.SEARCH_CHANGE, this.searchConditions, oldCondition);
            }
        };
    }();
});
define('services/stampCollections',["exports", "aurelia-framework", "aurelia-http-client", "./entity-managed", "../events/event-managed", "aurelia-event-aggregator"], function (exports, _aureliaFramework, _aureliaHttpClient, _entityManaged, _eventManaged, _aureliaEventAggregator) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.StampCollections = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _dec, _class;

    var StampCollections = exports.StampCollections = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function (_EntityManaged) {
        _inherits(StampCollections, _EntityManaged);

        function StampCollections(http, eventBus) {
            _classCallCheck(this, StampCollections);

            var _this = _possibleConstructorReturn(this, _EntityManaged.call(this, http, eventBus));

            _this.eventBus.subscribe(_eventManaged.EventNames.stampCountForCollection, _this.updateFromAlbumCount.bind(_this));
            return _this;
        }

        StampCollections.prototype.getResourceName = function getResourceName() {
            return "stampCollections";
        };

        StampCollections.prototype.updateFromAlbumCount = function updateFromAlbumCount(data) {
            if (data && this.loaded === true) {
                var sc = this.getById(data.stampCollectionRef);
                if (sc) {
                    sc.stampCount = sc.stampCount + data.count;
                }
            }
        };

        return StampCollections;
    }(_entityManaged.EntityManaged)) || _class);
});
define('services/stamps',["exports", "aurelia-framework", "aurelia-http-client", "./base-service", "aurelia-event-aggregator", "../events/event-managed", "lodash"], function (exports, _aureliaFramework, _aureliaHttpClient, _baseService, _aureliaEventAggregator, _eventManaged, _lodash) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Stamps = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _dec, _class;

    var Stamps = exports.Stamps = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function (_BaseService) {
        _inherits(Stamps, _BaseService);

        function Stamps(http, eventBus) {
            _classCallCheck(this, Stamps);

            var _this = _possibleConstructorReturn(this, _BaseService.call(this, http, eventBus));

            _this.setupListeners();

            return _this;
        }

        Stamps.prototype.setupListeners = function setupListeners() {
            this.eventBus.subscribe(_eventManaged.EventNames.deleteSuccessful, this.handleDelete.bind(this));
        };

        Stamps.prototype.getResourceName = function getResourceName() {
            return "stamps";
        };

        Stamps.prototype.executeReport = function executeReport(options) {
            var opts = _lodash2.default.extend({}, this.getDefaultSearchOptions(), options);
            var self = this;
            var q = new Promise(function (resolve, reject) {
                var href = self.baseHref + '/rest/reports?' + self.paramHelper.toParameters(opts);
                self.http.get(href).then(function (response) {
                    var retModel = response.content;
                    resolve(retModel);
                }).catch(function (reason) {
                    reject(reason);
                });
            });
            return q;
        };

        Stamps.prototype.handleDelete = function handleDelete(obj) {
            if (obj && obj.type === 'catalogueNumbers' && obj.id >= 0) {
                for (var i = 0, len = this.models.length; i < len; i++) {
                    var index = _lodash2.default.findIndex(this.models[i].catalogueNumbers, { id: +obj.id });
                    if (index >= 0) {
                        this.models[i].catalogueNumbers.splice(1, index);
                        break;
                    }
                }
            }
        };

        return Stamps;
    }(_baseService.BaseService)) || _class);
});
define('util/common-models',['exports', 'lodash'], function (exports, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.EnumeratedTypeHelper = exports.CatalogueHelper = exports.ConditionFilter = exports.StampFilter = exports.Deceptions = exports.Defects = exports.CatalogueType = exports.UserLocale = exports.CurrencyCode = exports.Grade = exports.Condition = exports.Enum = exports.EnumSymbol = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _class, _temp, _initialiseProps;

    var EnumSymbol = exports.EnumSymbol = (_temp = _class = function () {
        function EnumSymbol(name, _ref) {
            var ordinal = _ref.ordinal;
            var description = _ref.description;

            _classCallCheck(this, EnumSymbol);

            _initialiseProps.call(this);

            if (!Object.is(ordinal, undefined)) {
                this.ordinal = ordinal;
            }
            if (description) {
                this.description = description;
            }
            this.keyName = name;
            Object.freeze(this);
        }

        EnumSymbol.prototype.toString = function toString() {
            return this.sym;
        };

        EnumSymbol.prototype.valueOf = function valueOf() {
            return this.ordinal;
        };

        _createClass(EnumSymbol, [{
            key: 'display',
            get: function get() {
                return this.description || Symbol.keyFor(this.sym);
            }
        }, {
            key: 'key',
            get: function get() {
                return this.keyName;
            }
        }]);

        return EnumSymbol;
    }(), _initialiseProps = function _initialiseProps() {
        this.sym = Symbol.for(name);
    }, _temp);

    var Enum = exports.Enum = function () {
        function Enum(enumLiterals) {
            _classCallCheck(this, Enum);

            for (var key in enumLiterals) {
                if (!enumLiterals[key]) {
                    throw new TypeError('each enum should have been initialized with at least empty {} value');
                }
                this[key] = new EnumSymbol(key, enumLiterals[key]);
            }
            Object.freeze(this);
        }

        Enum.prototype.symbols = function symbols() {
            var syms = [];
            var self = this;
            Object.keys(this).forEach(function (k) {
                syms.push(self[k]);
            });
            return syms;
        };

        Enum.prototype.keys = function keys() {
            return Object.keys(this);
        };

        Enum.prototype.contains = function contains(sym) {
            if (!(sym instanceof EnumSymbol)) {
                return false;
            }
            return this[Symbol.keyFor(sym.sym)] === sym;
        };

        Enum.prototype.get = function get(ordinal) {
            var self = this;
            var symbol = void 0;
            this.keys().forEach(function (k) {
                if (self[k].ordinal === +ordinal) {
                    symbol = self[k];
                }
            });
            return symbol;
        };

        return Enum;
    }();

    var Condition = exports.Condition = new Enum({

        MINT: { ordinal: 0, description: 'condition.MLH' },
        MINT_NH: { ordinal: 1, description: 'condition.MNH' },
        MING_NG: { ordinal: 4, description: 'condition.MNG' },
        MINT_HH: { ordinal: 5, description: 'condition.MHH' },
        USED: { ordinal: 2, description: 'condition.U' },
        CTO: { ordinal: 3, description: 'condition.CTO' },
        COVER: { ordinal: 6, description: 'condition.COVER' },
        ON_PAPER: { ordinal: 7, description: 'condition.ON_PAPER' }
    });

    var Grade = exports.Grade = new Enum({
        XF: { ordinal: 0, description: 'grade.XF' },
        VF: { ordinal: 1, description: 'grade.VF' },
        FVF: { ordinal: 2, description: 'grade.FVF' },
        F: { ordinal: 3, description: 'grade.F' },
        VG: { ordinal: 4, description: 'grade.VG' },
        D: { ordinal: 5, description: 'grade.D' },
        CTS: { ordinal: 6, description: 'grade.CTS' }
    });

    var CurrencyCode = exports.CurrencyCode = new Enum({
        USD: { ordinal: 0, description: 'currencyCode.USD' },
        CAD: { ordinal: 1, description: 'currencyCode.CAD' },
        EUR: { ordinal: 2, description: 'currencyCode.EUR' },
        GBP: { ordinal: 3, description: 'currencyCode.GBP' },
        AUD: { ordinal: 4, description: 'currencyCode.AUD' },
        JYP: { ordinal: 5, description: 'currencyCode.JYP' },
        SEK: { ordinal: 6, description: 'currencyCode.SEK' }
    });

    var UserLocale = exports.UserLocale = new Enum({
        en: { ordinal: 0, description: 'userLocale.en' },
        zh: { ordinal: 1, description: 'userLocale.zh' }
    });

    var CatalogueType = exports.CatalogueType = new Enum({
        STANLEY_GIBBONS: { ordinal: 0, description: 'Stanley Gibbons' },
        SCOTT: { ordinal: 1, description: 'Scott Publishing' },
        MICHEL: { ordinal: 2, description: 'Michel' },
        FACIT: { ordinal: 3, description: 'Facit' },
        OTHER: { ordinal: 4, description: 'Other' },
        DARNELL: { ordinal: 5, description: 'Darnell' },
        BRIDGER_AND_KAY: { ordinal: 6, description: 'Bridger and Kay' },
        VAN_DAM: { ordinal: 7, description: 'Van Dam' },
        JSCA: { ordinal: 8, description: 'JSCA Specialized' }
    });

    var Defects = exports.Defects = new Enum({
        THIN: { ordinal: 2, description: 'defects.THIN' },
        TORN: { ordinal: 4, description: 'defects.TORN' },
        TONED_PAPER: { ordinal: 8, description: 'defects.TONED_PAPER' },
        CREASED: { ordinal: 16, description: 'defects.CREASED' },
        SCUFFED: { ordinal: 32, description: 'defects.SCUFFED' },
        PINHOLE: { ordinal: 64, description: 'defects.PINHOLE' },
        SHORT_PERF: { ordinal: 128, description: 'defects.SHORT_PERF' },
        STUNTED_PERF: { ordinal: 256, description: 'defects.STUNTED_PERF' },
        CLIPPED: { ordinal: 512, description: 'defects.CLIPPED' },
        FADING: { ordinal: 1024, description: 'defects.FADING' },
        BLEEDING: { ordinal: 2048, description: 'defects.BLEEDING' },
        INK_STAIN: { ordinal: 4096, description: 'defects.INK_STAIN' },
        CHANGELING: { ordinal: 8192, description: 'defects.CHANGELING' },
        CRACKED_GUM: { ordinal: 16384, description: 'defects.CRACKED_GUM' },
        TONED_GUM: { ordinal: 32768, description: 'defects.TONED_GUM' },
        HEAVILY_HINGED: { ordinal: 65536, description: 'defects.HEAVILY_HINGED' }
    });

    var Deceptions = exports.Deceptions = new Enum({
        FAKE_CANCEL: { ordinal: 2, description: 'deceptions.FAKE_CANCEL' },
        FAKE_OVERPRINT: { ordinal: 4, description: 'deceptions.FAKE_OVERPRINT' },
        FISCAL_REMOVED: { ordinal: 8, description: 'deceptions.FISCAL_REMOVED' },
        FORGERY: { ordinal: 16, description: 'deceptions.FORGERY' },
        FORGERY_POSSIBLE: { ordinal: 32, description: 'deceptions.FORGERY_POSSIBLE' },
        REPAIRED: { ordinal: 64, description: 'deceptions.REPAIRED' },
        REPRINT: { ordinal: 128, description: 'deceptions.REPRINT' }
    });

    var StampFilter = exports.StampFilter = new Enum({
        ALL: { ordinal: 0, description: 'filters.ALL_STAMPS' },
        ONLY_OWNED: { ordinal: 1, description: 'filters.ONLY_OWNED' },
        ONLY_WANTLIST: { ordinal: 2, description: 'filters.ONLY_WANTLIST' }
    });

    var ConditionFilter = exports.ConditionFilter = new Enum({
        ALL: { ordinal: 0, description: 'conditionFilters.ALL_STAMPS' },
        ONLY_MINT: { ordinal: 1, description: 'conditionFilters.ONLY_MINT' },
        ONLY_USED: { ordinal: 2, description: 'conditionFilters.ONLY_USED' },
        ONLY_POSTAL_HISTORY: { ordinal: 3, description: 'conditionFilters.ONLY_POSTAL_HISTORY' }
    });

    var CatalogueHelper = exports.CatalogueHelper = function () {
        return {
            getImagePrefix: function getImagePrefix(catalogue) {
                var prefix = "";
                switch (catalogue.type) {
                    case 1:
                        prefix = "sc";
                        break;
                }
                return prefix;
            }
        };
    }();

    var determineShiftedValues = function determineShiftedValues(total, highestValue) {
        var values = [];
        var runningTotal = total;
        for (var i = highestValue; i >= 0; i--) {
            if (runningTotal >> i === 1) {
                var binValue = Math.pow(2, i);
                runningTotal = runningTotal - binValue;
                values.push(binValue);
            }
        }
        return values;
    };

    var EnumeratedTypeHelper = exports.EnumeratedTypeHelper = function () {
        return {
            asArray: function asArray(type, value) {
                if (value === undefined) {
                    return [];
                }
                var v = determineShiftedValues(value, type.symbols().length);
                var enums = [];
                _lodash2.default.forEach(v, function (ordinal) {
                    enums.push(type.get(ordinal));
                });
                return enums;
            }
        };
    }();
});
define('util/location-helper',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });


    function LocationHelperFn() {

        return {
            getQueryParameter: function getQueryParameter(key, default_) {
                if (default_ == null) {
                    default_ = null;
                }
                key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                key = key.replace("$", "\\$");
                var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
                var qs = regex.exec(window.location.href);
                if (qs == null) {
                    return default_;
                } else {
                    return decodeURIComponent(qs[1]);
                }
            }
        };
    }

    var LocationHelper = exports.LocationHelper = new LocationHelperFn();
});
define('util/object-utilities',['exports', 'odata-filter-parser', 'lodash'], function (exports, _odataFilterParser, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.StringUtil = exports.PredicateUtilities = exports.ObjectUtilities = undefined;

    var _odataFilterParser2 = _interopRequireDefault(_odataFilterParser);

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var Operators = _odataFilterParser2.default.Operators;

    var ObjectUtilities = exports.ObjectUtilities = {
        isEqual: function isEqual(objA, objB) {
            if (!objA || !objB) {
                return !objA && !objB;
            }
            var aKeys = Object.keys(objA);
            var bKeys = Object.keys(objB);
            if (aKeys.length !== bKeys.length) {
                return false;
            }
            for (var i = 0, len = aKeys.length; i < len; i++) {
                var key = aKeys[i];
                if (!objB.hasOwnProperty(key) || objA[key] !== objB[key]) {
                    return false;
                }
            }
            return true;
        },
        deepExtend: function deepExtend(destination, source) {
            for (var property in source) {
                if (source[property] && source[property].constructor && source[property].constructor === Object) {
                    destination[property] = destination[property] || {};
                    ObjectUtilities.deepExtend(destination[property], source[property]);
                } else {
                    destination[property] = source[property];
                }
            }
            return destination;
        }

    };

    var PredicateUtilities = exports.PredicateUtilities = {
        removeMatches: function removeMatches(subject, predicates) {
            var predicateList = _lodash2.default.clone(predicates);
            if (predicateList.length === 1 && !Operators.isLogical(predicateList[0].operator)) {
                if (predicateList[0].subject === subject) {
                    predicateList.splice(0, 1);
                }
            } else {
                _lodash2.default.remove(predicateList, function (item) {
                    return item.subject === subject;
                });
                var logicals = _lodash2.default.filter(predicateList, function (item) {
                    return Operators.isLogical(item.operator);
                });
                if (logicals.length > 0) {
                    _lodash2.default.forEach(logicals, function (logical) {
                        var flattened = logical.flatten();
                        var processed = PredicateUtilities.removeMatches(subject, flattened);
                        if (processed.length < flattened.length) {
                            var indx = _lodash2.default.indexOf(predicateList, logical);
                            predicateList.splice(indx, 1);
                        }
                    });
                }
            }
            return predicateList;
        }
    };

    var StringUtil = exports.StringUtil = {
        pluralize: function pluralize(str, count) {
            var s = str;
            if (count > 1) {
                if (str.endsWith("y")) {
                    s = str.substring(0, str.length - 1) + 'ies';
                } else {
                    s += 's';
                }
            }
            return s;
        }
    };
});
define('resources/attributes/find-target',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.FindTargetCustomAttribute = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _class;

    var handleKeyDown = function handleKeyDown(e) {
        var self = this;
        if (e.ctrlKey === 114 || (e.ctrlKey || e.metaKey) && e.keyCode === 70) {
            e.preventDefault();
            setTimeout(function () {
                $(self.element).focus();
            }, 100);
        }
    };

    var FindTargetCustomAttribute = exports.FindTargetCustomAttribute = (_dec = (0, _aureliaFramework.customAttribute)('find-target'), _dec2 = (0, _aureliaFramework.inject)(Element), _dec(_class = _dec2(_class = function () {
        function FindTargetCustomAttribute(element) {
            _classCallCheck(this, FindTargetCustomAttribute);

            this.element = element;
            this.listener = handleKeyDown.bind(this);
        }

        FindTargetCustomAttribute.prototype.attached = function attached() {
            $(window).on('keydown', this.listener);
        };

        FindTargetCustomAttribute.prototype.detached = function detached() {
            $(window).off('keydown', this.listener);
        };

        return FindTargetCustomAttribute;
    }()) || _class) || _class);
});
define('resources/elements/editor-dialog',['exports', 'aurelia-framework', 'aurelia-event-aggregator', '../../events/event-managed'], function (exports, _aureliaFramework, _aureliaEventAggregator, _eventManaged) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.EditorDialog = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class;

    var EditorDialog = exports.EditorDialog = (_dec = (0, _aureliaFramework.customElement)('editor-dialog'), _dec2 = (0, _aureliaFramework.bindable)('model'), _dec3 = (0, _aureliaFramework.bindable)('dialogId'), _dec4 = (0, _aureliaFramework.bindable)('content'), _dec5 = (0, _aureliaFramework.bindable)('title'), _dec6 = (0, _aureliaFramework.bindable)('icon'), _dec7 = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = function (_EventManaged) {
        _inherits(EditorDialog, _EventManaged);

        function EditorDialog(eventBus) {
            _classCallCheck(this, EditorDialog);

            var _this = _possibleConstructorReturn(this, _EventManaged.call(this, eventBus));

            _this.errorMsg = "None";
            _this.subscriptions = [];

            _this.eventBus = eventBus;
            _this.setupSubscriptions();
            return _this;
        }

        EditorDialog.prototype.setupSubscriptions = function setupSubscriptions() {
            var _this2 = this;

            var that = this;
            this.subscribe(_eventManaged.EventNames.close, function () {
                $("#" + that.dialogId).modal('hide');
            });
            this.subscribe(_eventManaged.EventNames.actionError, function (msg) {
                _this2.errorMsg = msg;
            });
        };

        EditorDialog.prototype.save = function save() {
            this.eventBus.publish(_eventManaged.EventNames.save, this.model);
        };

        return EditorDialog;
    }(_eventManaged.EventManaged)) || _class) || _class) || _class) || _class) || _class) || _class) || _class);
});
define('resources/elements/loading-indicator',['exports', 'nprogress', 'aurelia-framework', 'aurelia-event-aggregator', '../../events/event-managed'], function (exports, _nprogress, _aureliaFramework, _aureliaEventAggregator, _eventManaged) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.LoadingIndicator = undefined;

    var _nprogress2 = _interopRequireDefault(_nprogress);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _dec, _dec2, _class;

    var LoadingIndicator = exports.LoadingIndicator = (_dec = (0, _aureliaFramework.bindable)("loading"), _dec2 = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), (0, _aureliaFramework.noView)(_class = _dec(_class = _dec2(_class = function (_EventManaged) {
        _inherits(LoadingIndicator, _EventManaged);

        function LoadingIndicator(eventBus) {
            _classCallCheck(this, LoadingIndicator);

            var _this = _possibleConstructorReturn(this, _EventManaged.call(this, eventBus));

            _this.eventBus = eventBus;
            _this.loadingCount = 0;

            _nprogress2.default.configure({
                showSpinner: false
            });
            return _this;
        }

        LoadingIndicator.prototype.attached = function attached() {
            this.setupSubscriptions();
        };

        LoadingIndicator.prototype.setupSubscriptions = function setupSubscriptions() {
            var self = this;
            this.subscribe(_eventManaged.EventNames.loadingStarted, function () {
                _nprogress2.default.start();
                self.loadingCount++;
            });
            this.subscribe(_eventManaged.EventNames.loadingFinished, function () {
                self.loadingCount--;
                if (!self.loading && self.loadingCount <= 0) {
                    _nprogress2.default.done();
                    self.loadingCount = 0;
                }
            });
        };

        LoadingIndicator.prototype.loadingChanged = function loadingChanged(newValue) {
            if (newValue) {
                _nprogress2.default.start();
            } else {
                _nprogress2.default.done();
            }
        };

        return LoadingIndicator;
    }(_eventManaged.EventManaged)) || _class) || _class) || _class);
});
define('resources/value-converters/as-currency-formatted',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.asCurrencyValueConverter = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var asCurrencyValueConverter = exports.asCurrencyValueConverter = (_dec = (0, _aureliaFramework.valueConverter)("asCurrencyFormatted"), _dec(_class = function () {
    function asCurrencyValueConverter() {
      _classCallCheck(this, asCurrencyValueConverter);
    }

    asCurrencyValueConverter.prototype.toView = function toView(value, currency) {
      if (typeof value !== 'undefined') {

        if (+value > 0 && currency) {
          return value.toLocaleString("en", { style: "currency", currency: currency, minimumFractionDigits: 2 });
        }
      }
      return "-";
    };

    return asCurrencyValueConverter;
  }()) || _class);
});
define('resources/value-converters/as-currency',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.asCurrencyValueConverter = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var asCurrencyValueConverter = exports.asCurrencyValueConverter = (_dec = (0, _aureliaFramework.valueConverter)("asCurrency"), _dec(_class = function () {
    function asCurrencyValueConverter() {
      _classCallCheck(this, asCurrencyValueConverter);
    }

    asCurrencyValueConverter.prototype.toView = function toView(value, selector) {
      if (value && value[selector]) {
        return '(' + value[selector] + ')';
      }
      return "";
    };

    return asCurrencyValueConverter;
  }()) || _class);
});
define('resources/value-converters/as-enum',['exports', 'aurelia-framework', '../../util/common-models'], function (exports, _aureliaFramework, _commonModels) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.asEnumValueConverter = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var asEnumValueConverter = exports.asEnumValueConverter = (_dec = (0, _aureliaFramework.valueConverter)("asEnum"), _dec(_class = function () {
        function asEnumValueConverter() {
            _classCallCheck(this, asEnumValueConverter);
        }

        asEnumValueConverter.prototype.toView = function toView(value, selector) {
            if (!isNaN(value)) {
                var enumValues = void 0;
                switch (selector) {
                    case 'Condition':
                        enumValues = _commonModels.Condition;
                        break;
                    case 'Grade':
                        enumValues = _commonModels.Grade;

                }
                if (enumValues) {
                    return enumValues.get(value).display;
                }
            }
            return "";
        };

        return asEnumValueConverter;
    }()) || _class);
});
define('resources/value-converters/as-number',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.asNumberValueConverter = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var asNumberValueConverter = exports.asNumberValueConverter = (_dec = (0, _aureliaFramework.valueConverter)("asNumber"), _dec(_class = function () {
        function asNumberValueConverter() {
            _classCallCheck(this, asNumberValueConverter);
        }

        asNumberValueConverter.prototype.toView = function toView(value) {
            var asFloat = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            if (value) {
                try {
                    value = asFloat ? parseFloat(value.toString()) : parseInt(value.toString());
                } catch (err) {
                    console.log("Could not parse '" + value + "' to a number.");
                    value = -1;
                }
            }
            return value;
        };

        asNumberValueConverter.prototype.fromView = function fromView(value) {
            var asFloat = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            if (value) {
                try {
                    value = asFloat ? parseFloat(value) : parseInt(value);
                } catch (err) {
                    console.log("Could not parse '" + value + "' to a number.");
                    value = -1;
                }
            }
            return value;
        };

        return asNumberValueConverter;
    }()) || _class);
});
define('resources/value-converters/as-percentage',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.percentageValueConverter = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var percentageValueConverter = exports.percentageValueConverter = (_dec = (0, _aureliaFramework.valueConverter)("asPercentage"), _dec(_class = function () {
    function percentageValueConverter() {
      _classCallCheck(this, percentageValueConverter);
    }

    percentageValueConverter.prototype.toView = function toView(value) {
      if (typeof value !== 'undefined') {
        value = (100.0 * value).toFixed(2) + '%';
      }
      return value;
    };

    return percentageValueConverter;
  }()) || _class);
});
define('resources/value-converters/bitwise-to-array',['exports', 'aurelia-framework', 'lodash'], function (exports, _aureliaFramework, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.bitwiseToArrayValueConverter = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var bitwiseToArrayValueConverter = exports.bitwiseToArrayValueConverter = (_dec = (0, _aureliaFramework.valueConverter)("bitwiseToArray"), _dec(_class = function () {
        function bitwiseToArrayValueConverter() {
            _classCallCheck(this, bitwiseToArrayValueConverter);
        }

        bitwiseToArrayValueConverter.prototype.toView = function toView(value, maxSize) {
            return this.determineShiftedValues(value, maxSize);
        };

        bitwiseToArrayValueConverter.prototype.fromView = function fromView(values) {
            var value = 0;
            if (values) {
                _lodash2.default.each(values, function (v) {
                    value += +v;
                });
            }
            return value;
        };

        bitwiseToArrayValueConverter.prototype.determineShiftedValues = function determineShiftedValues(value, maxSize) {
            var values = [];
            var runningTotal = +value;
            for (var i = maxSize; i >= 0; i--) {
                if (runningTotal >> i === 1) {
                    var binValue = Math.pow(2, i);
                    runningTotal = runningTotal - binValue;
                    values.push('' + binValue);
                }
            }
            return values;
        };

        return bitwiseToArrayValueConverter;
    }()) || _class);
});
define('resources/value-converters/by-name',['exports', 'aurelia-framework', '../../services/countries', '../../services/catalogues', '../../services/albums', '../../services/stampCollections'], function (exports, _aureliaFramework, _countries, _catalogues, _albums, _stampCollections) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.byNameValueConverter = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _class;

    var byNameValueConverter = exports.byNameValueConverter = (_dec = (0, _aureliaFramework.inject)(_countries.Countries, _catalogues.Catalogues, _albums.Albums, _stampCollections.StampCollections), _dec2 = (0, _aureliaFramework.valueConverter)("byName"), _dec(_class = _dec2(_class = function () {
        function byNameValueConverter(countryService, catalogueService, albumService, stampCollectionService) {
            _classCallCheck(this, byNameValueConverter);

            this.services = {
                countries: countryService,
                catalogues: catalogueService,
                albums: albumService,
                stampCollectionService: stampCollectionService
            };
        }

        byNameValueConverter.prototype.toView = function toView(value, serviceName) {
            if (value && value > 0) {
                var model = this.services[serviceName].getById(value);
                if (model) {
                    return model.displayName ? model.displayName : model.name;
                }
            }
            return "";
        };

        return byNameValueConverter;
    }()) || _class) || _class);
});
define('resources/value-converters/date-formatter',['exports', 'aurelia-framework', 'moment'], function (exports, _aureliaFramework, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.dateFormatterValueConverter = undefined;

    var _moment2 = _interopRequireDefault(_moment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var logger = _aureliaFramework.LogManager.getLogger('dateFormatter');

    var dateFormatterValueConverter = exports.dateFormatterValueConverter = (_dec = (0, _aureliaFramework.valueConverter)("dateFormatter"), _dec(_class = function () {
        function dateFormatterValueConverter() {
            _classCallCheck(this, dateFormatterValueConverter);
        }

        dateFormatterValueConverter.prototype.toView = function toView(value) {
            if (value) {
                try {
                    var d = new Date(value);
                    value = (0, _moment2.default)(d).format('MM/DD/YYYY');
                } catch (dateErr) {
                    logger.warn("Invalid value for view:" + value, dateErr);
                }
            }
            if (value === 'Invalid date') {
                value = null;
            }
            return value;
        };

        dateFormatterValueConverter.prototype.fromView = function fromView(value) {
            if (value) {
                if (value === 'Invalid date') {
                    return null;
                }
                try {
                    value = (0, _moment2.default)(new Date(value)).format('YYYY-MM-DDTHH:mm:ssZ');
                } catch (dateErr) {
                    value = null;
                    logger.warn("invalid value from view: " + value, dateErr);
                }
            }
            return value;
        };

        return dateFormatterValueConverter;
    }()) || _class);
});
define('resources/value-converters/default-value',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.DefaultValueConverter = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var DefaultValueConverter = exports.DefaultValueConverter = (_dec = (0, _aureliaFramework.valueConverter)("defaultValue"), _dec(_class = function () {
        function DefaultValueConverter() {
            _classCallCheck(this, DefaultValueConverter);
        }

        DefaultValueConverter.prototype.toView = function toView(value, defValue) {
            return !value ? defValue : value;
        };

        return DefaultValueConverter;
    }()) || _class);
});
define('resources/value-converters/empty-text',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.emptyTextValueConverter = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var emptyTextValueConverter = exports.emptyTextValueConverter = (_dec = (0, _aureliaFramework.valueConverter)("emptyText"), _dec(_class = function () {
    function emptyTextValueConverter() {
      _classCallCheck(this, emptyTextValueConverter);
    }

    emptyTextValueConverter.prototype.toView = function toView(value, def) {
      return !value ? def ? def : "" : value;
    };

    return emptyTextValueConverter;
  }()) || _class);
});
define('resources/value-converters/filter-by-name',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.filterByNameValueConverter = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var filterByNameValueConverter = exports.filterByNameValueConverter = (_dec = (0, _aureliaFramework.valueConverter)("filterByName"), _dec(_class = function () {
    function filterByNameValueConverter() {
      _classCallCheck(this, filterByNameValueConverter);
    }

    filterByNameValueConverter.prototype.toView = function toView(value, filterText) {
      if (!value || value.length < 1 || !filterText || filterText.length < 1) {
        return value;
      }
      return value.filter(function (item) {
        return item.name.toUpperCase().indexOf(filterText.toUpperCase()) >= 0;
      });
    };

    return filterByNameValueConverter;
  }()) || _class);
});
define('resources/value-converters/rate-filter',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.rateFilterValueConverter = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var rateFilterValueConverter = exports.rateFilterValueConverter = (_dec = (0, _aureliaFramework.valueConverter)("rateFilter"), _dec(_class = function () {
    function rateFilterValueConverter() {
      _classCallCheck(this, rateFilterValueConverter);
    }

    rateFilterValueConverter.prototype.toView = function toView(value) {
      return !value || value === '-' ? '' : value;
    };

    return rateFilterValueConverter;
  }()) || _class);
});
define('resources/value-converters/stamp-count',['exports', 'aurelia-framework', '../../util/object-utilities'], function (exports, _aureliaFramework, _objectUtilities) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.stampCountValueConverter = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var stampCountValueConverter = exports.stampCountValueConverter = (_dec = (0, _aureliaFramework.valueConverter)("stampCount"), _dec(_class = function () {
        function stampCountValueConverter() {
            _classCallCheck(this, stampCountValueConverter);
        }

        stampCountValueConverter.prototype.toView = function toView(value) {
            return value && +value > 0 ? value + _objectUtilities.StringUtil.pluralize(' stamp', +value) : '';
        };

        return stampCountValueConverter;
    }()) || _class);
});
define('resources/value-converters/zero-based',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.zeroBasedValueConverter = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var zeroBasedValueConverter = exports.zeroBasedValueConverter = (_dec = (0, _aureliaFramework.valueConverter)("zeroBased"), _dec(_class = function () {
        function zeroBasedValueConverter() {
            _classCallCheck(this, zeroBasedValueConverter);
        }

        zeroBasedValueConverter.prototype.toView = function toView(value) {
            if (!isNaN(parseInt(value))) {
                value = value + 1;
            }
            return value;
        };

        zeroBasedValueConverter.prototype.fromView = function fromView(value) {
            if (!isNaN(parseInt(value))) {
                value = value - 1;
            }
            return value;
        };

        return zeroBasedValueConverter;
    }()) || _class);
});
define('resources/elements/catalogue-numbers/cn-details',['exports', 'aurelia-framework', 'aurelia-dependency-injection', 'aurelia-validatejs', 'aurelia-validation', 'aurelia-binding', 'aurelia-i18n', 'aurelia-event-aggregator', '../../../events/event-managed', '../../../services/catalogues', '../../../util/common-models', 'lodash', 'jquery'], function (exports, _aureliaFramework, _aureliaDependencyInjection, _aureliaValidatejs, _aureliaValidation, _aureliaBinding, _aureliaI18n, _aureliaEventAggregator, _eventManaged, _catalogues, _commonModels, _lodash, _jquery) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.CatalogueNumberDetailsComponent = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _dec, _dec2, _dec3, _class, _class2, _temp;

    var CatalogueNumberDetailsComponent = exports.CatalogueNumberDetailsComponent = (_dec = (0, _aureliaFramework.customElement)('catalogue-number-details'), _dec2 = (0, _aureliaFramework.bindable)('model'), _dec3 = (0, _aureliaFramework.bindable)('selectedCatalogue'), _dec(_class = _dec2(_class = _dec3(_class = (_temp = _class2 = function (_EventManaged) {
        _inherits(CatalogueNumberDetailsComponent, _EventManaged);

        function CatalogueNumberDetailsComponent(eventBus, $bindingEngine, i18n, catalogueService, validationController) {
            _classCallCheck(this, CatalogueNumberDetailsComponent);

            var _this = _possibleConstructorReturn(this, _EventManaged.call(this, eventBus));

            _this.catalogues = [];
            _this.conditions = _commonModels.Condition.symbols();
            _this.loading = true;
            _this.showWarning = false;
            _this.isValid = false;
            _this._modelSubscribers = [];

            _this.catalogueService = catalogueService;
            _this.bindingEngine = $bindingEngine;
            _this.i18n = i18n;
            validationController.validateTrigger = _aureliaValidation.validateTrigger.manual;
            _this.validationController = validationController;
            _this.loadCatalogues();
            return _this;
        }

        CatalogueNumberDetailsComponent.prototype.attached = function attached() {
            this.subscribe(_eventManaged.EventNames.conflictExists, this.handleConflictExists.bind(this));
        };

        CatalogueNumberDetailsComponent.prototype.detached = function detached() {
            _EventManaged.prototype.detached.call(this);
            this._modelSubscribers.forEach(function (sub) {
                sub.dispose();
            });
        };

        CatalogueNumberDetailsComponent.prototype.setupValidation = function setupValidation() {
            this.rules = _aureliaValidatejs.ValidationRules.ensure('number').length({ minimum: 1, maximum: 25, message: this.i18n.tr('messages.numberInvalid') }).required({ message: this.i18n.tr('messages.numberRequired') });
        };

        CatalogueNumberDetailsComponent.prototype.validate = function validate() {
            this.handleValidation(this.validationController.validate());
        };

        CatalogueNumberDetailsComponent.prototype.handleValidation = function handleValidation(result) {
            this.isValid = result.length === 0;
        };

        CatalogueNumberDetailsComponent.prototype.handleConflictExists = function handleConflictExists(data) {
            if (data) {
                this.icon = data.convert ? 'sw-convert sw-icon-exchange' : 'sw-warning sw-icon-attention';
                this.conflictMessage = data.convert ? 'Click to convert the wanted stamp using the existing country, catalogue and number.' : 'A stamp with this country, catalogue and number already exists.';
                this.conversionModel = data.conversionModel;
                this.showWarning = true;
                if (this.model.id <= 0) {
                    this.playConflict();
                }
            }
        };

        CatalogueNumberDetailsComponent.prototype.playConflict = function playConflict() {
            var audioElm = (0, _jquery2.default)('audio#sw-exist-sound');
            if (audioElm.length > 0) {
                var audio = audioElm[0];
                if (audio.readyState >= 4) {
                    audio.play();
                }
            }
        };

        CatalogueNumberDetailsComponent.prototype.convert = function convert() {
            this.eventBus.publish(_eventManaged.EventNames.convert, this.conversionModel);
        };

        CatalogueNumberDetailsComponent.prototype.modelChanged = function modelChanged(newValue) {
            var _this2 = this;

            this._modelSubscribers.forEach(function (sub) {
                sub.dispose();
            });
            this._modelSubscribers = [];
            if (newValue) {
                (function () {
                    _this2._modelSubscribers.push(_this2.bindingEngine.propertyObserver(newValue, 'catalogueRef').subscribe(_this2.catalogueChanged.bind(_this2)));
                    _this2._modelSubscribers.push(_this2.bindingEngine.propertyObserver(newValue, 'condition').subscribe(_this2.sendNotifications.bind(_this2)));
                    _this2._modelSubscribers.push(_this2.bindingEngine.propertyObserver(newValue, 'number').subscribe(_this2.sendNotifications.bind(_this2)));
                    _this2.showWarning = false;
                    _this2.icon = '';
                    _this2.conversionModel = undefined;
                    _this2.setupValidation();
                    var self = _this2;
                    setTimeout(function () {
                        self.sendNotifications();
                    }, 125);
                })();
            }
        };

        CatalogueNumberDetailsComponent.prototype.catalogueChanged = function catalogueChanged(newValue) {
            if (newValue > 0) {
                this.selectedCatalogue = _lodash2.default.findWhere(this.catalogues, { id: +newValue });
                this.sendNotifications();
            }
        };

        CatalogueNumberDetailsComponent.prototype.sendNotifications = function sendNotifications() {
            this.validate();
            if (this.model.number && this.model.number !== '') {
                if (this.model.catalogueRef > 0) {
                    this.icon = '';
                    this.showWarning = false;
                    this.eventBus.publish(_eventManaged.EventNames.checkExists, { model: this.model });
                }
                if (this.model.id <= 0 && this.model.condition >= 0) {
                    this.eventBus.publish(_eventManaged.EventNames.calculateImagePath, { model: this.model });
                }
            }
        };

        CatalogueNumberDetailsComponent.prototype.loadCatalogues = function loadCatalogues() {
            var self = this;
            this.catalogueService.find(this.catalogueService.getDefaultSearchOptions()).then(function (results) {
                self.catalogues = results.models;
                self.loading = false;
            });
        };

        return CatalogueNumberDetailsComponent;
    }(_eventManaged.EventManaged), _class2.inject = [_aureliaEventAggregator.EventAggregator, _aureliaBinding.BindingEngine, _aureliaI18n.I18N, _catalogues.Catalogues, _aureliaDependencyInjection.NewInstance.of(_aureliaValidation.ValidationController)], _temp)) || _class) || _class) || _class);
});
define('resources/elements/catalogue-numbers/cn-references',['exports', 'aurelia-framework', '../../../services/catalogues', '../../../services/stamps', '../../../services/catalogueNumbers', '../../../services/preferences', '../../../util/common-models', 'aurelia-i18n', 'jquery', 'lodash', 'bootbox'], function (exports, _aureliaFramework, _catalogues, _stamps, _catalogueNumbers, _preferences, _commonModels, _aureliaI18n, _jquery, _lodash, _bootbox) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.CatalogueNumberReferences = undefined;

    var _jquery2 = _interopRequireDefault(_jquery);

    var _lodash2 = _interopRequireDefault(_lodash);

    var _bootbox2 = _interopRequireDefault(_bootbox);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _dec3, _class;

    var logger = _aureliaFramework.LogManager.getLogger('cn-references');

    var CatalogueNumberReferences = exports.CatalogueNumberReferences = (_dec = (0, _aureliaFramework.customElement)('catalogue-number-references'), _dec2 = (0, _aureliaFramework.bindable)('model'), _dec3 = (0, _aureliaFramework.inject)(Element, _aureliaI18n.I18N, _catalogues.Catalogues, _catalogueNumbers.CatalogueNumbers, _stamps.Stamps, _preferences.Preferences), _dec(_class = _dec2(_class = _dec3(_class = function () {
        function CatalogueNumberReferences(element, i18next, catalogueService, catalogueNumberService, stampService, preferenceService) {
            _classCallCheck(this, CatalogueNumberReferences);

            this.catalogues = [];
            this.defaultCondition = -1;
            this.defaultCatalogue = null;
            this.conditions = _commonModels.Condition.symbols();

            this.element = (0, _jquery2.default)(element);
            this.i18next = i18next;
            this.catalogueService = catalogueService;
            this.catalogueNumberService = catalogueNumberService;
            this.stampService = stampService;
            this.preferenceService = preferenceService;
        }

        CatalogueNumberReferences.prototype.bind = function bind() {
            var self = this;

            Promise.all([self.catalogueService.find(self.catalogueService.getDefaultSearchOptions()).then(function (results) {
                self.catalogues = results.models;
            }), self.preferenceService.find(self.preferenceService.getDefaultSearchOptions()).then(function (results) {
                var cond = self.preferenceService.getByNameAndCategory('condition', 'stamps');
                if (cond) {
                    self.defaultCondition = +cond.value;
                }
                var cat = self.preferenceService.getByNameAndCategory('catalogueRefSecondary', 'stamps');
                if (cat) {
                    self.defaultCatalogue = +cat.value;
                }
            })]);
        };

        CatalogueNumberReferences.prototype.modelChanged = function modelChanged(newModel) {
            var _this = this;

            if (newModel) {
                (function () {
                    var self = _this;
                    _this.modelCopy = _lodash2.default.clone(newModel, true);
                    _this.modelCopy.catalogueNumbers.forEach(function (catNum) {
                        catNum.currencyCode = self.determineCurrencyCode(catNum.catalogueRef);
                    });
                })();
            } else {
                this.modelCopy = {};
            }
        };

        CatalogueNumberReferences.prototype.determineCurrencyCode = function determineCurrencyCode(catalogueRef) {
            var code = 'USD';
            var cat = this.catalogueService.getById(catalogueRef);
            if (cat) {
                code = cat.code;
            }
            return code;
        };

        CatalogueNumberReferences.prototype.edit = function edit(num, index) {
            num.editing = true;
        };

        CatalogueNumberReferences.prototype.cancel = function cancel(num) {
            var inlineRow = (0, _jquery2.default)(this.element.find('.editing-row'));
            if (num.id === 0) {
                inlineRow.remove();
                var index = _lodash2.default.findIndex(this.modelCopy.catalogueNumbers, { id: 0 });
                if (index >= 0) {
                    this.modelCopy.catalogueNumbers.splice(1, index);
                }
            }
            num.editing = false;
        };

        CatalogueNumberReferences.prototype.save = function save(num) {
            var self = this;
            self.stampService.save(this.modelCopy).then(function (stamp) {
                self.modelChanged(stamp);
            });
        };

        CatalogueNumberReferences.prototype.add = function add() {
            var _this2 = this;

            var num = {
                id: 0,
                active: false,
                catalogueRef: this.defaultCatalogue,
                condition: this.defaultCondition,
                number: "",
                value: 0
            };
            num.editing = true;
            this.modelCopy.catalogueNumbers.push(num);
            setTimeout(function () {
                var el = _this2.element.find('#cn-number');
                (0, _jquery2.default)(el).focus();
            }, 250);
        };

        CatalogueNumberReferences.prototype.remove = function remove(num) {
            var self = this;
            var _remove = function _remove(m) {
                self.catalogueNumberService.remove(m).then(function (result) {
                    if (result === true) {
                        var index = _lodash2.default.findIndex(self.modelCopy.catalogueNumbers, { id: m.id });
                        self.modelCopy.catalogueNumbers.splice(index, 1);
                    }
                }).catch(function (err) {
                    logger.debug("Error removing", err);
                });
            };
            _bootbox2.default.confirm({
                size: 'small',
                message: self.i18next.tr("prompts.delete-catalogue-number", { number: num.number }),
                callback: function callback(result) {
                    if (result === true) {
                        _remove.call(self, num);
                    }
                }
            });
        };

        CatalogueNumberReferences.prototype.makeActive = function makeActive(num) {
            var activeNum = void 0;
            for (var i = 0; i < this.modelCopy.catalogueNumbers.length; i++) {
                var cn = this.modelCopy.catalogueNumbers[i];
                if (cn.active === true) {
                    activeNum = cn;
                    break;
                }
            }
            if (activeNum.id === num.id) {
                throw new Error("Can not set active as active!");
            } else {
                this.catalogueNumberService.makeActive(num.id).then(function (stamp) {
                    activeNum.active = false;
                    num.active = true;
                }).catch(function (err) {
                    logger.error(err);
                });
            }
        };

        return CatalogueNumberReferences;
    }()) || _class) || _class) || _class);
});
define('resources/elements/collapse-panel/collapse-panel',['exports', 'aurelia-framework', 'aurelia-event-aggregator', '../../../events/event-managed'], function (exports, _aureliaFramework, _aureliaEventAggregator, _eventManaged) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.CollapsePanel = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _dec, _dec2, _dec3, _dec4, _dec5, _class;

    var CollapsePanel = exports.CollapsePanel = (_dec = (0, _aureliaFramework.bindable)('title'), _dec2 = (0, _aureliaFramework.bindable)({
        name: "name",
        defaultValue: "collapsing-panel"
    }), _dec3 = (0, _aureliaFramework.bindable)({
        name: "collapsed",
        defaultValue: false
    }), _dec4 = (0, _aureliaFramework.customElement)('collapse-panel'), _dec5 = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = function (_EventManaged) {
        _inherits(CollapsePanel, _EventManaged);

        function CollapsePanel(eventBus) {
            _classCallCheck(this, CollapsePanel);

            return _possibleConstructorReturn(this, _EventManaged.call(this, eventBus));
        }

        CollapsePanel.prototype.attached = function attached() {
            this.setupSubscriptions();
        };

        CollapsePanel.prototype.setupSubscriptions = function setupSubscriptions() {
            var _this2 = this;

            this.subscribe(_eventManaged.EventNames.collapsePanel, function () {
                _this2.hide();
            });
        };

        CollapsePanel.prototype.hide = function hide() {
            this.collapsed = true;
            this.eventBus.publish(_eventManaged.EventNames.panelCollapsed, { name: this.name });
        };

        return CollapsePanel;
    }(_eventManaged.EventManaged)) || _class) || _class) || _class) || _class) || _class);
});
define('resources/elements/date-picker/date-picker',['exports', 'aurelia-framework', 'aurelia-i18n', 'jquery', 'lodash', 'moment', 'bootstrap-datepicker'], function (exports, _aureliaFramework, _aureliaI18n, _jquery, _lodash, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.DatePicker = undefined;

    var _jquery2 = _interopRequireDefault(_jquery);

    var _lodash2 = _interopRequireDefault(_lodash);

    var _moment2 = _interopRequireDefault(_moment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class;

    var logger = _aureliaFramework.LogManager.getLogger('date-picker');

    var DatePicker = exports.DatePicker = (_dec = (0, _aureliaFramework.customElement)('date-picker'), _dec2 = (0, _aureliaFramework.bindable)({ name: 'value', defaultValue: undefined }), _dec3 = (0, _aureliaFramework.bindable)({ name: 'endValue', defaultValue: undefined }), _dec4 = (0, _aureliaFramework.bindable)({ name: 'startDate', defaultValue: undefined }), _dec5 = (0, _aureliaFramework.bindable)({ name: 'endDate', defaultValue: undefined }), _dec6 = (0, _aureliaFramework.bindable)({ name: 'range', defaultValue: false }), _dec7 = (0, _aureliaFramework.inject)(Element, _aureliaI18n.I18N), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = function () {
        function DatePicker(element, i18n) {
            _classCallCheck(this, DatePicker);

            this.element = element;
            this.i18n = i18n;
        }

        DatePicker.prototype.attached = function attached() {
            var _this = this;

            var self = this;

            this.datepicker = (0, _jquery2.default)(this.element).find('.date-wrapper input');
            this.datepicker.datepicker({
                orientation: "left auto",
                language: this.i18n.getLocale(),
                autoclose: true,
                clearBtn: false,
                todayBtn: "linked",
                todayHighlight: true,
                templates: {
                    leftArrow: '<span class="sw-icon-previous"></span>',
                    rightArrow: '<span class="sw-icon-next"></span>'
                },
                container: (0, _jquery2.default)(this.element).parent(),
                startDate: this.startDate,
                endData: this.endDate
            }).on('changeDate', function (event) {
                var wrapper = (0, _jquery2.default)(event.currentTarget).closest('.date-control');
                if (wrapper.hasClass('end-date')) {
                    self.lastChangeEndDate = event.date;
                } else {
                    self.lastChangeDate = event.date;
                }
            }).on('hide', function (event) {
                var wrapper = (0, _jquery2.default)(event.currentTarget).closest('.date-control');
                if (wrapper.hasClass('end-date')) {
                    self.endValue = self.lastChangeEndDate;
                } else {
                    self.value = self.lastChangeDate;
                }
            });

            this.updateDate(null, false);
            _lodash2.default.defer(function () {
                _this.updateDate(_this.value, false);
            });

            if (this.endValue && this.range) {
                this.updateDate(null, true);
                _lodash2.default.defer(function () {
                    _this.updateDate(_this.endValue, true);
                });
            }
            this.configureAttributes();
        };

        DatePicker.prototype.startDateChanged = function startDateChanged(newVal) {
            if (!this.datepicker) {
                return;
            }
            this.datepicker.datepicker('setStartDate', newVal);
        };

        DatePicker.prototype.endDateChanged = function endDateChanged(newVal) {
            if (!this.datepicker) {
                return;
            }
            this.datepicker.datepicker('setEndDate', newVal);
        };

        DatePicker.prototype.valueChanged = function valueChanged(newVal) {
            if (!this.datepicker) {
                return;
            }
            this.updateDate(newVal, false);
            this.fireChangeEvent();
        };

        DatePicker.prototype.endValueChanged = function endValueChanged(newVal) {
            if (!this.datepicker || !this.range) {
                return;
            }
            this.updateDate(newVal, true);
            this.fireChangeEvent();
        };

        DatePicker.prototype.clear = function clear($event) {
            var wrapper = (0, _jquery2.default)($event.currentTarget).parents('.date-control');
            wrapper.find('input').datepicker('clearDates');
            if (wrapper.hasClass('end-date')) {
                this.endValue = undefined;
            } else {
                this.value = undefined;
            }
        };

        DatePicker.prototype.show = function show($event) {
            var wrapper = (0, _jquery2.default)($event.currentTarget).parents('.date-control');
            wrapper.find('input').datepicker('show');
        };

        DatePicker.prototype.detached = function detached() {
            try {
                (0, _jquery2.default)(this.element).find('.date-control input').datepicker('destroy').off('changeDate');
            } catch (err) {
                logger.warn('Unabled to destroy date-picker' + err);
            }
        };

        DatePicker.prototype.updateDate = function updateDate(val, end) {
            var controls = (0, _jquery2.default)(this.element).find('.date-control input');
            if (controls.length < 1) {
                return;
            }
            var displayText = this.formatDisplay(val);
            if (end) {
                this.lastChangeEndDate = val;
            } else {
                this.lastChangeDate = val;
            }
            (0, _jquery2.default)(controls[end ? 1 : 0]).datepicker('update', val);
            if (end) {
                this.selectedEndDate = displayText;
                (0, _jquery2.default)(controls[0]).datepicker('setEndDate', val);
            } else {
                this.selectedDate = displayText;
                if (this.range) {
                    (0, _jquery2.default)(controls[1]).datepicker('setStartDate', val);
                }
            }
        };

        DatePicker.prototype.configureAttributes = function configureAttributes() {
            var controls = (0, _jquery2.default)(this.element).find('.date-wrapper input');
            var tabIndex = (0, _jquery2.default)(this.element).attr('tabindex');
            if (tabIndex && tabIndex !== '') {
                (0, _jquery2.default)(this.element).removeAttr('tabindex');
                controls.attr('tabindex', tabIndex);
            }
            var id = (0, _jquery2.default)(this.element).attr('id');
            if (id && id !== '') {
                (0, _jquery2.default)(this.element).removeAttr('id');
                if (this.range) {
                    (0, _jquery2.default)(controls[0]).attr('id', id + '-start');
                    (0, _jquery2.default)(controls[1]).attr('id', id + '-end');
                } else {
                    (0, _jquery2.default)(controls[0]).attr('id', id);
                }
            }
        };

        DatePicker.prototype.formatDisplay = function formatDisplay(val) {
            return val ? (0, _moment2.default)(val).format(this.i18n.tr('date-picker.format')) : undefined;
        };

        DatePicker.prototype.fireChangeEvent = function fireChangeEvent() {
            var _this2 = this;

            _lodash2.default.defer(function () {
                (0, _jquery2.default)(_this2.element).trigger('change');
            });
        };

        return DatePicker;
    }()) || _class) || _class) || _class) || _class) || _class) || _class) || _class);
});
define('resources/elements/image-preview/image-preview',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'lodash', 'blueimp-load-image'], function (exports, _aureliaFramework, _aureliaEventAggregator, _lodash, _blueimpLoadImage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ImagePreviewer = exports.ImagePreviewEvents = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    var _blueimpLoadImage2 = _interopRequireDefault(_blueimpLoadImage);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _dec3, _dec4, _dec5, _class;

    var ImagePreviewEvents = exports.ImagePreviewEvents = {
        close: "closeImagePreview",
        show: "showImagePreview"
    };

    var ImagePreviewer = exports.ImagePreviewer = (_dec = (0, _aureliaFramework.customElement)('image-preview'), _dec2 = (0, _aureliaFramework.inject)(Element, _aureliaEventAggregator.EventAggregator), _dec3 = (0, _aureliaFramework.bindable)("image"), _dec4 = (0, _aureliaFramework.bindable)("boundsSelector"), _dec5 = (0, _aureliaFramework.bindable)({
        name: "show",
        defaultValue: false
    }), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = function () {
        function ImagePreviewer(element, eventBus) {
            _classCallCheck(this, ImagePreviewer);

            this.element = element;
            this.eventBus = eventBus;
        }

        ImagePreviewer.prototype.imageChanged = function imageChanged(fullSizeImage) {
            var _this = this;

            if (fullSizeImage && fullSizeImage !== '') {
                (function () {
                    var self = _this;
                    _lodash2.default.debounce(function () {
                        var container = $(self.element).parents().find(self.boundsSelector);
                        (0, _blueimpLoadImage2.default)(fullSizeImage, function (img) {
                            if (img.type === "error") {
                                self.closeFullSizeImage();
                            } else {
                                $(self.element).find('div').html(img);
                            }
                        }, {
                            maxWidth: +container.width(),
                            maxHeight: +container.height(),
                            contain: true
                        });
                    })(_this);
                })();
            } else {
                this.closeFullSizeImage();
            }
        };

        ImagePreviewer.prototype.closeFullSizeImage = function closeFullSizeImage() {
            $(this.element).find('div').empty();
            this.eventBus.publish(ImagePreviewEvents.close);
        };

        return ImagePreviewer;
    }()) || _class) || _class) || _class) || _class) || _class);
});
define('resources/elements/nav/nav-bar',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.NavBar = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _class;

    var NavBar = exports.NavBar = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec2 = (0, _aureliaFramework.bindable)('router'), _dec(_class = _dec2(_class = function NavBar(eventBus) {
        _classCallCheck(this, NavBar);

        this.eventBus = eventBus;
    }) || _class) || _class);
});
define('resources/elements/ownerships/ownership-cert',['exports', 'aurelia-framework', 'aurelia-i18n'], function (exports, _aureliaFramework, _aureliaI18n) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.OwnershipCertCustomElement = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _dec3, _class;

    var OwnershipCertCustomElement = exports.OwnershipCertCustomElement = (_dec = (0, _aureliaFramework.customElement)('ownership-cert'), _dec2 = (0, _aureliaFramework.inject)(Element, _aureliaI18n.I18N), _dec3 = (0, _aureliaFramework.bindable)('model'), _dec(_class = _dec2(_class = _dec3(_class = function () {
        function OwnershipCertCustomElement(element, i18n) {
            _classCallCheck(this, OwnershipCertCustomElement);

            this.hasCert = false;
            this.iconCls = "";

            this.element = element;
            this.i18n = i18n;
        }

        OwnershipCertCustomElement.prototype.modelChanged = function modelChanged(newValue) {
            this.iconCls = '';
            var self = this;
            $(self.element).find('.tooltip').remove();
            if (newValue) {
                self.hasCert = newValue.cert;
                self.iconCls = self.hasCert ? 'sw-icon-ribbon' : '';
                if (self.hasCert) {
                    $(self.element).tooltip({
                        html: true,
                        container: 'body',
                        title: self.i18n.tr('tooltip.cert')
                    });
                }
            }
        };

        return OwnershipCertCustomElement;
    }()) || _class) || _class) || _class);
});
define('resources/elements/ownerships/ownership-editor',['exports', 'aurelia-framework', 'aurelia-event-aggregator', '../../../events/event-managed', '../../../services/albums', '../../../services/sellers', '../../../util/common-models'], function (exports, _aureliaFramework, _aureliaEventAggregator, _eventManaged, _albums, _sellers, _commonModels) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.OwnershipEditor = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _dec, _dec2, _dec3, _class;

    var logger = _aureliaFramework.LogManager.getLogger('ownership-editor');

    var OwnershipEditor = exports.OwnershipEditor = (_dec = (0, _aureliaFramework.customElement)('ownership-editor'), _dec2 = (0, _aureliaFramework.bindable)('model'), _dec3 = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _albums.Albums, _sellers.Sellers), _dec(_class = _dec2(_class = _dec3(_class = function (_EventManaged) {
        _inherits(OwnershipEditor, _EventManaged);

        function OwnershipEditor(eventBus, albumService, sellerService) {
            _classCallCheck(this, OwnershipEditor);

            var _this = _possibleConstructorReturn(this, _EventManaged.call(this, eventBus));

            _this.loading = true;
            _this.albums = [];
            _this.conditions = _commonModels.Condition.symbols();
            _this.grades = _commonModels.Grade.symbols();
            _this.codes = _commonModels.CurrencyCode.symbols();
            _this.defects = _commonModels.Defects.symbols();
            _this.deceptions = _commonModels.Deceptions.symbols();
            _this.sellers = [];

            _this.albumService = albumService;
            _this.sellerService = sellerService;
            _this.loadDependentModels();
            return _this;
        }

        OwnershipEditor.prototype.loadDependentModels = function loadDependentModels() {
            var self = this;
            var albumPromise = this.albumService.find({
                $orderby: 'name asc'
            });
            var sellerPromise = this.sellerService.find({
                $orderby: 'name asc'
            });
            Promise.all([albumPromise, sellerPromise]).then(function (values) {
                for (var i = 0; i < values.length; i++) {
                    switch (i) {
                        case 0:
                            self.albums = values[i].models;
                            break;
                        case 1:
                            self.sellers = values[i].models;
                            break;
                    }
                }
                self.loading = false;
            }).catch(function (err) {
                logger.error(err);
            });
        };

        return OwnershipEditor;
    }(_eventManaged.EventManaged)) || _class) || _class) || _class);
});
define('resources/elements/ownerships/ownership-notes',['exports', 'aurelia-framework', 'aurelia-i18n', '../../../util/common-models', 'lodash'], function (exports, _aureliaFramework, _aureliaI18n, _commonModels, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.OwnershipNotesCustomElement = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _dec, _dec2, _dec3, _class;

    var OwnershipNotesCustomElement = exports.OwnershipNotesCustomElement = (_dec = (0, _aureliaFramework.customElement)('ownership-notes'), _dec2 = (0, _aureliaFramework.inject)(Element, _aureliaI18n.I18N), _dec3 = (0, _aureliaFramework.bindable)('model'), _dec(_class = _dec2(_class = _dec3(_class = function () {
        function OwnershipNotesCustomElement(element, i18n) {
            _classCallCheck(this, OwnershipNotesCustomElement);

            this.hasDefects = false;
            this.hasDeception = false;
            this.hasNotes = false;
            this.iconCls = "";

            this.element = element;
            this.i18n = i18n;
        }

        OwnershipNotesCustomElement.prototype.modelChanged = function modelChanged(newValue) {
            this.iconCls = '';
            var self = this;
            $(self.element).find('.tooltip').remove();
            if (newValue) {
                self.hasNotes = newValue.notes && newValue.notes !== '';
                self.hasDeception = +newValue.deception > 0;
                self.hasDefects = +newValue.defects > 0;
                self.iconCls = self.hasDeception ? 'sw-icon-deception' : self.hasDefects ? 'sw-icon-defect' : self.hasNotes ? 'sw-icon-info' : '';
                if (self.visible) {
                    $(self.element).tooltip({
                        html: true,
                        container: 'body',
                        title: self.getPopupText.bind(self)
                    });
                }
            }
        };

        OwnershipNotesCustomElement.prototype.getPopupText = function getPopupText() {
            var _this = this;

            var text = '';
            if (this.hasDefects) {
                (function () {
                    var values = _commonModels.EnumeratedTypeHelper.asArray(_commonModels.Defects, _this.model.defects);
                    var dText = '';
                    if (values && values.length > 0) {
                        _lodash2.default.forEach(values, function (val, index) {
                            dText += _this.i18n.tr(val.description) + (index < values.length - 1 ? ', ' : '');
                        });
                    }
                    text += text.length > 0 ? '<br/>' : '';
                    text += '<label class="tooltip-label">' + _this.i18n.tr('tooltip.defects') + '</label>' + dText;
                })();
            }
            if (this.hasDeception) {
                (function () {
                    var values = _commonModels.EnumeratedTypeHelper.asArray(_commonModels.Deceptions, _this.model.deception);
                    var dText = '';
                    if (values && values.length > 0) {
                        _lodash2.default.forEach(values, function (val, index) {
                            dText += _this.i18n.tr(val.description) + (index < values.length - 1 ? ', ' : '');
                        });
                    }
                    text += text.length > 0 ? '<br/>' : '';
                    text += '<label class="tooltip-label">' + _this.i18n.tr('tooltip.deception') + '</label>' + dText;
                })();
            }
            if (this.hasNotes) {
                text += text.length > 0 ? '<br/>' : '';
                text += '<label class="tooltip-label">' + this.i18n.tr('tooltip.notes') + '</label>' + this.model.notes;
            }
            return text;
        };

        _createClass(OwnershipNotesCustomElement, [{
            key: 'visible',
            get: function get() {
                return this.hasDeception || this.hasDefects || this.hasNotes;
            }
        }]);

        return OwnershipNotesCustomElement;
    }()) || _class) || _class) || _class);
});
define('resources/elements/paging/paging-toolbar',['exports', 'aurelia-framework', 'aurelia-event-aggregator', '../../../events/event-managed'], function (exports, _aureliaFramework, _aureliaEventAggregator, _eventManaged) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.pagingToolbarComponent = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _dec3, _dec4, _class;

    var pagingToolbarComponent = exports.pagingToolbarComponent = (_dec = (0, _aureliaFramework.customElement)('paging-toolbar'), _dec2 = (0, _aureliaFramework.bindable)('total'), _dec3 = (0, _aureliaFramework.bindable)('page'), _dec4 = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, Element), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = function () {
        function pagingToolbarComponent(eventBus, element) {
            _classCallCheck(this, pagingToolbarComponent);

            this.eventBus = eventBus;
            this.element = element;
        }

        pagingToolbarComponent.prototype.pageChanged = function pageChanged(newVal) {
            this.setButtonState();
        };

        pagingToolbarComponent.prototype.totalChanged = function totalChanged(newVal) {
            this.setButtonState();
        };

        pagingToolbarComponent.prototype.selectPage = function selectPage(num) {
            if (+num < this.total && +num >= 0) {
                this.eventBus.publish(_eventManaged.EventNames.pageChanged, +num);
            }
        };

        pagingToolbarComponent.prototype.refresh = function refresh() {
            this.eventBus.publish(_eventManaged.EventNames.pageRefreshed, this.page);
        };

        pagingToolbarComponent.prototype.setButtonState = function setButtonState() {
            var elm = $(this.element);

            if (this.page === this.total) {
                elm.find('button.last-page').button().button('disable');
                elm.find('button.next-page').button().button('disable');
            } else {
                elm.find('button.last-page').button().button('enable');
                elm.find('button.next-page').button().button('enable');
            }
        };

        pagingToolbarComponent.prototype.validatePage = function validatePage() {
            if (typeof this.page === 'undefined' || +this.page > this.total || +this.page.page < 1) {
                $(this.element).find('.enter-page').addClass('invalid');
            } else {
                $(this.element).find('.enter-page').removeClass('invalid');
            }
        };

        pagingToolbarComponent.prototype.isValid = function isValid() {
            try {
                if (typeof this.page === 'undefined' || parseInt(this.page) > this.total || parseInt(this.page) < 1) {
                    return false;
                }
            } catch (err) {
                return false;
            }
            return true;
        };

        pagingToolbarComponent.prototype.filterKey = function filterKey($event) {
            if ($event.keyCode === _eventManaged.KeyCodes.VK_ENTER && this.isValid()) {
                this.selectPage(parseInt($($event.target).val()) - 1);
            }
        };

        return pagingToolbarComponent;
    }()) || _class) || _class) || _class) || _class);
});
define('resources/elements/search/search-form',['exports', 'aurelia-framework', 'aurelia-binding', 'aurelia-event-aggregator', '../../../services/countries', '../../../services/albums', '../../../services/sellers', '../../../services/catalogues', '../../../services/stampCollections', 'odata-filter-parser', '../../../services/session-context', '../../../events/event-managed', 'lodash'], function (exports, _aureliaFramework, _aureliaBinding, _aureliaEventAggregator, _countries, _albums, _sellers, _catalogues, _stampCollections, _odataFilterParser, _sessionContext, _eventManaged, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SearchForm = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _dec3, _dec4, _class;

    var SearchForm = exports.SearchForm = (_dec = (0, _aureliaFramework.customElement)("search-form"), _dec2 = (0, _aureliaFramework.bindable)({
        name: 'model',
        defaultValue: {}
    }), _dec3 = (0, _aureliaFramework.bindable)({
        name: 'showMinimize',
        defaultValue: true
    }), _dec4 = (0, _aureliaFramework.inject)(Element, _aureliaEventAggregator.EventAggregator, _aureliaBinding.BindingEngine, _countries.Countries, _stampCollections.StampCollections, _albums.Albums, _sellers.Sellers, _catalogues.Catalogues), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = function () {
        function SearchForm(element, eventBus, bindingEngine, countries, stampCollections, albums, sellers, catalogueService) {
            _classCallCheck(this, SearchForm);

            this.loading = true;
            this.minimizeOnSearch = true;
            this.searchFields = ['countryRef', 'stampCollectionRef', 'albumRef', 'sellerRef'];
            this.dateFields = ['purchased', 'createTimestamp', 'modifyTimestamp'];
            this.booleanFields = ['defects', 'deception'];

            this.element = element;
            this.eventBus = eventBus;
            this.bindingEngine = bindingEngine;
            this.countryServices = countries;
            this.stampCollectionService = stampCollections;
            this.albumService = albums;
            this.sellerService = sellers;
            this.catalogueService = catalogueService;
        }

        SearchForm.prototype.bind = function bind() {
            var self = this;

            self.loading = true;
            var searchConditions = _sessionContext.SessionContext.getSearchCondition();
            if (searchConditions !== undefined) {
                _lodash2.default.forEach(searchConditions.flatten(), function (filter) {
                    if (_lodash2.default.findWhere(self.dateFields, filter.subject) === filter.subject) {
                        var key = filter.subject + (filter.operator === _odataFilterParser.Operators.GREATER_THAN_EQUAL ? 'Start' : 'End');
                        self.model[key] = filter.value;
                    } else if (_lodash2.default.findWhere(self.booleanFields, filter.subject) === filter.subject) {
                        self.model[filter.subject] = +filter.value > 0 ? true : false;
                    } else {
                        self.model[filter.subject] = filter.value;
                    }
                });
            }

            return Promise.all([this.loadService(this.countryServices, 'countries'), this.loadService(this.stampCollectionService, 'stampCollections'), this.loadService(this.albumService, 'albums'), this.loadService(this.sellerService, 'sellers'), this.loadService(this.catalogueService, 'catalogues')]).then(function () {
                self.loading = false;
            });
        };

        SearchForm.prototype.unbind = function unbind() {};

        SearchForm.prototype.reset = function reset() {
            var _this = this;

            _lodash2.default.forOwn(this.model, function (value, key) {
                if (_lodash2.default.isNumber(value)) {
                    _this.model[key] = -1;
                } else if (_lodash2.default.isBoolean(value)) {
                    _this.model[key] = false;
                } else {
                    _this.model[key] = null;
                }
            });
        };

        SearchForm.prototype.search = function search() {
            var _this2 = this;

            var predicates = [];
            _lodash2.default.forOwn(this.model, function (value, key) {
                var bool = _lodash2.default.isBoolean(value);
                if ((_lodash2.default.isNumber(value) || bool) && value > 0) {
                    predicates.push(new _odataFilterParser.Predicate({
                        subject: key,
                        value: bool ? 1 : value,
                        operator: bool ? _odataFilterParser.Operators.GREATER_THAN_EQUAL : _odataFilterParser.Operators.EQUALS
                    }));
                } else {
                    var match = key.match(/^.*(Start|End)$/);
                    if (match && match.length > 1 && (match[1] === 'Start' || match[1] === 'End') && value) {
                        var nkey = key.substring(0, key.length - match[1].length);
                        predicates.push(new _odataFilterParser.Predicate({
                            subject: nkey,
                            value: _lodash2.default.indexOf(_this2.dateFields, nkey) >= 0 ? new Date(value) : value,
                            operator: key.endsWith("Start") ? _odataFilterParser.Operators.GREATER_THAN_EQUAL : _odataFilterParser.Operators.LESS_THAN_EQUAL
                        }));
                    }
                }
            });
            if (predicates.length > 0) {
                var p = predicates.length > 1 ? _odataFilterParser.Predicate.concat(_odataFilterParser.Operators.AND, predicates) : predicates[0];
                _sessionContext.SessionContext.setSearchCondition(p);
                if (this.minimizeOnSearch === true) {
                    this.eventBus.publish(_eventManaged.EventNames.collapsePanel);
                }
            }
        };

        SearchForm.prototype.loadService = function loadService(svc, collectionName) {
            var self = this;
            return new Promise(function (resolve) {
                svc.find(svc.getDefaultSearchOptions()).then(function (results) {
                    self[collectionName] = results.models;
                    resolve();
                });
            });
        };

        return SearchForm;
    }()) || _class) || _class) || _class) || _class);
});
define('resources/elements/select-picker/select-picker',['exports', 'aurelia-framework', 'aurelia-i18n', 'jquery', 'lodash', 'select2'], function (exports, _aureliaFramework, _aureliaI18n, _jquery, _lodash, _select) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Select2Picker = undefined;

    var _jquery2 = _interopRequireDefault(_jquery);

    var _lodash2 = _interopRequireDefault(_lodash);

    var _select2 = _interopRequireDefault(_select);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class;

    var logger = _aureliaFramework.LogManager.getLogger('select-picker');

    var Select2Picker = exports.Select2Picker = (_dec = (0, _aureliaFramework.customElement)('select-picker'), _dec2 = (0, _aureliaFramework.bindable)('items'), _dec3 = (0, _aureliaFramework.bindable)('config'), _dec4 = (0, _aureliaFramework.bindable)('value'), _dec5 = (0, _aureliaFramework.bindable)('multiple'), _dec6 = (0, _aureliaFramework.bindable)({
        name: 'valueProperty',
        defaultValue: 'id'
    }), _dec7 = (0, _aureliaFramework.bindable)({
        name: 'valueType',
        defaultValue: 'Number'
    }), _dec8 = (0, _aureliaFramework.bindable)({
        name: 'labelProperty',
        defaultValue: 'name'
    }), _dec9 = (0, _aureliaFramework.inject)(Element, _aureliaI18n.I18N), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = _dec8(_class = _dec9(_class = function () {
        function Select2Picker(element, i18n) {
            _classCallCheck(this, Select2Picker);

            this.firedCollectionChanged = false;

            this.element = element;
            this.i18n = i18n;
        }

        Select2Picker.prototype.bind = function bind() {
            var select = this.element.firstElementChild;
            this.config = this.config || {};
            var caption = this.config.caption;
            if (caption && caption.indexOf('.') > 0) {
                caption = this.i18n.tr(caption);
            }

            var options = {
                placeholder: caption,
                allowClear: true
            };

            if (typeof this.config.filterSearch !== 'undefined' && this.config.filterSearch === false) {
                options.minimumResultsForSearch = Infinity;
            }

            if (this.config.valueProperty) {
                this.valueProperty = this.config.valueProperty;
            }
            if (this.config.labelProperty) {
                this.labelProperty = this.config.labelProperty;
            }
            if (this.config.valueType) {
                this.valueType = this.config.valueType;
            }
            if (typeof this.config.allowClear !== 'undefined') {
                options.allowClear = this.config.allowClear;
            }

            if (typeof this.config.noSearch !== 'undefined') {
                options.minimumResultsForSearch = Infinity;
            }

            if (this.config.id) {
                this.id = this.config.id;
            } else {
                this.id = "select-" + parseInt(Math.random() * 16384, 10);
            }

            if (this.config.multiple === true || this.multiple === 'true') {
                options.multiple = true;
                this.multiple = true;
            }

            var $select = (0, _jquery2.default)(select);
            $select.css('width', '100%');
            $select.on("select2:unselect", this.onUnselect.bind(this));
            $select.on("select2:select", this.onSelect.bind(this));

            if (this.valueType === Number) {
                $select.val(0);
            } else {
                $select.val(undefined);
            }
            this.select2 = $select.select2(options);

            var tabIndex = this.config.tabIndex;
            if (typeof tabIndex === 'undefined') {
                tabIndex = -1;
            }

            $select.attr('tabindex', -1);

            _lodash2.default.debounce(function (selectTarget, index) {
                selectTarget.parent().find('.select2-selection').attr('tabindex', index);
            })($select, tabIndex);
        };

        Select2Picker.prototype.unbind = function unbind() {
            var select = this.element.firstElementChild;
            if (select) {
                var $select = (0, _jquery2.default)(select);
                if ($select.data('select2')) {
                    $select.select2("destroy");
                }
            }
        };

        Select2Picker.prototype.onSelect = function onSelect(e) {
            var self = this;
            if (e.params && e.params.data) {
                var data = e.params.data.id;
                if (self.multiple === true && typeof data === 'string') {
                    var val = data;
                    data = self.value ? _lodash2.default.clone(self.value) : [];
                    data.push(val);
                }
                self.valueChanged(data, self.value);
            }
        };

        Select2Picker.prototype.getBoundValue = function getBoundValue(item) {
            return item[this.valueProperty];
        };

        Select2Picker.prototype.getBoundText = function getBoundText(item) {
            return item[this.labelProperty];
        };

        Select2Picker.prototype.onUnselect = function onUnselect(e) {
            var self = this;
            if (e.params && e.params.data) {
                if (self.multiple) {
                    var newArr = [];
                    if (self.value) {
                        newArr = _lodash2.default.clone(self.value);
                        _lodash2.default.remove(newArr, function (el) {
                            return el === e.params.data.id;
                        });
                    }
                    self.valueChanged(newArr, self.value);
                } else {
                    var newValue = "";
                    switch (self.valueType) {
                        case Number:
                            newValue = -1;
                            break;
                    }
                    self.valueChanged(newValue, self.value);
                }
            }
        };

        Select2Picker.prototype.attached = function attached() {
            _lodash2.default.debounce(function (self) {
                if (self.value !== undefined && self.items && self.items.length > 0) {
                    self.valueChanged(self.value, undefined);
                }
            }, 125)(this);
        };

        Select2Picker.prototype.itemsChanged = function itemsChanged(newValue, oldValue) {
            if (newValue && newValue.length > 0) {
                _lodash2.default.debounce(function (self) {
                    if (self.value) {
                        self.valueChanged(self.value, undefined);
                        if (self.firedCollectionChanged) {
                            logger.debug("Collections was changed after initial binding");
                        }
                        self.firedCollectionChanged = true;
                    }
                })(this);
            }
        };

        Select2Picker.prototype.selectAndFire = function selectAndFire(newValue, finalNewValue) {
            if (!finalNewValue) {
                finalNewValue = newValue;
            }

            if (this.select2.data('select2') !== undefined) {
                this.select2.val(newValue).trigger('change');
            }
            if (this.value !== finalNewValue) {
                this.value = finalNewValue;
            }
            this.element.dispatchEvent(new Event("change"));
        };

        Select2Picker.prototype.valueChanged = function valueChanged(newValue, oldValue) {
            if (newValue === undefined) {
                logger.warn("value is undefined for " + this.valueProperty);
                return;
            }
            if (this.multiple) {
                if (oldValue === null) {
                    oldValue = [];
                }
                if (_lodash2.default.xor(oldValue, newValue).length > 0) {
                    this.selectAndFire(newValue);
                }
            } else {
                if (this.valueType === "String") {
                    this.selectAndFire(newValue);
                } else if (this.valueType === "Number") {
                    var newValueInt = parseInt(Number(newValue), 10);
                    if (isNaN(newValueInt)) {
                        throw new Error('Item Id must be null or an integer!');
                    }
                    if (newValueInt === 0 || newValueInt !== Number(oldValue)) {
                        this.selectAndFire('' + newValue, newValueInt);
                    }
                }
            }
        };

        return Select2Picker;
    }()) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class);
});
define('resources/elements/stamps/stamp-card',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-binding', '../../../events/event-managed', '../../../services/preferences', 'lodash', 'jquery'], function (exports, _aureliaFramework, _aureliaEventAggregator, _aureliaBinding, _eventManaged, _preferences, _lodash, _jquery) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.StampCard = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _dec, _dec2, _dec3, _dec4, _dec5, _class;

    var defaultImagePath = "http://drake-server.ddns.net:9001/Thumbnails/";

    var StampCard = exports.StampCard = (_dec = (0, _aureliaFramework.customElement)('stamp-card'), _dec2 = (0, _aureliaFramework.inject)(Element, _aureliaEventAggregator.EventAggregator, _aureliaBinding.BindingEngine, _preferences.Preferences), _dec3 = (0, _aureliaFramework.bindable)('model'), _dec4 = (0, _aureliaFramework.bindable)('selected'), _dec5 = (0, _aureliaFramework.bindable)('highlight'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = function () {
        function StampCard(element, eventBus, $bindingEngine, prefService) {
            _classCallCheck(this, StampCard);

            this.imageShown = false;

            this.element = element;
            this.eventBus = eventBus;
            this.prefService = prefService;
            this.bindingEngine = $bindingEngine;
        }

        StampCard.prototype.modelChanged = function modelChanged(newValue) {
            if (newValue) {
                this.bindActiveNumber();
                this.bindImagePath();
            }
        };

        StampCard.prototype.bindActiveNumber = function bindActiveNumber() {
            var _this = this;

            this.activeCN = this.findActiveCatalogueNumber();
            if (this.activeCN) {
                (function () {
                    var observer = _this.bindingEngine.propertyObserver(_this.activeCN, 'active').subscribe(function () {
                        observer.dispose();
                        delete _this.model.activeCatalogueNumber;
                        _this.bindActiveNumber();
                    });
                })();
            }
        };

        StampCard.prototype.findActiveCatalogueNumber = function findActiveCatalogueNumber() {
            this.activeCN = this.model.activeCatalogueNumber ? this.model.activeCatalogueNumber : undefined;
            if (!this.activeCN) {
                this.activeCN = _lodash2.default.findWhere(this.model.catalogueNumbers, { active: true });
                this.model.activeCatalogueNumber = this.activeCN;
            }
            return this.activeCN;
        };

        StampCard.prototype.notFoundImage = function notFoundImage() {
            return StampCard.prototype.imageNotFoundFn;
        };

        StampCard.prototype.bindImagePath = function bindImagePath() {
            var _this2 = this;

            if (this.model && !this.model.wantList && !_lodash2.default.isEmpty(this.model.stampOwnerships)) {
                var owner = _lodash2.default.first(this.model.stampOwnerships);
                if (owner) {
                    var index;

                    var _ret2 = function () {
                        var observer = _this2.bindingEngine.propertyObserver(owner, 'img').subscribe(function () {
                            if (observer) {
                                observer.dispose();
                            }
                            _this2.imagePath = undefined;
                            _this2.bindImagePath();
                        });
                        var path = owner.img;
                        if (path) {
                            index = path.lastIndexOf('/');

                            path = path.substring(0, index + 1) + "thumb-" + path.substring(index + 1);
                            _this2.imagePath = defaultImagePath + path;
                            return {
                                v: void 0
                            };
                        }
                    }();

                    if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
                }
            }
            this.imagePath = StampCard.prototype.imageNotFoundFn();
        };

        StampCard.prototype.showFullSizeImage = function showFullSizeImage(evt) {
            evt.cancelBubble = true;
            if (!_lodash2.default.isEmpty(this.model.stampOwnerships) && _lodash2.default.first(this.model.stampOwnerships).img) {
                this.eventBus.publish(_eventManaged.EventNames.showImage, this.model);
            }
        };

        StampCard.prototype.remove = function remove() {
            this.eventBus.publish(_eventManaged.EventNames.stampRemove, this.model);
        };

        StampCard.prototype.toggleSelection = function toggleSelection(evt) {
            var t = (0, _jquery2.default)(evt.target);
            var p = t.parents('button');
            if (this.model.selected && (p.length !== 0 || t.is('button'))) {
                return;
            }
            this.eventBus.publish(_eventManaged.EventNames.toggleStampSelection, { model: this.model, shiftKey: evt.shiftKey });
        };

        StampCard.prototype.edit = function edit() {
            this.eventBus.publish(_eventManaged.EventNames.stampEdit, this.model);
        };

        _createClass(StampCard, [{
            key: 'ownership',
            get: function get() {
                return this.model && !_lodash2.default.isEmpty(this.model.stampOwnerships) ? _lodash2.default.first(this.model.stampOwnerships) : undefined;
            }
        }]);

        return StampCard;
    }()) || _class) || _class) || _class) || _class) || _class);


    StampCard.prototype.imageNotFoundFn = function () {
        this.src = 'resources/images/not-available.png';
    };
});
define('resources/elements/stamps/stamp-details',['exports', 'aurelia-framework', 'aurelia-binding', 'aurelia-event-aggregator', '../../../events/event-managed', '../../../services/countries', 'jquery'], function (exports, _aureliaFramework, _aureliaBinding, _aureliaEventAggregator, _eventManaged, _countries, _jquery) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.StampDetailsComponent = undefined;

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _dec, _dec2, _class, _class2, _temp;

    var StampDetailsComponent = exports.StampDetailsComponent = (_dec = (0, _aureliaFramework.customElement)('stamp-details'), _dec2 = (0, _aureliaFramework.bindable)('model'), _dec(_class = _dec2(_class = (_temp = _class2 = function (_EventManaged) {
        _inherits(StampDetailsComponent, _EventManaged);

        function StampDetailsComponent(eventBus, $bindingEngine, countryService) {
            _classCallCheck(this, StampDetailsComponent);

            var _this = _possibleConstructorReturn(this, _EventManaged.call(this, eventBus));

            _this.countries = [];
            _this.loading = true;
            _this.editing = false;
            _this._modelSubscribers = [];

            _this.bindingEngine = $bindingEngine;
            _this.countryService = countryService;
            _this.loadCountries();
            return _this;
        }

        StampDetailsComponent.prototype.detached = function detached() {
            _EventManaged.prototype.detached.call(this);
            this._modelSubscribers.forEach(function (sub) {
                sub.dispose();
            });
        };

        StampDetailsComponent.prototype.modelChanged = function modelChanged(newValue) {
            this._modelSubscribers.forEach(function (sub) {
                sub.dispose();
            });
            this._modelSubscribers = [];
            if (newValue) {
                this._modelSubscribers.push(this.bindingEngine.propertyObserver(newValue, 'countryRef').subscribe(this.countrySelected.bind(this)));
                this.editing = newValue.id > 0;
                if (this.model.id <= 0) {
                    setTimeout(function () {
                        (0, _jquery2.default)('#details-rate').focus();
                    }, 25);
                }
            }
        };

        StampDetailsComponent.prototype.countrySelected = function countrySelected() {
            if (this.model.countryRef > 0) {
                this.eventBus.publish(_eventManaged.EventNames.checkExists, { model: this.model });
                this.eventBus.publish(_eventManaged.EventNames.calculateImagePath, { model: this.model });
            }
        };

        StampDetailsComponent.prototype.changeEditMode = function changeEditMode(mode) {
            this.eventBus.publish(_eventManaged.EventNames.changeEditMode, mode);
        };

        StampDetailsComponent.prototype.loadCountries = function loadCountries() {
            var self = this;
            this.countryService.find(this.countryService.getDefaultSearchOptions()).then(function (results) {
                self.countries = results.models;
                self.loading = false;
            });
        };

        return StampDetailsComponent;
    }(_eventManaged.EventManaged), _class2.inject = [_aureliaEventAggregator.EventAggregator, _aureliaBinding.BindingEngine, _countries.Countries], _temp)) || _class) || _class);
});
define('resources/elements/stamps/stamp-editor',['exports', 'aurelia-framework', '../../../util/common-models', '../../../services/stamps', '../../../services/countries', '../../../services/catalogues', '../../../services/preferences', 'aurelia-event-aggregator', '../../../events/event-managed', 'lodash'], function (exports, _aureliaFramework, _commonModels, _stamps, _countries, _catalogues, _preferences, _aureliaEventAggregator, _eventManaged, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.StampEditorComponent = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2;

    var logger = _aureliaFramework.LogManager.getLogger('stamp-editor');

    var PreferredValues = [{ key: 'countryRef', category: 'stamps', type: Number }, { key: 'catalogueRef', category: 'stamps', type: Number, model: ['activeCatalogueNumber'] }, { key: 'condition', category: 'stamps', type: Number, model: ['activeCatalogueNumber', 'ownership'] }, { key: 'albumRef', category: 'stamps', type: Number, model: ['ownership'] }, { key: 'sellerRef', category: 'stamps', type: Number, model: ['ownership'] }, { key: 'grade', category: 'stamps', type: Number, model: ['ownership'] }];

    var CACHED_PURCHASED = 'stamp-editor.purchased';

    function createCatalogueNumber() {
        return {
            id: 0,
            catalogueRef: -1,
            value: 0.0,
            condition: 0,
            number: '',
            active: true,
            unknown: false
        };
    }

    function createOwnership() {
        return {
            id: 0,
            albumRef: -1,
            sellerRef: -1,
            code: _commonModels.CurrencyCode.USD.keyName,
            purchased: null,
            pricePaid: 0.0,
            defects: 0,
            deception: 0,
            condition: 0,
            grade: 0,
            img: ''
        };
    }

    var StampEditorComponent = exports.StampEditorComponent = (_dec = (0, _aureliaFramework.customElement)('stamp-editor'), _dec2 = (0, _aureliaFramework.bindable)('model'), _dec3 = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _stamps.Stamps, _countries.Countries, _catalogues.Catalogues, _preferences.Preferences), _dec4 = (0, _aureliaFramework.computedFrom)('duplicateModel'), _dec5 = (0, _aureliaFramework.computedFrom)('duplicateModel'), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = function (_EventManaged) {
        _inherits(StampEditorComponent, _EventManaged);

        function StampEditorComponent(eventBus, stampService, countryService, catalogueService, preferenceService) {
            _classCallCheck(this, StampEditorComponent);

            var _this = _possibleConstructorReturn(this, _EventManaged.call(this, eventBus));

            _this.createMode = false;
            _this.usedInlineImagePath = false;
            _this.useCataloguePrefix = false;
            _this.preferences = [];
            _this.loaded = false;
            _this.usedConditions = [_commonModels.Condition.USED.ordinal, _commonModels.Condition.CTO.ordinal, _commonModels.Condition.COVER.ordinal, _commonModels.Condition.ON_PAPER.ordinal];
            _this.cachedValues = {
                purchased: null
            };
            _this.catalogues = [];

            _this.stampService = stampService;
            _this.countryService = countryService;
            _this.catalogueService = catalogueService;
            _this.preferenceService = preferenceService;

            var purchasedValue = localStorage.getItem(CACHED_PURCHASED);
            _this.cachedValues.purchased = purchasedValue ? new Date(purchasedValue) : null;
            return _this;
        }

        StampEditorComponent.prototype.attached = function attached() {
            this.setPreferences();
            this.loadServices();
            this.subscribe(_eventManaged.EventNames.checkExists, this.checkExists.bind(this));
            this.subscribe(_eventManaged.EventNames.calculateImagePath, this.calculateImagePath.bind(this));
            this.subscribe(_eventManaged.EventNames.convert, this.convertToStamp.bind(this));
            this.subscribe(_eventManaged.EventNames.changeEditMode, this.changeEditMode.bind(this));
        };

        StampEditorComponent.prototype.loadServices = function loadServices() {
            var _this2 = this;

            var self = this;
            var services = [this.countryService.find(this.countryService.getDefaultSearchOptions()), this.catalogueService.find(this.catalogueService.getDefaultSearchOptions())];
            Promise.all(services).then(function (serviceResult) {
                if (serviceResult && serviceResult.length > 0) {
                    _this2.catalogues = serviceResult[1].models;
                }
                self.loaded = true;
            });
        };

        StampEditorComponent.prototype.changeEditMode = function changeEditMode(mode) {
            if (this.createMode === true && (mode === 'wantList' || mode === 'stamp')) {
                this.duplicateModel.wantList = !this.duplicateModel.wantList;
                if (!this.duplicateModel.wantList) {
                    this.convertToStamp(this.duplicateModel);
                } else {
                    delete this.duplicateModel.stampOwnerships;
                }
            } else if (this.createMode === false && mode === 'create') {
                this.eventBus.publish(_eventManaged.EventNames.stampCreate);
            }
        };

        StampEditorComponent.prototype.convertToStamp = function convertToStamp(m) {
            if (m) {
                this.duplicateModel = m;
                this.duplicateModel.stampOwnerships = [];
                this.duplicateModel.wantList = false;

                var owner = this.ownership;
                this.processPreferences(true);
                this.calculateImagePath();
            }
        };

        StampEditorComponent.prototype.calculateImagePath = function calculateImagePath() {

            if (this.calculateImagePathFn && this.calculateImagePathFn.clearTimeout) {
                this.calculateImagePathFn.clearTimeout();
                this.calculateImagePathFn = undefined;
            }
            var self = this;
            this.calculateImagePathFn = setTimeout(function () {
                var m = self.duplicateModel;
                if (m.wantList === false && m.stampOwnerships && m.stampOwnerships.length > 0 && (self.createMode === true || _lodash2.default.first(m.stampOwnerships).img === '')) {
                    var cn = m.activeCatalogueNumber;
                    if (m.countryRef > 0 && cn.number !== '') {
                        var country = self.countryService.getById(m.countryRef);
                        if (country) {
                            var path = country.name + '/';
                            if (!self.usedInlineImagePath && self.usedConditions.indexOf(cn.condition) >= 0) {
                                path += cn.condition === _commonModels.Condition.COVER.ordinal ? 'on-cover/' : 'used/';
                            }
                            if (self.useCataloguePrefix === true && cn.catalogueRef > 0) {
                                path += _commonModels.CatalogueHelper.getImagePrefix(self.catalogueService.getById(cn.catalogueRef));
                            }
                            path += cn.number + '.jpg';
                            var owner = _lodash2.default.first(m.stampOwnerships);
                            owner.img = path;
                        }
                    }
                }
                this.calculateImagePathFn = undefined;
            }, 500);
        };

        StampEditorComponent.prototype.checkExists = function checkExists() {
            if (this.checkExistsFn && this.checkExistsFn.clearTimeout) {
                this.checkExistsFn.clearTimeout();
                this.checkExistsFn = undefined;
            }
            var self = this;
            this.checkExistsFn = setTimeout(function () {
                if (self.duplicateModel && (self.duplicateModel.id <= 0 || self.duplicateModel.wantList === true) && self.duplicateModel.countryRef > 0 && self.duplicateModel.activeCatalogueNumber) {
                    var cn = self.duplicateModel.activeCatalogueNumber;
                    if (cn.catalogueRef > 0 && cn.number && cn.number !== '') {
                        var opts = {
                            $filter: '((countryRef eq ' + self.duplicateModel.countryRef + ') and (number eq \'' + cn.number + '\'))'
                        };
                        self.stampService.find(opts).then(function (results) {
                            if (results.models.length > 0) {
                                self.processExistenceResults(results.models);
                            }
                        });
                    }
                }
                this.checkExistsFn = undefined;
            }, 350);
        };

        StampEditorComponent.prototype.processExistenceResults = function processExistenceResults(models) {
            var _this3 = this;

            if (this.duplicateModel.wantList === false) {
                _lodash2.default.remove(models, { id: this.duplicateModel.id });
            }
            if (models && models.length > 0) {
                (function () {
                    var catalogueType = _lodash2.default.find(_this3.catalogues, { id: _this3.activeCatalogueNumber.catalogueRef }).type;

                    var matchingStamps = _lodash2.default.remove(models, function (m) {
                        var cn = _lodash2.default.find(m.catalogueNumbers, { active: true });
                        var cnType = _lodash2.default.find(_this3.catalogues, { id: cn.catalogueRef }).type;
                        return cnType === catalogueType;
                    });
                    if (matchingStamps.length > 0) {
                        var index = _lodash2.default.findIndex(matchingStamps, { wantList: true });
                        var wantList = index >= 0;
                        var obj = {
                            convert: wantList,
                            conversionModel: index >= 0 ? matchingStamps[index] : undefined
                        };
                        _this3.eventBus.publish(_eventManaged.EventNames.conflictExists, obj);
                    }
                })();
            }
        };

        StampEditorComponent.prototype.setPreferences = function setPreferences() {
            var self = this;
            this.preferenceService.find().then(function (results) {
                self.preferences = results.models;
                self.processPreferences(self.duplicateModel && self.duplicateModel.id <= 0);
            });
        };

        StampEditorComponent.prototype.processPreferences = function processPreferences(alwaysProcess) {
            var _this4 = this;

            if (this.preferences.length > 0) {
                var p = _lodash2.default.findWhere(this.preferences, { name: 'usedInlineImagePath', category: 'stamps' });
                this.usedInlineImagePath = p && p.value === 'true';
                var catPrefix = _lodash2.default.findWhere(this.preferences, { name: 'applyCatalogueImagePrefix', category: 'stamps' });
                this.useCataloguePrefix = catPrefix && catPrefix.value === 'true';
                if (this.duplicateModel && this.duplicateModel.id <= 0 || alwaysProcess === true) {
                    (function () {
                        var m = _this4.duplicateModel;
                        if (m) {
                            logger.info("Stamp model was available on preferences initialization");
                        }
                        PreferredValues.forEach(function (pref) {
                            var _this5 = this;

                            var prefValue = _lodash2.default.findWhere(this.preferences, { name: pref.key, category: pref.category });
                            if (prefValue) {
                                (function () {
                                    var value = prefValue.value;
                                    if (pref.type === Number) {
                                        value = +value;
                                    }

                                    if (pref.model) {
                                        pref.model.forEach(function (key) {
                                            if (key === "activeCatalogueNumber") {
                                                m = this.activeCatalogueNumber;
                                            } else if (key === "ownership") {
                                                m = this.ownership;
                                            }
                                            if (m && pref.type === Number && (m[pref.key] === undefined || m[pref.key] <= 0 && value > 0)) {
                                                m[pref.key] = value;
                                            }
                                        }, _this5);
                                    } else if (m && pref.type === Number && (m[pref.key] === undefined || m[pref.key] <= 0 && value > 0)) {
                                        m[pref.key] = value;
                                    } else if (!m) {
                                        logger.warn("The stamp model was not defined at the point of preferences initialization.");
                                    }
                                })();
                            }
                        }, _this4);
                    })();
                }
            }
        };

        StampEditorComponent.prototype.save = function save(keepOpen) {
            var self = this;
            if (self.validate() && self.preprocess()) {
                _lodash2.default.each(self.duplicateModel.catalogueNumbers, function (cn) {
                    if (cn.__validationReporter__) {
                        delete cn.__validationReporter__;
                    }
                });
                self.stampService.save(self.duplicateModel).then(function (stamp) {
                    if (self.duplicateModel.id <= 0) {
                        self.eventBus.publish(_eventManaged.EventNames.stampCount, { stamp: self.duplicateModel, increment: true });
                        self.cacheSessionValues(self.duplicateModel);
                    }
                    self.eventBus.publish(_eventManaged.EventNames.stampSaved, { stamp: stamp, remainOpen: keepOpen });
                    if (keepOpen) {
                        self.resetModel();
                    }
                }).catch(function (err) {
                    logger.error(err);
                });
            }
        };

        StampEditorComponent.prototype.cacheSessionValues = function cacheSessionValues(m) {
            var owner = m.stampOwnerships && m.stampOwnerships.length > 0 ? m.stampOwnerships[0] : undefined;
            if (owner && owner.id <= 0) {
                this.cachedValues.purchased = owner.purchased ? owner.purchased : null;
                localStorage.setItem(CACHED_PURCHASED, this.cachedValues.purchased);
            }
        };

        StampEditorComponent.prototype.cancel = function cancel() {
            this.eventBus.publish(_eventManaged.EventNames.stampEditorCancel);
        };

        StampEditorComponent.prototype.saveAndNew = function saveAndNew() {
            this.save(true);
        };

        StampEditorComponent.prototype.validate = function validate() {
            return true;
        };

        StampEditorComponent.prototype.preprocess = function preprocess() {
            var owner = this.ownership;

            if (owner && (owner.purchased === "" || owner.purchased === undefined)) {
                owner.purchased = null;
            }
            return true;
        };

        StampEditorComponent.prototype.resetModel = function resetModel() {
            this.duplicateModel.id = 0;
            this.duplicateModel.rate = "";
            this.duplicateModel.description = "";
            this.resetCatalogueNumber(this.activeCatalogueNumber);
            this.resetOwnership(this.ownership);
            this.model = this.duplicateModel;
        };

        StampEditorComponent.prototype.resetCatalogueNumber = function resetCatalogueNumber(cn) {
            cn.id = 0;
            cn.number = "";
            cn.unknown = false;
            cn.nospace = false;
            cn.value = 0;
        };

        StampEditorComponent.prototype.resetOwnership = function resetOwnership(owner) {
            if (owner) {
                owner.notes = undefined;
                owner.cert = false;
                owner.img = undefined;
                owner.certImg = undefined;
                owner.pricePaid = 0.0;
                owner.defects = 0;
                owner.deception = 0;
            }
        };

        StampEditorComponent.prototype.modelChanged = function modelChanged(newValue) {
            this.createMode = newValue && newValue.id <= 0;
            if (newValue) {
                this.duplicateModel = _lodash2.default.clone(newValue, true);
                if (this.preferenceService.loaded) {
                    this.processPreferences(this.duplicateModel.id <= 0);
                }
                if (this.createMode) {
                    var owner = this.ownership;
                }
            } else {
                this.duplicateModel = null;
            }
        };

        _createClass(StampEditorComponent, [{
            key: 'ownership',
            get: function get() {
                var self = this;
                if (!self.duplicateModel) {
                    return undefined;
                }
                var owners = self.duplicateModel.stampOwnerships;
                var owner = void 0;
                if (self.duplicateModel.wantList === false) {
                    var configureOwnership = function configureOwnership() {
                        self.duplicateModel.stampOwnerships = [];
                        owner = createOwnership();
                        if (owner && self.cachedValues.purchased) {
                            owner.purchased = self.cachedValues.purchased;
                        }
                        self.duplicateModel.stampOwnerships.push(owner);
                    };
                    if (!owners) {
                        configureOwnership();
                    } else if (self.duplicateModel.stampOwnerships.length > 0) {
                        owner = _lodash2.default.first(self.duplicateModel.stampOwnerships);
                    } else {
                        configureOwnership();
                    }
                }
                return owner;
            }
        }, {
            key: 'activeCatalogueNumber',
            get: function get() {
                if (!this.duplicateModel) {
                    return undefined;
                }
                var activeNumber = this.duplicateModel.activeCatalogueNumber;
                if (!activeNumber) {
                    if (!this.duplicateModel.catalogueNumbers) {
                        this.duplicateModel.catalogueNumbers = [];
                    } else {
                        activeNumber = _lodash2.default.findWhere(this.duplicateModel.catalogueNumbers, { active: true });
                    }
                    if (!activeNumber) {
                        activeNumber = createCatalogueNumber();
                        this.duplicateModel.catalogueNumbers.push(activeNumber);
                    }
                    this.duplicateModel.activeCatalogueNumber = activeNumber;
                }
                return activeNumber;
            }
        }]);

        return StampEditorComponent;
    }(_eventManaged.EventManaged), (_applyDecoratedDescriptor(_class2.prototype, 'ownership', [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, 'ownership'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'activeCatalogueNumber', [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, 'activeCatalogueNumber'), _class2.prototype)), _class2)) || _class) || _class) || _class);
});
define('resources/elements/stamps/stamp-grid',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.StampGrid = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _class;

  var StampGrid = exports.StampGrid = (_dec = (0, _aureliaFramework.customElement)('stamp-grid'), _dec2 = (0, _aureliaFramework.bindable)('stamps'), _dec3 = (0, _aureliaFramework.bindable)('editId'), _dec4 = (0, _aureliaFramework.bindable)('lastSelected'), _dec5 = (0, _aureliaFramework.bindable)('showCatalogueNumbers'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = function StampGrid() {
    _classCallCheck(this, StampGrid);
  }) || _class) || _class) || _class) || _class) || _class);
});
define('resources/elements/stamps/stamp-replacement-table',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-binding', '../../../services/stamps', '../../../events/event-managed', '../../../services/catalogues', '../../../util/common-models', 'lodash', 'jquery'], function (exports, _aureliaFramework, _aureliaEventAggregator, _aureliaBinding, _stamps, _eventManaged, _catalogues, _commonModels, _lodash, _jquery) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.StampReplacementTable = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    var _dec, _dec2, _dec3, _class, _desc, _value, _class2;

    var defaultImagePath = "http://drake-server.ddns.net:9001/Thumbnails/";
    var logger = _aureliaFramework.LogManager.getLogger('stamp-replacement-table');

    var StampReplacementTable = exports.StampReplacementTable = (_dec = (0, _aureliaFramework.customElement)('stamp-replacement-table'), _dec2 = (0, _aureliaFramework.bindable)({
        name: 'stamps',
        defaultValue: []
    }), _dec3 = (0, _aureliaFramework.computedFrom)('model.filterCatalogueRef', 'model.replacementCatalogueRef'), _dec(_class = _dec2(_class = (_class2 = function () {
        StampReplacementTable.inject = function inject() {
            return [Element, _aureliaBinding.BindingEngine, _aureliaEventAggregator.EventAggregator, _catalogues.Catalogues, _stamps.Stamps];
        };

        function StampReplacementTable(element, bindingEngine, eventBus, catalogues, stamps) {
            _classCallCheck(this, StampReplacementTable);

            this.model = {
                filterCatalogueRef: -1,
                replacementCatalogueRef: -1
            };
            this.catalogues = [];
            this.filteredStamps = [];
            this.editingRow = -1;
            this.conditions = _commonModels.Condition.symbols();
            this.editCount = 0;

            this.element = element;
            this.bindingEngine = bindingEngine;
            this.eventBus = eventBus;
            this.catalogueService = catalogues;
            this.stampsService = stamps;
        }

        StampReplacementTable.prototype.stampsChanged = function stampsChanged(newList, oldList) {
            if (newList !== oldList) {
                this.filterStamps();
            }
        };

        StampReplacementTable.prototype.editingRowChanged = function editingRowChanged(newIndex) {
            this.editingCatalogueNumber = this.getReplacementCatalogueNumber(this.filteredStamps[newIndex]);
            logger.debug(this.editingCatalogueNumber);
            if (this.editingCatalogueNumber) {
                this._setupEditSubscribers(this.filteredStamps[newIndex], this.editingCatalogueNumber);
            }
            _lodash2.default.debounce(function () {
                (0, _jquery2.default)('.replacement-number-input').focus();
            }, 250)();
        };

        StampReplacementTable.prototype.attached = function attached() {
            var _this = this;

            this.loading = true;
            this.catalogueService.find(this.catalogueService.getDefaultSearchOptions()).then(function (results) {
                _this.catalogues = results.models;
                _this.loading = false;
            });
            this._editSubscribers = [];
            this._modelSubscribers = [];
            this._modelSubscribers.push(this.bindingEngine.propertyObserver(this, 'editingRow').subscribe(this.editingRowChanged.bind(this)));
        };

        StampReplacementTable.prototype.detached = function detached() {
            this._modelSubscribers.forEach(function (sub) {
                sub.dispose();
            });
            this._clearEditSubscribers();
        };

        StampReplacementTable.prototype.filterStamps = function filterStamps() {
            this.filteredStamps.splice(0, this.filteredStamps.length);
            var self = this;
            _lodash2.default.each(this.stamps, function (stamp) {
                var index = _lodash2.default.findIndex(stamp.catalogueNumbers, { catalogueRef: self.model.filterCatalogueRef });
                if (index >= 0) {
                    var s = _lodash2.default.clone(stamp, true);
                    var cn = s.catalogueNumbers[index];
                    self._storeOriginalValues(cn);
                    cn.catalogueRef = self.model.replacementCatalogueRef;
                    cn.replacing = true;
                    self.filteredStamps.push(s);
                }
            });
            if (this.filteredStamps.length > 0) {
                _lodash2.default.debounce(function (context) {
                    context.editingRow = 0;
                })(this);
            }
        };

        StampReplacementTable.prototype.select = function select($index) {
            this.editingRow = $index;
        };

        StampReplacementTable.prototype.getCurrencyCode = function getCurrencyCode(cn) {
            if (cn) {
                if (!cn.currencyCode) {
                    cn.currencyCode = _lodash2.default.find(this.catalogues, { id: cn.catalogueRef }).code;
                }
                return cn.currencyCode;
            }
        };

        StampReplacementTable.prototype.getReplacementCatalogueNumber = function getReplacementCatalogueNumber(stamp) {
            return _lodash2.default.find(stamp.catalogueNumbers, { replacing: true });
        };

        StampReplacementTable.prototype.getImagePath = function getImagePath(stamp) {
            var path = '';
            if (!stamp.wantList && !_lodash2.default.isEmpty(stamp.stampOwnerships && _lodash2.default.first(stamp.stampOwnerships).img)) {
                var img = _lodash2.default.first(stamp.stampOwnerships).img;
                if (img && img !== '') {
                    var index = img.lastIndexOf('/');
                    img = img.substring(0, index + 1) + "thumb-" + img.substring(index + 1);
                    path = defaultImagePath + img;
                }
            }
            return path;
        };

        StampReplacementTable.prototype.showFullSizeImage = function showFullSizeImage(evt, stamp) {
            evt.cancelBubble = true;
            if (!_lodash2.default.isEmpty(stamp.stampOwnerships) && _lodash2.default.first(stamp.stampOwnerships).img) {
                this.eventBus.publish(_eventManaged.EventNames.showImage, stamp);
            }
            return false;
        };

        StampReplacementTable.prototype.notFoundImage = function notFoundImage() {
            return StampReplacementTable.prototype.imageNotFoundFn;
        };

        StampReplacementTable.prototype.advanceToNextRow = function advanceToNextRow($event) {
            if ($event.keyCode === _eventManaged.KeyCodes.VK_TAB && this.editingRow < this.filteredStamps.length - 2) {
                this.select(this.editingRow + 1);
                return false;
            }
            return true;
        };

        StampReplacementTable.prototype.saveAll = function saveAll() {
            var _this2 = this;

            var modified = _lodash2.default.filter(this.filteredStamps, { __modified__: true });
            var savePromises = [];
            _lodash2.default.each(modified, function (stamp) {
                savePromises.push(_this2.stampsService.save(stamp));
            });
            Promise.all(savePromises).then(function (result) {
                if (result) {
                    _lodash2.default.each(result, function (s) {
                        _this2.filterStamps();
                    });
                }
            });
        };

        StampReplacementTable.prototype._setupEditSubscribers = function _setupEditSubscribers(stamp, cn) {
            this._clearEditSubscribers();
            this._editSubscribers.push(this.bindingEngine.propertyObserver(cn, 'number').subscribe(this._checkForModifiedStamp.bind(this)));
            this._editSubscribers.push(this.bindingEngine.propertyObserver(cn, 'value').subscribe(this._checkForModifiedStamp.bind(this)));
            this._editSubscribers.push(this.bindingEngine.propertyObserver(cn, 'condition').subscribe(this._checkForModifiedStamp.bind(this)));
        };

        StampReplacementTable.prototype._clearEditSubscribers = function _clearEditSubscribers() {
            if (this._editSubscribers) {
                this._editSubscribers.forEach(function (sub) {
                    sub.dispose();
                });
            }
            this._editSubscribers = [];
        };

        StampReplacementTable.prototype._checkForModifiedStamp = function _checkForModifiedStamp() {
            var stamp = this.filteredStamps[this.editingRow];
            var currentModified = stamp.__modified__;
            var modified = this._markedAsModified(stamp, this.getReplacementCatalogueNumber(stamp));
            if (modified !== currentModified) {
                this.editCount += modified ? 1 : -1;
            }
        };

        StampReplacementTable.prototype._storeOriginalValues = function _storeOriginalValues(cn) {
            cn.__orig__ = {
                catalogueRef: cn.catalogueRef,
                condition: cn.condition,
                number: cn.number,
                value: cn.value,
                unknown: cn.unknown
            };
        };

        StampReplacementTable.prototype._markedAsModified = function _markedAsModified(stamp, cn) {
            stamp.__modified__ = cn.__orig__.number !== cn.number || cn.__orig__.condition !== cn.condition || cn.__orig__.value !== cn.value || cn.__orig__.unknown !== cn.unknown;
            return stamp.__modified__;
        };

        _createClass(StampReplacementTable, [{
            key: 'filterReady',
            get: function get() {
                return this.model.filterCatalogueRef >= 0 && this.model.replacementCatalogueRef >= 0;
            }
        }]);

        return StampReplacementTable;
    }(), (_applyDecoratedDescriptor(_class2.prototype, 'filterReady', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'filterReady'), _class2.prototype)), _class2)) || _class) || _class);

    StampReplacementTable.prototype.imageNotFoundFn = function () {
        (0, _jquery2.default)(this).hide();
    };
});
define('resources/elements/stamps/stamp-table',['exports', 'aurelia-framework', 'aurelia-event-aggregator', '../../../services/catalogues', '../../../events/event-managed', 'lodash'], function (exports, _aureliaFramework, _aureliaEventAggregator, _catalogues, _eventManaged, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.StampTable = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _dec3, _dec4, _dec5, _class;

    var defaultImagePath = "http://drake-server.ddns.net:9001/Thumbnails/";

    var StampTable = exports.StampTable = (_dec = (0, _aureliaFramework.customElement)('stamp-table'), _dec2 = (0, _aureliaFramework.inject)(Element, _aureliaEventAggregator.EventAggregator, _catalogues.Catalogues), _dec3 = (0, _aureliaFramework.bindable)('stamps'), _dec4 = (0, _aureliaFramework.bindable)('lastSelected'), _dec5 = (0, _aureliaFramework.bindable)('total'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = function () {
        function StampTable(element, eventBus, catalogueService) {
            _classCallCheck(this, StampTable);

            this.catalogues = [];
            this.models = [];
            this.lastTime = 0;

            this.catalogueService = catalogueService;
            this.eventBus = eventBus;
            this.element = element;
        }

        StampTable.prototype.bind = function bind() {
            var _this = this;

            this.catalogueService.find(this.catalogueService.getDefaultSearchOptions).then(function (result) {
                _this.catalogues = result.models;
                _this.models = _this.stamps;
            });
        };

        StampTable.prototype.stampsChanged = function stampsChanged(newValues) {
            if (this.catalogueService.loaded) {
                this.models = newValues;
            }
        };

        StampTable.prototype.toggleSelection = function toggleSelection(evt, stamp) {
            var _this2 = this;

            if (this.selectionTimeout) {
                clearTimeout(this.selectionTimeout);
            }
            if (evt.detail > 1) {
                return;
            }
            this.selectionTimeout = setTimeout(function () {
                _this2.eventBus.publish(_eventManaged.EventNames.toggleStampSelection, { model: stamp, shiftKey: evt.shiftKey });
                _this2.selectionTimeout = undefined;
            }, 200);
        };

        StampTable.prototype.edit = function edit(stamp) {
            if (!stamp.selected) {
                this.eventBus.publish(_eventManaged.EventNames.toggleStampSelection, { model: stamp, shiftKey: false });
            }
            this.eventBus.publish(_eventManaged.EventNames.stampEdit, stamp);
        };

        StampTable.prototype.getImagePath = function getImagePath(stamp) {
            var path = '';
            if (!stamp.wantList && !_lodash2.default.isEmpty(stamp.stampOwnerships && _lodash2.default.first(stamp.stampOwnerships).img)) {
                var img = _lodash2.default.first(stamp.stampOwnerships).img;
                if (img && img !== '') {
                    var index = img.lastIndexOf('/');
                    img = img.substring(0, index + 1) + "thumb-" + img.substring(index + 1);
                    path = defaultImagePath + img;
                }
            }
            return path;
        };

        StampTable.prototype.showFullSizeImage = function showFullSizeImage(evt, stamp) {
            evt.cancelBubble = true;
            if (!_lodash2.default.isEmpty(stamp.stampOwnerships) && _lodash2.default.first(stamp.stampOwnerships).img) {
                this.eventBus.publish(_eventManaged.EventNames.showImage, stamp);
            }
            return false;
        };

        StampTable.prototype.notFoundImage = function notFoundImage() {
            return StampTable.prototype.imageNotFoundFn;
        };

        StampTable.prototype.getActiveCatalogueNumber = function getActiveCatalogueNumber(stamp) {
            if (stamp) {
                if (!stamp.activeCatalogueNumber) {
                    var index = _lodash2.default.findIndex(stamp.catalogueNumbers, { active: true });
                    stamp.activeCatalogueNumber = stamp.catalogueNumbers[index];
                }
                return stamp.activeCatalogueNumber;
            }
            return {};
        };

        StampTable.prototype.getOwnership = function getOwnership(stamp) {
            if (stamp.stampOwnerships && stamp.stampOwnerships.length > 0) {
                return stamp.stampOwnerships[0];
            }
            return {};
        };

        StampTable.prototype.getCurrencyCode = function getCurrencyCode(cn) {
            if (cn) {
                if (!cn.currencyCode) {
                    var indx = _lodash2.default.findIndex(this.catalogues, { id: cn.catalogueRef });
                    cn.currencyCode = this.catalogues[indx].code;
                }
                return cn.currencyCode;
            }
        };

        return StampTable;
    }()) || _class) || _class) || _class) || _class) || _class);


    StampTable.prototype.imageNotFoundFn = function () {
        $(this).hide();
    };
});
define('resources/views/albums/album-editor',['exports', 'aurelia-framework', '../../../services/stampCollections', 'jquery', 'lodash'], function (exports, _aureliaFramework, _stampCollections, _jquery, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.albumEditor = undefined;

    var _jquery2 = _interopRequireDefault(_jquery);

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var logger = _aureliaFramework.LogManager.getLogger('albumEditor');

    var albumEditor = exports.albumEditor = (_dec = (0, _aureliaFramework.inject)(_stampCollections.StampCollections), _dec(_class = function () {
        function albumEditor(stampCollections) {
            _classCallCheck(this, albumEditor);

            this.stampCollections = [];

            this.stampCollectionService = stampCollections;
        }

        albumEditor.prototype.activate = function activate(options) {
            this.model = options;
            var that = this;
            var p = this.stampCollectionService.find();
            p.then(function (results) {
                that.stampCollections = results.models;
            }).catch(function (err) {
                logger.error("Error with stamp collections", err);
            });
            if (!(this.model.id > 0)) {
                _lodash2.default.debounce(function () {
                    (0, _jquery2.default)('#editor-name').focus();
                }, 125)(this);
            }
            return p;
        };

        return albumEditor;
    }()) || _class);
});
define('resources/views/catalogues/catalogue-editor',['exports', 'jquery', 'lodash', '../../../util/common-models'], function (exports, _jquery, _lodash, _commonModels) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.catalogueEditor = undefined;

    var _jquery2 = _interopRequireDefault(_jquery);

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var catalogueEditor = exports.catalogueEditor = function () {
        function catalogueEditor() {
            _classCallCheck(this, catalogueEditor);

            this.codes = _commonModels.CurrencyCode.symbols();
            this.catalogueTypes = _commonModels.CatalogueType.symbols();
        }

        catalogueEditor.prototype.activate = function activate(options) {
            this.model = options;
            if (!(this.model.id > 0)) {
                _lodash2.default.debounce(function () {
                    (0, _jquery2.default)('#editor-issue').focus();
                }, 125)(this);
            }
        };

        return catalogueEditor;
    }();
});
define('resources/views/countries/country-editor',['exports', 'jquery', 'lodash'], function (exports, _jquery, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.countryEditor = undefined;

    var _jquery2 = _interopRequireDefault(_jquery);

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var countryEditor = exports.countryEditor = function () {
        function countryEditor() {
            _classCallCheck(this, countryEditor);

            this.updateCountries = true;
        }

        countryEditor.prototype.activate = function activate(options) {
            this.model = options;
            if (!(this.model.id > 0)) {
                _lodash2.default.debounce(function () {
                    (0, _jquery2.default)('#editor-name').focus();
                }, 125)(this);
            }
        };

        return countryEditor;
    }();
});
define('resources/views/manage/list',['exports', 'aurelia-event-aggregator', 'aurelia-framework', '../../../events/event-managed', 'bootbox', 'odata-filter-parser', 'lodash'], function (exports, _aureliaEventAggregator, _aureliaFramework, _eventManaged, _bootbox, _odataFilterParser, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.EntityListManage = undefined;

    var _bootbox2 = _interopRequireDefault(_bootbox);

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _dec3, _class;

    var logger = _aureliaFramework.LogManager.getLogger('manage-list-table');

    var handleKeyDown = function handleKeyDown(e) {
        var self = this;
        if (e.keyCode === 27) {
            self.clear();
        } else if (e.keyCode === 13) {
            e.preventDefault();
        }
    };

    var EntityListManage = exports.EntityListManage = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec2 = (0, _aureliaFramework.bindable)('models'), _dec3 = (0, _aureliaFramework.bindable)('field'), _dec(_class = _dec2(_class = _dec3(_class = function () {
        function EntityListManage(eventBus) {
            _classCallCheck(this, EntityListManage);

            this.subscriptions = [];
            this.filterText = "";
            this.hasIssue = false;

            this.eventBus = eventBus;
            this.configureSubscriptions();
        }

        EntityListManage.prototype.configureSubscriptions = function configureSubscriptions() {
            var _this = this;

            this.subscriptions.push(this.eventBus.subscribe(_eventManaged.EventNames.manageEntity, function (data) {
                if (data) {
                    if (data.models) {
                        _this.models = data.models;
                    }
                    if (data.field) {
                        _this.field = data.field;
                    }
                }
            }));
        };

        EntityListManage.prototype.fieldChanged = function fieldChanged(newVal) {
            this.hasIssue = newVal && newVal.field === 'catalogueRef';
        };

        EntityListManage.prototype.viewStamps = function viewStamps(model) {
            var p = new _odataFilterParser.Predicate({
                subject: this.field.field,
                operator: _odataFilterParser.Operators.EQUALS,
                value: model.id
            });
            this.eventBus.publish(_eventManaged.EventNames.entityFilter, p);
        };

        EntityListManage.prototype.edit = function edit(model) {
            this.eventBus.publish(_eventManaged.EventNames.edit, { field: this.field, model: _lodash2.default.clone(model) });
        };

        EntityListManage.prototype.remove = function remove(model) {
            var self = this;
            var _remove = function _remove(m) {
                self.field.service.remove(m).then(function () {
                    var index = _lodash2.default.findIndex(self.models, { id: m.id });
                    self.models.splice(index, 1);
                }).catch(function (err) {
                    logger.error(err);
                });
            };
            _bootbox2.default.confirm({
                size: 'small',
                message: "Delete " + model.name + "?",
                callback: function callback(result) {
                    if (result === true) {
                        _remove.call(self, model);
                    }
                }
            });
        };

        EntityListManage.prototype.clear = function clear() {
            this.filterText = "";
        };

        EntityListManage.prototype.activate = function activate(obj) {
            this.models = [];
            var that = this;
            that.eventBus.publish(_eventManaged.EventNames.selectEntity, obj.path);
        };

        EntityListManage.prototype.bind = function bind() {
            if (this.field) {
                this.fieldChanged(this.field);
            }
        };

        EntityListManage.prototype.attached = function attached() {
            var self = this;
            setTimeout(function () {
                var id = self.filterInput ? self.filterInput.id : 'filter-text';
                $('#' + id).on('keydown', handleKeyDown.bind(self));
            }, 250);
        };

        EntityListManage.prototype.detached = function detached() {
            $('#' + this.filterInput.id).off('keydown', handleKeyDown.bind(this));
            this.subscriptions.forEach(function (sub) {
                sub.dispose();
            });
        };

        return EntityListManage;
    }()) || _class) || _class) || _class);
});
define('resources/views/manage/manage-list',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-router', '../../../services/countries', '../../../services/albums', '../../../services/stampCollections', '../../../services/sellers', '../../../services/catalogues', '../../../services/stamps', '../../../events/event-managed', '../../../services/session-context', 'lodash'], function (exports, _aureliaFramework, _aureliaEventAggregator, _aureliaRouter, _countries, _albums, _stampCollections, _sellers, _catalogues, _stamps, _eventManaged, _sessionContext, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ManageList = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var logger = _aureliaFramework.LogManager.getLogger('manage-list');

    var ManageList = exports.ManageList = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _countries.Countries, _albums.Albums, _stampCollections.StampCollections, _sellers.Sellers, _catalogues.Catalogues, _stamps.Stamps), _dec(_class = function () {
        function ManageList(eventBus, countryService, albumService, stampCollectionService, sellerService, catalogueService, stampService) {
            _classCallCheck(this, ManageList);

            this.selectedEntity = undefined;
            this.editingEntity = undefined;
            this.entityModels = [];
            this.subscriptions = [];

            this.eventBus = eventBus;
            this.stampService = stampService;
            this.entityModels = [{
                field: 'countryRef',
                collectionName: countryService.getResourceName(),
                label: 'Countries',
                editTitle: 'Edit Country',
                createTitle: 'Create Country',
                service: countryService,
                editor: 'resources/views/countries/country-editor',
                icon: 'sw-icon-country'
            }, {
                field: 'albumRef',
                collectionName: albumService.getResourceName(),
                label: 'Albums',
                editTitle: 'Edit Album',
                createTitle: 'Create Album',
                service: albumService,
                editor: 'resources/views/albums/album-editor',
                icon: 'sw-icon-album'
            }, {
                field: 'stampCollectionRef',
                collectionName: stampCollectionService.getResourceName(),
                label: 'Stamp Collections',
                editTitle: 'Edit Stamp Collection',
                createTitle: 'Create Stamp Collection',
                service: stampCollectionService,
                editor: 'resources/views/stamp-collections/stamp-collection-editor',
                icon: 'sw-icon-stamp-collection'
            }, {
                field: 'sellerRef',
                collectionName: sellerService.getResourceName(),
                label: 'Sellers',
                editTitle: 'Edit Seller',
                createTitle: 'Create Seller',
                service: sellerService,
                editor: 'resources/views/sellers/seller-editor',
                icon: 'sw-icon-seller'
            }, {
                field: 'catalogueRef',
                collectionName: catalogueService.getResourceName(),
                label: 'Catalogues',
                editTitle: 'Edit Catalogue',
                createTitle: 'Create Catalogue',
                service: catalogueService,
                editor: 'resources/views/catalogues/catalogue-editor',
                icon: 'sw-icon-catalogue'
            }];
        }

        ManageList.prototype.configureRouter = function configureRouter(config, router) {
            var _this = this;

            this.router = router;
            config.mapUnknownRoutes(function (instruction) {
                if (instruction.fragment === '') {
                    _this._restoreState();
                } else {
                    var index = _lodash2.default.findIndex(_this.entityModels, { collectionName: instruction.fragment });
                    if (index >= 0) {
                        _this._saveState(_this.entityModels[index].field);
                    }
                }
                return {
                    moduleId: './list'
                };
            });
        };

        ManageList.prototype._saveState = function _saveState(fieldDef) {
            var obj = {
                field: fieldDef
            };
            localStorage.setItem(_eventManaged.StorageKeys.manageEntities, JSON.stringify(obj));
        };

        ManageList.prototype._restoreState = function _restoreState() {
            var entityCache = localStorage.getItem(_eventManaged.StorageKeys.manageEntities);
            if (entityCache) {
                var cacheVal = JSON.parse(entityCache);
                if (cacheVal.field) {
                    var that = this;
                    setTimeout(function () {
                        that.setEntity(cacheVal.field);
                    }, 250);
                }
            }
        };

        ManageList.prototype.activate = function activate() {
            this.configureSubscriptions();
        };

        ManageList.prototype.deactivate = function deactivate() {
            this.subscriptions.forEach(function (subscription) {
                subscription.dispose();
            });
            this.subscriptions = [];
        };

        ManageList.prototype.configureSubscriptions = function configureSubscriptions() {
            var _this2 = this;

            this.subscriptions.push(this.eventBus.subscribe(_eventManaged.EventNames.entityFilter, function (opts) {
                _sessionContext.SessionContext.setSearchCondition(opts);
                _this2.router.navigate(_this2.router.generate('stamp-list', { $filter: opts.serialize() }));
            }));
            this.subscriptions.push(this.eventBus.subscribe(_eventManaged.EventNames.selectEntity, function (collectionName) {
                var fieldDef = _lodash2.default.findWhere(_this2.entityModels, { collectionName: collectionName });
                if (fieldDef) {
                    _this2.processField(fieldDef);
                }
            }));
            this.subscriptions.push(this.eventBus.subscribe(_eventManaged.EventNames.save, function (model) {
                if (_this2.editingEntity.service) {
                    _this2.editingEntity.service.save(model).then(function (result) {
                        logger.debug(result);
                        _this2.eventBus.publish(_eventManaged.EventNames.close);
                    }).catch(function (err) {
                        _this2.eventBus.publish(_eventManaged.EventNames.actionError, err.message);
                    });
                }
            }));
            this.subscriptions.push(this.eventBus.subscribe(_eventManaged.EventNames.edit, function (config) {
                _this2.editingModel = config.model;
                _this2.editingEntity = config.field;
                _this2.editorTitle = _this2.editingEntity.editTitle;
                _this2.editorContent = _this2.editingEntity.editor;
                _this2.editorIcon = _this2.editingEntity.icon;
            }));
            this.subscriptions.push(this.eventBus.subscribe(_eventManaged.EventNames.entityDelete, function () {
                throw new Error("Not implemented yet");
            }));
        };

        ManageList.prototype.determineActivationStrategy = function determineActivationStrategy() {
            return _aureliaRouter.activationStrategy.replace;
        };

        ManageList.prototype.getSortCriteria = function getSortCriteria(fieldDef) {
            var opts = {
                $orderby: 'name asc'
            };
            if (fieldDef.field === 'catalogueRef') {
                opts.$orderby = 'issue desc';
            }
            return opts;
        };

        ManageList.prototype.processField = function processField(fieldDef) {
            var _this3 = this;

            if (this.selectedEntity === fieldDef) {
                return;
            }
            this.selectedEntity = fieldDef;
            fieldDef.service.find(this.getSortCriteria(fieldDef)).then(function (result) {
                var that = _this3;
                that.eventBus.publish(_eventManaged.EventNames.manageEntity, {
                    models: result.models,
                    field: that.selectedEntity
                });
                if (result.models.length > 0 && typeof result.models[0].stampCount === 'undefined') {
                    fieldDef.service.countStamps().then(function (countResults) {
                        _lodash2.default.forEach(countResults, function (r) {
                            var entity = _lodash2.default.findWhere(result.models, { id: +r.id });
                            if (entity) {
                                entity.stampCount = +r.count;
                            }
                        });
                    });
                }
            });
        };

        ManageList.prototype.setEntity = function setEntity(entityType) {
            var index = _lodash2.default.findIndex(this.entityModels, { field: entityType });
            if (index >= 0) {
                var collectionName = this.entityModels[index].collectionName;
                if (this.router.currentInstruction && this.router.currentInstruction.fragment !== collectionName) {
                    this.router.navigate(collectionName);
                }
            }
        };

        ManageList.prototype.create = function create(entity) {
            var that = this;
            this.editingEntity = entity;
            setTimeout(function () {
                that.editingModel = {
                    id: 0
                };
                that.editorTitle = entity.createTitle;
                that.editorContent = entity.editor;
                that.editorIcon = entity.icon;
            }, 50);
        };

        return ManageList;
    }()) || _class);
});
define('resources/views/preferences/user-settings',['exports', 'aurelia-framework', 'aurelia-binding', 'aurelia-event-aggregator', '../../../events/event-managed', '../../../services/countries', '../../../services/albums', '../../../services/sellers', '../../../services/catalogues', '../../../services/stampCollections', '../../../services/preferences', '../../../util/common-models', '../../../util/object-utilities', 'lodash'], function (exports, _aureliaFramework, _aureliaBinding, _aureliaEventAggregator, _eventManaged, _countries, _albums, _sellers, _catalogues, _stampCollections, _preferences, _commonModels, _objectUtilities, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserSettings = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var logger = _aureliaFramework.LogManager.getLogger('user-settings');

    var UserSettings = exports.UserSettings = (_dec = (0, _aureliaFramework.inject)(_aureliaBinding.BindingEngine, _aureliaEventAggregator.EventAggregator, _preferences.Preferences, _countries.Countries, _albums.Albums, _sellers.Sellers, _catalogues.Catalogues, _stampCollections.StampCollections), _dec(_class = function () {
        function UserSettings($bindingEngine, eventBus, preferenceService, countryService, albumService, sellerService, catalogueService, stampCollectionService) {
            _classCallCheck(this, UserSettings);

            this.countries = [];
            this.albums = [];
            this.sellers = [];
            this.catalogues = [];
            this.stampCollections = [];
            this.preferences = [];
            this.conditions = _commonModels.Condition.symbols();
            this.codes = _commonModels.CurrencyCode.symbols();
            this.grades = _commonModels.Grade.symbols();
            this.locales = _commonModels.UserLocale.symbols();
            this.pageSizes = [100, 250, 500, 1000, 2500, 5000];
            this.model = {};
            this.preferenceKeys = [{ name: 'countryRef', category: 'stamps', type: Number }, { name: 'stampCollectionRef', category: 'stamps', type: Number }, { name: 'albumRef', category: 'stamps', type: Number }, { name: 'sellerRef', category: 'stamps', type: Number }, { name: 'catalogueRef', category: 'stamps', type: Number }, { name: 'catalogueRefSecondary', category: 'stamps', type: Number }, { name: 'condition', category: 'stamps', type: Number }, { name: 'conditionSecondary', category: 'stamps', type: Number }, { name: 'grade', category: 'stamps', type: Number }, { name: 'pageSize', category: 'stamps', type: Number, defaultValue: 100 }, { name: 'CurrencyCode', category: 'currency', type: String, defaultValue: 'USD' }, { name: 'imagePath', category: 'stamps', type: String }, { name: 'locale', category: 'user', type: String, defaultValue: 'en' }, { name: 'applyCatalogueImagePrefix', category: 'stamps', type: Boolean, defaultValue: true }];
            this.EDITOR = 'settings.editor';
            this.REFERENCE = 'settings.reference';
            this.SERVER = 'settings.server';
            this.USER = 'settings.user';
            this.viewModels = [this.EDITOR, this.REFERENCE, this.SERVER, this.USER];
            this.selectedView = this.EDITOR;
            this.servicesLoaded = 0;
            this.loading = false;
            this.valid = false;

            this.bindingEngine = $bindingEngine;
            this.eventBus = eventBus;
            this.preferenceService = preferenceService;
            this.countryService = countryService;
            this.albumService = albumService;
            this.sellerService = sellerService;
            this.catalogueService = catalogueService;
            this.stampCollectionService = stampCollectionService;
        }

        UserSettings.prototype.activate = function activate() {
            this.loadServices();
        };

        UserSettings.prototype.deactivate = function deactivate() {};

        UserSettings.prototype.selectView = function selectView(pref) {
            this.selectedView = pref;
        };

        UserSettings.prototype.save = function save() {
            var self = this;
            _lodash2.default.each(Object.keys(self.model), function (category) {
                _lodash2.default.each(Object.keys(self.model[category]), function (name) {
                    var pref = self.preferenceService.getByNameAndCategory(name, category);
                    if (pref) {
                        if (pref.value === "" + self.model[category][name]) {
                            logger.debug("No update needed for " + name);
                            return;
                        }
                        pref.value = self.model[category][name].toString();
                    } else {
                        pref = {
                            name: name,
                            category: category,
                            value: self.model[category][name].toString(),
                            id: 0
                        };
                    }
                    self.preferenceService.save(pref).then(function (modifiedPref) {
                        self.eventBus.publish(_eventManaged.EventNames.preferenceChanged, modifiedPref);
                    });
                });
            });
            self.stateReset();
        };

        UserSettings.prototype.stateReset = function stateReset() {
            this.modelClone = {};
            _lodash2.default.forEach(Object.keys(this.model), function (key) {
                this.modelClone[key] = _lodash2.default.clone(this.model[key]);
            }, this);
            this.validate();
        };

        UserSettings.prototype.reset = function reset() {
            _lodash2.default.forEach(Object.keys(this.model), function (key) {
                _lodash2.default.extend(this.model[key], this.modelClone[key]);
            }, this);
            this.validate();
        };

        UserSettings.prototype.validate = function validate() {
            var value = true;
            var keys = Object.keys(this.model);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (!_objectUtilities.ObjectUtilities.isEqual(this.model[key], this.modelClone[key])) {
                    value = false;
                    break;
                }
            }
            this.valid = !value;
        };

        UserSettings.prototype.processResults = function processResults(collectionName, results) {
            this[collectionName] = results.models;
            this.servicesLoaded++;
            if (this.servicesLoaded >= 6) {
                this.loading = false;
            }
        };

        UserSettings.prototype.processPreferences = function processPreferences() {
            var self = this;
            _lodash2.default.forEach(self.preferenceKeys, function (prefKey) {

                var pref = self.preferenceService.getByNameAndCategory(prefKey.name, prefKey.category);
                if (!pref) {
                    pref = {
                        value: prefKey.defaultValue ? prefKey.defaultValue.toString() : undefined
                    };
                }
                if (!self.model[prefKey.category]) {
                    self.model[prefKey.category] = {};
                }
                var value = void 0;
                switch (prefKey.type) {
                    case Number:
                        value = +pref.value;
                        break;
                    case Boolean:
                        value = pref.value === "true";
                        break;
                    default:
                        value = pref.value;
                }

                self.model[prefKey.category][prefKey.name] = value;
                self.bindingEngine.propertyObserver(self.model[prefKey.category], prefKey.name).subscribe(self.validate.bind(self));
            });
            self.stateReset();
        };

        UserSettings.prototype.loadServices = function loadServices() {
            var self = this;
            this.loading = true;
            this.preferenceService.find().then(function (result) {
                self.processResults('preferences', result);
                self.processPreferences();
            });
            this.countryService.find().then(function (result) {
                self.processResults('countries', result);
            });
            this.albumService.find().then(function (result) {
                self.processResults('albums', result);
            });
            this.sellerService.find().then(function (result) {
                self.processResults('sellers', result);
            });
            this.stampCollectionService.find().then(function (result) {
                self.processResults('stampCollections', result);
            });
            this.catalogueService.find().then(function (result) {
                self.processResults('catalogues', result);
            });
        };

        return UserSettings;
    }()) || _class);
});
define('resources/views/sellers/seller-editor',['exports', 'jquery', 'lodash'], function (exports, _jquery, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.sellerEditor = undefined;

    var _jquery2 = _interopRequireDefault(_jquery);

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var sellerEditor = exports.sellerEditor = function () {
        function sellerEditor() {
            _classCallCheck(this, sellerEditor);
        }

        sellerEditor.prototype.activate = function activate(options) {
            this.model = options;
            if (!(this.model.id > 0)) {
                _lodash2.default.debounce(function () {
                    (0, _jquery2.default)('#editor-name').focus();
                }, 125)(this);
            }
        };

        return sellerEditor;
    }();
});
define('resources/views/stamp-collections/stamp-collection-editor',['exports', 'jquery', 'lodash'], function (exports, _jquery, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.stampCollectionEditor = undefined;

    var _jquery2 = _interopRequireDefault(_jquery);

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var stampCollectionEditor = exports.stampCollectionEditor = function () {
        function stampCollectionEditor() {
            _classCallCheck(this, stampCollectionEditor);
        }

        stampCollectionEditor.prototype.activate = function activate(options) {
            this.model = options;
            if (!(this.model.id > 0)) {
                _lodash2.default.debounce(function () {
                    (0, _jquery2.default)('#editor-name').focus();
                }, 125)(this);
            }
        };

        return stampCollectionEditor;
    }();
});
define('resources/views/stamps/purchase-form',['exports', 'aurelia-dialog', 'aurelia-framework', 'aurelia-dependency-injection', 'aurelia-validatejs', 'aurelia-validation', 'aurelia-i18n', '../../../util/common-models', '../../../services/stamps', 'lodash'], function (exports, _aureliaDialog, _aureliaFramework, _aureliaDependencyInjection, _aureliaValidatejs, _aureliaValidation, _aureliaI18n, _commonModels, _stamps, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PurchaseForm = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var logger = _aureliaFramework.LogManager.getLogger('purchase-form');

    var PurchaseForm = exports.PurchaseForm = (_dec = (0, _aureliaFramework.bindable)('model'), _dec(_class = function () {
        PurchaseForm.inject = function inject() {
            return [_aureliaDialog.DialogController, _aureliaI18n.I18N, _stamps.Stamps, _aureliaDependencyInjection.NewInstance.of(_aureliaValidation.ValidationController)];
        };

        function PurchaseForm(controller, i18n, stampService, validationController) {
            _classCallCheck(this, PurchaseForm);

            this.catalogueTotal = 0.0;
            this.percentage = 0.0;
            this.codes = _commonModels.CurrencyCode.symbols();
            this.processing = false;
            this.processingCount = 0;
            this.errorMessage = "";
            this.isValid = false;

            this.controller = controller;
            this.i18n = i18n;
            this.stampService = stampService;
            validationController.validateTrigger = _aureliaValidation.validateTrigger.manual;
            this.validationController = validationController;
        }

        PurchaseForm.prototype.priceChanged = function priceChanged() {
            if (this.model.price && +this.model.price > 0 && this.catalogueTotal > 0.0) {
                this.percentage = +this.model.price / this.catalogueTotal;
            } else {
                this.percentage = 0.0;
            }
            this.validate();
        };

        PurchaseForm.prototype.save = function save() {
            var _this = this;

            var self = this;
            var results = [];
            self.processing = true;
            self.processingCount = 0;
            self.errorMessage = "";
            var count = self.model.selectedStamps.length;
            _lodash2.default.each(self.model.selectedStamps, function (stamp) {
                if (stamp.stampOwnerships && stamp.stampOwnerships.length > 0) {
                    var owner = stamp.stampOwnerships[0];
                    if (owner.pricePaid > 0.0 && self.model.updateExisting || owner.pricePaid <= 0.0) {
                        owner.pricePaid = +(stamp.activeCatalogueNumber.value / self.catalogueTotal * self.model.price).toFixed(2);
                        owner.code = self.model.currency;
                        var promise = self.stampService.save(stamp);
                        results.push(promise);
                        promise.then(function () {
                            self.processingCount++;
                            $('.progress-bar').css('width', self.processingCount * 1.0 / count * 100 + '%');
                        });
                    }
                }
            });
            Promise.all(results).then(function () {
                logger.debug("Completed saving updates for " + results.length);
                self.processing = false;
                _lodash2.default.debounce(function () {
                    _this.controller.ok();
                }, 125)(_this);
            }).catch(function (err) {
                self.processing = false;
                self.errorMessage = err.statusText ? err.statusText : err;
            });
        };

        PurchaseForm.prototype.activate = function activate(model) {
            var _this2 = this;

            model.currency = model.currency || _commonModels.CurrencyCode.USD.toString();
            this.model = model;
            this.catalogueTotal = 0.0;
            if (this.model && this.model.selectedStamps && this.model.selectedStamps.length > 0) {
                (function () {
                    var self = _this2;
                    _lodash2.default.each(_this2.model.selectedStamps, function (stamp) {
                        var activeCN = stamp.activeCatalogueNumber ? stamp.activeCatalogueNumber : undefined;
                        if (activeCN) {
                            self.catalogueTotal += activeCN.value;
                        } else {
                            logger.warn("No active number found.");
                        }
                    });
                })();
            }

            this.rules = _aureliaValidatejs.ValidationRules.ensure('price').numericality({ lessThan: 9999.0, greaterThan: 0, message: this.i18n.tr('messages.totalPurchaseNumber') }).required({ message: this.i18n.tr('messages.totalPurchaseRequired') });

            _lodash2.default.debounce(function () {
                _this2.validate();
            }, 150)(this);
        };

        PurchaseForm.prototype.handleValidation = function handleValidation(result) {
            this.isValid = result.length === 0;
        };

        PurchaseForm.prototype.validate = function validate() {
            this.handleValidation(this.validationController.validate());
        };

        return PurchaseForm;
    }()) || _class);
});
define('resources/views/stamps/stamp-list',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-i18n', '../../../services/countries', 'aurelia-router', '../../../services/stamps', '../../../services/preferences', './purchase-form', '../../../services/session-context', '../../../events/event-managed', '../../../util/location-helper', '../../../util/common-models', '../../../util/object-utilities', '../../elements/image-preview/image-preview', 'odata-filter-parser', '../../value-converters/as-currency-formatted', 'bootbox', 'aurelia-dialog', 'lodash'], function (exports, _aureliaFramework, _aureliaEventAggregator, _aureliaI18n, _countries, _aureliaRouter, _stamps, _preferences, _purchaseForm, _sessionContext, _eventManaged, _locationHelper, _commonModels, _objectUtilities, _imagePreview, _odataFilterParser, _asCurrencyFormatted, _bootbox, _aureliaDialog, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.StampList = undefined;

    var _bootbox2 = _interopRequireDefault(_bootbox);

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    var _dec, _dec2, _class, _desc, _value, _class2;

    var logger = _aureliaFramework.LogManager.getLogger('stamp-list');

    function createStamp(wantList) {
        return {
            id: 0,
            wantList: wantList,
            countryRef: -1,
            catalogueNumbers: [],
            stampOwnerships: []
        };
    }

    var StampList = exports.StampList = (_dec = (0, _aureliaFramework.inject)(Element, _aureliaEventAggregator.EventAggregator, _aureliaRouter.Router, _stamps.Stamps, _countries.Countries, _preferences.Preferences, _asCurrencyFormatted.asCurrencyValueConverter, _aureliaI18n.I18N, _aureliaDialog.DialogService), _dec2 = (0, _aureliaFramework.computedFrom)('referenceMode', 'displayMode'), _dec(_class = (_class2 = function (_EventManaged) {
        _inherits(StampList, _EventManaged);

        function StampList(element, eventBus, router, stampService, countryService, preferenceService, currencyFormatter, i18next, dialogService) {
            _classCallCheck(this, StampList);

            var _this = _possibleConstructorReturn(this, _EventManaged.call(this, eventBus));

            _this.stamps = [];
            _this.editingStamp = undefined;
            _this.latestSelected = undefined;
            _this.stampCount = 0;
            _this.countries = [];
            _this.heading = "Stamp List";
            _this.displayMode = 'Grid';
            _this.imageShown = false;
            _this.editorShown = false;
            _this.panelContents = "stamp-editor";
            _this.subscribers = [];
            _this.referenceMode = false;
            _this.reportValue = "";
            _this.reportType = "CatalogueValue";
            _this.sortColumns = ['number', 'value', 'pricePaid'];
            _this.filters = _commonModels.StampFilter.symbols();
            _this.stampFilter = _commonModels.StampFilter.ALL;
            _this.conditionFilters = _commonModels.ConditionFilter.symbols();
            _this.conditionFilter = _commonModels.ConditionFilter.ALL;
            _this.currentFilters = [];
            _this.pageSizes = [100, 250, 500, 1000, 2500, 5000];
            _this.pageInfo = {
                total: 1,
                active: 0
            };
            _this.options = {
                $filter: "",
                $top: 250,
                $skip: 0,
                sort: _this.sortColumns[0],
                sortDirection: 'asc'
            };

            _this.element = element;
            _this.stampService = stampService;
            _this.countryService = countryService;
            _this.preferenceService = preferenceService;
            _this.currencyFormatter = currencyFormatter;
            _this.router = router;
            _this.i18next = i18next;
            _this.dialogService = dialogService;
            return _this;
        }

        StampList.prototype.bind = function bind() {
            this._searchHandler = this.processSearchRequest.bind(this);
            _sessionContext.SessionContext.addContextListener(_sessionContext.SessionContext.SEARCH_CHANGE, this._searchHandler);
        };

        StampList.prototype.unbind = function unbind() {
            _sessionContext.SessionContext.removeContextListener(_sessionContext.SessionContext.SEARCH_CHANGE, this._searchHandler);
        };

        StampList.prototype.processSearchRequest = function processSearchRequest(data, oldData) {
            var self = this;
            var options = !self.options ? {} : self.options;
            if (data) {
                options.$filter = data.serialize();
                self.currentFilters = data.flatten();
                logger.debug(self.currentFilters);
            }
            self.search();
        };

        StampList.prototype.purchase = function purchase() {
            var selected = this.stampService.getSelected();
            if (selected && selected.length > 0) {
                selected = _lodash2.default.filter(selected, { wantList: false });
                if (selected.length > 0) {
                    var purchaseModel = {
                        price: 0.0,
                        currency: _commonModels.CurrencyCode.USD.key,
                        updateExisting: true,
                        selectedStamps: selected
                    };
                    this.dialogService.open({ viewModel: _purchaseForm.PurchaseForm, model: purchaseModel }).then(function () {}).catch(function () {});
                }
            }
        };

        StampList.prototype.selectAll = function selectAll(select) {
            if (!select) {
                this.stampService.clearSelected();
                if (this.editingStamp) {
                    if (this.editorShown) {
                        this.editorShown = false;
                    }
                    this.editingStamp = undefined;
                    this.latestSelected = undefined;
                }
            } else {
                this.stampService.selectAll();
            }
        };

        StampList.prototype.getFilterText = function getFilterText(filter) {
            return filter.description;
        };

        StampList.prototype.setStatistics = function setStatistics(reportType) {
            var self = this;
            self.reportType = reportType;
            var opt = self.buildOptions();
            opt.$reportType = reportType;
            self.reportValue = self.i18next.tr('footer-statistics.calculating');

            self.stampService.executeReport(opt).then(function (result) {
                if (+result.value > 0) {
                    self.reportValue = self.currencyFormatter.toView(+result.value, result.code);
                } else {
                    self.reportValue = "";
                }
            });
        };

        StampList.prototype.generatePageModels = function generatePageModels(total, current) {
            this.pageModels = [];
            for (var i = 0; i < total; i++) {
                this.pageModels.push({ page: i, current: current === i });
            }
            this.pageInfo.total = total;
            this.pageInfo.active = current;
        };

        StampList.prototype.setSize = function setSize(size) {
            var active = parseInt(this.pageInfo.active * this.options.$top / size);
            this.options.$skip = Math.max(0, size * active);
            this.options.$top = size;
            this.pageInfo.active = active;
            this.search();
        };

        StampList.prototype.setConditionFilter = function setConditionFilter(ordinal) {

            this.currentFilters = _objectUtilities.PredicateUtilities.removeMatches('condition', this.currentFilters);

            this.conditionFilter = _commonModels.ConditionFilter.get(ordinal);
            var conditions = [];
            switch (ordinal) {
                case 1:
                    conditions = [0, 1, 4, 5];
                    break;
                case 2:
                    conditions = [2, 3, 7];
                    break;
                case 3:
                    conditions = [6];
                    break;
            }
            if (conditions.length > 0) {
                var predicates = [];
                for (var i = 0; i < conditions.length; i++) {
                    predicates.push(new _odataFilterParser.Predicate({
                        subject: 'condition',
                        value: conditions[i]
                    }));
                }
                this.currentFilters.push(predicates.length === 1 ? predicates[0] : _odataFilterParser.Predicate.concat(_odataFilterParser.Operators.OR, predicates));
            }
            this.search();
        };

        StampList.prototype.setFilter = function setFilter(ordinal) {
            this.currentFilters = _objectUtilities.PredicateUtilities.removeMatches('wantList', this.currentFilters);

            this.stampFilter = _commonModels.StampFilter.get(ordinal);

            var theFilter = new _odataFilterParser.Predicate({
                subject: 'wantList'
            });
            switch (ordinal) {
                case 1:
                    theFilter.value = 0;
                    break;
                case 2:
                    theFilter.value = 1;
                    break;
                default:
                    theFilter = null;
            }
            if (theFilter) {
                this.currentFilters.push(theFilter);
            }
            this.search();
        };

        StampList.prototype.setPage = function setPage(page) {
            this.pageInfo.active = Math.max(0, Math.min(page, this.pageInfo.total - 1));
            if (this.options.$top) {
                this.options.$skip = this.options.$top * this.pageInfo.active;
            }
            this.search();
        };

        StampList.prototype.setSort = function setSort(attr) {
            this.options.sort = attr;
            if (!this.options.sortDirection) {
                this.options.sortDirection = 'asc';
            }
            this.search();
        };

        StampList.prototype.clearSort = function clearSort() {
            this.options.sort = 'placeholder';
            this.search();
        };

        StampList.prototype.toggleSortDirection = function toggleSortDirection() {
            this.options.sortDirection = this.options.sortDirection === 'asc' ? 'desc' : 'asc';
            this.search();
        };

        StampList.prototype.showEditor = function showEditor(action) {
            if (action === 'create-stamp' || action === 'create-wantList') {
                this.editingStamp = createStamp(action === 'create-wantList');
                this.panelContents = "stamp-editor";
            } else if (action === 'search-panel') {
                this.panelContents = action;
            }
            this.editorShown = true;
        };

        StampList.prototype.setDisplayMode = function setDisplayMode(mode) {
            this.displayMode = mode;
        };

        StampList.prototype.getDisplayModeClass = function getDisplayModeClass(mode) {
            return this.displayMode === mode ? 'active' : '';
        };

        StampList.prototype.toggleCatalogueNumbers = function toggleCatalogueNumbers() {
            this.referenceMode = !this.referenceMode;
            localStorage.setItem(_eventManaged.StorageKeys.referenceCatalogueNumbers, this.referenceMode);
        };

        StampList.prototype.clearSearch = function clearSearch() {
            this.searchText = "";
            this.sendSearch();
        };

        StampList.prototype.sendSearch = function sendSearch() {
            this.currentFilters = _objectUtilities.PredicateUtilities.removeMatches('description', this.currentFilters);
            if (this.searchText && this.searchText !== "") {
                this.currentFilters.unshift(new _odataFilterParser.Predicate({
                    subject: 'description',
                    operators: _odataFilterParser.Operators.EQUALS,
                    value: this.searchText
                }));
            }
            this.search();
        };

        StampList.prototype.buildOptions = function buildOptions() {
            var _this2 = this;

            var cOpts = this.options;
            var opts = {};

            if (cOpts.sort && cOpts.sort !== 'placeholder' && cOpts.sortDirection) {
                opts.$orderby = cOpts.sort + " " + cOpts.sortDirection;
            }
            opts.$top = cOpts.$top > -1 ? cOpts.$top : 100;
            if (this.currentFilters && this.currentFilters.length > 0) {
                (function () {
                    var current = [];
                    _this2.currentFilters.forEach(function (f) {
                        current.push(f);
                    });
                    var predicate = current.length > 1 ? _odataFilterParser.Predicate.concat(_odataFilterParser.Operators.AND, current) : _this2.currentFilters[0];
                    opts.$filter = predicate.serialize();
                    logger.debug("$filter=" + opts.$filter);
                })();
            }
            if (cOpts.$skip) {
                opts.$skip = cOpts.$skip;
            }
            return opts;
        };

        StampList.prototype.setupSubscriptions = function setupSubscriptions() {
            var _this3 = this;

            var self = this;
            this.subscribe(_eventManaged.EventNames.pageChanged, function (page) {
                _this3.setPage(page);
            });
            this.subscribe(_eventManaged.EventNames.pageRefreshed, function (page) {
                _this3.options._ul = new Date().getTime();
                _this3.setPage(page);
            });
            this.subscribe(_eventManaged.EventNames.stampCreate, function () {
                self.editingStamp = createStamp(false);
                self.editorShown = true;
            });

            this.subscribe(_imagePreview.ImagePreviewEvents.close, function () {
                self.imageShown = false;
            });

            this.subscribe(_eventManaged.EventNames.panelCollapsed, function (config) {
                if (config.name === "stamp-list-editor-panel") {
                    self.editorShown = false;
                }
            });

            this.subscribe(_eventManaged.EventNames.showImage, function (stamp) {
                _this3.handleFullSizeImage(stamp);
            });
            this.subscribe(_eventManaged.EventNames.stampEdit, function (stamp) {
                self.lastSelected = stamp;
                self.panelContents = 'stamp-editor';
                self.editingStamp = stamp;
                self.editorShown = true;
            });
            this.subscribe(_eventManaged.EventNames.stampEditorCancel, function () {
                self.editorShown = false;
            });
            this.subscribe(_eventManaged.EventNames.stampSaved, function (result) {
                if (!result.remainOpen) {
                    self.editorShown = false;
                }
            });

            this.subscribe(_eventManaged.EventNames.deleteSuccessful, function (obj) {
                if (obj && obj.type === self.stampService.getCollectionName()) {
                    _lodash2.default.remove(_this3.stamps, { id: obj.id });
                }
            });
            this.subscribe(_eventManaged.EventNames.toggleStampSelection, this.stampSelected.bind(this));

            this.subscribe(_eventManaged.EventNames.stampRemove, function (stamp) {
                var _remove = function _remove(model) {
                    if (self.editingStamp && stamp.id === self.editingStamp.id) {
                        self.editingStamp = null;
                        self.editorShown = false;
                    }
                    self.stampService.remove(model).then(function () {
                        self.eventBus.publish(_eventManaged.EventNames.stampCount, { stamp: model, increment: false });
                        var index = _lodash2.default.findIndex(self.stamps, { id: model.id });
                        self.stamps.splice(index, 1);
                    }).catch(function (err) {
                        logger.error(err);
                    });
                };
                _bootbox2.default.confirm({
                    size: 'large',
                    className: 'sw-dialog-wrapper',
                    message: "Delete " + stamp.rate + ' - ' + stamp.description + "?",
                    callback: function callback(result) {
                        if (result === true) {
                            _remove.call(self, stamp);
                        }
                    }
                });
            });
        };

        StampList.prototype.stampSelected = function stampSelected(obj) {
            var _this4 = this;

            if (obj && obj.model) {
                if (this.stampService.isSelected(obj.model)) {
                    if (this.lastSelected.id !== obj.model.id) {
                        this.lastSelected = obj.model;
                    } else {
                        this.stampService.unselect(obj.model);
                        var selected = this.stampService.getSelected();
                        this.lastSelected = selected && selected.length > 0 ? selected[selected.length - 1] : undefined;
                        if (this.lastSelected && this.editorShown) {
                            this.editingStamp = this.lastSelected;
                        } else {
                            this.editorShown = false;
                        }
                    }
                } else {
                    if (obj.shiftKey && !!this.lastSelected) {
                        var lastIndex = _lodash2.default.indexOf(this.stamps, this.lastSelected);
                        var nowIndex = _lodash2.default.indexOf(this.stamps, obj.model);
                        var nowSelected = _lodash2.default.slice(this.stamps, Math.min(nowIndex, lastIndex), Math.max(nowIndex, lastIndex) + 1);
                        _lodash2.default.each(nowSelected, function (s) {
                            _this4.stampService.select(s);
                        });
                    } else {
                        this.stampService.select(obj.model);
                    }
                    this.lastSelected = obj.model;
                    if (this.editorShown) {
                        this.editingStamp = obj.model;
                    }
                }
            }
        };

        StampList.prototype.handleFullSizeImage = function handleFullSizeImage(stamp) {
            if (stamp && stamp.stampOwnerships && stamp.stampOwnerships.length > 0) {
                var oldImage = this.fullSizeImage;
                this.fullSizeImage = "http://drake-server.ddns.net:9001/Pictures/Stamps/" + stamp.stampOwnerships[0].img;
                this.imageShown = !this.imageShown || oldImage !== this.fullSizeImage;
            }
        };

        StampList.prototype.search = function search() {
            var _this5 = this;

            return new Promise(function (resolve, reject) {
                var opts = _this5.buildOptions();
                _this5.stampService.clearSelected();
                _this5.stampService.find(opts).then(function (result) {
                    _this5.router.navigate(_this5.router.generate('stamp-list', opts));
                    _this5.processStamps(result, opts);
                    resolve();
                }).catch(function (err) {
                    logger.debug(err);
                    reject(err);
                });
            });
        };

        StampList.prototype.processStamps = function processStamps(result, opts) {
            this.lastSelected = undefined;
            this.generatePageModels(1, 0);
            this.stamps = result.models;
            this.stampCount = result.total;
            this.pageInfo.total = 1;
            this.pageInfo.active = 0;
            if (opts.$top) {
                this.pageInfo.total = parseInt(result.total / opts.$top) + 1;
                if (opts.$skip) {
                    this.pageInfo.active = opts.$skip / opts.$top;
                }
            }
            this.setStatistics(this.reportType);
        };

        StampList.prototype.attached = function attached() {
            this.setupSubscriptions();
        };

        StampList.prototype.activate = function activate(params, routeConfig) {
            var _this6 = this;

            var t = new Date().getTime();
            var self = this;
            this.referenceMode = localStorage.getItem(_eventManaged.StorageKeys.referenceCatalogueNumbers) === 'true';

            return new Promise(function (resolve, reject) {
                Promise.all([_this6.countryService.find(), _this6.preferenceService.find()]).then(function (results) {
                    var result = results && results.length > 0 ? results[0] : undefined;
                    self.countries = result ? result.models : [];
                    var $filter = _locationHelper.LocationHelper.getQueryParameter("$filter");
                    if ($filter) {
                        var f = _odataFilterParser.Parser.parse($filter);
                        if (f) {
                            self.currentFilters = f.flatten();
                            logger.debug(self.currentFilters);
                            _sessionContext.SessionContext.setSearchCondition(f);
                        }
                    } else if (result && result.total > 0) {
                        var indx = Math.floor(Math.random() * result.total);
                        self.currentFilters.push(new _odataFilterParser.Predicate({
                            subject: 'countryRef',
                            value: self.countries[indx].id
                        }));
                    }
                    var $orderby = _locationHelper.LocationHelper.getQueryParameter("$orderby");
                    if ($orderby && $orderby.length > 1) {
                        var orderParts = $orderby.split(' ');

                        _this6.options.sort = orderParts[0];
                        _this6.options.sortDirection = orderParts[1];
                    }
                    var $top = self.preferenceService.getByNameAndCategory('pageSize', 'stamps');
                    if ($top) {
                        _this6.options.$top = +$top.value;
                    }
                    var $skip = _locationHelper.LocationHelper.getQueryParameter("$skip");
                    if ($skip) {
                        _this6.options.$skip = $skip;
                    }
                    _this6.search().then(function () {
                        logger.debug("StampGrid initialization time: " + (new Date().getTime() - t) + "ms");
                        resolve();
                    });
                }).catch(function (err) {
                    reject(err);
                });
            });
        };

        _createClass(StampList, [{
            key: 'selectedCount',
            get: function get() {
                return this.stampService.getSelected().length;
            }
        }, {
            key: 'referenceTableState',
            get: function get() {
                return this.referenceMode && this.displayMode === 'Grid' ? 'active' : this.displayMode !== 'Grid' ? 'disabled' : '';
            }
        }]);

        return StampList;
    }(_eventManaged.EventManaged), (_applyDecoratedDescriptor(_class2.prototype, 'referenceTableState', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'referenceTableState'), _class2.prototype)), _class2)) || _class);
});
define('aurelia-templating-resources/compose',['exports', 'aurelia-dependency-injection', 'aurelia-task-queue', 'aurelia-templating', 'aurelia-pal'], function (exports, _aureliaDependencyInjection, _aureliaTaskQueue, _aureliaTemplating, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Compose = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var Compose = exports.Compose = (_dec = (0, _aureliaTemplating.customElement)('compose'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources, _aureliaTaskQueue.TaskQueue), _dec(_class = (0, _aureliaTemplating.noView)(_class = _dec2(_class = (_class2 = function () {
    function Compose(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
      

      _initDefineProp(this, 'model', _descriptor, this);

      _initDefineProp(this, 'view', _descriptor2, this);

      _initDefineProp(this, 'viewModel', _descriptor3, this);

      this.element = element;
      this.container = container;
      this.compositionEngine = compositionEngine;
      this.viewSlot = viewSlot;
      this.viewResources = viewResources;
      this.taskQueue = taskQueue;
      this.currentController = null;
      this.currentViewModel = null;
    }

    Compose.prototype.created = function created(owningView) {
      this.owningView = owningView;
    };

    Compose.prototype.bind = function bind(bindingContext, overrideContext) {
      this.bindingContext = bindingContext;
      this.overrideContext = overrideContext;
      processInstruction(this, createInstruction(this, {
        view: this.view,
        viewModel: this.viewModel,
        model: this.model
      }));
    };

    Compose.prototype.unbind = function unbind(bindingContext, overrideContext) {
      this.bindingContext = null;
      this.overrideContext = null;
      var returnToCache = true;
      var skipAnimation = true;
      this.viewSlot.removeAll(returnToCache, skipAnimation);
    };

    Compose.prototype.modelChanged = function modelChanged(newValue, oldValue) {
      var _this = this;

      if (this.currentInstruction) {
        this.currentInstruction.model = newValue;
        return;
      }

      this.taskQueue.queueMicroTask(function () {
        if (_this.currentInstruction) {
          _this.currentInstruction.model = newValue;
          return;
        }

        var vm = _this.currentViewModel;

        if (vm && typeof vm.activate === 'function') {
          vm.activate(newValue);
        }
      });
    };

    Compose.prototype.viewChanged = function viewChanged(newValue, oldValue) {
      var _this2 = this;

      var instruction = createInstruction(this, {
        view: newValue,
        viewModel: this.currentViewModel || this.viewModel,
        model: this.model
      });

      if (this.currentInstruction) {
        this.currentInstruction = instruction;
        return;
      }

      this.currentInstruction = instruction;
      this.taskQueue.queueMicroTask(function () {
        return processInstruction(_this2, _this2.currentInstruction);
      });
    };

    Compose.prototype.viewModelChanged = function viewModelChanged(newValue, oldValue) {
      var _this3 = this;

      var instruction = createInstruction(this, {
        viewModel: newValue,
        view: this.view,
        model: this.model
      });

      if (this.currentInstruction) {
        this.currentInstruction = instruction;
        return;
      }

      this.currentInstruction = instruction;
      this.taskQueue.queueMicroTask(function () {
        return processInstruction(_this3, _this3.currentInstruction);
      });
    };

    return Compose;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'model', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'view', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'viewModel', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class) || _class);


  function createInstruction(composer, instruction) {
    return Object.assign(instruction, {
      bindingContext: composer.bindingContext,
      overrideContext: composer.overrideContext,
      owningView: composer.owningView,
      container: composer.container,
      viewSlot: composer.viewSlot,
      viewResources: composer.viewResources,
      currentController: composer.currentController,
      host: composer.element
    });
  }

  function processInstruction(composer, instruction) {
    composer.currentInstruction = null;
    composer.compositionEngine.compose(instruction).then(function (controller) {
      composer.currentController = controller;
      composer.currentViewModel = controller ? controller.viewModel : null;
    });
  }
});
define('aurelia-templating-resources/if',['exports', 'aurelia-templating', 'aurelia-dependency-injection'], function (exports, _aureliaTemplating, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.If = undefined;

  

  var _dec, _dec2, _class;

  var If = exports.If = (_dec = (0, _aureliaTemplating.customAttribute)('if'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
    function If(viewFactory, viewSlot) {
      

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.showing = false;
      this.view = null;
      this.bindingContext = null;
      this.overrideContext = null;
    }

    If.prototype.bind = function bind(bindingContext, overrideContext) {
      this.bindingContext = bindingContext;
      this.overrideContext = overrideContext;
      this.valueChanged(this.value);
    };

    If.prototype.valueChanged = function valueChanged(newValue) {
      var _this = this;

      if (this.__queuedChanges) {
        this.__queuedChanges.push(newValue);
        return;
      }

      var maybePromise = this._runValueChanged(newValue);
      if (maybePromise instanceof Promise) {
        (function () {
          var queuedChanges = _this.__queuedChanges = [];

          var runQueuedChanges = function runQueuedChanges() {
            if (!queuedChanges.length) {
              _this.__queuedChanges = undefined;
              return;
            }

            var nextPromise = _this._runValueChanged(queuedChanges.shift()) || Promise.resolve();
            nextPromise.then(runQueuedChanges);
          };

          maybePromise.then(runQueuedChanges);
        })();
      }
    };

    If.prototype._runValueChanged = function _runValueChanged(newValue) {
      var _this2 = this;

      if (!newValue) {
        var viewOrPromise = void 0;
        if (this.view !== null && this.showing) {
          viewOrPromise = this.viewSlot.remove(this.view);
          if (viewOrPromise instanceof Promise) {
            viewOrPromise.then(function () {
              return _this2.view.unbind();
            });
          } else {
            this.view.unbind();
          }
        }

        this.showing = false;
        return viewOrPromise;
      }

      if (this.view === null) {
        this.view = this.viewFactory.create();
      }

      if (!this.view.isBound) {
        this.view.bind(this.bindingContext, this.overrideContext);
      }

      if (!this.showing) {
        this.showing = true;
        return this.viewSlot.add(this.view);
      }

      return undefined;
    };

    If.prototype.unbind = function unbind() {
      if (this.view === null) {
        return;
      }

      this.view.unbind();

      if (!this.viewFactory.isCaching) {
        return;
      }

      if (this.showing) {
        this.showing = false;
        this.viewSlot.remove(this.view, true, true);
      }
      this.view.returnToCache();
      this.view = null;
    };

    return If;
  }()) || _class) || _class) || _class);
});
define('aurelia-templating-resources/with',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-binding'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.With = undefined;

  

  var _dec, _dec2, _class;

  var With = exports.With = (_dec = (0, _aureliaTemplating.customAttribute)('with'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
    function With(viewFactory, viewSlot) {
      

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.parentOverrideContext = null;
      this.view = null;
    }

    With.prototype.bind = function bind(bindingContext, overrideContext) {
      this.parentOverrideContext = overrideContext;
      this.valueChanged(this.value);
    };

    With.prototype.valueChanged = function valueChanged(newValue) {
      var overrideContext = (0, _aureliaBinding.createOverrideContext)(newValue, this.parentOverrideContext);
      if (!this.view) {
        this.view = this.viewFactory.create();
        this.view.bind(newValue, overrideContext);
        this.viewSlot.add(this.view);
      } else {
        this.view.bind(newValue, overrideContext);
      }
    };

    With.prototype.unbind = function unbind() {
      this.parentOverrideContext = null;

      if (this.view) {
        this.view.unbind();
      }
    };

    return With;
  }()) || _class) || _class) || _class);
});
define('aurelia-templating-resources/repeat',['exports', 'aurelia-dependency-injection', 'aurelia-binding', 'aurelia-templating', './repeat-strategy-locator', './repeat-utilities', './analyze-view-factory', './abstract-repeater'], function (exports, _aureliaDependencyInjection, _aureliaBinding, _aureliaTemplating, _repeatStrategyLocator, _repeatUtilities, _analyzeViewFactory, _abstractRepeater) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Repeat = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var Repeat = exports.Repeat = (_dec = (0, _aureliaTemplating.customAttribute)('repeat'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.TargetInstruction, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources, _aureliaBinding.ObserverLocator, _repeatStrategyLocator.RepeatStrategyLocator), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = (_class2 = function (_AbstractRepeater) {
    _inherits(Repeat, _AbstractRepeater);

    function Repeat(viewFactory, instruction, viewSlot, viewResources, observerLocator, strategyLocator) {
      

      var _this = _possibleConstructorReturn(this, _AbstractRepeater.call(this, {
        local: 'item',
        viewsRequireLifecycle: (0, _analyzeViewFactory.viewsRequireLifecycle)(viewFactory)
      }));

      _initDefineProp(_this, 'items', _descriptor, _this);

      _initDefineProp(_this, 'local', _descriptor2, _this);

      _initDefineProp(_this, 'key', _descriptor3, _this);

      _initDefineProp(_this, 'value', _descriptor4, _this);

      _this.viewFactory = viewFactory;
      _this.instruction = instruction;
      _this.viewSlot = viewSlot;
      _this.lookupFunctions = viewResources.lookupFunctions;
      _this.observerLocator = observerLocator;
      _this.key = 'key';
      _this.value = 'value';
      _this.strategyLocator = strategyLocator;
      _this.ignoreMutation = false;
      _this.sourceExpression = (0, _repeatUtilities.getItemsSourceExpression)(_this.instruction, 'repeat.for');
      _this.isOneTime = (0, _repeatUtilities.isOneTime)(_this.sourceExpression);
      _this.viewsRequireLifecycle = (0, _analyzeViewFactory.viewsRequireLifecycle)(viewFactory);
      return _this;
    }

    Repeat.prototype.call = function call(context, changes) {
      this[context](this.items, changes);
    };

    Repeat.prototype.bind = function bind(bindingContext, overrideContext) {
      this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
      this.matcherBinding = this._captureAndRemoveMatcherBinding();
      this.itemsChanged();
    };

    Repeat.prototype.unbind = function unbind() {
      this.scope = null;
      this.items = null;
      this.matcherBinding = null;
      this.viewSlot.removeAll(true);
      this._unsubscribeCollection();
    };

    Repeat.prototype._unsubscribeCollection = function _unsubscribeCollection() {
      if (this.collectionObserver) {
        this.collectionObserver.unsubscribe(this.callContext, this);
        this.collectionObserver = null;
        this.callContext = null;
      }
    };

    Repeat.prototype.itemsChanged = function itemsChanged() {
      this._unsubscribeCollection();

      if (!this.scope) {
        return;
      }

      var items = this.items;
      this.strategy = this.strategyLocator.getStrategy(items);
      if (!this.strategy) {
        throw new Error('Value for \'' + this.sourceExpression + '\' is non-repeatable');
      }

      if (!this.isOneTime && !this._observeInnerCollection()) {
        this._observeCollection();
      }
      this.strategy.instanceChanged(this, items);
    };

    Repeat.prototype._getInnerCollection = function _getInnerCollection() {
      var expression = (0, _repeatUtilities.unwrapExpression)(this.sourceExpression);
      if (!expression) {
        return null;
      }
      return expression.evaluate(this.scope, null);
    };

    Repeat.prototype.handleCollectionMutated = function handleCollectionMutated(collection, changes) {
      if (!this.collectionObserver) {
        return;
      }
      this.strategy.instanceMutated(this, collection, changes);
    };

    Repeat.prototype.handleInnerCollectionMutated = function handleInnerCollectionMutated(collection, changes) {
      var _this2 = this;

      if (!this.collectionObserver) {
        return;
      }

      if (this.ignoreMutation) {
        return;
      }
      this.ignoreMutation = true;
      var newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
      this.observerLocator.taskQueue.queueMicroTask(function () {
        return _this2.ignoreMutation = false;
      });

      if (newItems === this.items) {
        this.itemsChanged();
      } else {
        this.items = newItems;
      }
    };

    Repeat.prototype._observeInnerCollection = function _observeInnerCollection() {
      var items = this._getInnerCollection();
      var strategy = this.strategyLocator.getStrategy(items);
      if (!strategy) {
        return false;
      }
      this.collectionObserver = strategy.getCollectionObserver(this.observerLocator, items);
      if (!this.collectionObserver) {
        return false;
      }
      this.callContext = 'handleInnerCollectionMutated';
      this.collectionObserver.subscribe(this.callContext, this);
      return true;
    };

    Repeat.prototype._observeCollection = function _observeCollection() {
      var items = this.items;
      this.collectionObserver = this.strategy.getCollectionObserver(this.observerLocator, items);
      if (this.collectionObserver) {
        this.callContext = 'handleCollectionMutated';
        this.collectionObserver.subscribe(this.callContext, this);
      }
    };

    Repeat.prototype._captureAndRemoveMatcherBinding = function _captureAndRemoveMatcherBinding() {
      if (this.viewFactory.viewFactory) {
        var instructions = this.viewFactory.viewFactory.instructions;
        var instructionIds = Object.keys(instructions);
        for (var i = 0; i < instructionIds.length; i++) {
          var expressions = instructions[instructionIds[i]].expressions;
          if (expressions) {
            for (var ii = 0; i < expressions.length; i++) {
              if (expressions[ii].targetProperty === 'matcher') {
                var matcherBinding = expressions[ii];
                expressions.splice(ii, 1);
                return matcherBinding;
              }
            }
          }
        }
      }

      return undefined;
    };

    Repeat.prototype.viewCount = function viewCount() {
      return this.viewSlot.children.length;
    };

    Repeat.prototype.views = function views() {
      return this.viewSlot.children;
    };

    Repeat.prototype.view = function view(index) {
      return this.viewSlot.children[index];
    };

    Repeat.prototype.matcher = function matcher() {
      return this.matcherBinding ? this.matcherBinding.sourceExpression.evaluate(this.scope, this.matcherBinding.lookupFunctions) : null;
    };

    Repeat.prototype.addView = function addView(bindingContext, overrideContext) {
      var view = this.viewFactory.create();
      view.bind(bindingContext, overrideContext);
      this.viewSlot.add(view);
    };

    Repeat.prototype.insertView = function insertView(index, bindingContext, overrideContext) {
      var view = this.viewFactory.create();
      view.bind(bindingContext, overrideContext);
      this.viewSlot.insert(index, view);
    };

    Repeat.prototype.moveView = function moveView(sourceIndex, targetIndex) {
      this.viewSlot.move(sourceIndex, targetIndex);
    };

    Repeat.prototype.removeAllViews = function removeAllViews(returnToCache, skipAnimation) {
      return this.viewSlot.removeAll(returnToCache, skipAnimation);
    };

    Repeat.prototype.removeViews = function removeViews(viewsToRemove, returnToCache, skipAnimation) {
      return this.viewSlot.removeMany(viewsToRemove, returnToCache, skipAnimation);
    };

    Repeat.prototype.removeView = function removeView(index, returnToCache, skipAnimation) {
      return this.viewSlot.removeAt(index, returnToCache, skipAnimation);
    };

    Repeat.prototype.updateBindings = function updateBindings(view) {
      var j = view.bindings.length;
      while (j--) {
        (0, _repeatUtilities.updateOneTimeBinding)(view.bindings[j]);
      }
      j = view.controllers.length;
      while (j--) {
        var k = view.controllers[j].boundProperties.length;
        while (k--) {
          var binding = view.controllers[j].boundProperties[k].binding;
          (0, _repeatUtilities.updateOneTimeBinding)(binding);
        }
      }
    };

    return Repeat;
  }(_abstractRepeater.AbstractRepeater), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'items', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'local', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'key', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'value', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class) || _class);
});
define('aurelia-templating-resources/repeat-strategy-locator',['exports', './null-repeat-strategy', './array-repeat-strategy', './map-repeat-strategy', './set-repeat-strategy', './number-repeat-strategy'], function (exports, _nullRepeatStrategy, _arrayRepeatStrategy, _mapRepeatStrategy, _setRepeatStrategy, _numberRepeatStrategy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RepeatStrategyLocator = undefined;

  

  var RepeatStrategyLocator = exports.RepeatStrategyLocator = function () {
    function RepeatStrategyLocator() {
      

      this.matchers = [];
      this.strategies = [];

      this.addStrategy(function (items) {
        return items === null || items === undefined;
      }, new _nullRepeatStrategy.NullRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Array;
      }, new _arrayRepeatStrategy.ArrayRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Map;
      }, new _mapRepeatStrategy.MapRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Set;
      }, new _setRepeatStrategy.SetRepeatStrategy());
      this.addStrategy(function (items) {
        return typeof items === 'number';
      }, new _numberRepeatStrategy.NumberRepeatStrategy());
    }

    RepeatStrategyLocator.prototype.addStrategy = function addStrategy(matcher, strategy) {
      this.matchers.push(matcher);
      this.strategies.push(strategy);
    };

    RepeatStrategyLocator.prototype.getStrategy = function getStrategy(items) {
      var matchers = this.matchers;

      for (var i = 0, ii = matchers.length; i < ii; ++i) {
        if (matchers[i](items)) {
          return this.strategies[i];
        }
      }

      return null;
    };

    return RepeatStrategyLocator;
  }();
});
define('aurelia-templating-resources/null-repeat-strategy',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var NullRepeatStrategy = exports.NullRepeatStrategy = function () {
    function NullRepeatStrategy() {
      
    }

    NullRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      repeat.removeAllViews(true);
    };

    NullRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {};

    return NullRepeatStrategy;
  }();
});
define('aurelia-templating-resources/array-repeat-strategy',['exports', './repeat-utilities', 'aurelia-binding'], function (exports, _repeatUtilities, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ArrayRepeatStrategy = undefined;

  

  var ArrayRepeatStrategy = exports.ArrayRepeatStrategy = function () {
    function ArrayRepeatStrategy() {
      
    }

    ArrayRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getArrayObserver(items);
    };

    ArrayRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var itemsLength = items.length;

      if (!items || itemsLength === 0) {
        repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        return;
      }

      var children = repeat.views();
      var viewsLength = children.length;

      if (viewsLength === 0) {
        this._standardProcessInstanceChanged(repeat, items);
        return;
      }

      if (repeat.viewsRequireLifecycle) {
        (function () {
          var childrenSnapshot = children.slice(0);
          var itemNameInBindingContext = repeat.local;
          var matcher = repeat.matcher();

          var itemsPreviouslyInViews = [];
          var viewsToRemove = [];

          for (var index = 0; index < viewsLength; index++) {
            var view = childrenSnapshot[index];
            var oldItem = view.bindingContext[itemNameInBindingContext];

            if ((0, _repeatUtilities.indexOf)(items, oldItem, matcher) === -1) {
              viewsToRemove.push(view);
            } else {
              itemsPreviouslyInViews.push(oldItem);
            }
          }

          var updateViews = void 0;
          var removePromise = void 0;

          if (itemsPreviouslyInViews.length > 0) {
            removePromise = repeat.removeViews(viewsToRemove, true, !repeat.viewsRequireLifecycle);
            updateViews = function updateViews() {
              for (var _index = 0; _index < itemsLength; _index++) {
                var item = items[_index];
                var indexOfView = (0, _repeatUtilities.indexOf)(itemsPreviouslyInViews, item, matcher, _index);
                var _view = void 0;

                if (indexOfView === -1) {
                  var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, items[_index], _index, itemsLength);
                  repeat.insertView(_index, overrideContext.bindingContext, overrideContext);

                  itemsPreviouslyInViews.splice(_index, 0, undefined);
                } else if (indexOfView === _index) {
                  _view = children[indexOfView];
                  itemsPreviouslyInViews[indexOfView] = undefined;
                } else {
                  _view = children[indexOfView];
                  repeat.moveView(indexOfView, _index);
                  itemsPreviouslyInViews.splice(indexOfView, 1);
                  itemsPreviouslyInViews.splice(_index, 0, undefined);
                }

                if (_view) {
                  (0, _repeatUtilities.updateOverrideContext)(_view.overrideContext, _index, itemsLength);
                }
              }

              _this._inPlaceProcessItems(repeat, items);
            };
          } else {
            removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            updateViews = function updateViews() {
              return _this._standardProcessInstanceChanged(repeat, items);
            };
          }

          if (removePromise instanceof Promise) {
            removePromise.then(updateViews);
          } else {
            updateViews();
          }
        })();
      } else {
        this._inPlaceProcessItems(repeat, items);
      }
    };

    ArrayRepeatStrategy.prototype._standardProcessInstanceChanged = function _standardProcessInstanceChanged(repeat, items) {
      for (var i = 0, ii = items.length; i < ii; i++) {
        var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, items[i], i, ii);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }
    };

    ArrayRepeatStrategy.prototype._inPlaceProcessItems = function _inPlaceProcessItems(repeat, items) {
      var itemsLength = items.length;
      var viewsLength = repeat.viewCount();

      while (viewsLength > itemsLength) {
        viewsLength--;
        repeat.removeView(viewsLength, true, !repeat.viewsRequireLifecycle);
      }

      var local = repeat.local;

      for (var i = 0; i < viewsLength; i++) {
        var view = repeat.view(i);
        var last = i === itemsLength - 1;
        var middle = i !== 0 && !last;

        if (view.bindingContext[local] === items[i] && view.overrideContext.$middle === middle && view.overrideContext.$last === last) {
          continue;
        }

        view.bindingContext[local] = items[i];
        view.overrideContext.$middle = middle;
        view.overrideContext.$last = last;
        repeat.updateBindings(view);
      }

      for (var _i = viewsLength; _i < itemsLength; _i++) {
        var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, items[_i], _i, itemsLength);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }
    };

    ArrayRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, array, splices) {
      var _this2 = this;

      if (repeat.__queuedSplices) {
        for (var i = 0, ii = splices.length; i < ii; ++i) {
          var _splices$i = splices[i];
          var index = _splices$i.index;
          var removed = _splices$i.removed;
          var addedCount = _splices$i.addedCount;

          (0, _aureliaBinding.mergeSplice)(repeat.__queuedSplices, index, removed, addedCount);
        }

        repeat.__array = array.slice(0);
        return;
      }

      var maybePromise = this._runSplices(repeat, array.slice(0), splices);
      if (maybePromise instanceof Promise) {
        (function () {
          var queuedSplices = repeat.__queuedSplices = [];

          var runQueuedSplices = function runQueuedSplices() {
            if (!queuedSplices.length) {
              repeat.__queuedSplices = undefined;
              repeat.__array = undefined;
              return;
            }

            var nextPromise = _this2._runSplices(repeat, repeat.__array, queuedSplices) || Promise.resolve();
            queuedSplices = repeat.__queuedSplices = [];
            nextPromise.then(runQueuedSplices);
          };

          maybePromise.then(runQueuedSplices);
        })();
      }
    };

    ArrayRepeatStrategy.prototype._runSplices = function _runSplices(repeat, array, splices) {
      var _this3 = this;

      var removeDelta = 0;
      var rmPromises = [];

      for (var i = 0, ii = splices.length; i < ii; ++i) {
        var splice = splices[i];
        var removed = splice.removed;

        for (var j = 0, jj = removed.length; j < jj; ++j) {
          var viewOrPromise = repeat.removeView(splice.index + removeDelta + rmPromises.length, true);
          if (viewOrPromise instanceof Promise) {
            rmPromises.push(viewOrPromise);
          }
        }
        removeDelta -= splice.addedCount;
      }

      if (rmPromises.length > 0) {
        return Promise.all(rmPromises).then(function () {
          var spliceIndexLow = _this3._handleAddedSplices(repeat, array, splices);
          (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), spliceIndexLow);
        });
      }

      var spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
      (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), spliceIndexLow);

      return undefined;
    };

    ArrayRepeatStrategy.prototype._handleAddedSplices = function _handleAddedSplices(repeat, array, splices) {
      var spliceIndex = void 0;
      var spliceIndexLow = void 0;
      var arrayLength = array.length;
      for (var i = 0, ii = splices.length; i < ii; ++i) {
        var splice = splices[i];
        var addIndex = spliceIndex = splice.index;
        var end = splice.index + splice.addedCount;

        if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
          spliceIndexLow = spliceIndex;
        }

        for (; addIndex < end; ++addIndex) {
          var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, array[addIndex], addIndex, arrayLength);
          repeat.insertView(addIndex, overrideContext.bindingContext, overrideContext);
        }
      }

      return spliceIndexLow;
    };

    return ArrayRepeatStrategy;
  }();
});
define('aurelia-templating-resources/repeat-utilities',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.updateOverrideContexts = updateOverrideContexts;
  exports.createFullOverrideContext = createFullOverrideContext;
  exports.updateOverrideContext = updateOverrideContext;
  exports.getItemsSourceExpression = getItemsSourceExpression;
  exports.unwrapExpression = unwrapExpression;
  exports.isOneTime = isOneTime;
  exports.updateOneTimeBinding = updateOneTimeBinding;
  exports.indexOf = indexOf;


  var oneTime = _aureliaBinding.bindingMode.oneTime;

  function updateOverrideContexts(views, startIndex) {
    var length = views.length;

    if (startIndex > 0) {
      startIndex = startIndex - 1;
    }

    for (; startIndex < length; ++startIndex) {
      updateOverrideContext(views[startIndex].overrideContext, startIndex, length);
    }
  }

  function createFullOverrideContext(repeat, data, index, length, key) {
    var bindingContext = {};
    var overrideContext = (0, _aureliaBinding.createOverrideContext)(bindingContext, repeat.scope.overrideContext);

    if (typeof key !== 'undefined') {
      bindingContext[repeat.key] = key;
      bindingContext[repeat.value] = data;
    } else {
      bindingContext[repeat.local] = data;
    }
    updateOverrideContext(overrideContext, index, length);
    return overrideContext;
  }

  function updateOverrideContext(overrideContext, index, length) {
    var first = index === 0;
    var last = index === length - 1;
    var even = index % 2 === 0;

    overrideContext.$index = index;
    overrideContext.$first = first;
    overrideContext.$last = last;
    overrideContext.$middle = !(first || last);
    overrideContext.$odd = !even;
    overrideContext.$even = even;
  }

  function getItemsSourceExpression(instruction, attrName) {
    return instruction.behaviorInstructions.filter(function (bi) {
      return bi.originalAttrName === attrName;
    })[0].attributes.items.sourceExpression;
  }

  function unwrapExpression(expression) {
    var unwrapped = false;
    while (expression instanceof _aureliaBinding.BindingBehavior) {
      expression = expression.expression;
    }
    while (expression instanceof _aureliaBinding.ValueConverter) {
      expression = expression.expression;
      unwrapped = true;
    }
    return unwrapped ? expression : null;
  }

  function isOneTime(expression) {
    while (expression instanceof _aureliaBinding.BindingBehavior) {
      if (expression.name === 'oneTime') {
        return true;
      }
      expression = expression.expression;
    }
    return false;
  }

  function updateOneTimeBinding(binding) {
    if (binding.call && binding.mode === oneTime) {
      binding.call(_aureliaBinding.sourceContext);
    } else if (binding.updateOneTimeBindings) {
      binding.updateOneTimeBindings();
    }
  }

  function indexOf(array, item, matcher, startIndex) {
    if (!matcher) {
      return array.indexOf(item);
    }
    var length = array.length;
    for (var index = startIndex || 0; index < length; index++) {
      if (matcher(array[index], item)) {
        return index;
      }
    }
    return -1;
  }
});
define('aurelia-templating-resources/map-repeat-strategy',['exports', './repeat-utilities'], function (exports, _repeatUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MapRepeatStrategy = undefined;

  

  var MapRepeatStrategy = exports.MapRepeatStrategy = function () {
    function MapRepeatStrategy() {
      
    }

    MapRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getMapObserver(items);
    };

    MapRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, items);
        });
        return;
      }
      this._standardProcessItems(repeat, items);
    };

    MapRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, items) {
      var index = 0;
      var overrideContext = void 0;

      items.forEach(function (value, key) {
        overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, value, index, items.size, key);
        repeat.addView(overrideContext.bindingContext, overrideContext);
        ++index;
      });
    };

    MapRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, map, records) {
      var key = void 0;
      var i = void 0;
      var ii = void 0;
      var overrideContext = void 0;
      var removeIndex = void 0;
      var record = void 0;
      var rmPromises = [];
      var viewOrPromise = void 0;

      for (i = 0, ii = records.length; i < ii; ++i) {
        record = records[i];
        key = record.key;
        switch (record.type) {
          case 'update':
            removeIndex = this._getViewIndexByKey(repeat, key);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, map.get(key), removeIndex, map.size, key);
            repeat.insertView(removeIndex, overrideContext.bindingContext, overrideContext);
            break;
          case 'add':
            overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, map.get(key), map.size - 1, map.size, key);
            repeat.insertView(map.size - 1, overrideContext.bindingContext, overrideContext);
            break;
          case 'delete':
            if (record.oldValue === undefined) {
              return;
            }
            removeIndex = this._getViewIndexByKey(repeat, key);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            break;
          case 'clear':
            repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            break;
          default:
            continue;
        }
      }

      if (rmPromises.length > 0) {
        Promise.all(rmPromises).then(function () {
          (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
        });
      } else {
        (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
      }
    };

    MapRepeatStrategy.prototype._getViewIndexByKey = function _getViewIndexByKey(repeat, key) {
      var i = void 0;
      var ii = void 0;
      var child = void 0;

      for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
        child = repeat.view(i);
        if (child.bindingContext[repeat.key] === key) {
          return i;
        }
      }

      return undefined;
    };

    return MapRepeatStrategy;
  }();
});
define('aurelia-templating-resources/set-repeat-strategy',['exports', './repeat-utilities'], function (exports, _repeatUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SetRepeatStrategy = undefined;

  

  var SetRepeatStrategy = exports.SetRepeatStrategy = function () {
    function SetRepeatStrategy() {
      
    }

    SetRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getSetObserver(items);
    };

    SetRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, items);
        });
        return;
      }
      this._standardProcessItems(repeat, items);
    };

    SetRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, items) {
      var index = 0;
      var overrideContext = void 0;

      items.forEach(function (value) {
        overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, value, index, items.size);
        repeat.addView(overrideContext.bindingContext, overrideContext);
        ++index;
      });
    };

    SetRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, set, records) {
      var value = void 0;
      var i = void 0;
      var ii = void 0;
      var overrideContext = void 0;
      var removeIndex = void 0;
      var record = void 0;
      var rmPromises = [];
      var viewOrPromise = void 0;

      for (i = 0, ii = records.length; i < ii; ++i) {
        record = records[i];
        value = record.value;
        switch (record.type) {
          case 'add':
            overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, value, set.size - 1, set.size);
            repeat.insertView(set.size - 1, overrideContext.bindingContext, overrideContext);
            break;
          case 'delete':
            removeIndex = this._getViewIndexByValue(repeat, value);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            break;
          case 'clear':
            repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            break;
          default:
            continue;
        }
      }

      if (rmPromises.length > 0) {
        Promise.all(rmPromises).then(function () {
          (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
        });
      } else {
        (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
      }
    };

    SetRepeatStrategy.prototype._getViewIndexByValue = function _getViewIndexByValue(repeat, value) {
      var i = void 0;
      var ii = void 0;
      var child = void 0;

      for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
        child = repeat.view(i);
        if (child.bindingContext[repeat.local] === value) {
          return i;
        }
      }

      return undefined;
    };

    return SetRepeatStrategy;
  }();
});
define('aurelia-templating-resources/number-repeat-strategy',['exports', './repeat-utilities'], function (exports, _repeatUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NumberRepeatStrategy = undefined;

  

  var NumberRepeatStrategy = exports.NumberRepeatStrategy = function () {
    function NumberRepeatStrategy() {
      
    }

    NumberRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver() {
      return null;
    };

    NumberRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, value) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, value);
        });
        return;
      }
      this._standardProcessItems(repeat, value);
    };

    NumberRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, value) {
      var childrenLength = repeat.viewCount();
      var i = void 0;
      var ii = void 0;
      var overrideContext = void 0;
      var viewsToRemove = void 0;

      value = Math.floor(value);
      viewsToRemove = childrenLength - value;

      if (viewsToRemove > 0) {
        if (viewsToRemove > childrenLength) {
          viewsToRemove = childrenLength;
        }

        for (i = 0, ii = viewsToRemove; i < ii; ++i) {
          repeat.removeView(childrenLength - (i + 1), true, !repeat.viewsRequireLifecycle);
        }

        return;
      }

      for (i = childrenLength, ii = value; i < ii; ++i) {
        overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, i, i, ii);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }

      (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
    };

    return NumberRepeatStrategy;
  }();
});
define('aurelia-templating-resources/analyze-view-factory',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.viewsRequireLifecycle = viewsRequireLifecycle;
  var lifecycleOptionalBehaviors = exports.lifecycleOptionalBehaviors = ['focus', 'if', 'repeat', 'show', 'with'];

  function behaviorRequiresLifecycle(instruction) {
    var t = instruction.type;
    var name = t.elementName !== null ? t.elementName : t.attributeName;
    return lifecycleOptionalBehaviors.indexOf(name) === -1 && (t.handlesAttached || t.handlesBind || t.handlesCreated || t.handlesDetached || t.handlesUnbind) || t.viewFactory && viewsRequireLifecycle(t.viewFactory) || instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
  }

  function targetRequiresLifecycle(instruction) {
    var behaviors = instruction.behaviorInstructions;
    if (behaviors) {
      var i = behaviors.length;
      while (i--) {
        if (behaviorRequiresLifecycle(behaviors[i])) {
          return true;
        }
      }
    }

    return instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
  }

  function viewsRequireLifecycle(viewFactory) {
    if ('_viewsRequireLifecycle' in viewFactory) {
      return viewFactory._viewsRequireLifecycle;
    }

    viewFactory._viewsRequireLifecycle = false;

    if (viewFactory.viewFactory) {
      viewFactory._viewsRequireLifecycle = viewsRequireLifecycle(viewFactory.viewFactory);
      return viewFactory._viewsRequireLifecycle;
    }

    if (viewFactory.template.querySelector('.au-animate')) {
      viewFactory._viewsRequireLifecycle = true;
      return true;
    }

    for (var id in viewFactory.instructions) {
      if (targetRequiresLifecycle(viewFactory.instructions[id])) {
        viewFactory._viewsRequireLifecycle = true;
        return true;
      }
    }

    viewFactory._viewsRequireLifecycle = false;
    return false;
  }
});
define('aurelia-templating-resources/abstract-repeater',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var AbstractRepeater = exports.AbstractRepeater = function () {
    function AbstractRepeater(options) {
      

      Object.assign(this, {
        local: 'items',
        viewsRequireLifecycle: true
      }, options);
    }

    AbstractRepeater.prototype.viewCount = function viewCount() {
      throw new Error('subclass must implement `viewCount`');
    };

    AbstractRepeater.prototype.views = function views() {
      throw new Error('subclass must implement `views`');
    };

    AbstractRepeater.prototype.view = function view(index) {
      throw new Error('subclass must implement `view`');
    };

    AbstractRepeater.prototype.matcher = function matcher() {
      throw new Error('subclass must implement `matcher`');
    };

    AbstractRepeater.prototype.addView = function addView(bindingContext, overrideContext) {
      throw new Error('subclass must implement `addView`');
    };

    AbstractRepeater.prototype.insertView = function insertView(index, bindingContext, overrideContext) {
      throw new Error('subclass must implement `insertView`');
    };

    AbstractRepeater.prototype.moveView = function moveView(sourceIndex, targetIndex) {
      throw new Error('subclass must implement `moveView`');
    };

    AbstractRepeater.prototype.removeAllViews = function removeAllViews(returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeAllViews`');
    };

    AbstractRepeater.prototype.removeViews = function removeViews(viewsToRemove, returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeView`');
    };

    AbstractRepeater.prototype.removeView = function removeView(index, returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeView`');
    };

    AbstractRepeater.prototype.updateBindings = function updateBindings(view) {
      throw new Error('subclass must implement `updateBindings`');
    };

    return AbstractRepeater;
  }();
});
define('aurelia-templating-resources/show',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-pal', './aurelia-hide-style'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaPal, _aureliaHideStyle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Show = undefined;

  

  var _dec, _dec2, _class;

  var Show = exports.Show = (_dec = (0, _aureliaTemplating.customAttribute)('show'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTemplating.Animator, _aureliaDependencyInjection.Optional.of(_aureliaPal.DOM.boundary, true)), _dec(_class = _dec2(_class = function () {
    function Show(element, animator, domBoundary) {
      

      this.element = element;
      this.animator = animator;
      this.domBoundary = domBoundary;
    }

    Show.prototype.created = function created() {
      (0, _aureliaHideStyle.injectAureliaHideStyleAtBoundary)(this.domBoundary);
    };

    Show.prototype.valueChanged = function valueChanged(newValue) {
      if (newValue) {
        this.animator.removeClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      } else {
        this.animator.addClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      }
    };

    Show.prototype.bind = function bind(bindingContext) {
      this.valueChanged(this.value);
    };

    return Show;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/aurelia-hide-style',['exports', 'aurelia-pal'], function (exports, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.aureliaHideClassName = undefined;
  exports.injectAureliaHideStyleAtHead = injectAureliaHideStyleAtHead;
  exports.injectAureliaHideStyleAtBoundary = injectAureliaHideStyleAtBoundary;
  var aureliaHideClassName = exports.aureliaHideClassName = 'aurelia-hide';

  var aureliaHideClass = '.' + aureliaHideClassName + ' { display:none !important; }';

  function injectAureliaHideStyleAtHead() {
    _aureliaPal.DOM.injectStyles(aureliaHideClass);
  }

  function injectAureliaHideStyleAtBoundary(domBoundary) {
    if (_aureliaPal.FEATURE.shadowDOM && domBoundary && !domBoundary.hasAureliaHideStyle) {
      domBoundary.hasAureliaHideStyle = true;
      _aureliaPal.DOM.injectStyles(aureliaHideClass, domBoundary);
    }
  }
});
define('aurelia-templating-resources/hide',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-pal', './aurelia-hide-style'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaPal, _aureliaHideStyle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Hide = undefined;

  

  var _dec, _dec2, _class;

  var Hide = exports.Hide = (_dec = (0, _aureliaTemplating.customAttribute)('hide'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTemplating.Animator, _aureliaDependencyInjection.Optional.of(_aureliaPal.DOM.boundary, true)), _dec(_class = _dec2(_class = function () {
    function Hide(element, animator, domBoundary) {
      

      this.element = element;
      this.animator = animator;
      this.domBoundary = domBoundary;
    }

    Hide.prototype.created = function created() {
      (0, _aureliaHideStyle.injectAureliaHideStyleAtBoundary)(this.domBoundary);
    };

    Hide.prototype.valueChanged = function valueChanged(newValue) {
      if (newValue) {
        this.animator.addClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      } else {
        this.animator.removeClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      }
    };

    Hide.prototype.bind = function bind(bindingContext) {
      this.valueChanged(this.value);
    };

    return Hide;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/sanitize-html',['exports', 'aurelia-binding', 'aurelia-dependency-injection', './html-sanitizer'], function (exports, _aureliaBinding, _aureliaDependencyInjection, _htmlSanitizer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SanitizeHTMLValueConverter = undefined;

  

  var _dec, _dec2, _class;

  var SanitizeHTMLValueConverter = exports.SanitizeHTMLValueConverter = (_dec = (0, _aureliaBinding.valueConverter)('sanitizeHTML'), _dec2 = (0, _aureliaDependencyInjection.inject)(_htmlSanitizer.HTMLSanitizer), _dec(_class = _dec2(_class = function () {
    function SanitizeHTMLValueConverter(sanitizer) {
      

      this.sanitizer = sanitizer;
    }

    SanitizeHTMLValueConverter.prototype.toView = function toView(untrustedMarkup) {
      if (untrustedMarkup === null || untrustedMarkup === undefined) {
        return null;
      }

      return this.sanitizer.sanitize(untrustedMarkup);
    };

    return SanitizeHTMLValueConverter;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/html-sanitizer',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

  var HTMLSanitizer = exports.HTMLSanitizer = function () {
    function HTMLSanitizer() {
      
    }

    HTMLSanitizer.prototype.sanitize = function sanitize(input) {
      return input.replace(SCRIPT_REGEX, '');
    };

    return HTMLSanitizer;
  }();
});
define('aurelia-templating-resources/replaceable',['exports', 'aurelia-dependency-injection', 'aurelia-templating'], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Replaceable = undefined;

  

  var _dec, _dec2, _class;

  var Replaceable = exports.Replaceable = (_dec = (0, _aureliaTemplating.customAttribute)('replaceable'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
    function Replaceable(viewFactory, viewSlot) {
      

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.view = null;
    }

    Replaceable.prototype.bind = function bind(bindingContext, overrideContext) {
      if (this.view === null) {
        this.view = this.viewFactory.create();
        this.viewSlot.add(this.view);
      }

      this.view.bind(bindingContext, overrideContext);
    };

    Replaceable.prototype.unbind = function unbind() {
      this.view.unbind();
    };

    return Replaceable;
  }()) || _class) || _class) || _class);
});
define('aurelia-templating-resources/focus',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-task-queue', 'aurelia-pal'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _aureliaTaskQueue, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Focus = undefined;

  

  var _dec, _dec2, _class;

  var Focus = exports.Focus = (_dec = (0, _aureliaTemplating.customAttribute)('focus', _aureliaBinding.bindingMode.twoWay), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTaskQueue.TaskQueue), _dec(_class = _dec2(_class = function () {
    function Focus(element, taskQueue) {
      var _this = this;

      

      this.element = element;
      this.taskQueue = taskQueue;
      this.isAttached = false;
      this.needsApply = false;

      this.focusListener = function (e) {
        _this.value = true;
      };
      this.blurListener = function (e) {
        if (_aureliaPal.DOM.activeElement !== _this.element) {
          _this.value = false;
        }
      };
    }

    Focus.prototype.valueChanged = function valueChanged(newValue) {
      if (this.isAttached) {
        this._apply();
      } else {
        this.needsApply = true;
      }
    };

    Focus.prototype._apply = function _apply() {
      var _this2 = this;

      if (this.value) {
        this.taskQueue.queueMicroTask(function () {
          if (_this2.value) {
            _this2.element.focus();
          }
        });
      } else {
        this.element.blur();
      }
    };

    Focus.prototype.attached = function attached() {
      this.isAttached = true;
      if (this.needsApply) {
        this.needsApply = false;
        this._apply();
      }
      this.element.addEventListener('focus', this.focusListener);
      this.element.addEventListener('blur', this.blurListener);
    };

    Focus.prototype.detached = function detached() {
      this.isAttached = false;
      this.element.removeEventListener('focus', this.focusListener);
      this.element.removeEventListener('blur', this.blurListener);
    };

    return Focus;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/css-resource',['exports', 'aurelia-templating', 'aurelia-loader', 'aurelia-dependency-injection', 'aurelia-path', 'aurelia-pal'], function (exports, _aureliaTemplating, _aureliaLoader, _aureliaDependencyInjection, _aureliaPath, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports._createCSSResource = _createCSSResource;

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  

  var cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;

  function fixupCSSUrls(address, css) {
    if (typeof css !== 'string') {
      throw new Error('Failed loading required CSS file: ' + address);
    }
    return css.replace(cssUrlMatcher, function (match, p1) {
      var quote = p1.charAt(0);
      if (quote === '\'' || quote === '"') {
        p1 = p1.substr(1, p1.length - 2);
      }
      return 'url(\'' + (0, _aureliaPath.relativeToFile)(p1, address) + '\')';
    });
  }

  var CSSResource = function () {
    function CSSResource(address) {
      

      this.address = address;
      this._global = null;
      this._scoped = null;
    }

    CSSResource.prototype.initialize = function initialize(container, target) {
      this._global = new target('global');
      this._scoped = new target('scoped');
    };

    CSSResource.prototype.register = function register(registry, name) {
      registry.registerViewEngineHooks(name === 'scoped' ? this._scoped : this._global);
    };

    CSSResource.prototype.load = function load(container) {
      var _this = this;

      return container.get(_aureliaLoader.Loader).loadText(this.address).catch(function (err) {
        return null;
      }).then(function (text) {
        text = fixupCSSUrls(_this.address, text);
        _this._global.css = text;
        _this._scoped.css = text;
      });
    };

    return CSSResource;
  }();

  var CSSViewEngineHooks = function () {
    function CSSViewEngineHooks(mode) {
      

      this.mode = mode;
      this.css = null;
      this._alreadyGloballyInjected = false;
    }

    CSSViewEngineHooks.prototype.beforeCompile = function beforeCompile(content, resources, instruction) {
      if (this.mode === 'scoped') {
        if (instruction.targetShadowDOM) {
          _aureliaPal.DOM.injectStyles(this.css, content, true);
        } else if (_aureliaPal.FEATURE.scopedCSS) {
          var styleNode = _aureliaPal.DOM.injectStyles(this.css, content, true);
          styleNode.setAttribute('scoped', 'scoped');
        } else if (!this._alreadyGloballyInjected) {
          _aureliaPal.DOM.injectStyles(this.css);
          this._alreadyGloballyInjected = true;
        }
      } else if (!this._alreadyGloballyInjected) {
        _aureliaPal.DOM.injectStyles(this.css);
        this._alreadyGloballyInjected = true;
      }
    };

    return CSSViewEngineHooks;
  }();

  function _createCSSResource(address) {
    var _dec, _class;

    var ViewCSS = (_dec = (0, _aureliaTemplating.resource)(new CSSResource(address)), _dec(_class = function (_CSSViewEngineHooks) {
      _inherits(ViewCSS, _CSSViewEngineHooks);

      function ViewCSS() {
        

        return _possibleConstructorReturn(this, _CSSViewEngineHooks.apply(this, arguments));
      }

      return ViewCSS;
    }(CSSViewEngineHooks)) || _class);

    return ViewCSS;
  }
});
define('aurelia-templating-resources/binding-mode-behaviors',['exports', 'aurelia-binding', 'aurelia-metadata'], function (exports, _aureliaBinding, _aureliaMetadata) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TwoWayBindingBehavior = exports.OneWayBindingBehavior = exports.OneTimeBindingBehavior = undefined;

  

  var _dec, _class, _dec2, _class2, _dec3, _class3;

  var modeBindingBehavior = {
    bind: function bind(binding, source, lookupFunctions) {
      binding.originalMode = binding.mode;
      binding.mode = this.mode;
    },
    unbind: function unbind(binding, source) {
      binding.mode = binding.originalMode;
      binding.originalMode = null;
    }
  };

  var OneTimeBindingBehavior = exports.OneTimeBindingBehavior = (_dec = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec(_class = function OneTimeBindingBehavior() {
    

    this.mode = _aureliaBinding.bindingMode.oneTime;
  }) || _class);
  var OneWayBindingBehavior = exports.OneWayBindingBehavior = (_dec2 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec2(_class2 = function OneWayBindingBehavior() {
    

    this.mode = _aureliaBinding.bindingMode.oneWay;
  }) || _class2);
  var TwoWayBindingBehavior = exports.TwoWayBindingBehavior = (_dec3 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec3(_class3 = function TwoWayBindingBehavior() {
    

    this.mode = _aureliaBinding.bindingMode.twoWay;
  }) || _class3);
});
define('aurelia-templating-resources/throttle-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ThrottleBindingBehavior = undefined;

  

  function throttle(newValue) {
    var _this = this;

    var state = this.throttleState;
    var elapsed = +new Date() - state.last;
    if (elapsed >= state.delay) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
      state.last = +new Date();
      this.throttledMethod(newValue);
      return;
    }
    state.newValue = newValue;
    if (state.timeoutId === null) {
      state.timeoutId = setTimeout(function () {
        state.timeoutId = null;
        state.last = +new Date();
        _this.throttledMethod(state.newValue);
      }, state.delay - elapsed);
    }
  }

  var ThrottleBindingBehavior = exports.ThrottleBindingBehavior = function () {
    function ThrottleBindingBehavior() {
      
    }

    ThrottleBindingBehavior.prototype.bind = function bind(binding, source) {
      var delay = arguments.length <= 2 || arguments[2] === undefined ? 200 : arguments[2];

      var methodToThrottle = 'updateTarget';
      if (binding.callSource) {
        methodToThrottle = 'callSource';
      } else if (binding.updateSource && binding.mode === _aureliaBinding.bindingMode.twoWay) {
          methodToThrottle = 'updateSource';
        }

      binding.throttledMethod = binding[methodToThrottle];
      binding.throttledMethod.originalName = methodToThrottle;

      binding[methodToThrottle] = throttle;

      binding.throttleState = {
        delay: delay,
        last: 0,
        timeoutId: null
      };
    };

    ThrottleBindingBehavior.prototype.unbind = function unbind(binding, source) {
      var methodToRestore = binding.throttledMethod.originalName;
      binding[methodToRestore] = binding.throttledMethod;
      binding.throttledMethod = null;
      clearTimeout(binding.throttleState.timeoutId);
      binding.throttleState = null;
    };

    return ThrottleBindingBehavior;
  }();
});
define('aurelia-templating-resources/debounce-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DebounceBindingBehavior = undefined;

  

  function debounce(newValue) {
    var _this = this;

    var state = this.debounceState;
    if (state.immediate) {
      state.immediate = false;
      this.debouncedMethod(newValue);
      return;
    }
    clearTimeout(state.timeoutId);
    state.timeoutId = setTimeout(function () {
      return _this.debouncedMethod(newValue);
    }, state.delay);
  }

  var DebounceBindingBehavior = exports.DebounceBindingBehavior = function () {
    function DebounceBindingBehavior() {
      
    }

    DebounceBindingBehavior.prototype.bind = function bind(binding, source) {
      var delay = arguments.length <= 2 || arguments[2] === undefined ? 200 : arguments[2];

      var methodToDebounce = 'updateTarget';
      if (binding.callSource) {
        methodToDebounce = 'callSource';
      } else if (binding.updateSource && binding.mode === _aureliaBinding.bindingMode.twoWay) {
          methodToDebounce = 'updateSource';
        }

      binding.debouncedMethod = binding[methodToDebounce];
      binding.debouncedMethod.originalName = methodToDebounce;

      binding[methodToDebounce] = debounce;

      binding.debounceState = {
        delay: delay,
        timeoutId: null,
        immediate: methodToDebounce === 'updateTarget' };
    };

    DebounceBindingBehavior.prototype.unbind = function unbind(binding, source) {
      var methodToRestore = binding.debouncedMethod.originalName;
      binding[methodToRestore] = binding.debouncedMethod;
      binding.debouncedMethod = null;
      clearTimeout(binding.debounceState.timeoutId);
      binding.debounceState = null;
    };

    return DebounceBindingBehavior;
  }();
});
define('aurelia-templating-resources/signal-binding-behavior',['exports', './binding-signaler'], function (exports, _bindingSignaler) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SignalBindingBehavior = undefined;

  

  var SignalBindingBehavior = exports.SignalBindingBehavior = function () {
    SignalBindingBehavior.inject = function inject() {
      return [_bindingSignaler.BindingSignaler];
    };

    function SignalBindingBehavior(bindingSignaler) {
      

      this.signals = bindingSignaler.signals;
    }

    SignalBindingBehavior.prototype.bind = function bind(binding, source) {
      if (!binding.updateTarget) {
        throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
      }
      if (arguments.length === 3) {
        var name = arguments[2];
        var bindings = this.signals[name] || (this.signals[name] = []);
        bindings.push(binding);
        binding.signalName = name;
      } else if (arguments.length > 3) {
        var names = Array.prototype.slice.call(arguments, 2);
        var i = names.length;
        while (i--) {
          var _name = names[i];
          var _bindings = this.signals[_name] || (this.signals[_name] = []);
          _bindings.push(binding);
        }
        binding.signalName = names;
      } else {
        throw new Error('Signal name is required.');
      }
    };

    SignalBindingBehavior.prototype.unbind = function unbind(binding, source) {
      var name = binding.signalName;
      binding.signalName = null;
      if (Array.isArray(name)) {
        var names = name;
        var i = names.length;
        while (i--) {
          var n = names[i];
          var bindings = this.signals[n];
          bindings.splice(bindings.indexOf(binding), 1);
        }
      } else {
        var _bindings2 = this.signals[name];
        _bindings2.splice(_bindings2.indexOf(binding), 1);
      }
    };

    return SignalBindingBehavior;
  }();
});
define('aurelia-templating-resources/binding-signaler',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BindingSignaler = undefined;

  

  var BindingSignaler = exports.BindingSignaler = function () {
    function BindingSignaler() {
      

      this.signals = {};
    }

    BindingSignaler.prototype.signal = function signal(name) {
      var bindings = this.signals[name];
      if (!bindings) {
        return;
      }
      var i = bindings.length;
      while (i--) {
        bindings[i].call(_aureliaBinding.sourceContext);
      }
    };

    return BindingSignaler;
  }();
});
define('aurelia-templating-resources/update-trigger-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UpdateTriggerBindingBehavior = undefined;

  

  var _class, _temp;

  var eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
  var notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way bindings on input/select elements.';

  var UpdateTriggerBindingBehavior = exports.UpdateTriggerBindingBehavior = (_temp = _class = function () {
    function UpdateTriggerBindingBehavior(eventManager) {
      

      this.eventManager = eventManager;
    }

    UpdateTriggerBindingBehavior.prototype.bind = function bind(binding, source) {
      for (var _len = arguments.length, events = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        events[_key - 2] = arguments[_key];
      }

      if (events.length === 0) {
        throw new Error(eventNamesRequired);
      }
      if (binding.mode !== _aureliaBinding.bindingMode.twoWay) {
        throw new Error(notApplicableMessage);
      }

      var targetObserver = binding.observerLocator.getObserver(binding.target, binding.targetProperty);
      if (!targetObserver.handler) {
        throw new Error(notApplicableMessage);
      }
      binding.targetObserver = targetObserver;

      targetObserver.originalHandler = binding.targetObserver.handler;

      var handler = this.eventManager.createElementHandler(events);
      targetObserver.handler = handler;
    };

    UpdateTriggerBindingBehavior.prototype.unbind = function unbind(binding, source) {
      binding.targetObserver.handler = binding.targetObserver.originalHandler;
      binding.targetObserver.originalHandler = null;
    };

    return UpdateTriggerBindingBehavior;
  }(), _class.inject = [_aureliaBinding.EventManager], _temp);
});
define('aurelia-templating-resources/html-resource-plugin',['exports', 'aurelia-templating', './dynamic-element'], function (exports, _aureliaTemplating, _dynamicElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getElementName = getElementName;
  exports.configure = configure;
  function getElementName(address) {
    return (/([^\/^\?]+)\.html/i.exec(address)[1].toLowerCase()
    );
  }

  function configure(config) {
    var viewEngine = config.container.get(_aureliaTemplating.ViewEngine);
    var loader = config.aurelia.loader;

    viewEngine.addResourcePlugin('.html', {
      'fetch': function fetch(address) {
        return loader.loadTemplate(address).then(function (registryEntry) {
          var _ref;

          var bindable = registryEntry.template.getAttribute('bindable');
          var elementName = getElementName(address);

          if (bindable) {
            bindable = bindable.split(',').map(function (x) {
              return x.trim();
            });
            registryEntry.template.removeAttribute('bindable');
          } else {
            bindable = [];
          }

          return _ref = {}, _ref[elementName] = (0, _dynamicElement._createDynamicElement)(elementName, address, bindable), _ref;
        });
      }
    });
  }
});
define('aurelia-templating-resources/dynamic-element',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports._createDynamicElement = _createDynamicElement;

  

  function _createDynamicElement(name, viewUrl, bindableNames) {
    var _dec, _dec2, _class;

    var DynamicElement = (_dec = (0, _aureliaTemplating.customElement)(name), _dec2 = (0, _aureliaTemplating.useView)(viewUrl), _dec(_class = _dec2(_class = function () {
      function DynamicElement() {
        
      }

      DynamicElement.prototype.bind = function bind(bindingContext) {
        this.$parent = bindingContext;
      };

      return DynamicElement;
    }()) || _class) || _class);

    for (var i = 0, ii = bindableNames.length; i < ii; ++i) {
      (0, _aureliaTemplating.bindable)(bindableNames[i])(DynamicElement);
    }
    return DynamicElement;
  }
});
define('aurelia-i18n/i18n',['exports', 'i18next', 'aurelia-pal'], function (exports, _i18next, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.I18N = undefined;

  var _i18next2 = _interopRequireDefault(_i18next);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  

  var I18N = exports.I18N = function () {
    function I18N(ea, signaler) {
      var _this = this;

      

      this.globalVars = {};
      this.i18nextDefered = {
        resolve: null,
        promise: null
      };

      this.i18next = _i18next2.default;
      this.ea = ea;
      this.Intl = window.Intl;
      this.signaler = signaler;
      this.i18nextDefered.promise = new Promise(function (resolve) {
        return _this.i18nextDefered.resolve = resolve;
      });
    }

    I18N.prototype.setup = function setup(options) {
      var _this2 = this;

      var defaultOptions = {
        compatibilityAPI: 'v1',
        compatibilityJSON: 'v1',
        lng: 'en',
        attributes: ['t', 'i18n'],
        fallbackLng: 'en',
        debug: false
      };

      _i18next2.default.init(options || defaultOptions, function (err, t) {
        if (_i18next2.default.options.attributes instanceof String) {
          _i18next2.default.options.attributes = [_i18next2.default.options.attributes];
        }

        _this2.i18nextDefered.resolve(_this2.i18next);
      });

      return this.i18nextDefered.promise;
    };

    I18N.prototype.i18nextReady = function i18nextReady() {
      return this.i18nextDefered.promise;
    };

    I18N.prototype.setLocale = function setLocale(locale) {
      var _this3 = this;

      return new Promise(function (resolve) {
        var oldLocale = _this3.getLocale();
        _this3.i18next.changeLanguage(locale, function (err, tr) {
          _this3.ea.publish('i18n:locale:changed', { oldValue: oldLocale, newValue: locale });
          _this3.signaler.signal('aurelia-translation-signal');
          resolve(tr);
        });
      });
    };

    I18N.prototype.getLocale = function getLocale() {
      return this.i18next.language;
    };

    I18N.prototype.nf = function nf(options, locales) {
      return new this.Intl.NumberFormat(locales || this.getLocale(), options || {});
    };

    I18N.prototype.uf = function uf(number, locale) {
      var nf = this.nf({}, locale || this.getLocale());
      var comparer = nf.format(10000 / 3);

      var thousandSeparator = comparer[1];
      var decimalSeparator = comparer[5];

      var result = number.replace(thousandSeparator, '').replace(/[^\d.,-]/g, '').replace(decimalSeparator, '.');

      return Number(result);
    };

    I18N.prototype.df = function df(options, locales) {
      return new this.Intl.DateTimeFormat(locales || this.getLocale(), options);
    };

    I18N.prototype.tr = function tr(key, options) {
      var fullOptions = this.globalVars;

      if (options !== undefined) {
        fullOptions = Object.assign(Object.assign({}, this.globalVars), options);
      }

      return this.i18next.t(key, fullOptions);
    };

    I18N.prototype.registerGlobalVariable = function registerGlobalVariable(key, value) {
      this.globalVars[key] = value;
    };

    I18N.prototype.unregisterGlobalVariable = function unregisterGlobalVariable(key) {
      delete this.globalVars[key];
    };

    I18N.prototype.updateTranslations = function updateTranslations(el) {
      var i = void 0;
      var l = void 0;

      var selector = [].concat(this.i18next.options.attributes);
      for (i = 0, l = selector.length; i < l; i++) {
        selector[i] = '[' + selector[i] + ']';
      }selector = selector.join(',');

      var nodes = el.querySelectorAll(selector);
      for (i = 0, l = nodes.length; i < l; i++) {
        var node = nodes[i];
        var keys = void 0;

        for (var i2 = 0, l2 = this.i18next.options.attributes.length; i2 < l2; i2++) {
          keys = node.getAttribute(this.i18next.options.attributes[i2]);
          if (keys) break;
        }

        if (!keys) continue;

        this.updateValue(node, keys);
      }
    };

    I18N.prototype.updateValue = function updateValue(node, value, params) {
      var _this4 = this;

      this.i18nextDefered.promise.then(function () {
        return _this4._updateValue(node, value, params);
      });
    };

    I18N.prototype._updateValue = function _updateValue(node, value, params) {
      if (value === null || value === undefined) {
        return;
      }

      var keys = value.split(';');
      var i = keys.length;

      while (i--) {
        var key = keys[i];

        var re = /\[([a-z\-]*)\]/g;

        var m = void 0;
        var attr = 'text';

        if (node.nodeName === 'IMG') attr = 'src';

        while ((m = re.exec(key)) !== null) {
          if (m.index === re.lastIndex) {
            re.lastIndex++;
          }
          if (m) {
            key = key.replace(m[0], '');
            attr = m[1];
          }
        }

        if (!node._textContent) node._textContent = node.textContent;
        if (!node._innerHTML) node._innerHTML = node.innerHTML;

        switch (attr) {
          case 'text':
            var newChild = _aureliaPal.DOM.createTextNode(this.tr(key, params));
            if (node._newChild) {
              node.removeChild(node._newChild);
            }

            node._newChild = newChild;
            while (node.firstChild) {
              node.removeChild(node.firstChild);
            }
            node.appendChild(node._newChild);
            break;
          case 'prepend':
            var prependParser = _aureliaPal.DOM.createElement('div');
            prependParser.innerHTML = this.tr(key, params);
            for (var ni = node.childNodes.length - 1; ni >= 0; ni--) {
              if (node.childNodes[ni]._prepended) {
                node.removeChild(node.childNodes[ni]);
              }
            }

            for (var pi = prependParser.childNodes.length - 1; pi >= 0; pi--) {
              prependParser.childNodes[pi]._prepended = true;
              if (node.firstChild) {
                node.insertBefore(prependParser.childNodes[pi], node.firstChild);
              } else {
                node.appendChild(prependParser.childNodes[pi]);
              }
            }
            break;
          case 'append':
            var appendParser = _aureliaPal.DOM.createElement('div');
            appendParser.innerHTML = this.tr(key, params);
            for (var _ni = node.childNodes.length - 1; _ni >= 0; _ni--) {
              if (node.childNodes[_ni]._appended) {
                node.removeChild(node.childNodes[_ni]);
              }
            }

            while (appendParser.firstChild) {
              appendParser.firstChild._appended = true;
              node.appendChild(appendParser.firstChild);
            }
            break;
          case 'html':
            node.innerHTML = this.tr(key, params);
            break;
          default:
            node.setAttribute(attr, this.tr(key, params));
            break;
        }
      }
    };

    return I18N;
  }();
});
define('aurelia-i18n/relativeTime',['exports', './i18n', './defaultTranslations/relative.time', 'aurelia-event-aggregator'], function (exports, _i18n, _relative, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RelativeTime = undefined;

  

  var RelativeTime = exports.RelativeTime = function () {
    RelativeTime.inject = function inject() {
      return [_i18n.I18N, _aureliaEventAggregator.EventAggregator];
    };

    function RelativeTime(i18n, ea) {
      var _this = this;

      

      this.service = i18n;
      this.ea = ea;

      this.service.i18nextReady().then(function () {
        _this.setup();
      });
      this.ea.subscribe('i18n:locale:changed', function (locales) {
        _this.setup(locales);
      });
    }

    RelativeTime.prototype.setup = function setup(locales) {
      var trans = _relative.translations.default || _relative.translations;
      var key = locales && locales.newValue ? locales.newValue : this.service.getLocale();
      var fallbackLng = this.service.fallbackLng;
      var index = 0;

      if ((index = key.indexOf('-')) >= 0) {
        var baseLocale = key.substring(0, index);

        if (trans[baseLocale]) {
          this.addTranslationResource(baseLocale, trans[baseLocale].translation);
        }
      }

      if (trans[key]) {
        this.addTranslationResource(key, trans[key].translation);
      }
      if (trans[fallbackLng]) {
        this.addTranslationResource(key, trans[fallbackLng].translation);
      }
    };

    RelativeTime.prototype.addTranslationResource = function addTranslationResource(key, translation) {
      var options = this.service.i18next.options;

      if (options.interpolation && options.interpolation.prefix !== '__' || options.interpolation.suffix !== '__') {
        for (var subkey in translation) {
          translation[subkey] = translation[subkey].replace('__count__', options.interpolation.prefix + 'count' + options.interpolation.suffix);
        }
      }

      this.service.i18next.addResources(key, 'translation', translation);
    };

    RelativeTime.prototype.getRelativeTime = function getRelativeTime(time) {
      var now = new Date();
      var diff = now.getTime() - time.getTime();

      var timeDiff = this.getTimeDiffDescription(diff, 'year', 31104000000);
      if (!timeDiff) {
        timeDiff = this.getTimeDiffDescription(diff, 'month', 2592000000);
        if (!timeDiff) {
          timeDiff = this.getTimeDiffDescription(diff, 'day', 86400000);
          if (!timeDiff) {
            timeDiff = this.getTimeDiffDescription(diff, 'hour', 3600000);
            if (!timeDiff) {
              timeDiff = this.getTimeDiffDescription(diff, 'minute', 60000);
              if (!timeDiff) {
                timeDiff = this.getTimeDiffDescription(diff, 'second', 1000);
                if (!timeDiff) {
                  timeDiff = this.service.tr('now');
                }
              }
            }
          }
        }
      }

      return timeDiff;
    };

    RelativeTime.prototype.getTimeDiffDescription = function getTimeDiffDescription(diff, unit, timeDivisor) {
      var unitAmount = (diff / timeDivisor).toFixed(0);
      if (unitAmount > 0) {
        return this.service.tr(unit, { count: parseInt(unitAmount, 10), context: 'ago' });
      } else if (unitAmount < 0) {
        var abs = Math.abs(unitAmount);
        return this.service.tr(unit, { count: abs, context: 'in' });
      }

      return null;
    };

    return RelativeTime;
  }();
});
define('aurelia-i18n/defaultTranslations/relative.time',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var translations = exports.translations = {
    ar: {
      translation: {
        'now': 'الآن',
        'second_ago': 'منذ __count__ ثانية',
        'second_ago_plural': 'منذ __count__ ثواني',
        'second_in': 'في __count__ ثانية',
        'second_in_plural': 'في __count__ ثواني',
        'minute_ago': 'منذ __count__ دقيقة',
        'minute_ago_plural': 'منذ __count__ دقائق',
        'minute_in': 'في __count__ دقيقة',
        'minute_in_plural': 'في __count__ دقائق',
        'hour_ago': 'منذ __count__ ساعة',
        'hour_ago_plural': 'منذ __count__ ساعات',
        'hour_in': 'في __count__ ساعة',
        'hour_in_plural': 'في __count__ ساعات',
        'day_ago': 'منذ __count__ يوم',
        'day_ago_plural': 'منذ __count__ أيام',
        'day_in': 'في __count__ يوم',
        'day_in_plural': 'في __count__ أيام'
      }
    },
    en: {
      translation: {
        'now': 'just now',
        'second_ago': '__count__ second ago',
        'second_ago_plural': '__count__ seconds ago',
        'second_in': 'in __count__ second',
        'second_in_plural': 'in __count__ seconds',
        'minute_ago': '__count__ minute ago',
        'minute_ago_plural': '__count__ minutes ago',
        'minute_in': 'in __count__ minute',
        'minute_in_plural': 'in __count__ minutes',
        'hour_ago': '__count__ hour ago',
        'hour_ago_plural': '__count__ hours ago',
        'hour_in': 'in __count__ hour',
        'hour_in_plural': 'in __count__ hours',
        'day_ago': '__count__ day ago',
        'day_ago_plural': '__count__ days ago',
        'day_in': 'in __count__ day',
        'day_in_plural': 'in __count__ days',
        'month_ago': '__count__ month ago',
        'month_ago_plural': '__count__ months ago',
        'month_in': 'in __count__ month',
        'month_in_plural': 'in __count__ months',
        'year_ago': '__count__ year ago',
        'year_ago_plural': '__count__ years ago',
        'year_in': 'in __count__ year',
        'year_in_plural': 'in __count__ years'
      }
    },
    it: {
      translation: {
        'now': 'adesso',
        'second_ago': '__count__ secondo fa',
        'second_ago_plural': '__count__ secondi fa',
        'second_in': 'in __count__ secondo',
        'second_in_plural': 'in __count__ secondi',
        'minute_ago': '__count__ minuto fa',
        'minute_ago_plural': '__count__ minuti fa',
        'minute_in': 'in __count__ minuto',
        'minute_in_plural': 'in __count__ minuti',
        'hour_ago': '__count__ ora fa',
        'hour_ago_plural': '__count__ ore fa',
        'hour_in': 'in __count__ ora',
        'hour_in_plural': 'in __count__ ore',
        'day_ago': '__count__ giorno fa',
        'day_ago_plural': '__count__ giorni fa',
        'day_in': 'in __count__ giorno',
        'day_in_plural': 'in __count__ giorni',
        'month_ago': '__count__ mese fa',
        'month_ago_plural': '__count__ mesi fa',
        'month_in': 'in __count__ mese',
        'month_in_plural': 'in __count__ mesi',
        'year_ago': '__count__ anno fa',
        'year_ago_plural': '__count__ anni fa',
        'year_in': 'in __count__ anno',
        'year_in_plural': 'in __count__ anni'
      }
    },
    de: {
      translation: {
        'now': 'jetzt gerade',
        'second_ago': 'vor __count__ Sekunde',
        'second_ago_plural': 'vor __count__ Sekunden',
        'second_in': 'in __count__ Sekunde',
        'second_in_plural': 'in __count__ Sekunden',
        'minute_ago': 'vor __count__ Minute',
        'minute_ago_plural': 'vor __count__ Minuten',
        'minute_in': 'in __count__ Minute',
        'minute_in_plural': 'in __count__ Minuten',
        'hour_ago': 'vor __count__ Stunde',
        'hour_ago_plural': 'vor __count__ Stunden',
        'hour_in': 'in __count__ Stunde',
        'hour_in_plural': 'in __count__ Stunden',
        'day_ago': 'vor __count__ Tag',
        'day_ago_plural': 'vor __count__ Tagen',
        'day_in': 'in __count__ Tag',
        'day_in_plural': 'in __count__ Tagen',
        'month_ago': 'vor __count__ Monat',
        'month_ago_plural': 'vor __count__ Monaten',
        'month_in': 'in __count__ Monat',
        'month_in_plural': 'in __count__ Monaten',
        'year_ago': 'vor __count__ Jahr',
        'year_ago_plural': 'vor __count__ Jahren',
        'year_in': 'in __count__ Jahr',
        'year_in_plural': 'in __count__ Jahren'
      }
    },
    nl: {
      translation: {
        'now': 'zonet',
        'second_ago': '__count__ seconde geleden',
        'second_ago_plural': '__count__ seconden geleden',
        'second_in': 'in __count__ seconde',
        'second_in_plural': 'in __count__ seconden',
        'minute_ago': '__count__ minuut geleden',
        'minute_ago_plural': '__count__ minuten geleden',
        'minute_in': 'in __count__ minuut',
        'minute_in_plural': 'in __count__ minuten',
        'hour_ago': '__count__ uur geleden',
        'hour_ago_plural': '__count__ uren geleden',
        'hour_in': 'in __count__ uur',
        'hour_in_plural': 'in __count__ uren',
        'day_ago': '__count__ dag geleden',
        'day_ago_plural': '__count__ dagen geleden',
        'day_in': 'in __count__ dag',
        'day_in_plural': 'in __count__ dagen',
        'month_ago': '__count__ maand geleden',
        'month_ago_plural': '__count__ maanden geleden',
        'month_in': 'in __count__ maand',
        'month_in_plural': 'in __count__ maanden',
        'year_ago': '__count__ jaar geleden',
        'year_ago_plural': '__count__ jaren geleden',
        'year_in': 'in __count__ jaar',
        'year_in_plural': 'in __count__ jaren'
      }
    },
    fr: {
      translation: {
        'now': 'juste',
        'second_ago': '__count__ seconde passé',
        'second_ago_plural': '__count__ secondes passé',
        'second_in': 'en __count__ seconde',
        'second_in_plural': 'en __count__ secondes',
        'minute_ago': '__count__ minute passé',
        'minute_ago_plural': '__count__ minutes passé',
        'minute_in': 'en __count__ minute',
        'minute_in_plural': 'en __count__ minutes',
        'hour_ago': '__count__ heure passé',
        'hour_ago_plural': '__count__ heures passé',
        'hour_in': 'en __count__ heure',
        'hour_in_plural': 'en __count__ heures',
        'day_ago': '__count__ jour passé',
        'day_ago_plural': '__count__ jours passé',
        'day_in': 'en __count__ jour',
        'day_in_plural': 'en __count__ jours'
      }
    },
    th: {
      translation: {
        'now': 'เมื่อกี้',
        'second_ago': '__count__ วินาที ที่ผ่านมา',
        'second_ago_plural': '__count__ วินาที ที่ผ่านมา',
        'second_in': 'อีก __count__ วินาที',
        'second_in_plural': 'อีก __count__ วินาที',
        'minute_ago': '__count__ นาที ที่ผ่านมา',
        'minute_ago_plural': '__count__ นาที ที่ผ่านมา',
        'minute_in': 'อีก __count__ นาที',
        'minute_in_plural': 'อีก __count__ นาที',
        'hour_ago': '__count__ ชั่วโมง ที่ผ่านมา',
        'hour_ago_plural': '__count__ ชั่วโมง ที่ผ่านมา',
        'hour_in': 'อีก __count__ ชั่วโมง',
        'hour_in_plural': 'อีก __count__ ชั่วโมง',
        'day_ago': '__count__ วัน ที่ผ่านมา',
        'day_ago_plural': '__count__ วัน ที่ผ่านมา',
        'day_in': 'อีก __count__ วัน',
        'day_in_plural': 'อีก __count__ วัน'
      }
    },
    sv: {
      translation: {
        'now': 'just nu',
        'second_ago': '__count__ sekund sedan',
        'second_ago_plural': '__count__ sekunder sedan',
        'second_in': 'om __count__ sekund',
        'second_in_plural': 'om __count__ sekunder',
        'minute_ago': '__count__ minut sedan',
        'minute_ago_plural': '__count__ minuter sedan',
        'minute_in': 'om __count__ minut',
        'minute_in_plural': 'om __count__ minuter',
        'hour_ago': '__count__ timme sedan',
        'hour_ago_plural': '__count__ timmar sedan',
        'hour_in': 'om __count__ timme',
        'hour_in_plural': 'om __count__ timmar',
        'day_ago': '__count__ dag sedan',
        'day_ago_plural': '__count__ dagar sedan',
        'day_in': 'om __count__ dag',
        'day_in_plural': 'om __count__ dagar'
      }
    },
    da: {
      translation: {
        'now': 'lige nu',
        'second_ago': '__count__ sekunder siden',
        'second_ago_plural': '__count__ sekunder siden',
        'second_in': 'om __count__ sekund',
        'second_in_plural': 'om __count__ sekunder',
        'minute_ago': '__count__ minut siden',
        'minute_ago_plural': '__count__ minutter siden',
        'minute_in': 'om __count__ minut',
        'minute_in_plural': 'om __count__ minutter',
        'hour_ago': '__count__ time siden',
        'hour_ago_plural': '__count__ timer siden',
        'hour_in': 'om __count__ time',
        'hour_in_plural': 'om __count__ timer',
        'day_ago': '__count__ dag siden',
        'day_ago_plural': '__count__ dage siden',
        'day_in': 'om __count__ dag',
        'day_in_plural': 'om __count__ dage'
      }
    },
    no: {
      translation: {
        'now': 'akkurat nå',
        'second_ago': '__count__ sekund siden',
        'second_ago_plural': '__count__ sekunder siden',
        'second_in': 'om __count__ sekund',
        'second_in_plural': 'om __count__ sekunder',
        'minute_ago': '__count__ minutt siden',
        'minute_ago_plural': '__count__ minutter siden',
        'minute_in': 'om __count__ minutt',
        'minute_in_plural': 'om __count__ minutter',
        'hour_ago': '__count__ time siden',
        'hour_ago_plural': '__count__ timer siden',
        'hour_in': 'om __count__ time',
        'hour_in_plural': 'om __count__ timer',
        'day_ago': '__count__ dag siden',
        'day_ago_plural': '__count__ dager siden',
        'day_in': 'om __count__ dag',
        'day_in_plural': 'om __count__ dager'
      }
    },
    jp: {
      translation: {
        'now': 'たった今',
        'second_ago': '__count__ 秒前',
        'second_ago_plural': '__count__ 秒前',
        'second_in': 'あと __count__ 秒',
        'second_in_plural': 'あと __count__ 秒',
        'minute_ago': '__count__ 分前',
        'minute_ago_plural': '__count__ 分前',
        'minute_in': 'あと __count__ 分',
        'minute_in_plural': 'あと __count__ 分',
        'hour_ago': '__count__ 時間前',
        'hour_ago_plural': '__count__ 時間前',
        'hour_in': 'あと __count__ 時間',
        'hour_in_plural': 'あと __count__ 時間',
        'day_ago': '__count__ 日間前',
        'day_ago_plural': '__count__ 日間前',
        'day_in': 'あと __count__ 日間',
        'day_in_plural': 'あと __count__ 日間'
      }
    },
    pt: {
      translation: {
        'now': 'neste exato momento',
        'second_ago': '__count__ segundo atrás',
        'second_ago_plural': '__count__ segundos atrás',
        'second_in': 'em __count__ segundo',
        'second_in_plural': 'em __count__ segundos',
        'minute_ago': '__count__ minuto atrás',
        'minute_ago_plural': '__count__ minutos atrás',
        'minute_in': 'em __count__ minuto',
        'minute_in_plural': 'em __count__ minutos',
        'hour_ago': '__count__ hora atrás',
        'hour_ago_plural': '__count__ horas atrás',
        'hour_in': 'em __count__ hora',
        'hour_in_plural': 'em __count__ horas',
        'day_ago': '__count__ dia atrás',
        'day_ago_plural': '__count__ dias atrás',
        'day_in': 'em __count__ dia',
        'day_in_plural': 'em __count__ dias',
        'month_ago': '__count__ mês atrás',
        'month_ago_plural': '__count__ meses atrás',
        'month_in': 'em __count__ mês',
        'month_in_plural': 'em __count__ meses',
        'year_ago': '__count__ ano atrás',
        'year_ago_plural': '__count__ anos atrás',
        'year_in': 'em __count__ ano',
        'year_in_plural': 'em __count__ anos'
      }
    }
  };
});
define('aurelia-i18n/df',['exports', './i18n'], function (exports, _i18n) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DfValueConverter = undefined;

  

  var DfValueConverter = exports.DfValueConverter = function () {
    DfValueConverter.inject = function inject() {
      return [_i18n.I18N];
    };

    function DfValueConverter(i18n) {
      

      this.service = i18n;
    }

    DfValueConverter.prototype.toView = function toView(value, dfOrOptions, locale, df) {
      if (value === null || typeof value === 'undefined' || typeof value === 'string' && value.trim() === '') {
        return value;
      }

      if (dfOrOptions && typeof dfOrOptions.format === 'function') {
        return dfOrOptions.format(value);
      } else if (df) {
        console.warn('This ValueConverter signature is depcrecated and will be removed in future releases. Please use the signature [dfOrOptions, locale]');
      } else {
          df = this.service.df(dfOrOptions, locale || this.service.getLocale());
        }

      return df.format(value);
    };

    return DfValueConverter;
  }();
});
define('aurelia-i18n/nf',['exports', './i18n'], function (exports, _i18n) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NfValueConverter = undefined;

  

  var NfValueConverter = exports.NfValueConverter = function () {
    NfValueConverter.inject = function inject() {
      return [_i18n.I18N];
    };

    function NfValueConverter(i18n) {
      

      this.service = i18n;
    }

    NfValueConverter.prototype.toView = function toView(value, formatOptions, locale, numberFormat) {
      var nf = numberFormat || this.service.nf(formatOptions, locale || this.service.getLocale());

      return nf.format(value);
    };

    return NfValueConverter;
  }();
});
define('aurelia-i18n/rt',['exports', './relativeTime'], function (exports, _relativeTime) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RtValueConverter = undefined;

  

  var RtValueConverter = exports.RtValueConverter = function () {
    RtValueConverter.inject = function inject() {
      return [_relativeTime.RelativeTime];
    };

    function RtValueConverter(relativeTime) {
      

      this.service = relativeTime;
    }

    RtValueConverter.prototype.toView = function toView(value) {
      return this.service.getRelativeTime(value);
    };

    return RtValueConverter;
  }();
});
define('aurelia-i18n/t',['exports', './i18n', 'aurelia-event-aggregator', 'aurelia-templating', 'aurelia-templating-resources', 'aurelia-binding', './utils'], function (exports, _i18n, _aureliaEventAggregator, _aureliaTemplating, _aureliaTemplatingResources, _aureliaBinding, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TBindingBehavior = exports.TCustomAttribute = exports.TParamsCustomAttribute = exports.TValueConverter = undefined;

  var _dec, _class, _class2, _temp, _dec2, _class3, _class4, _temp2, _class5, _temp3;

  

  var TValueConverter = exports.TValueConverter = function () {
    TValueConverter.inject = function inject() {
      return [_i18n.I18N];
    };

    function TValueConverter(i18n) {
      

      this.service = i18n;
    }

    TValueConverter.prototype.toView = function toView(value, options) {
      return this.service.tr(value, options);
    };

    return TValueConverter;
  }();

  var TParamsCustomAttribute = exports.TParamsCustomAttribute = (_dec = (0, _aureliaTemplating.customAttribute)('t-params'), _dec(_class = (_temp = _class2 = function () {
    function TParamsCustomAttribute(element) {
      

      this.element = element;
    }

    TParamsCustomAttribute.prototype.valueChanged = function valueChanged() {};

    return TParamsCustomAttribute;
  }(), _class2.inject = [Element], _temp)) || _class);
  var TCustomAttribute = exports.TCustomAttribute = (_dec2 = (0, _aureliaTemplating.customAttribute)('t'), _dec2(_class3 = (_temp2 = _class4 = function () {
    function TCustomAttribute(element, i18n, ea, tparams) {
      

      this.element = element;
      this.service = i18n;
      this.ea = ea;
      this.lazyParams = tparams;
    }

    TCustomAttribute.prototype.bind = function bind() {
      var _this = this;

      this.params = this.lazyParams();

      if (this.params) {
        this.params.valueChanged = function (newParams, oldParams) {
          _this.paramsChanged(_this.value, newParams, oldParams);
        };
      }

      var p = this.params !== null ? this.params.value : undefined;
      this.subscription = this.ea.subscribe('i18n:locale:changed', function () {
        _this.service.updateValue(_this.element, _this.value, p);
      });

      this.service.updateValue(this.element, this.value, p);
    };

    TCustomAttribute.prototype.paramsChanged = function paramsChanged(newValue, newParams) {
      this.service.updateValue(this.element, newValue, newParams);
    };

    TCustomAttribute.prototype.valueChanged = function valueChanged(newValue) {
      var p = this.params !== null ? this.params.value : undefined;
      this.service.updateValue(this.element, newValue, p);
    };

    TCustomAttribute.prototype.unbind = function unbind() {
      if (this.subscription) {
        this.subscription.dispose();
      }
    };

    return TCustomAttribute;
  }(), _class4.inject = [Element, _i18n.I18N, _aureliaEventAggregator.EventAggregator, _utils.LazyOptional.of(TParamsCustomAttribute)], _temp2)) || _class3);
  var TBindingBehavior = exports.TBindingBehavior = (_temp3 = _class5 = function () {
    function TBindingBehavior(signalBindingBehavior) {
      

      this.signalBindingBehavior = signalBindingBehavior;
    }

    TBindingBehavior.prototype.bind = function bind(binding, source) {
      this.signalBindingBehavior.bind(binding, source, 'aurelia-translation-signal');

      var sourceExpression = binding.sourceExpression;
      var expression = sourceExpression.expression;
      sourceExpression.expression = new _aureliaBinding.ValueConverter(expression, 't', sourceExpression.args, [expression].concat(sourceExpression.args));
    };

    TBindingBehavior.prototype.unbind = function unbind(binding, source) {
      binding.sourceExpression.expression = binding.sourceExpression.expression.expression;

      this.signalBindingBehavior.unbind(binding, source);
    };

    return TBindingBehavior;
  }(), _class5.inject = [_aureliaTemplatingResources.SignalBindingBehavior], _temp3);
});
define('aurelia-i18n/utils',['exports', 'aurelia-dependency-injection'], function (exports, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.LazyOptional = exports.assignObjectToKeys = exports.extend = undefined;

  

  var _dec, _class;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var extend = exports.extend = function extend(destination, source) {
    for (var property in source) {
      destination[property] = source[property];
    }

    return destination;
  };

  var assignObjectToKeys = exports.assignObjectToKeys = function assignObjectToKeys(root, obj) {
    if (obj === undefined || obj === null) {
      return obj;
    }

    var opts = {};

    Object.keys(obj).map(function (key) {
      if (_typeof(obj[key]) === 'object') {
        extend(opts, assignObjectToKeys(key, obj[key]));
      } else {
        opts[root !== '' ? root + '.' + key : key] = obj[key];
      }
    });

    return opts;
  };

  var LazyOptional = exports.LazyOptional = (_dec = (0, _aureliaDependencyInjection.resolver)(), _dec(_class = function () {
    function LazyOptional(key) {
      

      this.key = key;
    }

    LazyOptional.prototype.get = function get(container) {
      var _this = this;

      return function () {
        if (container.hasResolver(_this.key, false)) {
          return container.get(_this.key);
        }
        return null;
      };
    };

    LazyOptional.of = function of(key) {
      return new LazyOptional(key);
    };

    return LazyOptional;
  }()) || _class);
});
define('aurelia-i18n/base-i18n',['exports', './i18n', 'aurelia-event-aggregator'], function (exports, _i18n, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BaseI18N = undefined;

  

  var _class, _temp;

  var BaseI18N = exports.BaseI18N = (_temp = _class = function () {
    function BaseI18N(i18n, element, ea) {
      var _this = this;

      

      this.i18n = i18n;
      this.element = element;

      this.__i18nDisposer = ea.subscribe('i18n:locale:changed', function () {
        _this.i18n.updateTranslations(_this.element);
      });
    }

    BaseI18N.prototype.attached = function attached() {
      this.i18n.updateTranslations(this.element);
    };

    BaseI18N.prototype.detached = function detached() {
      this.__i18nDisposer.dispose();
    };

    return BaseI18N;
  }(), _class.inject = [_i18n.I18N, Element, _aureliaEventAggregator.EventAggregator], _temp);
});
define('i18next-xhr-backend/utils',['require','exports','module'],function (require, exports, module) {"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaults = defaults;
exports.extend = extend;
var arr = [];
var each = arr.forEach;
var slice = arr.slice;

function defaults(obj) {
  each.call(slice.call(arguments, 1), function (source) {
    if (source) {
      for (var prop in source) {
        if (obj[prop] === undefined) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

function extend(obj) {
  each.call(slice.call(arguments, 1), function (source) {
    if (source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}
});

define('aurelia-validation/validate-binding-behavior',['exports', 'aurelia-dependency-injection', 'aurelia-task-queue', './validation-controller', './validate-trigger'], function (exports, _aureliaDependencyInjection, _aureliaTaskQueue, _validationController, _validateTrigger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ValidateBindingBehavior = undefined;

  

  var _dec, _class;

  var ValidateBindingBehavior = exports.ValidateBindingBehavior = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaTaskQueue.TaskQueue), _dec(_class = function () {
    function ValidateBindingBehavior(taskQueue) {
      

      this.taskQueue = taskQueue;
    }

    ValidateBindingBehavior.prototype.getTarget = function getTarget(binding, view) {
      var target = binding.target;
      if (target instanceof Element) {
        return target;
      }
      var controller = void 0;
      for (var id in view.controllers) {
        controller = view.controllers[id];
        if (controller.viewModel === target) {
          break;
        }
      }
      return controller.view.firstChild.parentNode;
    };

    ValidateBindingBehavior.prototype.bind = function bind(binding, source, rules) {
      var _this = this;

      var target = this.getTarget(binding, source);

      var controller = source.container.get(_aureliaDependencyInjection.Optional.of(_validationController.ValidationController, true));
      if (controller === null) {
        throw new Error('A ValidationController has not been registered.');
      }
      controller.registerBinding(binding, target, rules);
      binding.validationController = controller;

      if (controller.validateTrigger === _validateTrigger.validateTrigger.change) {
        binding.standardUpdateSource = binding.updateSource;
        binding.updateSource = function (value) {
          this.standardUpdateSource(value);
          this.validationController._validateBinding(this);
        };
      } else if (controller.validateTrigger === _validateTrigger.validateTrigger.blur) {
        binding.validateBlurHandler = function () {
          _this.taskQueue.queueMicroTask(function () {
            return controller._validateBinding(binding);
          });
        };
        binding.validateTarget = target;
        target.addEventListener('blur', binding.validateBlurHandler);
      }

      if (controller.validateTrigger !== _validateTrigger.validateTrigger.manual) {
        binding.standardUpdateTarget = binding.updateTarget;
        binding.updateTarget = function (value) {
          this.standardUpdateTarget(value);
          this.validationController._resetBinding(this);
        };
      }
    };

    ValidateBindingBehavior.prototype.unbind = function unbind(binding, source) {
      if (binding.standardUpdateSource) {
        binding.updateSource = binding.standardUpdateSource;
        binding.standardUpdateSource = null;
      }
      if (binding.standardUpdateTarget) {
        binding.updateTarget = binding.standardUpdateTarget;
        binding.standardUpdateTarget = null;
      }
      if (binding.validateBlurHandler) {
        binding.validateTarget.removeEventListener('blur', binding.validateBlurHandler);
        binding.validateBlurHandler = null;
        binding.validateTarget = null;
      }
      binding.validationController.unregisterBinding(binding);
      binding.validationController = null;
    };

    return ValidateBindingBehavior;
  }()) || _class);
});
define('aurelia-validation/validation-controller',['exports', 'aurelia-dependency-injection', './validator', './validate-trigger', './property-info'], function (exports, _aureliaDependencyInjection, _validator, _validateTrigger, _propertyInfo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ValidationController = undefined;

  

  var _dec, _class;

  var ValidationController = exports.ValidationController = (_dec = (0, _aureliaDependencyInjection.inject)(_validator.Validator), _dec(_class = function () {
    function ValidationController(validator) {
      

      this.bindings = new Map();
      this.renderers = [];
      this.validateTrigger = _validateTrigger.validateTrigger.blur;

      this.validator = validator;
    }

    ValidationController.prototype.addRenderer = function addRenderer(renderer) {
      for (var _iterator = this.bindings.values(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var _ref2 = _ref;
        var target = _ref2.target;
        var errors = _ref2.errors;

        for (var i = 0, ii = errors.length; i < ii; i++) {
          renderer.render(errors[i], target);
        }
      }
      this.renderers.push(renderer);
    };

    ValidationController.prototype.removeRenderer = function removeRenderer(renderer) {
      for (var _iterator2 = this.bindings.values(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref3;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref3 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref3 = _i2.value;
        }

        var _ref4 = _ref3;
        var target = _ref4.target;
        var errors = _ref4.errors;

        for (var i = 0, ii = errors.length; i < ii; i++) {
          renderer.unrender(errors[i], target);
        }
      }
      this.renderers.splice(this.renderers.indexOf(renderer), 1);
    };

    ValidationController.prototype.registerBinding = function registerBinding(binding, target) {
      var rules = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      var errors = [];
      this.bindings.set(binding, { target: target, rules: rules, errors: errors });
    };

    ValidationController.prototype.unregisterBinding = function unregisterBinding(binding) {
      this._resetBinding(binding);
      this.bindings.delete(binding);
    };

    ValidationController.prototype.validate = function validate() {
      var errors = [];
      for (var _iterator3 = this.bindings.keys(), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
        var _ref5;

        if (_isArray3) {
          if (_i3 >= _iterator3.length) break;
          _ref5 = _iterator3[_i3++];
        } else {
          _i3 = _iterator3.next();
          if (_i3.done) break;
          _ref5 = _i3.value;
        }

        var binding = _ref5;

        errors.splice.apply(errors, [errors.length, 0].concat(this._validateBinding(binding)));
      }
      return errors;
    };

    ValidationController.prototype.reset = function reset() {
      for (var _iterator4 = this.bindings.keys(), _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
        var _ref6;

        if (_isArray4) {
          if (_i4 >= _iterator4.length) break;
          _ref6 = _iterator4[_i4++];
        } else {
          _i4 = _iterator4.next();
          if (_i4.done) break;
          _ref6 = _i4.value;
        }

        var binding = _ref6;

        this._resetBinding(binding);
      }
    };

    ValidationController.prototype._renderError = function _renderError(error, target) {
      var renderers = this.renderers;
      var i = renderers.length;
      while (i--) {
        renderers[i].render(error, target);
      }
    };

    ValidationController.prototype._unrenderError = function _unrenderError(error, target) {
      var renderers = this.renderers;
      var i = renderers.length;
      while (i--) {
        renderers[i].unrender(error, target);
      }
    };

    ValidationController.prototype._updateErrors = function _updateErrors(errors, newErrors, target) {
      var error = void 0;
      while (error = errors.pop()) {
        this._unrenderError(error, target);
      }
      for (var i = 0, ii = newErrors.length; i < ii; i++) {
        error = newErrors[i];
        errors.push(error);
        this._renderError(error, target);
      }
    };

    ValidationController.prototype._validateBinding = function _validateBinding(binding) {
      var _bindings$get = this.bindings.get(binding);

      var target = _bindings$get.target;
      var rules = _bindings$get.rules;
      var errors = _bindings$get.errors;

      var _getPropertyInfo = (0, _propertyInfo.getPropertyInfo)(binding.sourceExpression, binding.source);

      var object = _getPropertyInfo.object;
      var property = _getPropertyInfo.property;

      var newErrors = this.validator.validateProperty(object, property, rules);
      this._updateErrors(errors, newErrors, target);
      return errors;
    };

    ValidationController.prototype._resetBinding = function _resetBinding(binding) {
      var _bindings$get2 = this.bindings.get(binding);

      var target = _bindings$get2.target;
      var errors = _bindings$get2.errors;

      this._updateErrors(errors, [], target);
    };

    return ValidationController;
  }()) || _class);
});
define('aurelia-validation/validator',['exports', './validation-error'], function (exports, _validationError) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Validator = undefined;

  

  var Validator = exports.Validator = function () {
    function Validator() {
      
    }

    Validator.prototype.validateProperty = function validateProperty(object, propertyName) {
      var rules = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      throw new Error('A Validator must implement validateProperty');
    };

    Validator.prototype.validateObject = function validateObject(object) {
      var rules = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      throw new Error('A Validator must implement validateObject');
    };

    return Validator;
  }();
});
define('aurelia-validation/validation-error',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var ValidationError = exports.ValidationError = function ValidationError(rule, message, object) {
    var propertyName = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

    

    this.rule = rule;
    this.message = message;
    this.object = object;
    this.propertyName = propertyName || null;
  };
});
define('aurelia-validation/validate-trigger',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var validateTrigger = exports.validateTrigger = {
    blur: 'blur',

    change: 'change',

    manual: 'manual'
  };
});
define('aurelia-validation/property-info',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getPropertyInfo = getPropertyInfo;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function getObject(expression, objectExpression, source) {
    var value = objectExpression.evaluate(source);
    if (value !== null && ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || typeof value === 'function')) {
      return value;
    }
    if (value === null) {
      value = 'null';
    } else if (value === undefined) {
      value = 'undefined';
    }
    throw new Error('The \'' + objectExpression + '\' part of \'' + expression + '\' evaluates to ' + value + ' instead of an object.');
  }

  function getPropertyInfo(expression, source) {
    var originalExpression = expression;
    while (expression instanceof _aureliaBinding.BindingBehavior || expression instanceof _aureliaBinding.ValueConverter) {
      expression = expression.expression;
    }

    var object = void 0;
    var property = void 0;
    if (expression instanceof _aureliaBinding.AccessScope) {
      object = source.bindingContext;
      property = expression.name;
    } else if (expression instanceof _aureliaBinding.AccessMember) {
      object = getObject(originalExpression, expression.object, source);
      property = expression.name;
    } else if (expression instanceof _aureliaBinding.AccessKeyed) {
      object = getObject(originalExpression, expression.object, source);
      property = expression.key.evaluate(source);
    } else {
      throw new Error('Expression \'' + originalExpression + '\' is not compatible with the validate binding-behavior.');
    }

    return { object: object, property: property };
  }
});
define('aurelia-validation/validation-errors-custom-attribute',['exports', 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-templating', './validation-controller', './validation-renderer'], function (exports, _aureliaBinding, _aureliaDependencyInjection, _aureliaTemplating, _validationController, _validationRenderer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ValidationErrorsCustomAttribute = undefined;

  

  var _dec, _dec2, _class;

  var ValidationErrorsCustomAttribute = exports.ValidationErrorsCustomAttribute = (_dec = (0, _aureliaTemplating.customAttribute)('validation-errors', _aureliaBinding.bindingMode.twoWay), _dec2 = (0, _aureliaDependencyInjection.inject)(Element, _aureliaDependencyInjection.Lazy.of(_validationController.ValidationController)), _dec(_class = _dec2(_class = (0, _validationRenderer.validationRenderer)(_class = function () {
    function ValidationErrorsCustomAttribute(boundaryElement, controllerAccessor) {
      

      this.errors = [];

      this.boundaryElement = boundaryElement;
      this.controllerAccessor = controllerAccessor;
    }

    ValidationErrorsCustomAttribute.prototype.sort = function sort() {
      this.errors.sort(function (a, b) {
        if (a.target === b.target) {
          return 0;
        }
        return a.target.compareDocumentPosition(b.target) & 2 ? 1 : -1;
      });
    };

    ValidationErrorsCustomAttribute.prototype.render = function render(error, target) {
      if (!target || !(this.boundaryElement === target || this.boundaryElement.contains(target))) {
        return;
      }

      this.errors.push({ error: error, target: target });
      this.sort();
      this.value = this.errors;
    };

    ValidationErrorsCustomAttribute.prototype.unrender = function unrender(error, target) {
      var index = this.errors.findIndex(function (x) {
        return x.error === error;
      });
      if (index === -1) {
        return;
      }
      this.errors.splice(index, 1);
      this.value = this.errors;
    };

    ValidationErrorsCustomAttribute.prototype.bind = function bind() {
      this.controllerAccessor().addRenderer(this);
      this.value = this.errors;
    };

    ValidationErrorsCustomAttribute.prototype.unbind = function unbind() {
      this.controllerAccessor().removeRenderer(this);
    };

    return ValidationErrorsCustomAttribute;
  }()) || _class) || _class) || _class);
});
define('aurelia-validation/validation-renderer',['exports', 'aurelia-metadata', './validation-error'], function (exports, _aureliaMetadata, _validationError) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.validationRenderer = undefined;
  var validationRenderer = exports.validationRenderer = _aureliaMetadata.protocol.create('aurelia:validation-renderer', function (target) {
    if (!(typeof target.render === 'function')) {
      return 'Validation renderers must implement: render(error: ValidationError, target: Element): void';
    }

    if (!(typeof target.unrender === 'function')) {
      return 'Validation renderers must implement: unrender(error: ValidationError, target: Element): void';
    }

    return true;
  });
});
define('aurelia-validation/validation-renderer-custom-attribute',['exports', './validation-controller'], function (exports, _validationController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ValidationRendererCustomAttribute = undefined;

  

  var ValidationRendererCustomAttribute = exports.ValidationRendererCustomAttribute = function () {
    function ValidationRendererCustomAttribute() {
      
    }

    ValidationRendererCustomAttribute.prototype.created = function created(view) {
      this.container = view.container;
    };

    ValidationRendererCustomAttribute.prototype.bind = function bind() {
      this.controller = this.container.get(_validationController.ValidationController);
      this.renderer = this.container.get(this.value);
      this.controller.addRenderer(this.renderer);
    };

    ValidationRendererCustomAttribute.prototype.unbind = function unbind() {
      this.controller.removeRenderer(this.renderer);
      this.controller = null;
      this.renderer = null;
    };

    return ValidationRendererCustomAttribute;
  }();
});
define('odata-filter-parser/dist/odata-parser',['require','exports','module'],function (require, exports, module) {/**
 Copyright 2015 Jason Drake

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

var Operators = {
    EQUALS: 'eq',
    AND: 'and',
    OR: 'or',
    GREATER_THAN: 'gt',
    GREATER_THAN_EQUAL: 'ge',
    LESS_THAN: 'lt',
    LESS_THAN_EQUAL: 'le',
    LIKE: 'like',
    IS_NULL: 'is null',
    NOT_EQUAL: 'ne',

    /**
     * Whether a defined operation is unary or binary.  Will return true
     * if the operation only supports a subject with no value.
     *
     * @param {String} op the operation to check.
     * @return {Boolean} whether the operation is an unary operation.
     */
    isUnary: function (op) {
        var value = false;
        if (op === Operators.IS_NULL) {
            value = true;
        }
        return value;
    },
    /**
     * Whether a defined operation is a logical operators or not.
     *
     * @param {String} op the operation to check.
     * @return {Boolean} whether the operation is a logical operation.
     */
    isLogical: function (op) {
        return (op === Operators.AND || op === Operators.OR);
    }
};

/**
 * Predicate is the basic model construct of the odata expression
 *
 * @param config
 * @returns {Predicate}
 * @constructor
 */
var Predicate = function (config) {
    if (!config) {
        config = {};
    }
    this.subject = config.subject;
    this.value = config.value;
    this.operator = (config.operator) ? config.operator : Operators.EQUALS;
    return this;
};

Predicate.concat = function (operator, p) {
    if (arguments.length < 3 && !(p instanceof Array && p.length >= 2)) {
        throw {
            key: 'INSUFFICIENT_PREDICATES',
            msg: 'At least two predicates are required'
        };
    } else if (!operator || !Operators.isLogical(operator)) {
        throw {
            key: 'INVALID_LOGICAL',
            msg: 'The operator is not representative of a logical operator.'
        };
    }
    var result;
    var arr = [];
    if( p instanceof Array ) {
        arr = p;
    } else {
        for( var i = 1; i < arguments.length; i++ ) {
            arr.push( arguments[i] );
        }
    }
    var len = arr.length;
    result = new Predicate({
        subject: arr[0],
        operator: operator
    });
    if (len === 2) {
        result.value = arr[len - 1];
    } else {
        var a = [];
        for( var j = 1; j < len; j++ ) {
            a.push(arr[j]);
        }
        result.value = Predicate.concat(operator, a);
    }
    return result;
};

Predicate.prototype.flatten = function(result) {
    if( !result ) {
        result = [];
    }
    if( Operators.isLogical(this.operator) ) {
        result = result.concat(this.subject.flatten());
        result = result.concat(this.value.flatten());
    } else {
        result.push(this);
    }
    return result;
};

/**
 * Will serialie the predicate to an ODATA compliant serialized string.
 *
 * @return {String} The compliant ODATA query string
 */
Predicate.prototype.serialize = function() {
    var retValue = '';
    if (this.operator) {
        if (this.subject === undefined || this.subject === null) {
            throw {
                key: 'INVALID_SUBJECT',
                msg: 'The subject is required and is not specified.'
            };
        }
        if (Operators.isLogical(this.operator) && (!(this.subject instanceof Predicate ||
            this.value instanceof Predicate) || (this.subject instanceof Predicate && this.value === undefined))) {
            throw {
                key: 'INVALID_LOGICAL',
                msg: 'The predicate does not represent a valid logical expression.'
            };
        }
        retValue = '(' + ((this.subject instanceof Predicate) ? this.subject.serialize() : this.subject) + ' ' + this.operator;
        if (!Operators.isUnary(this.operator)) {
            if (this.value === undefined || this.value === null) {
                throw {
                    key: 'INVALID_VALUE',
                    msg: 'The value was required but was not defined.'
                };
            }
            retValue += ' ';
            var val = typeof this.value;
            if (val === 'string') {
                retValue += '\'' + this.value + '\'';
            } else if (val === 'number' || val === 'boolean') {
                retValue += this.value;
            } else if (this.value instanceof Predicate) {
                retValue += this.value.serialize();
            } else if (this.value instanceof Date) {
                retValue += 'datetimeoffset\'' + this.value.toISOString() + '\'';
            } else {
                throw {
                    key: 'UNKNOWN_TYPE',
                    msg: 'Unsupported value type: ' + (typeof this.value),
                    source: this.value
                };
            }

        }
        retValue += ')';
    }
    return retValue;
};

var ODataParser = function() {

    "use strict";

    var REGEX = {
        parenthesis: /^([(](.*)[)])$/,
        andor: /^(.*?) (or|and)+ (.*)$/,
        op: /(\w*) (eq|gt|lt|ge|le|ne) (datetimeoffset'(.*)'|'(.*)'|[0-9]*)/,
        startsWith: /^startswith[(](.*),'(.*)'[)]/,
        endsWith: /^endswith[(](.*),'(.*)'[)]/,
        contains: /^contains[(](.*),'(.*)'[)]/
    };

    function buildLike(match, key) {
        var right = (key === 'startsWith') ? match[2] + '*' : (key === 'endsWith') ? '*' + match[2] : '*' + match[2] + '*';
        if( match[0].charAt(match[0].lastIndexOf(')') - 1) === "\'") {
            right = "\'" + right + "\'";
        }
        return {
            subject: match[1],
            operator: Operators.LIKE,
            value: right
        };
    }

    function parseFragment(filter) {
        var found = false;
        var obj = null;
        for (var key in REGEX ) {
            var regex = REGEX[key];
            if( found ) {
                break;
            }
            var match = filter.match(regex);
            if( match ) {
                switch (regex) {
                    case REGEX.parenthesis:
                        if( match.length > 2 ) {
                            if( match[2].indexOf(')') < match[2].indexOf('(')) {
                                continue;
                            }
                            obj = parseFragment(match[2]);
                        }
                        break;
                    case REGEX.andor:
                        obj = new Predicate({
                            subject: parseFragment(match[1]),
                            operator: match[2],
                            value: parseFragment(match[3])
                        });
                        break;
                    case REGEX.op:
                        obj = new Predicate({
                            subject: match[1],
                            operator: match[2],
                            value: ( match[3].indexOf('\'') === -1) ? +match[3] : match[3]
                        });
                        if(obj.value.indexOf && obj.value.indexOf("datetimeoffset") === 0) {
                            var m = obj.value.match(/^datetimeoffset'(.*)'$/);
                            if( m && m.length > 1) {
                                obj.value = new Date(m[1]);
                            }
                        }
                        break;
                    case REGEX.startsWith:
                    case REGEX.endsWith:
                    case REGEX.contains:
                        obj = buildLike(match, key);
                        break;
                }
                found = true;
            }
        }
        return obj;
    }

    return {
        parse: function(filterStr) {
            if( !filterStr || filterStr === '') {
                return null;
            }
            var filter = filterStr.trim();
            var obj = {};
            if( filter.length > 0 ) {
                obj = parseFragment(filter);
            }
            return obj;
        }
    };
}();



module.exports = {
    Parser: ODataParser,
    Operators: Operators,
    Predicate: Predicate
};
});

define('aurelia-dialog/ai-dialog',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialog = undefined;

  

  var _dec, _dec2, _class;

  var AiDialog = exports.AiDialog = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialog() {
    
  }) || _class) || _class);
});
define('aurelia-dialog/ai-dialog-header',['exports', 'aurelia-templating', './dialog-controller'], function (exports, _aureliaTemplating, _dialogController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogHeader = undefined;

  

  var _dec, _dec2, _class, _class2, _temp;

  var AiDialogHeader = exports.AiDialogHeader = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-header'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <button type="button" class="dialog-close" aria-label="Close" if.bind="!controller.settings.lock" click.trigger="controller.cancel()">\n      <span aria-hidden="true">&times;</span>\n    </button>\n\n    <div class="dialog-header-content">\n      <slot></slot>\n    </div>\n  </template>\n'), _dec(_class = _dec2(_class = (_temp = _class2 = function AiDialogHeader(controller) {
    

    this.controller = controller;
  }, _class2.inject = [_dialogController.DialogController], _temp)) || _class) || _class);
});
define('aurelia-dialog/dialog-controller',['exports', './lifecycle', './dialog-result'], function (exports, _lifecycle, _dialogResult) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogController = undefined;

  

  var DialogController = exports.DialogController = function () {
    function DialogController(renderer, settings, resolve, reject) {
      

      this.renderer = renderer;
      this.settings = settings;
      this._resolve = resolve;
      this._reject = reject;
    }

    DialogController.prototype.ok = function ok(output) {
      return this.close(true, output);
    };

    DialogController.prototype.cancel = function cancel(output) {
      return this.close(false, output);
    };

    DialogController.prototype.error = function error(message) {
      var _this = this;

      return (0, _lifecycle.invokeLifecycle)(this.viewModel, 'deactivate').then(function () {
        return _this.renderer.hideDialog(_this);
      }).then(function () {
        _this.controller.unbind();
        _this._reject(message);
      });
    };

    DialogController.prototype.close = function close(ok, output) {
      var _this2 = this;

      if (this._closePromise) return this._closePromise;

      this._closePromise = (0, _lifecycle.invokeLifecycle)(this.viewModel, 'canDeactivate').then(function (canDeactivate) {
        if (canDeactivate) {
          return (0, _lifecycle.invokeLifecycle)(_this2.viewModel, 'deactivate').then(function () {
            return _this2.renderer.hideDialog(_this2);
          }).then(function () {
            var result = new _dialogResult.DialogResult(!ok, output);
            _this2.controller.unbind();
            _this2._resolve(result);
            return result;
          });
        }

        return Promise.resolve();
      });

      return this._closePromise;
    };

    return DialogController;
  }();
});
define('aurelia-dialog/lifecycle',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.invokeLifecycle = invokeLifecycle;
  function invokeLifecycle(instance, name, model) {
    if (typeof instance[name] === 'function') {
      var result = instance[name](model);

      if (result instanceof Promise) {
        return result;
      }

      if (result !== null && result !== undefined) {
        return Promise.resolve(result);
      }

      return Promise.resolve(true);
    }

    return Promise.resolve(true);
  }
});
define('aurelia-dialog/dialog-result',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var DialogResult = exports.DialogResult = function DialogResult(cancelled, output) {
    

    this.wasCancelled = false;

    this.wasCancelled = cancelled;
    this.output = output;
  };
});
define('aurelia-dialog/ai-dialog-body',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogBody = undefined;

  

  var _dec, _dec2, _class;

  var AiDialogBody = exports.AiDialogBody = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-body'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialogBody() {
    
  }) || _class) || _class);
});
define('aurelia-dialog/ai-dialog-footer',['exports', 'aurelia-templating', './dialog-controller'], function (exports, _aureliaTemplating, _dialogController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogFooter = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _class3, _temp;

  var AiDialogFooter = exports.AiDialogFooter = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-footer'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n\n    <template if.bind="buttons.length > 0">\n      <button type="button" class="btn btn-default" repeat.for="button of buttons" click.trigger="close(button)">${button}</button>\n    </template>\n  </template>\n'), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = function () {
    function AiDialogFooter(controller) {
      

      _initDefineProp(this, 'buttons', _descriptor, this);

      _initDefineProp(this, 'useDefaultButtons', _descriptor2, this);

      this.controller = controller;
    }

    AiDialogFooter.prototype.close = function close(buttonValue) {
      if (AiDialogFooter.isCancelButton(buttonValue)) {
        this.controller.cancel(buttonValue);
      } else {
        this.controller.ok(buttonValue);
      }
    };

    AiDialogFooter.prototype.useDefaultButtonsChanged = function useDefaultButtonsChanged(newValue) {
      if (newValue) {
        this.buttons = ['Cancel', 'Ok'];
      }
    };

    AiDialogFooter.isCancelButton = function isCancelButton(value) {
      return value === 'Cancel';
    };

    return AiDialogFooter;
  }(), _class3.inject = [_dialogController.DialogController], _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'buttons', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'useDefaultButtons', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-dialog/attach-focus',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AttachFocus = undefined;

  

  var _dec, _class, _class2, _temp;

  var AttachFocus = exports.AttachFocus = (_dec = (0, _aureliaTemplating.customAttribute)('attach-focus'), _dec(_class = (_temp = _class2 = function () {
    function AttachFocus(element) {
      

      this.value = true;

      this.element = element;
    }

    AttachFocus.prototype.attached = function attached() {
      if (this.value && this.value !== 'false') {
        this.element.focus();
      }
    };

    AttachFocus.prototype.valueChanged = function valueChanged(newValue) {
      this.value = newValue;
    };

    return AttachFocus;
  }(), _class2.inject = [Element], _temp)) || _class);
});
define('aurelia-dialog/dialog-configuration',['exports', './renderer', './dialog-renderer', './dialog-options', 'aurelia-pal'], function (exports, _renderer, _dialogRenderer, _dialogOptions, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogConfiguration = undefined;

  

  var defaultRenderer = _dialogRenderer.DialogRenderer;

  var resources = {
    'ai-dialog': './ai-dialog',
    'ai-dialog-header': './ai-dialog-header',
    'ai-dialog-body': './ai-dialog-body',
    'ai-dialog-footer': './ai-dialog-footer',
    'attach-focus': './attach-focus'
  };

  var defaultCSSText = 'ai-dialog-container,ai-dialog-overlay{position:fixed;top:0;right:0;bottom:0;left:0}ai-dialog,ai-dialog-container>div>div{min-width:300px;margin:auto;display:block}ai-dialog-overlay{opacity:0}ai-dialog-overlay.active{opacity:1}ai-dialog-container{display:block;transition:opacity .2s linear;opacity:0;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch}ai-dialog-container.active{opacity:1}ai-dialog-container>div{padding:30px}ai-dialog-container>div>div{width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content}ai-dialog-container,ai-dialog-container>div,ai-dialog-container>div>div{outline:0}ai-dialog{box-shadow:0 5px 15px rgba(0,0,0,.5);border:1px solid rgba(0,0,0,.2);border-radius:5px;padding:3;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background:#fff}ai-dialog>ai-dialog-header{display:block;padding:16px;border-bottom:1px solid #e5e5e5}ai-dialog>ai-dialog-header>button{float:right;border:none;display:block;width:32px;height:32px;background:0 0;font-size:22px;line-height:16px;margin:-14px -16px 0 0;padding:0;cursor:pointer}ai-dialog>ai-dialog-body{display:block;padding:16px}ai-dialog>ai-dialog-footer{display:block;padding:6px;border-top:1px solid #e5e5e5;text-align:right}ai-dialog>ai-dialog-footer button{color:#333;background-color:#fff;padding:6px 12px;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid #ccc;border-radius:4px;margin:5px 0 5px 5px}ai-dialog>ai-dialog-footer button:disabled{cursor:default;opacity:.45}ai-dialog>ai-dialog-footer button:hover:enabled{color:#333;background-color:#e6e6e6;border-color:#adadad}.ai-dialog-open{overflow:hidden}';

  var DialogConfiguration = exports.DialogConfiguration = function () {
    function DialogConfiguration(aurelia) {
      

      this.aurelia = aurelia;
      this.settings = _dialogOptions.dialogOptions;
      this.resources = [];
      this.cssText = defaultCSSText;
      this.renderer = defaultRenderer;
    }

    DialogConfiguration.prototype.useDefaults = function useDefaults() {
      return this.useRenderer(defaultRenderer).useCSS(defaultCSSText).useStandardResources();
    };

    DialogConfiguration.prototype.useStandardResources = function useStandardResources() {
      return this.useResource('ai-dialog').useResource('ai-dialog-header').useResource('ai-dialog-body').useResource('ai-dialog-footer').useResource('attach-focus');
    };

    DialogConfiguration.prototype.useResource = function useResource(resourceName) {
      this.resources.push(resourceName);
      return this;
    };

    DialogConfiguration.prototype.useRenderer = function useRenderer(renderer, settings) {
      this.renderer = renderer;
      this.settings = Object.assign(this.settings, settings || {});
      return this;
    };

    DialogConfiguration.prototype.useCSS = function useCSS(cssText) {
      this.cssText = cssText;
      return this;
    };

    DialogConfiguration.prototype._apply = function _apply() {
      var _this = this;

      this.aurelia.singleton(_renderer.Renderer, this.renderer);
      this.resources.forEach(function (resourceName) {
        return _this.aurelia.globalResources(resources[resourceName]);
      });
      _aureliaPal.DOM.injectStyles(this.cssText);
    };

    return DialogConfiguration;
  }();
});
define('aurelia-dialog/renderer',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var Renderer = exports.Renderer = function () {
    function Renderer() {
      
    }

    Renderer.prototype.getDialogContainer = function getDialogContainer() {
      throw new Error('DialogRenderer must implement getDialogContainer().');
    };

    Renderer.prototype.showDialog = function showDialog(dialogController) {
      throw new Error('DialogRenderer must implement showDialog().');
    };

    Renderer.prototype.hideDialog = function hideDialog(dialogController) {
      throw new Error('DialogRenderer must implement hideDialog().');
    };

    return Renderer;
  }();
});
define('aurelia-dialog/dialog-renderer',['exports', './dialog-options', 'aurelia-pal', 'aurelia-dependency-injection'], function (exports, _dialogOptions, _aureliaPal, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogRenderer = undefined;

  

  var _dec, _class;

  var containerTagName = 'ai-dialog-container';
  var overlayTagName = 'ai-dialog-overlay';
  var transitionEvent = function () {
    var transition = null;

    return function () {
      if (transition) return transition;

      var t = void 0;
      var el = _aureliaPal.DOM.createElement('fakeelement');
      var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
      };
      for (t in transitions) {
        if (el.style[t] !== undefined) {
          transition = transitions[t];
          return transition;
        }
      }
    };
  }();

  var DialogRenderer = exports.DialogRenderer = (_dec = (0, _aureliaDependencyInjection.transient)(), _dec(_class = function () {
    function DialogRenderer() {
      var _this = this;

      

      this.dialogControllers = [];

      this.escapeKeyEvent = function (e) {
        if (e.keyCode === 27) {
          var top = _this.dialogControllers[_this.dialogControllers.length - 1];
          if (top && top.settings.lock !== true) {
            top.cancel();
          }
        }
      };

      this.defaultSettings = _dialogOptions.dialogOptions;
    }

    DialogRenderer.prototype.getDialogContainer = function getDialogContainer() {
      return _aureliaPal.DOM.createElement('div');
    };

    DialogRenderer.prototype.showDialog = function showDialog(dialogController) {
      var _this2 = this;

      var settings = Object.assign({}, this.defaultSettings, dialogController.settings);
      var body = _aureliaPal.DOM.querySelectorAll('body')[0];
      var wrapper = document.createElement('div');

      this.modalOverlay = _aureliaPal.DOM.createElement(overlayTagName);
      this.modalContainer = _aureliaPal.DOM.createElement(containerTagName);
      this.anchor = dialogController.slot.anchor;
      wrapper.appendChild(this.anchor);
      this.modalContainer.appendChild(wrapper);

      this.stopPropagation = function (e) {
        e._aureliaDialogHostClicked = true;
      };
      this.closeModalClick = function (e) {
        if (!settings.lock && !e._aureliaDialogHostClicked) {
          dialogController.cancel();
        } else {
          return false;
        }
      };

      dialogController.centerDialog = function () {
        if (settings.centerHorizontalOnly) return;
        centerDialog(_this2.modalContainer);
      };

      this.modalOverlay.style.zIndex = this.defaultSettings.startingZIndex;
      this.modalContainer.style.zIndex = this.defaultSettings.startingZIndex;

      var lastContainer = Array.from(body.querySelectorAll(containerTagName)).pop();

      if (lastContainer) {
        lastContainer.parentNode.insertBefore(this.modalContainer, lastContainer.nextSibling);
        lastContainer.parentNode.insertBefore(this.modalOverlay, lastContainer.nextSibling);
      } else {
        body.insertBefore(this.modalContainer, body.firstChild);
        body.insertBefore(this.modalOverlay, body.firstChild);
      }

      if (!this.dialogControllers.length) {
        _aureliaPal.DOM.addEventListener('keyup', this.escapeKeyEvent);
      }

      this.dialogControllers.push(dialogController);

      dialogController.slot.attached();

      if (typeof settings.position === 'function') {
        settings.position(this.modalContainer, this.modalOverlay);
      } else {
        dialogController.centerDialog();
      }

      this.modalContainer.addEventListener('click', this.closeModalClick);
      this.anchor.addEventListener('click', this.stopPropagation);

      return new Promise(function (resolve) {
        var renderer = _this2;
        if (settings.ignoreTransitions) {
          resolve();
        } else {
          _this2.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
        }

        _this2.modalOverlay.classList.add('active');
        _this2.modalContainer.classList.add('active');
        body.classList.add('ai-dialog-open');

        function onTransitionEnd(e) {
          if (e.target !== renderer.modalContainer) {
            return;
          }
          renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }
      });
    };

    DialogRenderer.prototype.hideDialog = function hideDialog(dialogController) {
      var _this3 = this;

      var settings = Object.assign({}, this.defaultSettings, dialogController.settings);
      var body = _aureliaPal.DOM.querySelectorAll('body')[0];

      this.modalContainer.removeEventListener('click', this.closeModalClick);
      this.anchor.removeEventListener('click', this.stopPropagation);

      var i = this.dialogControllers.indexOf(dialogController);
      if (i !== -1) {
        this.dialogControllers.splice(i, 1);
      }

      if (!this.dialogControllers.length) {
        _aureliaPal.DOM.removeEventListener('keyup', this.escapeKeyEvent);
      }

      return new Promise(function (resolve) {
        var renderer = _this3;
        if (settings.ignoreTransitions) {
          resolve();
        } else {
          _this3.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
        }

        _this3.modalOverlay.classList.remove('active');
        _this3.modalContainer.classList.remove('active');

        function onTransitionEnd() {
          renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }
      }).then(function () {
        body.removeChild(_this3.modalOverlay);
        body.removeChild(_this3.modalContainer);
        dialogController.slot.detached();

        if (!_this3.dialogControllers.length) {
          body.classList.remove('ai-dialog-open');
        }

        return Promise.resolve();
      });
    };

    return DialogRenderer;
  }()) || _class);


  function centerDialog(modalContainer) {
    var child = modalContainer.children[0];
    var vh = Math.max(_aureliaPal.DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);

    child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
    child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  }
});
define('aurelia-dialog/dialog-options',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dialogOptions = exports.dialogOptions = {
    lock: true,
    centerHorizontalOnly: false,
    startingZIndex: 1000,
    ignoreTransitions: false
  };
});
define('aurelia-dialog/dialog-service',['exports', 'aurelia-metadata', 'aurelia-dependency-injection', 'aurelia-templating', './dialog-controller', './renderer', './lifecycle', './dialog-result'], function (exports, _aureliaMetadata, _aureliaDependencyInjection, _aureliaTemplating, _dialogController, _renderer, _lifecycle, _dialogResult) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogService = undefined;

  

  var _class, _temp;

  var DialogService = exports.DialogService = (_temp = _class = function () {
    function DialogService(container, compositionEngine) {
      

      this.container = container;
      this.compositionEngine = compositionEngine;
      this.controllers = [];
      this.hasActiveDialog = false;
    }

    DialogService.prototype.open = function open(settings) {
      var _this = this;

      var dialogController = void 0;

      var promise = new Promise(function (resolve, reject) {
        var childContainer = _this.container.createChild();
        dialogController = new _dialogController.DialogController(childContainer.get(_renderer.Renderer), settings, resolve, reject);
        childContainer.registerInstance(_dialogController.DialogController, dialogController);
        var host = dialogController.renderer.getDialogContainer();

        var instruction = {
          container: _this.container,
          childContainer: childContainer,
          model: dialogController.settings.model,
          view: dialogController.settings.view,
          viewModel: dialogController.settings.viewModel,
          viewSlot: new _aureliaTemplating.ViewSlot(host, true),
          host: host
        };

        return _getViewModel(instruction, _this.compositionEngine).then(function (returnedInstruction) {
          dialogController.viewModel = returnedInstruction.viewModel;
          dialogController.slot = returnedInstruction.viewSlot;

          return (0, _lifecycle.invokeLifecycle)(dialogController.viewModel, 'canActivate', dialogController.settings.model).then(function (canActivate) {
            if (canActivate) {
              _this.controllers.push(dialogController);
              _this.hasActiveDialog = !!_this.controllers.length;

              return _this.compositionEngine.compose(returnedInstruction).then(function (controller) {
                dialogController.controller = controller;
                dialogController.view = controller.view;

                return dialogController.renderer.showDialog(dialogController);
              });
            }
          });
        });
      });

      return promise.then(function (result) {
        var i = _this.controllers.indexOf(dialogController);
        if (i !== -1) {
          _this.controllers.splice(i, 1);
          _this.hasActiveDialog = !!_this.controllers.length;
        }

        return result;
      });
    };

    return DialogService;
  }(), _class.inject = [_aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine], _temp);


  function _getViewModel(instruction, compositionEngine) {
    if (typeof instruction.viewModel === 'function') {
      instruction.viewModel = _aureliaMetadata.Origin.get(instruction.viewModel).moduleId;
    }

    if (typeof instruction.viewModel === 'string') {
      return compositionEngine.ensureViewModel(instruction);
    }

    return Promise.resolve(instruction);
  }
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from='./resources/elements/nav/nav-bar'></require>\n    <require from=\"./resources/elements/loading-indicator\"></require>\n\n    <require from=\"theme/bootstrap.css\"></require>\n    <require from=\"app.css\"></require>\n    <!--\n    <require from=\"resources/styles/styles.css\"></require>\n    -->\n\n    <nav-bar router.bind=\"router\"></nav-bar>\n\n    <div class=\"page-host\">\n        <loading-indicator loading.bind=\"router.isNavigating\"></loading-indicator>\n        <router-view></router-view>\n    </div>\n</template>\n"; });
define('text!resources/elements/editor-dialog.html', ['module'], function(module) { module.exports = "<template>\r\n\t<div class=\"modal \" id=\"${dialogId}\" role=\"dialog\">\r\n\t\t<div class=\"modal-dialog\">\r\n\t\t\t<div class=\"modal-content\">\r\n\t\t\t\t<div class=\"modal-header\">\r\n\t\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span\r\n\t\t\t\t\t\taria-hidden=\"true\">&times;</span></button>\r\n\t\t\t\t\t<h4 class=\"modal-title\"><span if.bind=\"icon\" class=\"${icon}\"></span>${title}</h4>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"modal-body\">\r\n\t\t\t\t\t<compose model.bind=\"model\" view-model.bind=\"content\"></compose>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"modal-footer\">\r\n\t\t\t\t\t<span class=\"error-msg\">${errorMsg}</span>\r\n\t\t\t\t\t<button type=\"button\" class=\"btn btn-primary\" tabindex=\"5000\" click.delegate=\"save()\">Save</button>\r\n\t\t\t\t\t<button type=\"button\" class=\"btn\" tabindex=\"5050\" data-dismiss=\"modal\">Close</button>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<!-- /.modal-content -->\r\n\t\t</div>\r\n\t\t<!-- /.modal-dialog -->\r\n\t</div>\r\n\t<!-- /.modal -->\r\n</template>\r\n"; });
define('text!resources/elements/catalogue-numbers/cn-details.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"resources/elements/catalogue-numbers/cn-details.css\"></require>\n\t<require from=\"../../value-converters/empty-text\"></require>\n\t<require from=\"../../value-converters/as-currency\"></require>\n    <require from=\"../select-picker/select-picker\"></require>\n\n\t<div class=\"panel panel-default\">\n\t\t<div class=\"panel-heading\">\n\t\t\t<h4 class=\"panel-title\">Active Catalogue Number</h4>\n\t\t</div>\n\t\t<div class=\"panel-body\" validation-renderer=\"bootstrap-form\">\n\t\t\t<div class=\"form-group form-group-sm\">\n\t\t\t\t<label for=\"cn-catalogueRef\" class=\"col-sm-3 control-label\">Catalogue</label>\n\t\t\t\t<div class=\"col-sm-9\">\n                    <select-picker items.bind=\"catalogues\" disabled.bind=\"loading\" value.two-way=\"model.catalogueRef\"\n                                   config.bind=\"{ id: 'cn-catalogueRef', tabIndex: 70, labelProperty: 'displayName', valueProperty: 'id', caption: 'editor.catalogue-select' }\">\n                    </select-picker>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"form-group form-group-sm\">\n\t\t\t\t<label for=\"cn-condition\" class=\"col-sm-3 control-label\">Condition</label>\n\t\t\t\t<div class=\"col-sm-4\">\n                    <select-picker items.bind=\"conditions\" disabled.bind=\"loading\" value.two-way=\"model.condition\"\n                                   config.bind=\"{ id: 'cn-condition', tabIndex: 75, labelProperty: 'description', valueProperty: 'ordinal', filterSearch: false, caption: 'editor.condition-select' }\">\n                    </select-picker>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"form-group form-group-sm has-feedback\">\n\t\t\t\t<label for=\"cn-number\" class=\"col-sm-3 control-label\">Number</label>\n\t\t\t\t<div class=\"col-sm-3\">\n\t\t\t\t\t<input type=\"text\" tabindex=\"80\" class=\"form-control\" id=\"cn-number\" value.bind=\"model.number & validate:rules\">\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-1 packed-col\">\n\t\t\t\t\t<span title.bind=\"conflictMessage\" class=\"control-label sw-conversion ${icon}\" click.trigger=\"convert()\" disabled.bind=\"conversionModel !== undefined\"></span>\n                    <audio id=\"sw-exist-sound\">\n                        <source src=\"resources/sound/ring.ogg\" type=\"audio/ogg\">\n                        <source src=\"resources/sound/ring.mp3\" type=\"audio/mpeg\">\n                    </audio>\n\t\t\t\t</div>\n                <span id=\"inputNumberStatus\" class=\"sr-only\"></span>\n\t\t\t</div>\n\t\t\t<div class=\"form-group form-group-sm\">\n\t\t\t\t<label for=\"cn-value\" class=\"col-sm-3 control-label\"  disabled.bind=\"model.unknown\">Value</label>\n\t\t\t\t<div class=\"col-sm-2\">\n\t\t\t\t\t<input type=\"text\" tabindex=\"85\" class=\"form-control\" id=\"cn-value\" disabled.bind=\"model.unknown\" value.bind=\"model.value\" >\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-2 packed-col\">\n\t\t\t\t\t<div class=\"sw-currency-label control-label\" innerhtml=\"${selectedCatalogue | asCurrency:'code'}\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"checkbox\">\n\t\t\t\t<span class=\"col-sm-3\"></span>\n                <label class=\"col-sm-9\">\n                    <input type=\"checkbox\" tabindex=\"90\" checked.bind=\"model.unknown\">\n                    <span>No value listed</span>\n                </label>\n\t\t\t</div>\n\t\t\t<div class=\"checkbox\">\n\t\t\t\t<span class=\"col-sm-3\"></span>\n                <label class=\"col-sm-9\">\n\t\t\t\t\t<input type=\"checkbox\" tabindex=\"95\" checked.bind=\"model.nospace\">\n\t\t\t\t\t<span>No album space available</span>\n\t\t\t\t</label>\n\t\t\t</div>\n\n\t\t</div>\n\t</div>\n</template>\n"; });
define('text!resources/elements/catalogue-numbers/cn-references.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../../value-converters/by-name\"></require>\n    <require from=\"../../value-converters/as-enum\"></require>\n    <require from=\"../../value-converters/as-currency-formatted\"></require>\n    <require from=\"../select-picker/select-picker\"></require>\n    <require from=\"resources/elements/catalogue-numbers/cn-references.css\"></require>\n\n    <section class=\"sw-catalogue-number-table\">\n        <div class=\"sw-catalogue-number-content\">\n            <table class=\"table table-hover\">\n                <thead>\n                <tr>\n                    <th>\n                        <button type=\"button\" class=\"btn btn-default btn-xs\" show.bind='modelCopy' title=\"${'actions.add-cn'|t}\" click.delegate=\"add()\">\n                            <span class=\"sw-icon-plus\"></span>\n                        </button>\n                    </th>\n                    <th>${'editor.catalogue' | t}</th>\n                    <th>${'editor.condition' | t}</th>\n                    <th>${'editor.catalogue-number' | t}</th>\n                    <th>${'editor.catalogue-value' | t}</th>\n                    <th>${'editor.actions' | t}</th>\n                </tr>\n                </thead>\n                <tbody>\n                <tr repeat.for=\"number of modelCopy.catalogueNumbers\" class=\"cn-row ${(number.editing === true) ? 'editing-row' : ''}\">\n                    <template if.bind=\"!number.editing\">\n                        <td><span if.bind=\"number.active\" class=\"sw-icon-key\"></span></td>\n                        <td class=\"col-md-3\">${number.catalogueRef | byName:'catalogues' }</td>\n                        <td class=\"col-md-2\">${number.condition | asEnum:'Condition' | t}</td>\n                        <td class=\"col-md-2\">${number.number}</td>\n                        <td class=\"col-md-2\">${number.unknown ? 'editor.catalogue-value-unknown' : number.value | asCurrencyFormatted:number.currencyCode | t}</td>\n                        <td class=\"col-md-2\">\n                            <div class=\"btn-group actions\">\n                                <button type=\"button\" class=\"btn btn-default btn-xs\" title=\"${'actions.make-active'|t}\" show.bind=\"!number.active\" click.delegate=\"$parent.makeActive(number)\">\n                                    <span class=\"sw-icon-target\"></span>\n                                </button>\n                                <button type=\"button\" class=\"btn btn-default btn-xs\" title=\"${'actions.edit-cn'|t}\" click.delegate=\"$parent.edit(number, $index)\">\n                                    <span class=\"sw-icon-edit\"></span>\n                                </button>\n                                <button type=\"button\" class=\"btn btn-default btn-xs\" title=\"${'actions.remove-cn'|t}\" show.bind=\"!number.active\" click.trigger=\"$parent.remove(number)\">\n                                    <span class=\"sw-icon-trash\"></span>\n                                </button>\n                            </div>\n                        </td>\n                    </template>\n                    <template if.bind=\"number.editing === true\">\n                        <td><span if.bind=\"number.active\" class=\"sw-icon-key\"></span></td>\n                        <td class=\"col-md-3\">\n                            <select-picker class=\"editable-cell\" items.bind=\"$parent.catalogues\" disabled.bind=\"loading\" validate=\"catalogueRef\" value.two-way=\"number.catalogueRef\"\n                                           config.bind=\"{ id: 'cn-catalogueRef', tabIndex: 70, labelProperty: 'displayName', valueProperty: 'id', caption: 'editor.catalogue-select' }\">\n                            </select-picker>\n                        </td>\n                        <td class=\"col-md-2\">\n                            <select-picker class=\"editable-cell\" items.bind=\"$parent.conditions\" disabled.bind=\"loading\" value.two-way=\"number.condition\"\n                                           config.bind=\"{ id: 'cn-condition', tabIndex: 75, labelProperty: 'description', valueProperty: 'ordinal', filterSearch: false, caption: 'editor.condition-select' }\">\n                            </select-picker>\n                        </td>\n                        <td class=\"col-md-2\">\n                            <input type=\"text\" tabindex=\"80\" autofocus class=\"form-control\" id=\"cn-number\" validate=\"number\" value.bind=\"number.number\">\n                        </td>\n                        <td class=\"col-md-2\">\n                            <input type=\"text\" tabindex=\"85\" class=\"form-control\" id=\"cn-value\" value.bind=\"number.value\" >\n                        </td>\n                        <td class=\"col-md-2\">\n                            <div class=\"btn-group actions\">\n                                <button type=\"button\" class=\"btn btn-default btn-xs\" click.delegate=\"$parent.save(number)\" title=\"${'actions.save-changes'|t}\">\n                                    <span class=\"sw-icon-ok action-edit-ok\"></span>\n                                </button>\n                                <button type=\"button\" class=\"btn btn-default btn-xs\" click.delegate=\"$parent.cancel(number)\" title=\"${'actions.cancel-changes'|t}\">\n                                    <span class=\"sw-icon-cancel action-edit-cancel\"></span>\n                                </button>\n                            </div>\n                        </td>\n                    </template>\n                </tr>\n                </tbody>\n            </table>\n        </div>\n    </section>\n</template>\n"; });
define('text!resources/elements/collapse-panel/collapse-panel.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"resources/elements/collapse-panel/collapse-panel.css\"></require>\n    <div class=\"panel panel-primary\" show.bind=\"!collapsed\">\n        <div class=\"collapse-header\">\n            <h4 class=\"panel-title\">${title}</h4>\n            <button class=\"btn btn-xs btn-default btn-close\" type=\"button\" click.delegate=\"hide()\" title=\"${'editor.hide'|t}\">\n                <span class=\"sw-icon-previous\"></span>\n            </button>\n        </div>\n        <div class=\"collapse-content panel-body\">\n            <slot></slot>\n        </div>\n    </div>\n\n</template>\n"; });
define('text!app.css', ['module'], function(module) { module.exports = "html {\n  height: 100%;\n}\nbody {\n  margin: 0;\n  height: inherit;\n}\nsection {\n  margin: 0 20px;\n}\n.app-icon-stampweb {\n  background: url(\"../resources/images/stamp-web-64x64.png\") no-repeat;\n  background-size: 28px 28px;\n  display: inline-block;\n  width: 28px;\n  height: 28px;\n}\n.splash {\n  display: none;\n}\n.page-host {\n  position: relative;\n  height: inherit;\n  overflow-x: hidden;\n  overflow-y: hidden;\n}\nai-dialog-overlay {\n  background-color: #ccc;\n  z-index: 10000;\n}\nai-dialog-overlay.active {\n  opacity: 0.7;\n}\n.app-bar {\n  /*  box-shadow: 0px 2px 5px 0px rgba(50, 50, 50, 0.75);*/\n  padding-top: 4px;\n  margin-bottom: 0px;\n}\n.modal-open .modal {\n  overflow-y: hidden;\n}\n.modal-lg {\n  max-width: 600px;\n}\n.panel-title {\n  font-size: 1.1em;\n}\n.flex {\n  display: flex;\n  display: -webkit-flex;\n  flex-grow: 1;\n  align-self: stretch;\n}\n.flex-col {\n  display: flex;\n  display: -webkit-flex;\n  flex: 1 100%;\n  flex-flow: column nowrap;\n}\n.flex-down {\n  display: flex;\n  -webkit-flex: 2;\n  flex: 2;\n}\n.sw-warning {\n  color: #f0ad4e;\n}\n.condition-selector {\n  max-width: 150px;\n}\n.currency-selector {\n  max-width: 80px;\n}\n.locale-selector {\n  max-width: 150px;\n}\n.pageSize-selector {\n  max-width: 150px;\n}\n.packed-col {\n  padding-left: 0;\n}\n.panel-heading-with-actions h4 {\n  display: inline-block;\n  position: relative;\n}\n.panel-heading-with-actions .btn-group {\n  float: right;\n  top: -2.5px;\n}\n.panel-heading-with-actions .btn-group span {\n  height: 14px;\n  font-size: 0.9em;\n}\n.mirror-icon {\n  -moz-transform: rotate(180deg);\n  -webkit-transform: rotate(180deg);\n  -o-transform: rotate(180deg);\n  -ms-transform: rotate(180deg);\n  transform: rotate(180deg);\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);\n}\n.full-height {\n  height: 100%;\n}\ntable .icon-col {\n  min-width: 26px;\n  max-width: 26px;\n  width: 26px;\n}\ntable .image-col {\n  min-width: 46px;\n  max-width: 46px;\n  width: 46px;\n}\ntable .stamp-thumbnail {\n  padding: 4px;\n  margin: auto;\n  height: 46px;\n  width: 46px;\n  background-color: transparent;\n  position: relative;\n  border-radius: 0;\n}\ntable .stamp-thumbnail img {\n  cursor: pointer;\n  max-width: 36px;\n  max-height: 36px;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n*::selection {\n  background: transparent;\n}\n*::-moz-selection {\n  background: transparent;\n}\n* input::selection,\n* textarea::selection {\n  background: #337ab7;\n  color: #fff;\n}\n#nprogress .bar {\n  background: #36c377 !important;\n  height: 3px;\n}\n#nprogress .peg {\n  box-shadow: 0 0 10px #36c377, 0 0 5px #fff !important;\n}\n"; });
define('text!resources/elements/date-picker/date-picker.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"bootstrap-datepicker/css/bootstrap-datepicker3.css\"></require>\n    <require from=\"resources/elements/date-picker/date-picker.css\"></require>\n\n    <span class=\"date-wrapper\">\n        <label if.bind=\"range\">${'date-picker.from'|t}</label>\n        <span class=\"date-control start-date\">\n            <input value.two-way=\"selectedDate\" class=\"form-control\" type=\"text\" size=\"10\">\n            <span class=\"sw-icon-cancel\" click.trigger=\"clear($event)\" show.bind=\"selectedDate\"></span>\n            <span class=\"sw-icon-calendar date-toggle\" click.trigger=\"show($event)\"></span>\n        </span>\n    </span>\n    <span class=\"date-wrapper\" if.bind=\"range\">\n        <label class=\"to-label\">${'date-picker.to'|t}</label>\n        <span class=\"date-control end-date\">\n            <input value.two-way=\"selectedEndDate\" class=\"form-control\" type=\"text\" size=\"10\">\n            <span class=\"sw-icon-cancel\" click.trigger=\"clear($event)\" show.bind=\"selectedEndDate\"></span>\n            <span class=\"sw-icon-calendar date-toggle\" click.trigger=\"show($event)\"></span>\n        </span>\n    </span>\n\n</template>\n"; });
define('text!resources/elements/image-preview/image-preview.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"resources/elements/image-preview/image-preview.css\"></require>\n    <div click.delegate=\"closeFullSizeImage()\"></div>\n</template>\n"; });
define('text!resources/elements/nav/nav-bar.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"resources/elements/nav/nav-bar.css\"></require>\n\n\t<nav class=\"navbar navbar-inverse navbar-fixed-top app-bar\" role=\"navigation\">\n\t\t<div class=\"navbar-header\">\n\t\t\t<button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\"\n\t\t\t\t\tdata-target=\"#collapsible-header\">\n\t\t\t\t<span class=\"sr-only\">Toggle Navigation</span>\n\t\t\t\t<span class=\"icon-bar\"></span>\n\t\t\t\t<span class=\"icon-bar\"></span>\n\t\t\t\t<span class=\"icon-bar\"></span>\n\t\t\t</button>\n\t\t\t<a class=\"navbar-brand\" href=\"#\">\n\t\t\t\t<span class=\"app-icon-stampweb\"></span>\n\t\t\t\t<span>${router.title|t}</span>\n\t\t\t</a>\n\t\t</div>\n\n\t\t<div class=\"collapse navbar-collapse\" id=\"collapsible-header\">\n\t\t\t<ul class=\"nav navbar-nav\">\n\t\t\t\t<li role=\"presentation\">\n\t\t\t\t\t<a href=\"#/settings\">\n                        <span class=\"hidden-xs sw-icon-settings\" aria-hidden=\"true\" title=\"${'nav.settings'|t}\"></span>\n                        <span class=\"visible-xs\"> ${'nav.settings'|t}</span>\n                    </a>\n\t\t\t\t</li>\n\t\t\t\t<li role=\"presentation\" repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\n\t\t\t\t\t<a href.bind=\"row.href\">${row.title|t}</a>\n\t\t\t\t</li>\n\t\t\t</ul>\n            <ul class=\"nav navbar-nav navbar-right\">\n                <li role=\"presentation\">\n                    <a href=\"http://www.drakeserver.com/javaws/tools/stamp-imageparsing.jnlp\" title=\"${'nav.image-burst'|t}\">\n                        <span class=\"hidden-xs sw-icon-imageburst\"></span>\n                        <span class=\"visible-xs\">${'nav.image-burst'|t}</span>\n                    </a>\n                </li>\n                <li role=\"presentation\">\n                    <a href=\"http://www.drakeserver.com/javaws/tools/stamp-pagegen.jnlp\" title=\"${'nav.page-gen'|t}\">\n                        <span class=\"hidden-xs sw-icon-catalogue sw-icon-pagegen\"></span>\n                        <span class=\"visible-xs\">${'nav.page-gen'|t}</span>\n                    </a>\n                </li>\n            </ul>\n\t\t</div>\n\t</nav>\n</template>\n"; });
define('text!resources/elements/ownerships/ownership-cert.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"resources/elements/ownerships/ownership-cert.css\"></require>\n    <span class=\"${iconCls}\" if.bind=\"hasCert\" data-toggle=\"tooltip\"></span>\n</template>\n"; });
define('text!resources/elements/ownerships/ownership-editor.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../../value-converters/empty-text\"></require>\n    <require from=\"../../value-converters/date-formatter\"></require>\n    <require from=\"../../value-converters/bitwise-to-array\"></require>\n    <require from=\"../date-picker/date-picker\"></require>\n    <require from=\"../select-picker/select-picker\"></require>\n\n    <require from=\"resources/elements/ownerships/ownership-editor.css\"></require>\n\n    <div class=\"panel panel-default sw-ownership-editor\">\n        <div class=\"panel-heading\">\n            <h4 class=\"panel-title\">Owning Details</h4>\n        </div>\n\n        <div class=\"panel-body\">\n\n            <div class=\"form-group form-group-sm has-feedback\">\n                <label for=\"owner-albumRef\" class=\"col-sm-3 control-label\">Album</label>\n                <div class=\"col-sm-9\">\n                    <select-picker items.bind=\"albums\" class=\"album-selector\" disabled.bind=\"loading\"  value.two-way=\"model.albumRef\"\n                        config.bind=\"{ id: 'owner-albumRef', tabIndex: 100, name: 'albumRef', labelProperty: 'name', valueProperty: 'id', caption: 'editor.album-select' }\">\n                    </select-picker>\n                </div>\n            </div>\n            <div class=\"form-group form-group-sm\">\n                <label for=\"owner-condition\" class=\"col-sm-3 control-label\">${'editor.condition'|t}</label>\n                <div class=\"col-sm-4\">\n                    <select-picker class=\"condition-selector\" items.bind=\"conditions\" value.two-way=\"model.condition\"\n                                   config.bind=\"{ id: 'owner-condition', tabIndex: 101, labelProperty: 'description', valueProperty: 'ordinal', filterSearch: false, caption: 'editor.condition-select' }\">\n                    </select-picker>\n                </div>\n            </div>\n            <div class=\"form-group form-group-sm\">\n                <label for=\"owner-grade\" class=\"col-sm-3 control-label\">${'editor.grade'|t}</label>\n                <div class=\"col-sm-4\">\n                    <select-picker class=\"grade-selector\" items.bind=\"grades\" value.two-way=\"model.grade\"\n                                   config.bind=\"{ id: 'owner-grade', tabIndex: 102, labelProperty: 'description', valueProperty: 'ordinal', filterSearch: false, caption: 'editor.grade-select' }\">\n                    </select-picker>\n                </div>\n            </div>\n            <div class=\"form-group form-group-sm\">\n                <label for=\"owner-defects\" class=\"col-sm-3 control-label\">${'editor.defects'|t}</label>\n                <div class=\"col-sm-9\">\n                    <select-picker items.bind=\"defects\" value.two-way=\"model.defects | bitwiseToArray:defects.length\"\n                                   config.bind=\"{ id: 'owner-defects', tabIndex: 104, name: 'defects', labelProperty: 'description', valueProperty: 'ordinal', filterSearch: false, multiple: true, caption: 'editor.defects-select' }\">\n                    </select-picker>\n                </div>\n            </div>\n            <div class=\"form-group form-group-sm\">\n                <label for=\"owner-deceptions\" class=\"col-sm-3 control-label\">${'editor.deceptions'|t}</label>\n                <div class=\"col-sm-9\">\n                    <select-picker items.bind=\"deceptions\" value.two-way=\"model.deception | bitwiseToArray:deceptions.length\"\n                                   config.bind=\"{ id: 'owner-deceptions', tabIndex: 107, name: 'deceptions', labelProperty: 'description', valueProperty: 'ordinal', filterSearch: false, multiple: true, caption: 'editor.deceptions-select' }\">\n                    </select-picker>\n                </div>\n            </div>\n            <div class=\"form-group form-group-sm\">\n                <label for=\"owner-sellerRef\" class=\"col-sm-3 control-label\">${'editor.seller'|t}</label>\n                <div class=\"col-sm-9\">\n                    <select-picker items.bind=\"sellers\" class=\"seller-selector\" disabled.bind=\"loading\"  value.two-way=\"model.sellerRef\"\n                                   config.bind=\"{ id: 'owner-sellerRef', tabIndex: 110, name: 'sellerRef', labelProperty: 'name', valueProperty: 'id', caption: 'editor.seller-select' }\">\n                    </select-picker>\n                </div>\n            </div>\n           <div class=\"form-group form-group-sm\">\n               <label for=\"owner-pricePaid\" class=\"col-sm-3 control-label\">Price paid</label>\n               <div class=\"col-sm-2\">\n                   <input type=\"text\" tabindex=\"111\" class=\"form-control price-paid\" id=\"owner-pricePaid\" value.bind=\"model.pricePaid | emptyText\">\n               </div>\n               <div class=\"col-sm-3\">\n                   <select-picker items.bind=\"codes\" class=\"currency-selector\" value.two-way=\"model.code\" value-type=\"String\"\n                                  config.bind=\"{ id: 'owner-code', tabIndex: 112, name: 'code', noSearch: true, labelProperty: 'description', valueProperty: 'keyName' }\">\n                   </select-picker>\n               </div>\n           </div>\n           <div class=\"form-group form-group-sm\">\n               <label for=\"owner-purchased\" class=\"col-sm-3 control-label\">Purchased</label>\n               <div class=\"input-group col-sm-9\">\n                   <date-picker id=\"owner-purchased\" tabindex=\"115\" value.two-way=\"model.purchased\"></date-picker>\n               </div>\n           </div>\n            <div class=\"form-group form-group-sm\">\n                <label for=\"owner-img\" class=\"col-sm-3 control-label\">Image Path</label>\n                <div class=\"col-sm-9\">\n                    <input type=\"text\" tabindex=\"120\" required aria-required=\"true\" class=\"form-control\" value.bind=\"model.img | emptyText\" id=\"owner-img\">\n                </div>\n            </div>\n            <div class=\"checkbox\">\n                <span class=\"col-sm-3\"></span>\n                <label class=\"col-sm-9\">\n                    <input tabindex=\"125\" type=\"checkbox\" checked.bind=\"model.cert\">\n                    <span>Certified or validated</span>\n                </label>\n            </div>\n            <div class=\"form-group form-group-sm\">\n                <label for=\"owner-certImg\" class=\"col-sm-3 control-label\" disabled.bind=\"!model.cert\">Certificate</label>\n                <div class=\"col-sm-9\">\n                    <input type=\"text\" tabindex=\"130\" class=\"form-control\" disabled.bind=\"!model.cert\" value.bind=\"model.certImg | emptyText\" id=\"owner-certImg\">\n                </div>\n            </div>\n            <div class=\"form-group form-group-sm\">\n                <label for=\"owner-notes\" class=\"col-sm-3 control-label\">Notes</label>\n                <div class=\"col-sm-9\">\n                    <textarea class=\"form-control\" tabindex=\"135\" value.bind=\"model.notes | emptyText\" id=\"owner-notes\" rows=\"3\"></textarea>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>\n"; });
define('text!theme/bootstrap-overrides.css', ['module'], function(module) { module.exports = ".modal {\n  z-index: 5000;\n}\n.navbar {\n  z-index: 990;\n}\n.btn {\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0);\n}\n.btn-default {\n  background-color: #fafafa;\n}\n.btn:hover {\n  color: #337ab7;\n}\n.btn.btn-primary:hover {\n  color: #fff;\n}\n.dropdown-menu {\n  color: #333333;\n  background-color: #fff;\n  z-index: -1;\n}\n.dropdown-menu li {\n  padding-left: 15px;\n  padding-top: calc(7.5px);\n  padding-bottom: calc(7.5px);\n  font-size: 0.85em;\n}\n.dropdown-menu li:hover {\n  background-color: #337ab7;\n  color: #fff;\n}\n.dropdown-menu li.selected {\n  background-color: #337ab7;\n  color: #fff;\n}\n.dropdown {\n  display: inline-block;\n}\n.dropdown.open {\n  z-index: 1000;\n}\n.table {\n  font-size: 12px;\n}\n.form-group {\n  margin-bottom: 10px;\n}\n.form-group label {\n  font-weight: normal;\n}\n.form-group label.required {\n  font-weight: bold;\n}\n.form-group label:after {\n  content: \": \";\n}\n.form-group-sm textarea.form-control {\n  height: 100%;\n}\n.form-group-sm select.form-control {\n  height: 26px;\n  line-height: 26px;\n}\n.form-group-sm .form-control {\n  height: 26px;\n  padding: 2px 10px;\n  font-size: 12px;\n  line-height: 1.25;\n}\n.form-horizontal {\n  font-size: 12px;\n}\n.form-horizontal .checkbox {\n  padding-top: 0;\n}\n.form-horizontal .checkbox label {\n  padding-left: 10px;\n}\n.form-horizontal .checkbox label input {\n  position: relative;\n  display: inline-block;\n}\n.form-horizontal .checkbox label span {\n  position: relative;\n  top: -2px;\n}\n.tooltip-inner {\n  text-align: left;\n  padding: 6px 12px;\n  font-size: 11px;\n}\n.badge {\n  background-color: #337ab7;\n}\nbody .datepicker table tr td.day:hover,\nbody .datepicker table tr td.day.focused {\n  background: #f5f5f5;\n}\nbody .datepicker thead tr:first-child th:hover,\nbody .datepicker tfoot tr th:hover {\n  background: #f5f5f5;\n}\nbody .picker-switch table tbody td span:hover,\nbody .picker-switch table tbody td span:focus {\n  background: #f5f5f5;\n}\n"; });
define('text!resources/elements/ownerships/ownership-notes.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"resources/elements/ownerships/ownership-notes.css\"></require>\n    <span class=\"${iconCls}\" if.bind=\"visible\" data-toggle=\"tooltip\"></span>\n</template>\n"; });
define('text!resources/elements/paging/paging-toolbar.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"resources/elements/paging/paging-toolbar.css\"></require>\n    <require from=\"../../value-converters/zero-based\"></require>\n\n    <div class=\"paging-component\">\n        <div class=\"btn-group\" role=\"group\">\n            <button class=\"btn btn-xs btn-default first-page paging-button\" title=\"Show the first page\" click.trigger=\"selectPage(0)\" disabled.bind=\"page < 1\">\n                <span class=\"sw-icon-to-start\"></span>\n            </button>\n            <button class=\"btn btn-xs btn-default back-page mirror-icon paging-button\" aria-label=\"Previous\" title=\"Show the previous page\" click.trigger=\"selectPage(page - 1)\" disabled.bind=\"page < 1\">\n                <span class=\"sw-icon-forward mirror-icon\"></span>\n            </button>\n        </div>\n\n        <div class=\"current-page\">\n            ${'paging-toolbar.page'|t} <input type=\"number\" size=\"3\" class=\"enter-page\" min=\"0\" max.bind=\"total\" name=\"pageValue\" pattern=\"/^\\d+$/\" change.delegate=\"validatePage()\"\n                        keyup.delegate=\"filterKey($event)\" disabled.bind=\"total < 1\" value.bind=\"page | zeroBased\" /> of ${total}\n        </div>\n        <div class=\"btn-group\" role=\"group\">\n            <button class=\"btn btn-xs btn-default next-page paging-button\" aria-label=\"Next\" title=\"Show the next page\" click.trigger=\"selectPage(page + 1)\" disabled.bind=\"page + 1 >= total\">\n                <span class=\"sw-icon-forward\"></span>\n            </button>\n            <button class=\"btn btn-xs btn-default last-page paging-button\" title=\"Show the last page\" click.trigger=\"selectPage(total-1)\" disabled.bind=\"page + 1 >= total\">\n                <span class=\"sw-icon-to-end\"></span>\n            </button>\n        </div>\n\n        <button class=\"btn btn-xs btn-default refresh-page paging-button\" title=\"Refresh the page\" click.trigger=\"refresh()\" disabled.bind=\"total < 1\">\n            <span class=\"sw-icon-refresh\"></span>\n        </button>\n    </div>\n</template>\n"; });
define('text!resources/elements/search/search-form.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../date-picker/date-picker\"></require>\n    <require from=\"../select-picker/select-picker\"></require>\n    <require from=\"../../value-converters/date-formatter\"></require>\n    <require from=\"resources/elements/search/search-form.css\"></require>\n    <div>\n        <form class=\"form-horizontal\">\n            <div class=\"panel panel-default\">\n                <div class=\"panel-heading\">\n                    <h4 class=\"panel-title\">${'search.form-title'|t}</h4>\n                </div>\n                <div class=\"panel-body\">\n                    <div class=\"form-group form-group-sm has-feedback\">\n                        <label for=\"search-countryRef\" class=\"col-sm-3 control-label\">${'editor.country'|t}</label>\n                        <div class=\"col-sm-9\">\n                            <select-picker items.bind=\"countries\" class=\"country-selector\" disabled.bind=\"loading\" value.two-way=\"model.countryRef\"\n                                           config.bind=\"{ id: 'search-countryRef', tabIndex: 40, labelProperty: 'name', valueProperty: 'id', filterSearch: true, caption: 'editor.country-select' }\"></select-picker>\n                        </div>\n                    </div>\n                    <div class=\"form-group form-group-sm has-feedback\">\n                        <label for=\"search-stampCollectionRef\" class=\"col-sm-3 control-label\">${'editor.stamp-collection'|t}</label>\n                        <div class=\"col-sm-9\">\n                            <select-picker items.bind=\"stampCollections\" class=\"stampCollection-selector\" disabled.bind=\"loading\" value.two-way=\"model.stampCollectionRef\"\n                                           config.bind=\"{ id: 'search-stampCollectionRef', tabIndex: 40, labelProperty: 'name', valueProperty: 'id', filterSearch: true, caption: 'editor.stamp-collection-select' }\"></select-picker>\n                        </div>\n                    </div>\n                    <div class=\"form-group form-group-sm has-feedback\">\n                        <label for=\"search-albumRef\" class=\"col-sm-3 control-label\">Album</label>\n                        <div class=\"col-sm-9\">\n                            <select-picker items.bind=\"albums\" class=\"album-selector\" disabled.bind=\"loading\"  value.two-way=\"model.albumRef\"\n                                           config.bind=\"{ id: 'search-albumRef', tabIndex: 100, name: 'albumRef', labelProperty: 'name', valueProperty: 'id', caption: 'editor.album-select' }\">\n                            </select-picker>\n                        </div>\n                    </div>\n                    <div class=\"form-group form-group-sm\">\n                        <label for=\"search-catalogueRef\" class=\"col-sm-3 control-label\">${'editor.catalogue'|t}</label>\n                        <div class=\"col-sm-9\">\n                            <select-picker items.bind=\"catalogues\" class=\"catalogue-selector\" disabled.bind=\"loading\"  value.two-way=\"model.catalogueRef\"\n                                           config.bind=\"{ id: 'search-catalogueRef', tabIndex: 105, name: 'catalogueRef', labelProperty: 'displayName', valueProperty: 'id', caption: 'editor.catalogue-select' }\">\n                            </select-picker>\n                        </div>\n                    </div>\n                    <div class=\"form-group form-group-sm\">\n                        <label for=\"search-sellerRef\" class=\"col-sm-3 control-label\">${'editor.seller'|t}</label>\n                        <div class=\"col-sm-9\">\n                            <select-picker items.bind=\"sellers\" class=\"seller-selector\" disabled.bind=\"loading\"  value.two-way=\"model.sellerRef\"\n                                           config.bind=\"{ id: 'search-sellerRef', tabIndex: 110, name: 'sellerRef', labelProperty: 'name', valueProperty: 'id', caption: 'editor.seller-select' }\">\n                            </select-picker>\n                        </div>\n                    </div>\n                    <div class=\"form-group form-group-sm\">\n                        <label for=\"search-purchased\" class=\"col-sm-3 control-label\">${'editor.purchased'|t}</label>\n                        <div class=\"col-sm-9\">\n                            <date-picker range=\"true\" id=\"search-purchased\" tabindex=\"120\"\n                                            end-value.two-way=\"model.purchasedEnd\"\n                                            value.two-way=\"model.purchasedStart\">\n                            </date-picker>\n                        </div>\n                    </div>\n                    <div class=\"form-group form-group-sm\">\n                        <label for=\"search-createTimestamp\" class=\"col-sm-3 control-label\">${'editor.createTimestamp'|t}</label>\n                        <div class=\"col-sm-9\">\n                            <date-picker range=\"true\" id=\"search-createTimestamp\" tabindex=\"130\"\n                                            end-value.two-way=\"model.createTimestampEnd | dateFormatter\"\n                                            value.two-way=\"model.createTimestampStart | dateFormatter\">\n                            </date-picker>\n                        </div>\n                    </div>\n                    <div class=\"form-group form-group-sm\">\n                        <label for=\"search-modifyTimestamp\" class=\"col-sm-3 control-label\">${'editor.modifyTimestamp'|t}</label>\n                        <div class=\"col-sm-9\">\n                            <date-picker range=\"true\" id=\"search-modifyTimestamp\" tabindex=\"140\"\n                                            end-value.two-way=\"model.modifyTimestampEnd | dateFormatter\"\n                                            value.two-way=\"model.modifyTimestampStart | dateFormatter\">\n                            </date-picker>\n                        </div>\n                    </div>\n                    <div class=\"form-group form-group-sm\">\n                        <div class=\"col-sm-3\"></div>\n                        <div class=\"col-sm-9 advanced-options\">\n                            <div class=\"checkbox\">\n                                <label class=\"${model.deception ? 'disabled' : ''}\">\n                                    <input tabindex=\"150\" type=\"checkbox\" checked.bind=\"model.defects\" disabled.bind=\"model.deception\">\n                                    Only stamps with defects\n                                </label>\n                            </div>\n                            <div class=\"checkbox\">\n                                <label class=\"${model.defects ? 'disabled' : ''}\">\n                                    <input tabindex=\"160\" type=\"checkbox\" checked.bind=\"model.deception\" disabled.bind=\"model.defects\">\n                                    Only stamps with deceptive qualities\n                                </label>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\n            </div>\n            <div class=\"search-button-bar\">\n                <div class=\"checkbox col-sm-6\" if.bind=\"showMinimize === true\">\n                    <label>\n                        <input type=\"checkbox\" checked.bind=\"minimizeOnSearch\">\n                        <span>${'search.minimize'|t}</span>\n                    </label>\n                </div>\n                <div class=\"editor-buttons ${(showMinimize === true) ? 'col-sm-6' : 'col-sm-12'}\">\n                    <button type=\"button\" class=\"btn btn-sm btn-default ${!loading ? '' : 'disabled'}\" click.delegate=\"reset()\">Reset</button>\n                    <button type=\"button\" class=\"btn btn-sm btn-primary ${!loading ? '' : 'disabled'}\" click.delegate=\"search()\">Search</button>\n                </div>\n            </div>\n\n        </form>\n    </div>\n</template>\n"; });
define('text!resources/elements/select-picker/select-picker.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"select2/css/select2.css\"></require>\n    <require from=\"resources/elements/select-picker/select-picker.css\"></require>\n\n    <select id.bind=\"id\" class=\"form-control\" multiple.bind=\"multiple\">\n        <option></option>\n        <option repeat.for=\"item of items\" value.bind=\"$parent.getBoundValue(item)\">${$parent.getBoundText(item)|t}</option>\n    </select>\n</template>\n"; });
define('text!resources/elements/stamps/stamp-card.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../../value-converters/by-name\"></require>\n    <require from=\"../../value-converters/rate-filter\"></require>\n    <require from=\"../ownerships/ownership-notes\"></require>\n    <require from=\"../ownerships/ownership-cert\"></require>\n    <require from=\"resources/elements/stamps/stamp-card.css\"></require>\n\n  <div class=\"stamp-card ${(selected) ? 'selected' : ''} ${(highlight) ? 'highlight' : ''}\" click.trigger=\"toggleSelection($event)\">\n      <div class=\"card-header\">\n          <div class=\"header-status\">\n              <ownership-notes model.one-way=\"ownership\"></ownership-notes>\n              <ownership-cert model.one-way=\"ownership\"></ownership-cert>\n          </div>\n          <span class=\"header-text\">${activeCN.number} ${model.countryRef | byName:'countries' }</span>\n\n      </div>\n\n    <div class=\"description\" title=\"${model.rate} - ${model.description}\">\n      ${model.rate | rateFilter} - ${model.description}\n    </div>\n    <div class=\"stamp-thumbnail\">\n      <img src.bind=\"imagePath\" onerror.bind=\"notFoundImage()\" click.trigger=\"showFullSizeImage($event)\"/>\n    </div>\n    <div class=\"btn-group action-panel\" role=\"group\">\n      <button type=\"button\" class=\"btn btn-default\" aria-label=\"View\">\n        <span class=\"sw-icon-info\" aria-hidden=\"true\"></span>\n      </button>\n      <button type=\"button\" class=\"btn btn-default\" aria-label=\"Edit\" click.trigger=\"edit()\">\n        <span class=\"sw-icon-edit\" aria-hidden=\"true\"></span>\n      </button>\n      <button type=\"button\" class=\"btn btn-default\" aria-label=\"Delete\" click.trigger=\"remove()\">\n        <span class=\"sw-icon-trash\" aria-hidden=\"true\"></span>\n      </button>\n    </div>\n  </div>\n\n\n</template>\n"; });
define('text!theme/bootstrap.css', ['module'], function(module) { module.exports = "/*!\n * Based on Bootstrap\n */\n/*!\n * Bootstrap v3.3.6 (http://getbootstrap.com)\n * Copyright 2011-2015 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n */\n/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\nhtml {\n  font-family: sans-serif;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%;\n}\nbody {\n  margin: 0;\n}\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block;\n}\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  vertical-align: baseline;\n}\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n[hidden],\ntemplate {\n  display: none;\n}\na {\n  background-color: transparent;\n}\na:active,\na:hover {\n  outline: 0;\n}\nabbr[title] {\n  border-bottom: 1px dotted;\n}\nb,\nstrong {\n  font-weight: bold;\n}\ndfn {\n  font-style: italic;\n}\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\nmark {\n  background: #ff0;\n  color: #000;\n}\nsmall {\n  font-size: 80%;\n}\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\nsup {\n  top: -0.5em;\n}\nsub {\n  bottom: -0.25em;\n}\nimg {\n  border: 0;\n}\nsvg:not(:root) {\n  overflow: hidden;\n}\nfigure {\n  margin: 1em 40px;\n}\nhr {\n  box-sizing: content-box;\n  height: 0;\n}\npre {\n  overflow: auto;\n}\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  font: inherit;\n  margin: 0;\n}\nbutton {\n  overflow: visible;\n}\nbutton,\nselect {\n  text-transform: none;\n}\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  cursor: pointer;\n}\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default;\n}\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0;\n}\ninput {\n  line-height: normal;\n}\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  padding: 0;\n}\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  box-sizing: content-box;\n}\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em;\n}\nlegend {\n  border: 0;\n  padding: 0;\n}\ntextarea {\n  overflow: auto;\n}\noptgroup {\n  font-weight: bold;\n}\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\ntd,\nth {\n  padding: 0;\n}\n/*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */\n@media print {\n  *,\n  *:before,\n  *:after {\n    background: transparent !important;\n    color: #000 !important;\n    box-shadow: none !important;\n    text-shadow: none !important;\n  }\n  a,\n  a:visited {\n    text-decoration: underline;\n  }\n  a[href]:after {\n    content: \" (\" attr(href) \")\";\n  }\n  abbr[title]:after {\n    content: \" (\" attr(title) \")\";\n  }\n  a[href^=\"#\"]:after,\n  a[href^=\"javascript:\"]:after {\n    content: \"\";\n  }\n  pre,\n  blockquote {\n    border: 1px solid #999;\n    page-break-inside: avoid;\n  }\n  thead {\n    display: table-header-group;\n  }\n  tr,\n  img {\n    page-break-inside: avoid;\n  }\n  img {\n    max-width: 100% !important;\n  }\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3;\n  }\n  h2,\n  h3 {\n    page-break-after: avoid;\n  }\n  .navbar {\n    display: none;\n  }\n  .btn > .caret,\n  .dropup > .btn > .caret {\n    border-top-color: #000 !important;\n  }\n  .label {\n    border: 1px solid #000;\n  }\n  .table {\n    border-collapse: collapse !important;\n  }\n  .table td,\n  .table th {\n    background-color: #fff !important;\n  }\n  .table-bordered th,\n  .table-bordered td {\n    border: 1px solid #ddd !important;\n  }\n}\n@font-face {\n  font-family: 'Glyphicons Halflings';\n  src: url('../fonts/glyphicons-halflings-regular.eot');\n  src: url('../fonts/glyphicons-halflings-regular.eot?#iefix') format('embedded-opentype'), url('../fonts/glyphicons-halflings-regular.woff2') format('woff2'), url('../fonts/glyphicons-halflings-regular.woff') format('woff'), url('../fonts/glyphicons-halflings-regular.ttf') format('truetype'), url('../fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular') format('svg');\n}\n.glyphicon {\n  position: relative;\n  top: 1px;\n  display: inline-block;\n  font-family: 'Glyphicons Halflings';\n  font-style: normal;\n  font-weight: normal;\n  line-height: 1;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.glyphicon-asterisk:before {\n  content: \"\\002a\";\n}\n.glyphicon-plus:before {\n  content: \"\\002b\";\n}\n.glyphicon-euro:before,\n.glyphicon-eur:before {\n  content: \"\\20ac\";\n}\n.glyphicon-minus:before {\n  content: \"\\2212\";\n}\n.glyphicon-cloud:before {\n  content: \"\\2601\";\n}\n.glyphicon-envelope:before {\n  content: \"\\2709\";\n}\n.glyphicon-pencil:before {\n  content: \"\\270f\";\n}\n.glyphicon-glass:before {\n  content: \"\\e001\";\n}\n.glyphicon-music:before {\n  content: \"\\e002\";\n}\n.glyphicon-search:before {\n  content: \"\\e003\";\n}\n.glyphicon-heart:before {\n  content: \"\\e005\";\n}\n.glyphicon-star:before {\n  content: \"\\e006\";\n}\n.glyphicon-star-empty:before {\n  content: \"\\e007\";\n}\n.glyphicon-user:before {\n  content: \"\\e008\";\n}\n.glyphicon-film:before {\n  content: \"\\e009\";\n}\n.glyphicon-th-large:before {\n  content: \"\\e010\";\n}\n.glyphicon-th:before {\n  content: \"\\e011\";\n}\n.glyphicon-th-list:before {\n  content: \"\\e012\";\n}\n.glyphicon-ok:before {\n  content: \"\\e013\";\n}\n.glyphicon-remove:before {\n  content: \"\\e014\";\n}\n.glyphicon-zoom-in:before {\n  content: \"\\e015\";\n}\n.glyphicon-zoom-out:before {\n  content: \"\\e016\";\n}\n.glyphicon-off:before {\n  content: \"\\e017\";\n}\n.glyphicon-signal:before {\n  content: \"\\e018\";\n}\n.glyphicon-cog:before {\n  content: \"\\e019\";\n}\n.glyphicon-trash:before {\n  content: \"\\e020\";\n}\n.glyphicon-home:before {\n  content: \"\\e021\";\n}\n.glyphicon-file:before {\n  content: \"\\e022\";\n}\n.glyphicon-time:before {\n  content: \"\\e023\";\n}\n.glyphicon-road:before {\n  content: \"\\e024\";\n}\n.glyphicon-download-alt:before {\n  content: \"\\e025\";\n}\n.glyphicon-download:before {\n  content: \"\\e026\";\n}\n.glyphicon-upload:before {\n  content: \"\\e027\";\n}\n.glyphicon-inbox:before {\n  content: \"\\e028\";\n}\n.glyphicon-play-circle:before {\n  content: \"\\e029\";\n}\n.glyphicon-repeat:before {\n  content: \"\\e030\";\n}\n.glyphicon-refresh:before {\n  content: \"\\e031\";\n}\n.glyphicon-list-alt:before {\n  content: \"\\e032\";\n}\n.glyphicon-lock:before {\n  content: \"\\e033\";\n}\n.glyphicon-flag:before {\n  content: \"\\e034\";\n}\n.glyphicon-headphones:before {\n  content: \"\\e035\";\n}\n.glyphicon-volume-off:before {\n  content: \"\\e036\";\n}\n.glyphicon-volume-down:before {\n  content: \"\\e037\";\n}\n.glyphicon-volume-up:before {\n  content: \"\\e038\";\n}\n.glyphicon-qrcode:before {\n  content: \"\\e039\";\n}\n.glyphicon-barcode:before {\n  content: \"\\e040\";\n}\n.glyphicon-tag:before {\n  content: \"\\e041\";\n}\n.glyphicon-tags:before {\n  content: \"\\e042\";\n}\n.glyphicon-book:before {\n  content: \"\\e043\";\n}\n.glyphicon-bookmark:before {\n  content: \"\\e044\";\n}\n.glyphicon-print:before {\n  content: \"\\e045\";\n}\n.glyphicon-camera:before {\n  content: \"\\e046\";\n}\n.glyphicon-font:before {\n  content: \"\\e047\";\n}\n.glyphicon-bold:before {\n  content: \"\\e048\";\n}\n.glyphicon-italic:before {\n  content: \"\\e049\";\n}\n.glyphicon-text-height:before {\n  content: \"\\e050\";\n}\n.glyphicon-text-width:before {\n  content: \"\\e051\";\n}\n.glyphicon-align-left:before {\n  content: \"\\e052\";\n}\n.glyphicon-align-center:before {\n  content: \"\\e053\";\n}\n.glyphicon-align-right:before {\n  content: \"\\e054\";\n}\n.glyphicon-align-justify:before {\n  content: \"\\e055\";\n}\n.glyphicon-list:before {\n  content: \"\\e056\";\n}\n.glyphicon-indent-left:before {\n  content: \"\\e057\";\n}\n.glyphicon-indent-right:before {\n  content: \"\\e058\";\n}\n.glyphicon-facetime-video:before {\n  content: \"\\e059\";\n}\n.glyphicon-picture:before {\n  content: \"\\e060\";\n}\n.glyphicon-map-marker:before {\n  content: \"\\e062\";\n}\n.glyphicon-adjust:before {\n  content: \"\\e063\";\n}\n.glyphicon-tint:before {\n  content: \"\\e064\";\n}\n.glyphicon-edit:before {\n  content: \"\\e065\";\n}\n.glyphicon-share:before {\n  content: \"\\e066\";\n}\n.glyphicon-check:before {\n  content: \"\\e067\";\n}\n.glyphicon-move:before {\n  content: \"\\e068\";\n}\n.glyphicon-step-backward:before {\n  content: \"\\e069\";\n}\n.glyphicon-fast-backward:before {\n  content: \"\\e070\";\n}\n.glyphicon-backward:before {\n  content: \"\\e071\";\n}\n.glyphicon-play:before {\n  content: \"\\e072\";\n}\n.glyphicon-pause:before {\n  content: \"\\e073\";\n}\n.glyphicon-stop:before {\n  content: \"\\e074\";\n}\n.glyphicon-forward:before {\n  content: \"\\e075\";\n}\n.glyphicon-fast-forward:before {\n  content: \"\\e076\";\n}\n.glyphicon-step-forward:before {\n  content: \"\\e077\";\n}\n.glyphicon-eject:before {\n  content: \"\\e078\";\n}\n.glyphicon-chevron-left:before {\n  content: \"\\e079\";\n}\n.glyphicon-chevron-right:before {\n  content: \"\\e080\";\n}\n.glyphicon-plus-sign:before {\n  content: \"\\e081\";\n}\n.glyphicon-minus-sign:before {\n  content: \"\\e082\";\n}\n.glyphicon-remove-sign:before {\n  content: \"\\e083\";\n}\n.glyphicon-ok-sign:before {\n  content: \"\\e084\";\n}\n.glyphicon-question-sign:before {\n  content: \"\\e085\";\n}\n.glyphicon-info-sign:before {\n  content: \"\\e086\";\n}\n.glyphicon-screenshot:before {\n  content: \"\\e087\";\n}\n.glyphicon-remove-circle:before {\n  content: \"\\e088\";\n}\n.glyphicon-ok-circle:before {\n  content: \"\\e089\";\n}\n.glyphicon-ban-circle:before {\n  content: \"\\e090\";\n}\n.glyphicon-arrow-left:before {\n  content: \"\\e091\";\n}\n.glyphicon-arrow-right:before {\n  content: \"\\e092\";\n}\n.glyphicon-arrow-up:before {\n  content: \"\\e093\";\n}\n.glyphicon-arrow-down:before {\n  content: \"\\e094\";\n}\n.glyphicon-share-alt:before {\n  content: \"\\e095\";\n}\n.glyphicon-resize-full:before {\n  content: \"\\e096\";\n}\n.glyphicon-resize-small:before {\n  content: \"\\e097\";\n}\n.glyphicon-exclamation-sign:before {\n  content: \"\\e101\";\n}\n.glyphicon-gift:before {\n  content: \"\\e102\";\n}\n.glyphicon-leaf:before {\n  content: \"\\e103\";\n}\n.glyphicon-fire:before {\n  content: \"\\e104\";\n}\n.glyphicon-eye-open:before {\n  content: \"\\e105\";\n}\n.glyphicon-eye-close:before {\n  content: \"\\e106\";\n}\n.glyphicon-warning-sign:before {\n  content: \"\\e107\";\n}\n.glyphicon-plane:before {\n  content: \"\\e108\";\n}\n.glyphicon-calendar:before {\n  content: \"\\e109\";\n}\n.glyphicon-random:before {\n  content: \"\\e110\";\n}\n.glyphicon-comment:before {\n  content: \"\\e111\";\n}\n.glyphicon-magnet:before {\n  content: \"\\e112\";\n}\n.glyphicon-chevron-up:before {\n  content: \"\\e113\";\n}\n.glyphicon-chevron-down:before {\n  content: \"\\e114\";\n}\n.glyphicon-retweet:before {\n  content: \"\\e115\";\n}\n.glyphicon-shopping-cart:before {\n  content: \"\\e116\";\n}\n.glyphicon-folder-close:before {\n  content: \"\\e117\";\n}\n.glyphicon-folder-open:before {\n  content: \"\\e118\";\n}\n.glyphicon-resize-vertical:before {\n  content: \"\\e119\";\n}\n.glyphicon-resize-horizontal:before {\n  content: \"\\e120\";\n}\n.glyphicon-hdd:before {\n  content: \"\\e121\";\n}\n.glyphicon-bullhorn:before {\n  content: \"\\e122\";\n}\n.glyphicon-bell:before {\n  content: \"\\e123\";\n}\n.glyphicon-certificate:before {\n  content: \"\\e124\";\n}\n.glyphicon-thumbs-up:before {\n  content: \"\\e125\";\n}\n.glyphicon-thumbs-down:before {\n  content: \"\\e126\";\n}\n.glyphicon-hand-right:before {\n  content: \"\\e127\";\n}\n.glyphicon-hand-left:before {\n  content: \"\\e128\";\n}\n.glyphicon-hand-up:before {\n  content: \"\\e129\";\n}\n.glyphicon-hand-down:before {\n  content: \"\\e130\";\n}\n.glyphicon-circle-arrow-right:before {\n  content: \"\\e131\";\n}\n.glyphicon-circle-arrow-left:before {\n  content: \"\\e132\";\n}\n.glyphicon-circle-arrow-up:before {\n  content: \"\\e133\";\n}\n.glyphicon-circle-arrow-down:before {\n  content: \"\\e134\";\n}\n.glyphicon-globe:before {\n  content: \"\\e135\";\n}\n.glyphicon-wrench:before {\n  content: \"\\e136\";\n}\n.glyphicon-tasks:before {\n  content: \"\\e137\";\n}\n.glyphicon-filter:before {\n  content: \"\\e138\";\n}\n.glyphicon-briefcase:before {\n  content: \"\\e139\";\n}\n.glyphicon-fullscreen:before {\n  content: \"\\e140\";\n}\n.glyphicon-dashboard:before {\n  content: \"\\e141\";\n}\n.glyphicon-paperclip:before {\n  content: \"\\e142\";\n}\n.glyphicon-heart-empty:before {\n  content: \"\\e143\";\n}\n.glyphicon-link:before {\n  content: \"\\e144\";\n}\n.glyphicon-phone:before {\n  content: \"\\e145\";\n}\n.glyphicon-pushpin:before {\n  content: \"\\e146\";\n}\n.glyphicon-usd:before {\n  content: \"\\e148\";\n}\n.glyphicon-gbp:before {\n  content: \"\\e149\";\n}\n.glyphicon-sort:before {\n  content: \"\\e150\";\n}\n.glyphicon-sort-by-alphabet:before {\n  content: \"\\e151\";\n}\n.glyphicon-sort-by-alphabet-alt:before {\n  content: \"\\e152\";\n}\n.glyphicon-sort-by-order:before {\n  content: \"\\e153\";\n}\n.glyphicon-sort-by-order-alt:before {\n  content: \"\\e154\";\n}\n.glyphicon-sort-by-attributes:before {\n  content: \"\\e155\";\n}\n.glyphicon-sort-by-attributes-alt:before {\n  content: \"\\e156\";\n}\n.glyphicon-unchecked:before {\n  content: \"\\e157\";\n}\n.glyphicon-expand:before {\n  content: \"\\e158\";\n}\n.glyphicon-collapse-down:before {\n  content: \"\\e159\";\n}\n.glyphicon-collapse-up:before {\n  content: \"\\e160\";\n}\n.glyphicon-log-in:before {\n  content: \"\\e161\";\n}\n.glyphicon-flash:before {\n  content: \"\\e162\";\n}\n.glyphicon-log-out:before {\n  content: \"\\e163\";\n}\n.glyphicon-new-window:before {\n  content: \"\\e164\";\n}\n.glyphicon-record:before {\n  content: \"\\e165\";\n}\n.glyphicon-save:before {\n  content: \"\\e166\";\n}\n.glyphicon-open:before {\n  content: \"\\e167\";\n}\n.glyphicon-saved:before {\n  content: \"\\e168\";\n}\n.glyphicon-import:before {\n  content: \"\\e169\";\n}\n.glyphicon-export:before {\n  content: \"\\e170\";\n}\n.glyphicon-send:before {\n  content: \"\\e171\";\n}\n.glyphicon-floppy-disk:before {\n  content: \"\\e172\";\n}\n.glyphicon-floppy-saved:before {\n  content: \"\\e173\";\n}\n.glyphicon-floppy-remove:before {\n  content: \"\\e174\";\n}\n.glyphicon-floppy-save:before {\n  content: \"\\e175\";\n}\n.glyphicon-floppy-open:before {\n  content: \"\\e176\";\n}\n.glyphicon-credit-card:before {\n  content: \"\\e177\";\n}\n.glyphicon-transfer:before {\n  content: \"\\e178\";\n}\n.glyphicon-cutlery:before {\n  content: \"\\e179\";\n}\n.glyphicon-header:before {\n  content: \"\\e180\";\n}\n.glyphicon-compressed:before {\n  content: \"\\e181\";\n}\n.glyphicon-earphone:before {\n  content: \"\\e182\";\n}\n.glyphicon-phone-alt:before {\n  content: \"\\e183\";\n}\n.glyphicon-tower:before {\n  content: \"\\e184\";\n}\n.glyphicon-stats:before {\n  content: \"\\e185\";\n}\n.glyphicon-sd-video:before {\n  content: \"\\e186\";\n}\n.glyphicon-hd-video:before {\n  content: \"\\e187\";\n}\n.glyphicon-subtitles:before {\n  content: \"\\e188\";\n}\n.glyphicon-sound-stereo:before {\n  content: \"\\e189\";\n}\n.glyphicon-sound-dolby:before {\n  content: \"\\e190\";\n}\n.glyphicon-sound-5-1:before {\n  content: \"\\e191\";\n}\n.glyphicon-sound-6-1:before {\n  content: \"\\e192\";\n}\n.glyphicon-sound-7-1:before {\n  content: \"\\e193\";\n}\n.glyphicon-copyright-mark:before {\n  content: \"\\e194\";\n}\n.glyphicon-registration-mark:before {\n  content: \"\\e195\";\n}\n.glyphicon-cloud-download:before {\n  content: \"\\e197\";\n}\n.glyphicon-cloud-upload:before {\n  content: \"\\e198\";\n}\n.glyphicon-tree-conifer:before {\n  content: \"\\e199\";\n}\n.glyphicon-tree-deciduous:before {\n  content: \"\\e200\";\n}\n.glyphicon-cd:before {\n  content: \"\\e201\";\n}\n.glyphicon-save-file:before {\n  content: \"\\e202\";\n}\n.glyphicon-open-file:before {\n  content: \"\\e203\";\n}\n.glyphicon-level-up:before {\n  content: \"\\e204\";\n}\n.glyphicon-copy:before {\n  content: \"\\e205\";\n}\n.glyphicon-paste:before {\n  content: \"\\e206\";\n}\n.glyphicon-alert:before {\n  content: \"\\e209\";\n}\n.glyphicon-equalizer:before {\n  content: \"\\e210\";\n}\n.glyphicon-king:before {\n  content: \"\\e211\";\n}\n.glyphicon-queen:before {\n  content: \"\\e212\";\n}\n.glyphicon-pawn:before {\n  content: \"\\e213\";\n}\n.glyphicon-bishop:before {\n  content: \"\\e214\";\n}\n.glyphicon-knight:before {\n  content: \"\\e215\";\n}\n.glyphicon-baby-formula:before {\n  content: \"\\e216\";\n}\n.glyphicon-tent:before {\n  content: \"\\26fa\";\n}\n.glyphicon-blackboard:before {\n  content: \"\\e218\";\n}\n.glyphicon-bed:before {\n  content: \"\\e219\";\n}\n.glyphicon-apple:before {\n  content: \"\\f8ff\";\n}\n.glyphicon-erase:before {\n  content: \"\\e221\";\n}\n.glyphicon-hourglass:before {\n  content: \"\\231b\";\n}\n.glyphicon-lamp:before {\n  content: \"\\e223\";\n}\n.glyphicon-duplicate:before {\n  content: \"\\e224\";\n}\n.glyphicon-piggy-bank:before {\n  content: \"\\e225\";\n}\n.glyphicon-scissors:before {\n  content: \"\\e226\";\n}\n.glyphicon-bitcoin:before {\n  content: \"\\e227\";\n}\n.glyphicon-btc:before {\n  content: \"\\e227\";\n}\n.glyphicon-xbt:before {\n  content: \"\\e227\";\n}\n.glyphicon-yen:before {\n  content: \"\\00a5\";\n}\n.glyphicon-jpy:before {\n  content: \"\\00a5\";\n}\n.glyphicon-ruble:before {\n  content: \"\\20bd\";\n}\n.glyphicon-rub:before {\n  content: \"\\20bd\";\n}\n.glyphicon-scale:before {\n  content: \"\\e230\";\n}\n.glyphicon-ice-lolly:before {\n  content: \"\\e231\";\n}\n.glyphicon-ice-lolly-tasted:before {\n  content: \"\\e232\";\n}\n.glyphicon-education:before {\n  content: \"\\e233\";\n}\n.glyphicon-option-horizontal:before {\n  content: \"\\e234\";\n}\n.glyphicon-option-vertical:before {\n  content: \"\\e235\";\n}\n.glyphicon-menu-hamburger:before {\n  content: \"\\e236\";\n}\n.glyphicon-modal-window:before {\n  content: \"\\e237\";\n}\n.glyphicon-oil:before {\n  content: \"\\e238\";\n}\n.glyphicon-grain:before {\n  content: \"\\e239\";\n}\n.glyphicon-sunglasses:before {\n  content: \"\\e240\";\n}\n.glyphicon-text-size:before {\n  content: \"\\e241\";\n}\n.glyphicon-text-color:before {\n  content: \"\\e242\";\n}\n.glyphicon-text-background:before {\n  content: \"\\e243\";\n}\n.glyphicon-object-align-top:before {\n  content: \"\\e244\";\n}\n.glyphicon-object-align-bottom:before {\n  content: \"\\e245\";\n}\n.glyphicon-object-align-horizontal:before {\n  content: \"\\e246\";\n}\n.glyphicon-object-align-left:before {\n  content: \"\\e247\";\n}\n.glyphicon-object-align-vertical:before {\n  content: \"\\e248\";\n}\n.glyphicon-object-align-right:before {\n  content: \"\\e249\";\n}\n.glyphicon-triangle-right:before {\n  content: \"\\e250\";\n}\n.glyphicon-triangle-left:before {\n  content: \"\\e251\";\n}\n.glyphicon-triangle-bottom:before {\n  content: \"\\e252\";\n}\n.glyphicon-triangle-top:before {\n  content: \"\\e253\";\n}\n.glyphicon-console:before {\n  content: \"\\e254\";\n}\n.glyphicon-superscript:before {\n  content: \"\\e255\";\n}\n.glyphicon-subscript:before {\n  content: \"\\e256\";\n}\n.glyphicon-menu-left:before {\n  content: \"\\e257\";\n}\n.glyphicon-menu-right:before {\n  content: \"\\e258\";\n}\n.glyphicon-menu-down:before {\n  content: \"\\e259\";\n}\n.glyphicon-menu-up:before {\n  content: \"\\e260\";\n}\n* {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n*:before,\n*:after {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\nhtml {\n  font-size: 10px;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n}\nbody {\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 14px;\n  line-height: 1.42857143;\n  color: #333333;\n  background-color: #fff;\n}\ninput,\nbutton,\nselect,\ntextarea {\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit;\n}\na {\n  color: #337ab7;\n  text-decoration: none;\n}\na:hover,\na:focus {\n  color: #22527b;\n  text-decoration: underline;\n}\na:focus {\n  outline: thin dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\nfigure {\n  margin: 0;\n}\nimg {\n  vertical-align: middle;\n}\n.img-responsive,\n.thumbnail > img,\n.thumbnail a > img,\n.carousel-inner > .item > img,\n.carousel-inner > .item > a > img {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n.img-rounded {\n  border-radius: 6px;\n}\n.img-thumbnail {\n  padding: 4px;\n  line-height: 1.42857143;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  -webkit-transition: all 0.2s ease-in-out;\n  -o-transition: all 0.2s ease-in-out;\n  transition: all 0.2s ease-in-out;\n  display: inline-block;\n  max-width: 100%;\n  height: auto;\n}\n.img-circle {\n  border-radius: 50%;\n}\nhr {\n  margin-top: 20px;\n  margin-bottom: 20px;\n  border: 0;\n  border-top: 1px solid #eee;\n}\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  margin: -1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n}\n.sr-only-focusable:active,\n.sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  clip: auto;\n}\n[role=\"button\"] {\n  cursor: pointer;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\n.h1,\n.h2,\n.h3,\n.h4,\n.h5,\n.h6 {\n  font-family: inherit;\n  font-weight: 500;\n  line-height: 1.1;\n  color: inherit;\n}\nh1 small,\nh2 small,\nh3 small,\nh4 small,\nh5 small,\nh6 small,\n.h1 small,\n.h2 small,\n.h3 small,\n.h4 small,\n.h5 small,\n.h6 small,\nh1 .small,\nh2 .small,\nh3 .small,\nh4 .small,\nh5 .small,\nh6 .small,\n.h1 .small,\n.h2 .small,\n.h3 .small,\n.h4 .small,\n.h5 .small,\n.h6 .small {\n  font-weight: normal;\n  line-height: 1;\n  color: #ccc;\n}\nh1,\n.h1,\nh2,\n.h2,\nh3,\n.h3 {\n  margin-top: 20px;\n  margin-bottom: 10px;\n}\nh1 small,\n.h1 small,\nh2 small,\n.h2 small,\nh3 small,\n.h3 small,\nh1 .small,\n.h1 .small,\nh2 .small,\n.h2 .small,\nh3 .small,\n.h3 .small {\n  font-size: 65%;\n}\nh4,\n.h4,\nh5,\n.h5,\nh6,\n.h6 {\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\nh4 small,\n.h4 small,\nh5 small,\n.h5 small,\nh6 small,\n.h6 small,\nh4 .small,\n.h4 .small,\nh5 .small,\n.h5 .small,\nh6 .small,\n.h6 .small {\n  font-size: 75%;\n}\nh1,\n.h1 {\n  font-size: 36px;\n}\nh2,\n.h2 {\n  font-size: 30px;\n}\nh3,\n.h3 {\n  font-size: 24px;\n}\nh4,\n.h4 {\n  font-size: 18px;\n}\nh5,\n.h5 {\n  font-size: 14px;\n}\nh6,\n.h6 {\n  font-size: 12px;\n}\np {\n  margin: 0 0 10px;\n}\n.lead {\n  margin-bottom: 20px;\n  font-size: 16px;\n  font-weight: 300;\n  line-height: 1.4;\n}\n@media (min-width: 768px) {\n  .lead {\n    font-size: 21px;\n  }\n}\nsmall,\n.small {\n  font-size: 85%;\n}\nmark,\n.mark {\n  background-color: #fcf8e3;\n  padding: .2em;\n}\n.text-left {\n  text-align: left;\n}\n.text-right {\n  text-align: right;\n}\n.text-center {\n  text-align: center;\n}\n.text-justify {\n  text-align: justify;\n}\n.text-nowrap {\n  white-space: nowrap;\n}\n.text-lowercase {\n  text-transform: lowercase;\n}\n.text-uppercase {\n  text-transform: uppercase;\n}\n.text-capitalize {\n  text-transform: capitalize;\n}\n.text-muted {\n  color: #ccc;\n}\n.text-primary {\n  color: #337ab7;\n}\na.text-primary:hover,\na.text-primary:focus {\n  color: #285f8f;\n}\n.text-success {\n  color: #2b9b5f;\n}\na.text-success:hover,\na.text-success:focus {\n  color: #207347;\n}\n.text-info {\n  color: #c1d7e9;\n}\na.text-info:hover,\na.text-info:focus {\n  color: #9bbfdc;\n}\n.text-warning {\n  color: #8a6d3b;\n}\na.text-warning:hover,\na.text-warning:focus {\n  color: #66512c;\n}\n.text-danger {\n  color: #d9534f;\n}\na.text-danger:hover,\na.text-danger:focus {\n  color: #c9302c;\n}\n.bg-primary {\n  color: #fff;\n  background-color: #337ab7;\n}\na.bg-primary:hover,\na.bg-primary:focus {\n  background-color: #285f8f;\n}\n.bg-success {\n  background-color: #dff0d8;\n}\na.bg-success:hover,\na.bg-success:focus {\n  background-color: #c1e2b3;\n}\n.bg-info {\n  background-color: #d9edf7;\n}\na.bg-info:hover,\na.bg-info:focus {\n  background-color: #afd9ee;\n}\n.bg-warning {\n  background-color: #fcf8e3;\n}\na.bg-warning:hover,\na.bg-warning:focus {\n  background-color: #f7ecb5;\n}\n.bg-danger {\n  background-color: #f2dede;\n}\na.bg-danger:hover,\na.bg-danger:focus {\n  background-color: #e4b9b9;\n}\n.page-header {\n  padding-bottom: 9px;\n  margin: 40px 0 20px;\n  border-bottom: 1px solid #eee;\n}\nul,\nol {\n  margin-top: 0;\n  margin-bottom: 10px;\n}\nul ul,\nol ul,\nul ol,\nol ol {\n  margin-bottom: 0;\n}\n.list-unstyled {\n  padding-left: 0;\n  list-style: none;\n}\n.list-inline {\n  padding-left: 0;\n  list-style: none;\n  margin-left: -5px;\n}\n.list-inline > li {\n  display: inline-block;\n  padding-left: 5px;\n  padding-right: 5px;\n}\ndl {\n  margin-top: 0;\n  margin-bottom: 20px;\n}\ndt,\ndd {\n  line-height: 1.42857143;\n}\ndt {\n  font-weight: bold;\n}\ndd {\n  margin-left: 0;\n}\n@media (min-width: 768px) {\n  .dl-horizontal dt {\n    float: left;\n    width: 160px;\n    clear: left;\n    text-align: right;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n  .dl-horizontal dd {\n    margin-left: 180px;\n  }\n}\nabbr[title],\nabbr[data-original-title] {\n  cursor: help;\n  border-bottom: 1px dotted #ccc;\n}\n.initialism {\n  font-size: 90%;\n  text-transform: uppercase;\n}\nblockquote {\n  padding: 10px 20px;\n  margin: 0 0 20px;\n  font-size: 17.5px;\n  border-left: 5px solid #eee;\n}\nblockquote p:last-child,\nblockquote ul:last-child,\nblockquote ol:last-child {\n  margin-bottom: 0;\n}\nblockquote footer,\nblockquote small,\nblockquote .small {\n  display: block;\n  font-size: 80%;\n  line-height: 1.42857143;\n  color: #ccc;\n}\nblockquote footer:before,\nblockquote small:before,\nblockquote .small:before {\n  content: '\\2014 \\00A0';\n}\n.blockquote-reverse,\nblockquote.pull-right {\n  padding-right: 15px;\n  padding-left: 0;\n  border-right: 5px solid #eee;\n  border-left: 0;\n  text-align: right;\n}\n.blockquote-reverse footer:before,\nblockquote.pull-right footer:before,\n.blockquote-reverse small:before,\nblockquote.pull-right small:before,\n.blockquote-reverse .small:before,\nblockquote.pull-right .small:before {\n  content: '';\n}\n.blockquote-reverse footer:after,\nblockquote.pull-right footer:after,\n.blockquote-reverse small:after,\nblockquote.pull-right small:after,\n.blockquote-reverse .small:after,\nblockquote.pull-right .small:after {\n  content: '\\00A0 \\2014';\n}\naddress {\n  margin-bottom: 20px;\n  font-style: normal;\n  line-height: 1.42857143;\n}\ncode,\nkbd,\npre,\nsamp {\n  font-family: Menlo, Monaco, Consolas, \"Courier New\", monospace;\n}\ncode {\n  padding: 2px 4px;\n  font-size: 90%;\n  color: #d9534f;\n  background-color: #f9f2f4;\n  border-radius: 4px;\n}\nkbd {\n  padding: 2px 4px;\n  font-size: 90%;\n  color: #fff;\n  background-color: #333;\n  border-radius: 3px;\n  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.25);\n}\nkbd kbd {\n  padding: 0;\n  font-size: 100%;\n  font-weight: bold;\n  box-shadow: none;\n}\npre {\n  display: block;\n  padding: 9.5px;\n  margin: 0 0 10px;\n  font-size: 13px;\n  line-height: 1.42857143;\n  word-break: break-all;\n  word-wrap: break-word;\n  color: #333333;\n  background-color: #f5f5f5;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n}\npre code {\n  padding: 0;\n  font-size: inherit;\n  color: inherit;\n  white-space: pre-wrap;\n  background-color: transparent;\n  border-radius: 0;\n}\n.pre-scrollable {\n  max-height: 340px;\n  overflow-y: scroll;\n}\n.container {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left: 15px;\n  padding-right: 15px;\n}\n@media (min-width: 768px) {\n  .container {\n    width: 750px;\n  }\n}\n@media (min-width: 992px) {\n  .container {\n    width: 970px;\n  }\n}\n@media (min-width: 1200px) {\n  .container {\n    width: 1170px;\n  }\n}\n.container-fluid {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left: 15px;\n  padding-right: 15px;\n}\n.row {\n  margin-left: -15px;\n  margin-right: -15px;\n}\n.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {\n  position: relative;\n  min-height: 1px;\n  padding-left: 15px;\n  padding-right: 15px;\n}\n.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {\n  float: left;\n}\n.col-xs-12 {\n  width: 100%;\n}\n.col-xs-11 {\n  width: 91.66666667%;\n}\n.col-xs-10 {\n  width: 83.33333333%;\n}\n.col-xs-9 {\n  width: 75%;\n}\n.col-xs-8 {\n  width: 66.66666667%;\n}\n.col-xs-7 {\n  width: 58.33333333%;\n}\n.col-xs-6 {\n  width: 50%;\n}\n.col-xs-5 {\n  width: 41.66666667%;\n}\n.col-xs-4 {\n  width: 33.33333333%;\n}\n.col-xs-3 {\n  width: 25%;\n}\n.col-xs-2 {\n  width: 16.66666667%;\n}\n.col-xs-1 {\n  width: 8.33333333%;\n}\n.col-xs-pull-12 {\n  right: 100%;\n}\n.col-xs-pull-11 {\n  right: 91.66666667%;\n}\n.col-xs-pull-10 {\n  right: 83.33333333%;\n}\n.col-xs-pull-9 {\n  right: 75%;\n}\n.col-xs-pull-8 {\n  right: 66.66666667%;\n}\n.col-xs-pull-7 {\n  right: 58.33333333%;\n}\n.col-xs-pull-6 {\n  right: 50%;\n}\n.col-xs-pull-5 {\n  right: 41.66666667%;\n}\n.col-xs-pull-4 {\n  right: 33.33333333%;\n}\n.col-xs-pull-3 {\n  right: 25%;\n}\n.col-xs-pull-2 {\n  right: 16.66666667%;\n}\n.col-xs-pull-1 {\n  right: 8.33333333%;\n}\n.col-xs-pull-0 {\n  right: auto;\n}\n.col-xs-push-12 {\n  left: 100%;\n}\n.col-xs-push-11 {\n  left: 91.66666667%;\n}\n.col-xs-push-10 {\n  left: 83.33333333%;\n}\n.col-xs-push-9 {\n  left: 75%;\n}\n.col-xs-push-8 {\n  left: 66.66666667%;\n}\n.col-xs-push-7 {\n  left: 58.33333333%;\n}\n.col-xs-push-6 {\n  left: 50%;\n}\n.col-xs-push-5 {\n  left: 41.66666667%;\n}\n.col-xs-push-4 {\n  left: 33.33333333%;\n}\n.col-xs-push-3 {\n  left: 25%;\n}\n.col-xs-push-2 {\n  left: 16.66666667%;\n}\n.col-xs-push-1 {\n  left: 8.33333333%;\n}\n.col-xs-push-0 {\n  left: auto;\n}\n.col-xs-offset-12 {\n  margin-left: 100%;\n}\n.col-xs-offset-11 {\n  margin-left: 91.66666667%;\n}\n.col-xs-offset-10 {\n  margin-left: 83.33333333%;\n}\n.col-xs-offset-9 {\n  margin-left: 75%;\n}\n.col-xs-offset-8 {\n  margin-left: 66.66666667%;\n}\n.col-xs-offset-7 {\n  margin-left: 58.33333333%;\n}\n.col-xs-offset-6 {\n  margin-left: 50%;\n}\n.col-xs-offset-5 {\n  margin-left: 41.66666667%;\n}\n.col-xs-offset-4 {\n  margin-left: 33.33333333%;\n}\n.col-xs-offset-3 {\n  margin-left: 25%;\n}\n.col-xs-offset-2 {\n  margin-left: 16.66666667%;\n}\n.col-xs-offset-1 {\n  margin-left: 8.33333333%;\n}\n.col-xs-offset-0 {\n  margin-left: 0%;\n}\n@media (min-width: 768px) {\n  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {\n    float: left;\n  }\n  .col-sm-12 {\n    width: 100%;\n  }\n  .col-sm-11 {\n    width: 91.66666667%;\n  }\n  .col-sm-10 {\n    width: 83.33333333%;\n  }\n  .col-sm-9 {\n    width: 75%;\n  }\n  .col-sm-8 {\n    width: 66.66666667%;\n  }\n  .col-sm-7 {\n    width: 58.33333333%;\n  }\n  .col-sm-6 {\n    width: 50%;\n  }\n  .col-sm-5 {\n    width: 41.66666667%;\n  }\n  .col-sm-4 {\n    width: 33.33333333%;\n  }\n  .col-sm-3 {\n    width: 25%;\n  }\n  .col-sm-2 {\n    width: 16.66666667%;\n  }\n  .col-sm-1 {\n    width: 8.33333333%;\n  }\n  .col-sm-pull-12 {\n    right: 100%;\n  }\n  .col-sm-pull-11 {\n    right: 91.66666667%;\n  }\n  .col-sm-pull-10 {\n    right: 83.33333333%;\n  }\n  .col-sm-pull-9 {\n    right: 75%;\n  }\n  .col-sm-pull-8 {\n    right: 66.66666667%;\n  }\n  .col-sm-pull-7 {\n    right: 58.33333333%;\n  }\n  .col-sm-pull-6 {\n    right: 50%;\n  }\n  .col-sm-pull-5 {\n    right: 41.66666667%;\n  }\n  .col-sm-pull-4 {\n    right: 33.33333333%;\n  }\n  .col-sm-pull-3 {\n    right: 25%;\n  }\n  .col-sm-pull-2 {\n    right: 16.66666667%;\n  }\n  .col-sm-pull-1 {\n    right: 8.33333333%;\n  }\n  .col-sm-pull-0 {\n    right: auto;\n  }\n  .col-sm-push-12 {\n    left: 100%;\n  }\n  .col-sm-push-11 {\n    left: 91.66666667%;\n  }\n  .col-sm-push-10 {\n    left: 83.33333333%;\n  }\n  .col-sm-push-9 {\n    left: 75%;\n  }\n  .col-sm-push-8 {\n    left: 66.66666667%;\n  }\n  .col-sm-push-7 {\n    left: 58.33333333%;\n  }\n  .col-sm-push-6 {\n    left: 50%;\n  }\n  .col-sm-push-5 {\n    left: 41.66666667%;\n  }\n  .col-sm-push-4 {\n    left: 33.33333333%;\n  }\n  .col-sm-push-3 {\n    left: 25%;\n  }\n  .col-sm-push-2 {\n    left: 16.66666667%;\n  }\n  .col-sm-push-1 {\n    left: 8.33333333%;\n  }\n  .col-sm-push-0 {\n    left: auto;\n  }\n  .col-sm-offset-12 {\n    margin-left: 100%;\n  }\n  .col-sm-offset-11 {\n    margin-left: 91.66666667%;\n  }\n  .col-sm-offset-10 {\n    margin-left: 83.33333333%;\n  }\n  .col-sm-offset-9 {\n    margin-left: 75%;\n  }\n  .col-sm-offset-8 {\n    margin-left: 66.66666667%;\n  }\n  .col-sm-offset-7 {\n    margin-left: 58.33333333%;\n  }\n  .col-sm-offset-6 {\n    margin-left: 50%;\n  }\n  .col-sm-offset-5 {\n    margin-left: 41.66666667%;\n  }\n  .col-sm-offset-4 {\n    margin-left: 33.33333333%;\n  }\n  .col-sm-offset-3 {\n    margin-left: 25%;\n  }\n  .col-sm-offset-2 {\n    margin-left: 16.66666667%;\n  }\n  .col-sm-offset-1 {\n    margin-left: 8.33333333%;\n  }\n  .col-sm-offset-0 {\n    margin-left: 0%;\n  }\n}\n@media (min-width: 992px) {\n  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {\n    float: left;\n  }\n  .col-md-12 {\n    width: 100%;\n  }\n  .col-md-11 {\n    width: 91.66666667%;\n  }\n  .col-md-10 {\n    width: 83.33333333%;\n  }\n  .col-md-9 {\n    width: 75%;\n  }\n  .col-md-8 {\n    width: 66.66666667%;\n  }\n  .col-md-7 {\n    width: 58.33333333%;\n  }\n  .col-md-6 {\n    width: 50%;\n  }\n  .col-md-5 {\n    width: 41.66666667%;\n  }\n  .col-md-4 {\n    width: 33.33333333%;\n  }\n  .col-md-3 {\n    width: 25%;\n  }\n  .col-md-2 {\n    width: 16.66666667%;\n  }\n  .col-md-1 {\n    width: 8.33333333%;\n  }\n  .col-md-pull-12 {\n    right: 100%;\n  }\n  .col-md-pull-11 {\n    right: 91.66666667%;\n  }\n  .col-md-pull-10 {\n    right: 83.33333333%;\n  }\n  .col-md-pull-9 {\n    right: 75%;\n  }\n  .col-md-pull-8 {\n    right: 66.66666667%;\n  }\n  .col-md-pull-7 {\n    right: 58.33333333%;\n  }\n  .col-md-pull-6 {\n    right: 50%;\n  }\n  .col-md-pull-5 {\n    right: 41.66666667%;\n  }\n  .col-md-pull-4 {\n    right: 33.33333333%;\n  }\n  .col-md-pull-3 {\n    right: 25%;\n  }\n  .col-md-pull-2 {\n    right: 16.66666667%;\n  }\n  .col-md-pull-1 {\n    right: 8.33333333%;\n  }\n  .col-md-pull-0 {\n    right: auto;\n  }\n  .col-md-push-12 {\n    left: 100%;\n  }\n  .col-md-push-11 {\n    left: 91.66666667%;\n  }\n  .col-md-push-10 {\n    left: 83.33333333%;\n  }\n  .col-md-push-9 {\n    left: 75%;\n  }\n  .col-md-push-8 {\n    left: 66.66666667%;\n  }\n  .col-md-push-7 {\n    left: 58.33333333%;\n  }\n  .col-md-push-6 {\n    left: 50%;\n  }\n  .col-md-push-5 {\n    left: 41.66666667%;\n  }\n  .col-md-push-4 {\n    left: 33.33333333%;\n  }\n  .col-md-push-3 {\n    left: 25%;\n  }\n  .col-md-push-2 {\n    left: 16.66666667%;\n  }\n  .col-md-push-1 {\n    left: 8.33333333%;\n  }\n  .col-md-push-0 {\n    left: auto;\n  }\n  .col-md-offset-12 {\n    margin-left: 100%;\n  }\n  .col-md-offset-11 {\n    margin-left: 91.66666667%;\n  }\n  .col-md-offset-10 {\n    margin-left: 83.33333333%;\n  }\n  .col-md-offset-9 {\n    margin-left: 75%;\n  }\n  .col-md-offset-8 {\n    margin-left: 66.66666667%;\n  }\n  .col-md-offset-7 {\n    margin-left: 58.33333333%;\n  }\n  .col-md-offset-6 {\n    margin-left: 50%;\n  }\n  .col-md-offset-5 {\n    margin-left: 41.66666667%;\n  }\n  .col-md-offset-4 {\n    margin-left: 33.33333333%;\n  }\n  .col-md-offset-3 {\n    margin-left: 25%;\n  }\n  .col-md-offset-2 {\n    margin-left: 16.66666667%;\n  }\n  .col-md-offset-1 {\n    margin-left: 8.33333333%;\n  }\n  .col-md-offset-0 {\n    margin-left: 0%;\n  }\n}\n@media (min-width: 1200px) {\n  .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {\n    float: left;\n  }\n  .col-lg-12 {\n    width: 100%;\n  }\n  .col-lg-11 {\n    width: 91.66666667%;\n  }\n  .col-lg-10 {\n    width: 83.33333333%;\n  }\n  .col-lg-9 {\n    width: 75%;\n  }\n  .col-lg-8 {\n    width: 66.66666667%;\n  }\n  .col-lg-7 {\n    width: 58.33333333%;\n  }\n  .col-lg-6 {\n    width: 50%;\n  }\n  .col-lg-5 {\n    width: 41.66666667%;\n  }\n  .col-lg-4 {\n    width: 33.33333333%;\n  }\n  .col-lg-3 {\n    width: 25%;\n  }\n  .col-lg-2 {\n    width: 16.66666667%;\n  }\n  .col-lg-1 {\n    width: 8.33333333%;\n  }\n  .col-lg-pull-12 {\n    right: 100%;\n  }\n  .col-lg-pull-11 {\n    right: 91.66666667%;\n  }\n  .col-lg-pull-10 {\n    right: 83.33333333%;\n  }\n  .col-lg-pull-9 {\n    right: 75%;\n  }\n  .col-lg-pull-8 {\n    right: 66.66666667%;\n  }\n  .col-lg-pull-7 {\n    right: 58.33333333%;\n  }\n  .col-lg-pull-6 {\n    right: 50%;\n  }\n  .col-lg-pull-5 {\n    right: 41.66666667%;\n  }\n  .col-lg-pull-4 {\n    right: 33.33333333%;\n  }\n  .col-lg-pull-3 {\n    right: 25%;\n  }\n  .col-lg-pull-2 {\n    right: 16.66666667%;\n  }\n  .col-lg-pull-1 {\n    right: 8.33333333%;\n  }\n  .col-lg-pull-0 {\n    right: auto;\n  }\n  .col-lg-push-12 {\n    left: 100%;\n  }\n  .col-lg-push-11 {\n    left: 91.66666667%;\n  }\n  .col-lg-push-10 {\n    left: 83.33333333%;\n  }\n  .col-lg-push-9 {\n    left: 75%;\n  }\n  .col-lg-push-8 {\n    left: 66.66666667%;\n  }\n  .col-lg-push-7 {\n    left: 58.33333333%;\n  }\n  .col-lg-push-6 {\n    left: 50%;\n  }\n  .col-lg-push-5 {\n    left: 41.66666667%;\n  }\n  .col-lg-push-4 {\n    left: 33.33333333%;\n  }\n  .col-lg-push-3 {\n    left: 25%;\n  }\n  .col-lg-push-2 {\n    left: 16.66666667%;\n  }\n  .col-lg-push-1 {\n    left: 8.33333333%;\n  }\n  .col-lg-push-0 {\n    left: auto;\n  }\n  .col-lg-offset-12 {\n    margin-left: 100%;\n  }\n  .col-lg-offset-11 {\n    margin-left: 91.66666667%;\n  }\n  .col-lg-offset-10 {\n    margin-left: 83.33333333%;\n  }\n  .col-lg-offset-9 {\n    margin-left: 75%;\n  }\n  .col-lg-offset-8 {\n    margin-left: 66.66666667%;\n  }\n  .col-lg-offset-7 {\n    margin-left: 58.33333333%;\n  }\n  .col-lg-offset-6 {\n    margin-left: 50%;\n  }\n  .col-lg-offset-5 {\n    margin-left: 41.66666667%;\n  }\n  .col-lg-offset-4 {\n    margin-left: 33.33333333%;\n  }\n  .col-lg-offset-3 {\n    margin-left: 25%;\n  }\n  .col-lg-offset-2 {\n    margin-left: 16.66666667%;\n  }\n  .col-lg-offset-1 {\n    margin-left: 8.33333333%;\n  }\n  .col-lg-offset-0 {\n    margin-left: 0%;\n  }\n}\ntable {\n  background-color: transparent;\n}\ncaption {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  color: #ccc;\n  text-align: left;\n}\nth {\n  text-align: left;\n}\n.table {\n  width: 100%;\n  max-width: 100%;\n  margin-bottom: 20px;\n}\n.table > thead > tr > th,\n.table > tbody > tr > th,\n.table > tfoot > tr > th,\n.table > thead > tr > td,\n.table > tbody > tr > td,\n.table > tfoot > tr > td {\n  padding: 8px;\n  line-height: 1.42857143;\n  vertical-align: top;\n  border-top: 1px solid #ccc;\n}\n.table > thead > tr > th {\n  vertical-align: bottom;\n  border-bottom: 2px solid #ccc;\n}\n.table > caption + thead > tr:first-child > th,\n.table > colgroup + thead > tr:first-child > th,\n.table > thead:first-child > tr:first-child > th,\n.table > caption + thead > tr:first-child > td,\n.table > colgroup + thead > tr:first-child > td,\n.table > thead:first-child > tr:first-child > td {\n  border-top: 0;\n}\n.table > tbody + tbody {\n  border-top: 2px solid #ccc;\n}\n.table .table {\n  background-color: #fff;\n}\n.table-condensed > thead > tr > th,\n.table-condensed > tbody > tr > th,\n.table-condensed > tfoot > tr > th,\n.table-condensed > thead > tr > td,\n.table-condensed > tbody > tr > td,\n.table-condensed > tfoot > tr > td {\n  padding: 5px;\n}\n.table-bordered {\n  border: 1px solid #ccc;\n}\n.table-bordered > thead > tr > th,\n.table-bordered > tbody > tr > th,\n.table-bordered > tfoot > tr > th,\n.table-bordered > thead > tr > td,\n.table-bordered > tbody > tr > td,\n.table-bordered > tfoot > tr > td {\n  border: 1px solid #ccc;\n}\n.table-bordered > thead > tr > th,\n.table-bordered > thead > tr > td {\n  border-bottom-width: 2px;\n}\n.table-striped > tbody > tr:nth-of-type(odd) {\n  background-color: #f9f9f9;\n}\n.table-hover > tbody > tr:hover {\n  background-color: #f5f5f5;\n}\ntable col[class*=\"col-\"] {\n  position: static;\n  float: none;\n  display: table-column;\n}\ntable td[class*=\"col-\"],\ntable th[class*=\"col-\"] {\n  position: static;\n  float: none;\n  display: table-cell;\n}\n.table > thead > tr > td.active,\n.table > tbody > tr > td.active,\n.table > tfoot > tr > td.active,\n.table > thead > tr > th.active,\n.table > tbody > tr > th.active,\n.table > tfoot > tr > th.active,\n.table > thead > tr.active > td,\n.table > tbody > tr.active > td,\n.table > tfoot > tr.active > td,\n.table > thead > tr.active > th,\n.table > tbody > tr.active > th,\n.table > tfoot > tr.active > th {\n  background-color: #f5f5f5;\n}\n.table-hover > tbody > tr > td.active:hover,\n.table-hover > tbody > tr > th.active:hover,\n.table-hover > tbody > tr.active:hover > td,\n.table-hover > tbody > tr:hover > .active,\n.table-hover > tbody > tr.active:hover > th {\n  background-color: #e8e8e8;\n}\n.table > thead > tr > td.success,\n.table > tbody > tr > td.success,\n.table > tfoot > tr > td.success,\n.table > thead > tr > th.success,\n.table > tbody > tr > th.success,\n.table > tfoot > tr > th.success,\n.table > thead > tr.success > td,\n.table > tbody > tr.success > td,\n.table > tfoot > tr.success > td,\n.table > thead > tr.success > th,\n.table > tbody > tr.success > th,\n.table > tfoot > tr.success > th {\n  background-color: #dff0d8;\n}\n.table-hover > tbody > tr > td.success:hover,\n.table-hover > tbody > tr > th.success:hover,\n.table-hover > tbody > tr.success:hover > td,\n.table-hover > tbody > tr:hover > .success,\n.table-hover > tbody > tr.success:hover > th {\n  background-color: #d0e9c6;\n}\n.table > thead > tr > td.info,\n.table > tbody > tr > td.info,\n.table > tfoot > tr > td.info,\n.table > thead > tr > th.info,\n.table > tbody > tr > th.info,\n.table > tfoot > tr > th.info,\n.table > thead > tr.info > td,\n.table > tbody > tr.info > td,\n.table > tfoot > tr.info > td,\n.table > thead > tr.info > th,\n.table > tbody > tr.info > th,\n.table > tfoot > tr.info > th {\n  background-color: #d9edf7;\n}\n.table-hover > tbody > tr > td.info:hover,\n.table-hover > tbody > tr > th.info:hover,\n.table-hover > tbody > tr.info:hover > td,\n.table-hover > tbody > tr:hover > .info,\n.table-hover > tbody > tr.info:hover > th {\n  background-color: #c4e3f3;\n}\n.table > thead > tr > td.warning,\n.table > tbody > tr > td.warning,\n.table > tfoot > tr > td.warning,\n.table > thead > tr > th.warning,\n.table > tbody > tr > th.warning,\n.table > tfoot > tr > th.warning,\n.table > thead > tr.warning > td,\n.table > tbody > tr.warning > td,\n.table > tfoot > tr.warning > td,\n.table > thead > tr.warning > th,\n.table > tbody > tr.warning > th,\n.table > tfoot > tr.warning > th {\n  background-color: #fcf8e3;\n}\n.table-hover > tbody > tr > td.warning:hover,\n.table-hover > tbody > tr > th.warning:hover,\n.table-hover > tbody > tr.warning:hover > td,\n.table-hover > tbody > tr:hover > .warning,\n.table-hover > tbody > tr.warning:hover > th {\n  background-color: #faf2cc;\n}\n.table > thead > tr > td.danger,\n.table > tbody > tr > td.danger,\n.table > tfoot > tr > td.danger,\n.table > thead > tr > th.danger,\n.table > tbody > tr > th.danger,\n.table > tfoot > tr > th.danger,\n.table > thead > tr.danger > td,\n.table > tbody > tr.danger > td,\n.table > tfoot > tr.danger > td,\n.table > thead > tr.danger > th,\n.table > tbody > tr.danger > th,\n.table > tfoot > tr.danger > th {\n  background-color: #f2dede;\n}\n.table-hover > tbody > tr > td.danger:hover,\n.table-hover > tbody > tr > th.danger:hover,\n.table-hover > tbody > tr.danger:hover > td,\n.table-hover > tbody > tr:hover > .danger,\n.table-hover > tbody > tr.danger:hover > th {\n  background-color: #ebcccc;\n}\n.table-responsive {\n  overflow-x: auto;\n  min-height: 0.01%;\n}\n@media screen and (max-width: 767px) {\n  .table-responsive {\n    width: 100%;\n    margin-bottom: 15px;\n    overflow-y: hidden;\n    -ms-overflow-style: -ms-autohiding-scrollbar;\n    border: 1px solid #ccc;\n  }\n  .table-responsive > .table {\n    margin-bottom: 0;\n  }\n  .table-responsive > .table > thead > tr > th,\n  .table-responsive > .table > tbody > tr > th,\n  .table-responsive > .table > tfoot > tr > th,\n  .table-responsive > .table > thead > tr > td,\n  .table-responsive > .table > tbody > tr > td,\n  .table-responsive > .table > tfoot > tr > td {\n    white-space: nowrap;\n  }\n  .table-responsive > .table-bordered {\n    border: 0;\n  }\n  .table-responsive > .table-bordered > thead > tr > th:first-child,\n  .table-responsive > .table-bordered > tbody > tr > th:first-child,\n  .table-responsive > .table-bordered > tfoot > tr > th:first-child,\n  .table-responsive > .table-bordered > thead > tr > td:first-child,\n  .table-responsive > .table-bordered > tbody > tr > td:first-child,\n  .table-responsive > .table-bordered > tfoot > tr > td:first-child {\n    border-left: 0;\n  }\n  .table-responsive > .table-bordered > thead > tr > th:last-child,\n  .table-responsive > .table-bordered > tbody > tr > th:last-child,\n  .table-responsive > .table-bordered > tfoot > tr > th:last-child,\n  .table-responsive > .table-bordered > thead > tr > td:last-child,\n  .table-responsive > .table-bordered > tbody > tr > td:last-child,\n  .table-responsive > .table-bordered > tfoot > tr > td:last-child {\n    border-right: 0;\n  }\n  .table-responsive > .table-bordered > tbody > tr:last-child > th,\n  .table-responsive > .table-bordered > tfoot > tr:last-child > th,\n  .table-responsive > .table-bordered > tbody > tr:last-child > td,\n  .table-responsive > .table-bordered > tfoot > tr:last-child > td {\n    border-bottom: 0;\n  }\n}\nfieldset {\n  padding: 0;\n  margin: 0;\n  border: 0;\n  min-width: 0;\n}\nlegend {\n  display: block;\n  width: 100%;\n  padding: 0;\n  margin-bottom: 20px;\n  font-size: 21px;\n  line-height: inherit;\n  color: #333333;\n  border: 0;\n  border-bottom: 1px solid #e5e5e5;\n}\nlabel {\n  display: inline-block;\n  max-width: 100%;\n  margin-bottom: 5px;\n  font-weight: bold;\n}\ninput[type=\"search\"] {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\ninput[type=\"radio\"],\ninput[type=\"checkbox\"] {\n  margin: 4px 0 0;\n  margin-top: 1px \\9;\n  line-height: normal;\n}\ninput[type=\"file\"] {\n  display: block;\n}\ninput[type=\"range\"] {\n  display: block;\n  width: 100%;\n}\nselect[multiple],\nselect[size] {\n  height: auto;\n}\ninput[type=\"file\"]:focus,\ninput[type=\"radio\"]:focus,\ninput[type=\"checkbox\"]:focus {\n  outline: thin dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\noutput {\n  display: block;\n  padding-top: 7px;\n  font-size: 14px;\n  line-height: 1.42857143;\n  color: #555;\n}\n.form-control {\n  display: block;\n  width: 100%;\n  height: 34px;\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.42857143;\n  color: #555;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  -webkit-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;\n  -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;\n  transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;\n}\n.form-control:focus {\n  border-color: #c1d7e9;\n  outline: 0;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(193, 215, 233, 0.6);\n  box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(193, 215, 233, 0.6);\n}\n.form-control::-moz-placeholder {\n  color: #999;\n  opacity: 1;\n}\n.form-control:-ms-input-placeholder {\n  color: #999;\n}\n.form-control::-webkit-input-placeholder {\n  color: #999;\n}\n.form-control::-ms-expand {\n  border: 0;\n  background-color: transparent;\n}\n.form-control[disabled],\n.form-control[readonly],\nfieldset[disabled] .form-control {\n  background-color: #eee;\n  opacity: 1;\n}\n.form-control[disabled],\nfieldset[disabled] .form-control {\n  cursor: not-allowed;\n}\ntextarea.form-control {\n  height: auto;\n}\ninput[type=\"search\"] {\n  -webkit-appearance: none;\n}\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  input[type=\"date\"].form-control,\n  input[type=\"time\"].form-control,\n  input[type=\"datetime-local\"].form-control,\n  input[type=\"month\"].form-control {\n    line-height: 34px;\n  }\n  input[type=\"date\"].input-sm,\n  input[type=\"time\"].input-sm,\n  input[type=\"datetime-local\"].input-sm,\n  input[type=\"month\"].input-sm,\n  .input-group-sm input[type=\"date\"],\n  .input-group-sm input[type=\"time\"],\n  .input-group-sm input[type=\"datetime-local\"],\n  .input-group-sm input[type=\"month\"] {\n    line-height: 30px;\n  }\n  input[type=\"date\"].input-lg,\n  input[type=\"time\"].input-lg,\n  input[type=\"datetime-local\"].input-lg,\n  input[type=\"month\"].input-lg,\n  .input-group-lg input[type=\"date\"],\n  .input-group-lg input[type=\"time\"],\n  .input-group-lg input[type=\"datetime-local\"],\n  .input-group-lg input[type=\"month\"] {\n    line-height: 46px;\n  }\n}\n.form-group {\n  margin-bottom: 15px;\n}\n.radio,\n.checkbox {\n  position: relative;\n  display: block;\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\n.radio label,\n.checkbox label {\n  min-height: 20px;\n  padding-left: 20px;\n  margin-bottom: 0;\n  font-weight: normal;\n  cursor: pointer;\n}\n.radio input[type=\"radio\"],\n.radio-inline input[type=\"radio\"],\n.checkbox input[type=\"checkbox\"],\n.checkbox-inline input[type=\"checkbox\"] {\n  position: absolute;\n  margin-left: -20px;\n  margin-top: 4px \\9;\n}\n.radio + .radio,\n.checkbox + .checkbox {\n  margin-top: -5px;\n}\n.radio-inline,\n.checkbox-inline {\n  position: relative;\n  display: inline-block;\n  padding-left: 20px;\n  margin-bottom: 0;\n  vertical-align: middle;\n  font-weight: normal;\n  cursor: pointer;\n}\n.radio-inline + .radio-inline,\n.checkbox-inline + .checkbox-inline {\n  margin-top: 0;\n  margin-left: 10px;\n}\ninput[type=\"radio\"][disabled],\ninput[type=\"checkbox\"][disabled],\ninput[type=\"radio\"].disabled,\ninput[type=\"checkbox\"].disabled,\nfieldset[disabled] input[type=\"radio\"],\nfieldset[disabled] input[type=\"checkbox\"] {\n  cursor: not-allowed;\n}\n.radio-inline.disabled,\n.checkbox-inline.disabled,\nfieldset[disabled] .radio-inline,\nfieldset[disabled] .checkbox-inline {\n  cursor: not-allowed;\n}\n.radio.disabled label,\n.checkbox.disabled label,\nfieldset[disabled] .radio label,\nfieldset[disabled] .checkbox label {\n  cursor: not-allowed;\n}\n.form-control-static {\n  padding-top: 7px;\n  padding-bottom: 7px;\n  margin-bottom: 0;\n  min-height: 34px;\n}\n.form-control-static.input-lg,\n.form-control-static.input-sm {\n  padding-left: 0;\n  padding-right: 0;\n}\n.input-sm {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\nselect.input-sm {\n  height: 30px;\n  line-height: 30px;\n}\ntextarea.input-sm,\nselect[multiple].input-sm {\n  height: auto;\n}\n.form-group-sm .form-control {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n.form-group-sm select.form-control {\n  height: 30px;\n  line-height: 30px;\n}\n.form-group-sm textarea.form-control,\n.form-group-sm select[multiple].form-control {\n  height: auto;\n}\n.form-group-sm .form-control-static {\n  height: 30px;\n  min-height: 32px;\n  padding: 6px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n}\n.input-lg {\n  height: 46px;\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n  border-radius: 6px;\n}\nselect.input-lg {\n  height: 46px;\n  line-height: 46px;\n}\ntextarea.input-lg,\nselect[multiple].input-lg {\n  height: auto;\n}\n.form-group-lg .form-control {\n  height: 46px;\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n  border-radius: 6px;\n}\n.form-group-lg select.form-control {\n  height: 46px;\n  line-height: 46px;\n}\n.form-group-lg textarea.form-control,\n.form-group-lg select[multiple].form-control {\n  height: auto;\n}\n.form-group-lg .form-control-static {\n  height: 46px;\n  min-height: 38px;\n  padding: 11px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n}\n.has-feedback {\n  position: relative;\n}\n.has-feedback .form-control {\n  padding-right: 42.5px;\n}\n.form-control-feedback {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 2;\n  display: block;\n  width: 34px;\n  height: 34px;\n  line-height: 34px;\n  text-align: center;\n  pointer-events: none;\n}\n.input-lg + .form-control-feedback,\n.input-group-lg + .form-control-feedback,\n.form-group-lg .form-control + .form-control-feedback {\n  width: 46px;\n  height: 46px;\n  line-height: 46px;\n}\n.input-sm + .form-control-feedback,\n.input-group-sm + .form-control-feedback,\n.form-group-sm .form-control + .form-control-feedback {\n  width: 30px;\n  height: 30px;\n  line-height: 30px;\n}\n.has-success .help-block,\n.has-success .control-label,\n.has-success .radio,\n.has-success .checkbox,\n.has-success .radio-inline,\n.has-success .checkbox-inline,\n.has-success.radio label,\n.has-success.checkbox label,\n.has-success.radio-inline label,\n.has-success.checkbox-inline label {\n  color: #2b9b5f;\n}\n.has-success .form-control {\n  border-color: #2b9b5f;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n}\n.has-success .form-control:focus {\n  border-color: #207347;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #5bd192;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #5bd192;\n}\n.has-success .input-group-addon {\n  color: #2b9b5f;\n  border-color: #2b9b5f;\n  background-color: #dff0d8;\n}\n.has-success .form-control-feedback {\n  color: #2b9b5f;\n}\n.has-warning .help-block,\n.has-warning .control-label,\n.has-warning .radio,\n.has-warning .checkbox,\n.has-warning .radio-inline,\n.has-warning .checkbox-inline,\n.has-warning.radio label,\n.has-warning.checkbox label,\n.has-warning.radio-inline label,\n.has-warning.checkbox-inline label {\n  color: #8a6d3b;\n}\n.has-warning .form-control {\n  border-color: #8a6d3b;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n}\n.has-warning .form-control:focus {\n  border-color: #66512c;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #c0a16b;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #c0a16b;\n}\n.has-warning .input-group-addon {\n  color: #8a6d3b;\n  border-color: #8a6d3b;\n  background-color: #fcf8e3;\n}\n.has-warning .form-control-feedback {\n  color: #8a6d3b;\n}\n.has-error .help-block,\n.has-error .control-label,\n.has-error .radio,\n.has-error .checkbox,\n.has-error .radio-inline,\n.has-error .checkbox-inline,\n.has-error.radio label,\n.has-error.checkbox label,\n.has-error.radio-inline label,\n.has-error.checkbox-inline label {\n  color: #d9534f;\n}\n.has-error .form-control {\n  border-color: #d9534f;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n}\n.has-error .form-control:focus {\n  border-color: #c9302c;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #eba5a3;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #eba5a3;\n}\n.has-error .input-group-addon {\n  color: #d9534f;\n  border-color: #d9534f;\n  background-color: #f2dede;\n}\n.has-error .form-control-feedback {\n  color: #d9534f;\n}\n.has-feedback label ~ .form-control-feedback {\n  top: 25px;\n}\n.has-feedback label.sr-only ~ .form-control-feedback {\n  top: 0;\n}\n.help-block {\n  display: block;\n  margin-top: 5px;\n  margin-bottom: 10px;\n  color: #737373;\n}\n@media (min-width: 768px) {\n  .form-inline .form-group {\n    display: inline-block;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .form-inline .form-control {\n    display: inline-block;\n    width: auto;\n    vertical-align: middle;\n  }\n  .form-inline .form-control-static {\n    display: inline-block;\n  }\n  .form-inline .input-group {\n    display: inline-table;\n    vertical-align: middle;\n  }\n  .form-inline .input-group .input-group-addon,\n  .form-inline .input-group .input-group-btn,\n  .form-inline .input-group .form-control {\n    width: auto;\n  }\n  .form-inline .input-group > .form-control {\n    width: 100%;\n  }\n  .form-inline .control-label {\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .form-inline .radio,\n  .form-inline .checkbox {\n    display: inline-block;\n    margin-top: 0;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .form-inline .radio label,\n  .form-inline .checkbox label {\n    padding-left: 0;\n  }\n  .form-inline .radio input[type=\"radio\"],\n  .form-inline .checkbox input[type=\"checkbox\"] {\n    position: relative;\n    margin-left: 0;\n  }\n  .form-inline .has-feedback .form-control-feedback {\n    top: 0;\n  }\n}\n.form-horizontal .radio,\n.form-horizontal .checkbox,\n.form-horizontal .radio-inline,\n.form-horizontal .checkbox-inline {\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-top: 7px;\n}\n.form-horizontal .radio,\n.form-horizontal .checkbox {\n  min-height: 27px;\n}\n.form-horizontal .form-group {\n  margin-left: -15px;\n  margin-right: -15px;\n}\n@media (min-width: 768px) {\n  .form-horizontal .control-label {\n    text-align: right;\n    margin-bottom: 0;\n    padding-top: 7px;\n  }\n}\n.form-horizontal .has-feedback .form-control-feedback {\n  right: 15px;\n}\n@media (min-width: 768px) {\n  .form-horizontal .form-group-lg .control-label {\n    padding-top: 11px;\n    font-size: 18px;\n  }\n}\n@media (min-width: 768px) {\n  .form-horizontal .form-group-sm .control-label {\n    padding-top: 6px;\n    font-size: 12px;\n  }\n}\n.btn {\n  display: inline-block;\n  margin-bottom: 0;\n  font-weight: normal;\n  text-align: center;\n  vertical-align: middle;\n  touch-action: manipulation;\n  cursor: pointer;\n  background-image: none;\n  border: 1px solid transparent;\n  white-space: nowrap;\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.42857143;\n  border-radius: 4px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.btn:focus,\n.btn:active:focus,\n.btn.active:focus,\n.btn.focus,\n.btn:active.focus,\n.btn.active.focus {\n  outline: thin dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\n.btn:hover,\n.btn:focus,\n.btn.focus {\n  color: #333;\n  text-decoration: none;\n}\n.btn:active,\n.btn.active {\n  outline: 0;\n  background-image: none;\n  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n}\n.btn.disabled,\n.btn[disabled],\nfieldset[disabled] .btn {\n  cursor: not-allowed;\n  opacity: 0.65;\n  filter: alpha(opacity=65);\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\na.btn.disabled,\nfieldset[disabled] a.btn {\n  pointer-events: none;\n}\n.btn-default {\n  color: #333;\n  background-color: #fff;\n  border-color: #ccc;\n}\n.btn-default:focus,\n.btn-default.focus {\n  color: #333;\n  background-color: #e6e6e6;\n  border-color: #8c8c8c;\n}\n.btn-default:hover {\n  color: #333;\n  background-color: #e6e6e6;\n  border-color: #adadad;\n}\n.btn-default:active,\n.btn-default.active,\n.open > .dropdown-toggle.btn-default {\n  color: #333;\n  background-color: #e6e6e6;\n  border-color: #adadad;\n}\n.btn-default:active:hover,\n.btn-default.active:hover,\n.open > .dropdown-toggle.btn-default:hover,\n.btn-default:active:focus,\n.btn-default.active:focus,\n.open > .dropdown-toggle.btn-default:focus,\n.btn-default:active.focus,\n.btn-default.active.focus,\n.open > .dropdown-toggle.btn-default.focus {\n  color: #333;\n  background-color: #d4d4d4;\n  border-color: #8c8c8c;\n}\n.btn-default:active,\n.btn-default.active,\n.open > .dropdown-toggle.btn-default {\n  background-image: none;\n}\n.btn-default.disabled:hover,\n.btn-default[disabled]:hover,\nfieldset[disabled] .btn-default:hover,\n.btn-default.disabled:focus,\n.btn-default[disabled]:focus,\nfieldset[disabled] .btn-default:focus,\n.btn-default.disabled.focus,\n.btn-default[disabled].focus,\nfieldset[disabled] .btn-default.focus {\n  background-color: #fff;\n  border-color: #ccc;\n}\n.btn-default .badge {\n  color: #fff;\n  background-color: #333;\n}\n.btn-primary {\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #2d6da3;\n}\n.btn-primary:focus,\n.btn-primary.focus {\n  color: #fff;\n  background-color: #285f8f;\n  border-color: #122a3f;\n}\n.btn-primary:hover {\n  color: #fff;\n  background-color: #285f8f;\n  border-color: #204d73;\n}\n.btn-primary:active,\n.btn-primary.active,\n.open > .dropdown-toggle.btn-primary {\n  color: #fff;\n  background-color: #285f8f;\n  border-color: #204d73;\n}\n.btn-primary:active:hover,\n.btn-primary.active:hover,\n.open > .dropdown-toggle.btn-primary:hover,\n.btn-primary:active:focus,\n.btn-primary.active:focus,\n.open > .dropdown-toggle.btn-primary:focus,\n.btn-primary:active.focus,\n.btn-primary.active.focus,\n.open > .dropdown-toggle.btn-primary.focus {\n  color: #fff;\n  background-color: #204d73;\n  border-color: #122a3f;\n}\n.btn-primary:active,\n.btn-primary.active,\n.open > .dropdown-toggle.btn-primary {\n  background-image: none;\n}\n.btn-primary.disabled:hover,\n.btn-primary[disabled]:hover,\nfieldset[disabled] .btn-primary:hover,\n.btn-primary.disabled:focus,\n.btn-primary[disabled]:focus,\nfieldset[disabled] .btn-primary:focus,\n.btn-primary.disabled.focus,\n.btn-primary[disabled].focus,\nfieldset[disabled] .btn-primary.focus {\n  background-color: #337ab7;\n  border-color: #2d6da3;\n}\n.btn-primary .badge {\n  color: #337ab7;\n  background-color: #fff;\n}\n.btn-success {\n  color: #fff;\n  background-color: #2b9b5f;\n  border-color: #258753;\n}\n.btn-success:focus,\n.btn-success.focus {\n  color: #fff;\n  background-color: #207347;\n  border-color: #0a2316;\n}\n.btn-success:hover {\n  color: #fff;\n  background-color: #207347;\n  border-color: #185735;\n}\n.btn-success:active,\n.btn-success.active,\n.open > .dropdown-toggle.btn-success {\n  color: #fff;\n  background-color: #207347;\n  border-color: #185735;\n}\n.btn-success:active:hover,\n.btn-success.active:hover,\n.open > .dropdown-toggle.btn-success:hover,\n.btn-success:active:focus,\n.btn-success.active:focus,\n.open > .dropdown-toggle.btn-success:focus,\n.btn-success:active.focus,\n.btn-success.active.focus,\n.open > .dropdown-toggle.btn-success.focus {\n  color: #fff;\n  background-color: #185735;\n  border-color: #0a2316;\n}\n.btn-success:active,\n.btn-success.active,\n.open > .dropdown-toggle.btn-success {\n  background-image: none;\n}\n.btn-success.disabled:hover,\n.btn-success[disabled]:hover,\nfieldset[disabled] .btn-success:hover,\n.btn-success.disabled:focus,\n.btn-success[disabled]:focus,\nfieldset[disabled] .btn-success:focus,\n.btn-success.disabled.focus,\n.btn-success[disabled].focus,\nfieldset[disabled] .btn-success.focus {\n  background-color: #2b9b5f;\n  border-color: #258753;\n}\n.btn-success .badge {\n  color: #2b9b5f;\n  background-color: #fff;\n}\n.btn-info {\n  color: #fff;\n  background-color: #c1d7e9;\n  border-color: #aecbe2;\n}\n.btn-info:focus,\n.btn-info.focus {\n  color: #fff;\n  background-color: #9bbfdc;\n  border-color: #508ec1;\n}\n.btn-info:hover {\n  color: #fff;\n  background-color: #9bbfdc;\n  border-color: #81aed2;\n}\n.btn-info:active,\n.btn-info.active,\n.open > .dropdown-toggle.btn-info {\n  color: #fff;\n  background-color: #9bbfdc;\n  border-color: #81aed2;\n}\n.btn-info:active:hover,\n.btn-info.active:hover,\n.open > .dropdown-toggle.btn-info:hover,\n.btn-info:active:focus,\n.btn-info.active:focus,\n.open > .dropdown-toggle.btn-info:focus,\n.btn-info:active.focus,\n.btn-info.active.focus,\n.open > .dropdown-toggle.btn-info.focus {\n  color: #fff;\n  background-color: #81aed2;\n  border-color: #508ec1;\n}\n.btn-info:active,\n.btn-info.active,\n.open > .dropdown-toggle.btn-info {\n  background-image: none;\n}\n.btn-info.disabled:hover,\n.btn-info[disabled]:hover,\nfieldset[disabled] .btn-info:hover,\n.btn-info.disabled:focus,\n.btn-info[disabled]:focus,\nfieldset[disabled] .btn-info:focus,\n.btn-info.disabled.focus,\n.btn-info[disabled].focus,\nfieldset[disabled] .btn-info.focus {\n  background-color: #c1d7e9;\n  border-color: #aecbe2;\n}\n.btn-info .badge {\n  color: #c1d7e9;\n  background-color: #fff;\n}\n.btn-warning {\n  color: #fff;\n  background-color: #f0ad4e;\n  border-color: #eea236;\n}\n.btn-warning:focus,\n.btn-warning.focus {\n  color: #fff;\n  background-color: #ec971f;\n  border-color: #985f0d;\n}\n.btn-warning:hover {\n  color: #fff;\n  background-color: #ec971f;\n  border-color: #d58512;\n}\n.btn-warning:active,\n.btn-warning.active,\n.open > .dropdown-toggle.btn-warning {\n  color: #fff;\n  background-color: #ec971f;\n  border-color: #d58512;\n}\n.btn-warning:active:hover,\n.btn-warning.active:hover,\n.open > .dropdown-toggle.btn-warning:hover,\n.btn-warning:active:focus,\n.btn-warning.active:focus,\n.open > .dropdown-toggle.btn-warning:focus,\n.btn-warning:active.focus,\n.btn-warning.active.focus,\n.open > .dropdown-toggle.btn-warning.focus {\n  color: #fff;\n  background-color: #d58512;\n  border-color: #985f0d;\n}\n.btn-warning:active,\n.btn-warning.active,\n.open > .dropdown-toggle.btn-warning {\n  background-image: none;\n}\n.btn-warning.disabled:hover,\n.btn-warning[disabled]:hover,\nfieldset[disabled] .btn-warning:hover,\n.btn-warning.disabled:focus,\n.btn-warning[disabled]:focus,\nfieldset[disabled] .btn-warning:focus,\n.btn-warning.disabled.focus,\n.btn-warning[disabled].focus,\nfieldset[disabled] .btn-warning.focus {\n  background-color: #f0ad4e;\n  border-color: #eea236;\n}\n.btn-warning .badge {\n  color: #f0ad4e;\n  background-color: #fff;\n}\n.btn-danger {\n  color: #fff;\n  background-color: #d9534f;\n  border-color: #d43f3a;\n}\n.btn-danger:focus,\n.btn-danger.focus {\n  color: #fff;\n  background-color: #c9302c;\n  border-color: #761c19;\n}\n.btn-danger:hover {\n  color: #fff;\n  background-color: #c9302c;\n  border-color: #ac2925;\n}\n.btn-danger:active,\n.btn-danger.active,\n.open > .dropdown-toggle.btn-danger {\n  color: #fff;\n  background-color: #c9302c;\n  border-color: #ac2925;\n}\n.btn-danger:active:hover,\n.btn-danger.active:hover,\n.open > .dropdown-toggle.btn-danger:hover,\n.btn-danger:active:focus,\n.btn-danger.active:focus,\n.open > .dropdown-toggle.btn-danger:focus,\n.btn-danger:active.focus,\n.btn-danger.active.focus,\n.open > .dropdown-toggle.btn-danger.focus {\n  color: #fff;\n  background-color: #ac2925;\n  border-color: #761c19;\n}\n.btn-danger:active,\n.btn-danger.active,\n.open > .dropdown-toggle.btn-danger {\n  background-image: none;\n}\n.btn-danger.disabled:hover,\n.btn-danger[disabled]:hover,\nfieldset[disabled] .btn-danger:hover,\n.btn-danger.disabled:focus,\n.btn-danger[disabled]:focus,\nfieldset[disabled] .btn-danger:focus,\n.btn-danger.disabled.focus,\n.btn-danger[disabled].focus,\nfieldset[disabled] .btn-danger.focus {\n  background-color: #d9534f;\n  border-color: #d43f3a;\n}\n.btn-danger .badge {\n  color: #d9534f;\n  background-color: #fff;\n}\n.btn-link {\n  color: #337ab7;\n  font-weight: normal;\n  border-radius: 0;\n}\n.btn-link,\n.btn-link:active,\n.btn-link.active,\n.btn-link[disabled],\nfieldset[disabled] .btn-link {\n  background-color: transparent;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n.btn-link,\n.btn-link:hover,\n.btn-link:focus,\n.btn-link:active {\n  border-color: transparent;\n}\n.btn-link:hover,\n.btn-link:focus {\n  color: #22527b;\n  text-decoration: underline;\n  background-color: transparent;\n}\n.btn-link[disabled]:hover,\nfieldset[disabled] .btn-link:hover,\n.btn-link[disabled]:focus,\nfieldset[disabled] .btn-link:focus {\n  color: #ccc;\n  text-decoration: none;\n}\n.btn-lg,\n.btn-group-lg > .btn {\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n  border-radius: 6px;\n}\n.btn-sm,\n.btn-group-sm > .btn {\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n.btn-xs,\n.btn-group-xs > .btn {\n  padding: 1px 5px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n.btn-block {\n  display: block;\n  width: 100%;\n}\n.btn-block + .btn-block {\n  margin-top: 5px;\n}\ninput[type=\"submit\"].btn-block,\ninput[type=\"reset\"].btn-block,\ninput[type=\"button\"].btn-block {\n  width: 100%;\n}\n.fade {\n  opacity: 0;\n  -webkit-transition: opacity 0.15s linear;\n  -o-transition: opacity 0.15s linear;\n  transition: opacity 0.15s linear;\n}\n.fade.in {\n  opacity: 1;\n}\n.collapse {\n  display: none;\n}\n.collapse.in {\n  display: block;\n}\ntr.collapse.in {\n  display: table-row;\n}\ntbody.collapse.in {\n  display: table-row-group;\n}\n.collapsing {\n  position: relative;\n  height: 0;\n  overflow: hidden;\n  -webkit-transition-property: height, visibility;\n  transition-property: height, visibility;\n  -webkit-transition-duration: 0.35s;\n  transition-duration: 0.35s;\n  -webkit-transition-timing-function: ease;\n  transition-timing-function: ease;\n}\n.caret {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 2px;\n  vertical-align: middle;\n  border-top: 4px dashed;\n  border-top: 4px solid \\9;\n  border-right: 4px solid transparent;\n  border-left: 4px solid transparent;\n}\n.dropup,\n.dropdown {\n  position: relative;\n}\n.dropdown-toggle:focus {\n  outline: 0;\n}\n.dropdown-menu {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  z-index: 1000;\n  display: none;\n  float: left;\n  min-width: 160px;\n  padding: 5px 0;\n  margin: 2px 0 0;\n  list-style: none;\n  font-size: 14px;\n  text-align: left;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n  background-clip: padding-box;\n}\n.dropdown-menu.pull-right {\n  right: 0;\n  left: auto;\n}\n.dropdown-menu .divider {\n  height: 1px;\n  margin: 9px 0;\n  overflow: hidden;\n  background-color: #e5e5e5;\n}\n.dropdown-menu > li > a {\n  display: block;\n  padding: 3px 20px;\n  clear: both;\n  font-weight: normal;\n  line-height: 1.42857143;\n  color: #333333;\n  white-space: nowrap;\n}\n.dropdown-menu > li > a:hover,\n.dropdown-menu > li > a:focus {\n  text-decoration: none;\n  color: #262626;\n  background-color: #f5f5f5;\n}\n.dropdown-menu > .active > a,\n.dropdown-menu > .active > a:hover,\n.dropdown-menu > .active > a:focus {\n  color: #fff;\n  text-decoration: none;\n  outline: 0;\n  background-color: #337ab7;\n}\n.dropdown-menu > .disabled > a,\n.dropdown-menu > .disabled > a:hover,\n.dropdown-menu > .disabled > a:focus {\n  color: #ccc;\n}\n.dropdown-menu > .disabled > a:hover,\n.dropdown-menu > .disabled > a:focus {\n  text-decoration: none;\n  background-color: transparent;\n  background-image: none;\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);\n  cursor: not-allowed;\n}\n.open > .dropdown-menu {\n  display: block;\n}\n.open > a {\n  outline: 0;\n}\n.dropdown-menu-right {\n  left: auto;\n  right: 0;\n}\n.dropdown-menu-left {\n  left: 0;\n  right: auto;\n}\n.dropdown-header {\n  display: block;\n  padding: 3px 20px;\n  font-size: 12px;\n  line-height: 1.42857143;\n  color: #ccc;\n  white-space: nowrap;\n}\n.dropdown-backdrop {\n  position: fixed;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  top: 0;\n  z-index: 990;\n}\n.pull-right > .dropdown-menu {\n  right: 0;\n  left: auto;\n}\n.dropup .caret,\n.navbar-fixed-bottom .dropdown .caret {\n  border-top: 0;\n  border-bottom: 4px dashed;\n  border-bottom: 4px solid \\9;\n  content: \"\";\n}\n.dropup .dropdown-menu,\n.navbar-fixed-bottom .dropdown .dropdown-menu {\n  top: auto;\n  bottom: 100%;\n  margin-bottom: 2px;\n}\n@media (min-width: 768px) {\n  .navbar-right .dropdown-menu {\n    left: auto;\n    right: 0;\n  }\n  .navbar-right .dropdown-menu-left {\n    left: 0;\n    right: auto;\n  }\n}\n.btn-group,\n.btn-group-vertical {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle;\n}\n.btn-group > .btn,\n.btn-group-vertical > .btn {\n  position: relative;\n  float: left;\n}\n.btn-group > .btn:hover,\n.btn-group-vertical > .btn:hover,\n.btn-group > .btn:focus,\n.btn-group-vertical > .btn:focus,\n.btn-group > .btn:active,\n.btn-group-vertical > .btn:active,\n.btn-group > .btn.active,\n.btn-group-vertical > .btn.active {\n  z-index: 2;\n}\n.btn-group .btn + .btn,\n.btn-group .btn + .btn-group,\n.btn-group .btn-group + .btn,\n.btn-group .btn-group + .btn-group {\n  margin-left: -1px;\n}\n.btn-toolbar {\n  margin-left: -5px;\n}\n.btn-toolbar .btn,\n.btn-toolbar .btn-group,\n.btn-toolbar .input-group {\n  float: left;\n}\n.btn-toolbar > .btn,\n.btn-toolbar > .btn-group,\n.btn-toolbar > .input-group {\n  margin-left: 5px;\n}\n.btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {\n  border-radius: 0;\n}\n.btn-group > .btn:first-child {\n  margin-left: 0;\n}\n.btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0;\n}\n.btn-group > .btn:last-child:not(:first-child),\n.btn-group > .dropdown-toggle:not(:first-child) {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n}\n.btn-group > .btn-group {\n  float: left;\n}\n.btn-group > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0;\n}\n.btn-group > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0;\n}\n.btn-group > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n}\n.btn-group .dropdown-toggle:active,\n.btn-group.open .dropdown-toggle {\n  outline: 0;\n}\n.btn-group > .btn + .dropdown-toggle {\n  padding-left: 8px;\n  padding-right: 8px;\n}\n.btn-group > .btn-lg + .dropdown-toggle {\n  padding-left: 12px;\n  padding-right: 12px;\n}\n.btn-group.open .dropdown-toggle {\n  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n}\n.btn-group.open .dropdown-toggle.btn-link {\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n.btn .caret {\n  margin-left: 0;\n}\n.btn-lg .caret {\n  border-width: 5px 5px 0;\n  border-bottom-width: 0;\n}\n.dropup .btn-lg .caret {\n  border-width: 0 5px 5px;\n}\n.btn-group-vertical > .btn,\n.btn-group-vertical > .btn-group,\n.btn-group-vertical > .btn-group > .btn {\n  display: block;\n  float: none;\n  width: 100%;\n  max-width: 100%;\n}\n.btn-group-vertical > .btn-group > .btn {\n  float: none;\n}\n.btn-group-vertical > .btn + .btn,\n.btn-group-vertical > .btn + .btn-group,\n.btn-group-vertical > .btn-group + .btn,\n.btn-group-vertical > .btn-group + .btn-group {\n  margin-top: -1px;\n  margin-left: 0;\n}\n.btn-group-vertical > .btn:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.btn-group-vertical > .btn:first-child:not(:last-child) {\n  border-top-right-radius: 4px;\n  border-top-left-radius: 4px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.btn-group-vertical > .btn:last-child:not(:first-child) {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n  border-bottom-right-radius: 4px;\n  border-bottom-left-radius: 4px;\n}\n.btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0;\n}\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n}\n.btn-group-justified {\n  display: table;\n  width: 100%;\n  table-layout: fixed;\n  border-collapse: separate;\n}\n.btn-group-justified > .btn,\n.btn-group-justified > .btn-group {\n  float: none;\n  display: table-cell;\n  width: 1%;\n}\n.btn-group-justified > .btn-group .btn {\n  width: 100%;\n}\n.btn-group-justified > .btn-group .dropdown-menu {\n  left: auto;\n}\n[data-toggle=\"buttons\"] > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn input[type=\"checkbox\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"checkbox\"] {\n  position: absolute;\n  clip: rect(0, 0, 0, 0);\n  pointer-events: none;\n}\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate;\n}\n.input-group[class*=\"col-\"] {\n  float: none;\n  padding-left: 0;\n  padding-right: 0;\n}\n.input-group .form-control {\n  position: relative;\n  z-index: 2;\n  float: left;\n  width: 100%;\n  margin-bottom: 0;\n}\n.input-group .form-control:focus {\n  z-index: 3;\n}\n.input-group-lg > .form-control,\n.input-group-lg > .input-group-addon,\n.input-group-lg > .input-group-btn > .btn {\n  height: 46px;\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n  border-radius: 6px;\n}\nselect.input-group-lg > .form-control,\nselect.input-group-lg > .input-group-addon,\nselect.input-group-lg > .input-group-btn > .btn {\n  height: 46px;\n  line-height: 46px;\n}\ntextarea.input-group-lg > .form-control,\ntextarea.input-group-lg > .input-group-addon,\ntextarea.input-group-lg > .input-group-btn > .btn,\nselect[multiple].input-group-lg > .form-control,\nselect[multiple].input-group-lg > .input-group-addon,\nselect[multiple].input-group-lg > .input-group-btn > .btn {\n  height: auto;\n}\n.input-group-sm > .form-control,\n.input-group-sm > .input-group-addon,\n.input-group-sm > .input-group-btn > .btn {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\nselect.input-group-sm > .form-control,\nselect.input-group-sm > .input-group-addon,\nselect.input-group-sm > .input-group-btn > .btn {\n  height: 30px;\n  line-height: 30px;\n}\ntextarea.input-group-sm > .form-control,\ntextarea.input-group-sm > .input-group-addon,\ntextarea.input-group-sm > .input-group-btn > .btn,\nselect[multiple].input-group-sm > .form-control,\nselect[multiple].input-group-sm > .input-group-addon,\nselect[multiple].input-group-sm > .input-group-btn > .btn {\n  height: auto;\n}\n.input-group-addon,\n.input-group-btn,\n.input-group .form-control {\n  display: table-cell;\n}\n.input-group-addon:not(:first-child):not(:last-child),\n.input-group-btn:not(:first-child):not(:last-child),\n.input-group .form-control:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.input-group-addon,\n.input-group-btn {\n  width: 1%;\n  white-space: nowrap;\n  vertical-align: middle;\n}\n.input-group-addon {\n  padding: 6px 12px;\n  font-size: 14px;\n  font-weight: normal;\n  line-height: 1;\n  color: #555;\n  text-align: center;\n  background-color: #eee;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n}\n.input-group-addon.input-sm {\n  padding: 5px 10px;\n  font-size: 12px;\n  border-radius: 3px;\n}\n.input-group-addon.input-lg {\n  padding: 10px 16px;\n  font-size: 18px;\n  border-radius: 6px;\n}\n.input-group-addon input[type=\"radio\"],\n.input-group-addon input[type=\"checkbox\"] {\n  margin-top: 0;\n}\n.input-group .form-control:first-child,\n.input-group-addon:first-child,\n.input-group-btn:first-child > .btn,\n.input-group-btn:first-child > .btn-group > .btn,\n.input-group-btn:first-child > .dropdown-toggle,\n.input-group-btn:last-child > .btn:not(:last-child):not(.dropdown-toggle),\n.input-group-btn:last-child > .btn-group:not(:last-child) > .btn {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0;\n}\n.input-group-addon:first-child {\n  border-right: 0;\n}\n.input-group .form-control:last-child,\n.input-group-addon:last-child,\n.input-group-btn:last-child > .btn,\n.input-group-btn:last-child > .btn-group > .btn,\n.input-group-btn:last-child > .dropdown-toggle,\n.input-group-btn:first-child > .btn:not(:first-child),\n.input-group-btn:first-child > .btn-group:not(:first-child) > .btn {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n}\n.input-group-addon:last-child {\n  border-left: 0;\n}\n.input-group-btn {\n  position: relative;\n  font-size: 0;\n  white-space: nowrap;\n}\n.input-group-btn > .btn {\n  position: relative;\n}\n.input-group-btn > .btn + .btn {\n  margin-left: -1px;\n}\n.input-group-btn > .btn:hover,\n.input-group-btn > .btn:focus,\n.input-group-btn > .btn:active {\n  z-index: 2;\n}\n.input-group-btn:first-child > .btn,\n.input-group-btn:first-child > .btn-group {\n  margin-right: -1px;\n}\n.input-group-btn:last-child > .btn,\n.input-group-btn:last-child > .btn-group {\n  z-index: 2;\n  margin-left: -1px;\n}\n.nav {\n  margin-bottom: 0;\n  padding-left: 0;\n  list-style: none;\n}\n.nav > li {\n  position: relative;\n  display: block;\n}\n.nav > li > a {\n  position: relative;\n  display: block;\n  padding: 10px 15px;\n}\n.nav > li > a:hover,\n.nav > li > a:focus {\n  text-decoration: none;\n  background-color: #eee;\n}\n.nav > li.disabled > a {\n  color: #ccc;\n}\n.nav > li.disabled > a:hover,\n.nav > li.disabled > a:focus {\n  color: #ccc;\n  text-decoration: none;\n  background-color: transparent;\n  cursor: not-allowed;\n}\n.nav .open > a,\n.nav .open > a:hover,\n.nav .open > a:focus {\n  background-color: #eee;\n  border-color: #337ab7;\n}\n.nav .nav-divider {\n  height: 1px;\n  margin: 9px 0;\n  overflow: hidden;\n  background-color: #e5e5e5;\n}\n.nav > li > a > img {\n  max-width: none;\n}\n.nav-tabs {\n  border-bottom: 1px solid #ccc;\n}\n.nav-tabs > li {\n  float: left;\n  margin-bottom: -1px;\n}\n.nav-tabs > li > a {\n  margin-right: 2px;\n  line-height: 1.42857143;\n  border: 1px solid transparent;\n  border-radius: 4px 4px 0 0;\n}\n.nav-tabs > li > a:hover {\n  border-color: #eee #eee #ccc;\n}\n.nav-tabs > li.active > a,\n.nav-tabs > li.active > a:hover,\n.nav-tabs > li.active > a:focus {\n  color: #555;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border-bottom-color: transparent;\n  cursor: default;\n}\n.nav-tabs.nav-justified {\n  width: 100%;\n  border-bottom: 0;\n}\n.nav-tabs.nav-justified > li {\n  float: none;\n}\n.nav-tabs.nav-justified > li > a {\n  text-align: center;\n  margin-bottom: 5px;\n}\n.nav-tabs.nav-justified > .dropdown .dropdown-menu {\n  top: auto;\n  left: auto;\n}\n@media (min-width: 768px) {\n  .nav-tabs.nav-justified > li {\n    display: table-cell;\n    width: 1%;\n  }\n  .nav-tabs.nav-justified > li > a {\n    margin-bottom: 0;\n  }\n}\n.nav-tabs.nav-justified > li > a {\n  margin-right: 0;\n  border-radius: 4px;\n}\n.nav-tabs.nav-justified > .active > a,\n.nav-tabs.nav-justified > .active > a:hover,\n.nav-tabs.nav-justified > .active > a:focus {\n  border: 1px solid #ccc;\n}\n@media (min-width: 768px) {\n  .nav-tabs.nav-justified > li > a {\n    border-bottom: 1px solid #ccc;\n    border-radius: 4px 4px 0 0;\n  }\n  .nav-tabs.nav-justified > .active > a,\n  .nav-tabs.nav-justified > .active > a:hover,\n  .nav-tabs.nav-justified > .active > a:focus {\n    border-bottom-color: #fff;\n  }\n}\n.nav-pills > li {\n  float: left;\n}\n.nav-pills > li > a {\n  border-radius: 4px;\n}\n.nav-pills > li + li {\n  margin-left: 2px;\n}\n.nav-pills > li.active > a,\n.nav-pills > li.active > a:hover,\n.nav-pills > li.active > a:focus {\n  color: #fff;\n  background-color: #337ab7;\n}\n.nav-stacked > li {\n  float: none;\n}\n.nav-stacked > li + li {\n  margin-top: 2px;\n  margin-left: 0;\n}\n.nav-justified {\n  width: 100%;\n}\n.nav-justified > li {\n  float: none;\n}\n.nav-justified > li > a {\n  text-align: center;\n  margin-bottom: 5px;\n}\n.nav-justified > .dropdown .dropdown-menu {\n  top: auto;\n  left: auto;\n}\n@media (min-width: 768px) {\n  .nav-justified > li {\n    display: table-cell;\n    width: 1%;\n  }\n  .nav-justified > li > a {\n    margin-bottom: 0;\n  }\n}\n.nav-tabs-justified {\n  border-bottom: 0;\n}\n.nav-tabs-justified > li > a {\n  margin-right: 0;\n  border-radius: 4px;\n}\n.nav-tabs-justified > .active > a,\n.nav-tabs-justified > .active > a:hover,\n.nav-tabs-justified > .active > a:focus {\n  border: 1px solid #ccc;\n}\n@media (min-width: 768px) {\n  .nav-tabs-justified > li > a {\n    border-bottom: 1px solid #ccc;\n    border-radius: 4px 4px 0 0;\n  }\n  .nav-tabs-justified > .active > a,\n  .nav-tabs-justified > .active > a:hover,\n  .nav-tabs-justified > .active > a:focus {\n    border-bottom-color: #fff;\n  }\n}\n.tab-content > .tab-pane {\n  display: none;\n}\n.tab-content > .active {\n  display: block;\n}\n.nav-tabs .dropdown-menu {\n  margin-top: -1px;\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n}\n.navbar {\n  position: relative;\n  min-height: 50px;\n  margin-bottom: 20px;\n  border: 1px solid transparent;\n}\n@media (min-width: 768px) {\n  .navbar {\n    border-radius: 4px;\n  }\n}\n@media (min-width: 768px) {\n  .navbar-header {\n    float: left;\n  }\n}\n.navbar-collapse {\n  overflow-x: visible;\n  padding-right: 15px;\n  padding-left: 15px;\n  border-top: 1px solid transparent;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);\n  -webkit-overflow-scrolling: touch;\n}\n.navbar-collapse.in {\n  overflow-y: auto;\n}\n@media (min-width: 768px) {\n  .navbar-collapse {\n    width: auto;\n    border-top: 0;\n    box-shadow: none;\n  }\n  .navbar-collapse.collapse {\n    display: block !important;\n    height: auto !important;\n    padding-bottom: 0;\n    overflow: visible !important;\n  }\n  .navbar-collapse.in {\n    overflow-y: visible;\n  }\n  .navbar-fixed-top .navbar-collapse,\n  .navbar-static-top .navbar-collapse,\n  .navbar-fixed-bottom .navbar-collapse {\n    padding-left: 0;\n    padding-right: 0;\n  }\n}\n.navbar-fixed-top .navbar-collapse,\n.navbar-fixed-bottom .navbar-collapse {\n  max-height: 340px;\n}\n@media (max-device-width: 480px) and (orientation: landscape) {\n  .navbar-fixed-top .navbar-collapse,\n  .navbar-fixed-bottom .navbar-collapse {\n    max-height: 200px;\n  }\n}\n.container > .navbar-header,\n.container-fluid > .navbar-header,\n.container > .navbar-collapse,\n.container-fluid > .navbar-collapse {\n  margin-right: -15px;\n  margin-left: -15px;\n}\n@media (min-width: 768px) {\n  .container > .navbar-header,\n  .container-fluid > .navbar-header,\n  .container > .navbar-collapse,\n  .container-fluid > .navbar-collapse {\n    margin-right: 0;\n    margin-left: 0;\n  }\n}\n.navbar-static-top {\n  z-index: 1000;\n  border-width: 0 0 1px;\n}\n@media (min-width: 768px) {\n  .navbar-static-top {\n    border-radius: 0;\n  }\n}\n.navbar-fixed-top,\n.navbar-fixed-bottom {\n  position: fixed;\n  right: 0;\n  left: 0;\n  z-index: 1030;\n}\n@media (min-width: 768px) {\n  .navbar-fixed-top,\n  .navbar-fixed-bottom {\n    border-radius: 0;\n  }\n}\n.navbar-fixed-top {\n  top: 0;\n  border-width: 0 0 1px;\n}\n.navbar-fixed-bottom {\n  bottom: 0;\n  margin-bottom: 0;\n  border-width: 1px 0 0;\n}\n.navbar-brand {\n  float: left;\n  padding: 15px 15px;\n  font-size: 18px;\n  line-height: 20px;\n  height: 50px;\n}\n.navbar-brand:hover,\n.navbar-brand:focus {\n  text-decoration: none;\n}\n.navbar-brand > img {\n  display: block;\n}\n@media (min-width: 768px) {\n  .navbar > .container .navbar-brand,\n  .navbar > .container-fluid .navbar-brand {\n    margin-left: -15px;\n  }\n}\n.navbar-toggle {\n  position: relative;\n  float: right;\n  margin-right: 15px;\n  padding: 9px 10px;\n  margin-top: 8px;\n  margin-bottom: 8px;\n  background-color: transparent;\n  background-image: none;\n  border: 1px solid transparent;\n  border-radius: 4px;\n}\n.navbar-toggle:focus {\n  outline: 0;\n}\n.navbar-toggle .icon-bar {\n  display: block;\n  width: 22px;\n  height: 2px;\n  border-radius: 1px;\n}\n.navbar-toggle .icon-bar + .icon-bar {\n  margin-top: 4px;\n}\n@media (min-width: 768px) {\n  .navbar-toggle {\n    display: none;\n  }\n}\n.navbar-nav {\n  margin: 7.5px -15px;\n}\n.navbar-nav > li > a {\n  padding-top: 10px;\n  padding-bottom: 10px;\n  line-height: 20px;\n}\n@media (max-width: 767px) {\n  .navbar-nav .open .dropdown-menu {\n    position: static;\n    float: none;\n    width: auto;\n    margin-top: 0;\n    background-color: transparent;\n    border: 0;\n    box-shadow: none;\n  }\n  .navbar-nav .open .dropdown-menu > li > a,\n  .navbar-nav .open .dropdown-menu .dropdown-header {\n    padding: 5px 15px 5px 25px;\n  }\n  .navbar-nav .open .dropdown-menu > li > a {\n    line-height: 20px;\n  }\n  .navbar-nav .open .dropdown-menu > li > a:hover,\n  .navbar-nav .open .dropdown-menu > li > a:focus {\n    background-image: none;\n  }\n}\n@media (min-width: 768px) {\n  .navbar-nav {\n    float: left;\n    margin: 0;\n  }\n  .navbar-nav > li {\n    float: left;\n  }\n  .navbar-nav > li > a {\n    padding-top: 15px;\n    padding-bottom: 15px;\n  }\n}\n.navbar-form {\n  margin-left: -15px;\n  margin-right: -15px;\n  padding: 10px 15px;\n  border-top: 1px solid transparent;\n  border-bottom: 1px solid transparent;\n  -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);\n  margin-top: 8px;\n  margin-bottom: 8px;\n}\n@media (min-width: 768px) {\n  .navbar-form .form-group {\n    display: inline-block;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .navbar-form .form-control {\n    display: inline-block;\n    width: auto;\n    vertical-align: middle;\n  }\n  .navbar-form .form-control-static {\n    display: inline-block;\n  }\n  .navbar-form .input-group {\n    display: inline-table;\n    vertical-align: middle;\n  }\n  .navbar-form .input-group .input-group-addon,\n  .navbar-form .input-group .input-group-btn,\n  .navbar-form .input-group .form-control {\n    width: auto;\n  }\n  .navbar-form .input-group > .form-control {\n    width: 100%;\n  }\n  .navbar-form .control-label {\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .navbar-form .radio,\n  .navbar-form .checkbox {\n    display: inline-block;\n    margin-top: 0;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .navbar-form .radio label,\n  .navbar-form .checkbox label {\n    padding-left: 0;\n  }\n  .navbar-form .radio input[type=\"radio\"],\n  .navbar-form .checkbox input[type=\"checkbox\"] {\n    position: relative;\n    margin-left: 0;\n  }\n  .navbar-form .has-feedback .form-control-feedback {\n    top: 0;\n  }\n}\n@media (max-width: 767px) {\n  .navbar-form .form-group {\n    margin-bottom: 5px;\n  }\n  .navbar-form .form-group:last-child {\n    margin-bottom: 0;\n  }\n}\n@media (min-width: 768px) {\n  .navbar-form {\n    width: auto;\n    border: 0;\n    margin-left: 0;\n    margin-right: 0;\n    padding-top: 0;\n    padding-bottom: 0;\n    -webkit-box-shadow: none;\n    box-shadow: none;\n  }\n}\n.navbar-nav > li > .dropdown-menu {\n  margin-top: 0;\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n}\n.navbar-fixed-bottom .navbar-nav > li > .dropdown-menu {\n  margin-bottom: 0;\n  border-top-right-radius: 4px;\n  border-top-left-radius: 4px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.navbar-btn {\n  margin-top: 8px;\n  margin-bottom: 8px;\n}\n.navbar-btn.btn-sm {\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\n.navbar-btn.btn-xs {\n  margin-top: 14px;\n  margin-bottom: 14px;\n}\n.navbar-text {\n  margin-top: 15px;\n  margin-bottom: 15px;\n}\n@media (min-width: 768px) {\n  .navbar-text {\n    float: left;\n    margin-left: 15px;\n    margin-right: 15px;\n  }\n}\n@media (min-width: 768px) {\n  .navbar-left {\n    float: left !important;\n  }\n  .navbar-right {\n    float: right !important;\n    margin-right: -15px;\n  }\n  .navbar-right ~ .navbar-right {\n    margin-right: 0;\n  }\n}\n.navbar-default {\n  background-color: #f9f9f9;\n  border-color: #e8e8e8;\n}\n.navbar-default .navbar-brand {\n  color: #777;\n}\n.navbar-default .navbar-brand:hover,\n.navbar-default .navbar-brand:focus {\n  color: #5e5e5e;\n  background-color: transparent;\n}\n.navbar-default .navbar-text {\n  color: #777;\n}\n.navbar-default .navbar-nav > li > a {\n  color: #777;\n}\n.navbar-default .navbar-nav > li > a:hover,\n.navbar-default .navbar-nav > li > a:focus {\n  color: #333;\n  background-color: transparent;\n}\n.navbar-default .navbar-nav > .active > a,\n.navbar-default .navbar-nav > .active > a:hover,\n.navbar-default .navbar-nav > .active > a:focus {\n  color: #555;\n  background-color: #e8e8e8;\n}\n.navbar-default .navbar-nav > .disabled > a,\n.navbar-default .navbar-nav > .disabled > a:hover,\n.navbar-default .navbar-nav > .disabled > a:focus {\n  color: #ccc;\n  background-color: transparent;\n}\n.navbar-default .navbar-toggle {\n  border-color: #ccc;\n}\n.navbar-default .navbar-toggle:hover,\n.navbar-default .navbar-toggle:focus {\n  background-color: #ccc;\n}\n.navbar-default .navbar-toggle .icon-bar {\n  background-color: #888;\n}\n.navbar-default .navbar-collapse,\n.navbar-default .navbar-form {\n  border-color: #e8e8e8;\n}\n.navbar-default .navbar-nav > .open > a,\n.navbar-default .navbar-nav > .open > a:hover,\n.navbar-default .navbar-nav > .open > a:focus {\n  background-color: #e8e8e8;\n  color: #555;\n}\n@media (max-width: 767px) {\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a {\n    color: #777;\n  }\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a:hover,\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a:focus {\n    color: #333;\n    background-color: transparent;\n  }\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a,\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a:hover,\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a:focus {\n    color: #555;\n    background-color: #e8e8e8;\n  }\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a,\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:hover,\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:focus {\n    color: #ccc;\n    background-color: transparent;\n  }\n}\n.navbar-default .navbar-link {\n  color: #777;\n}\n.navbar-default .navbar-link:hover {\n  color: #333;\n}\n.navbar-default .btn-link {\n  color: #777;\n}\n.navbar-default .btn-link:hover,\n.navbar-default .btn-link:focus {\n  color: #333;\n}\n.navbar-default .btn-link[disabled]:hover,\nfieldset[disabled] .navbar-default .btn-link:hover,\n.navbar-default .btn-link[disabled]:focus,\nfieldset[disabled] .navbar-default .btn-link:focus {\n  color: #ccc;\n}\n.navbar-inverse {\n  background-color: #337ab7;\n  border-color: #285f8f;\n}\n.navbar-inverse .navbar-brand {\n  color: #eee;\n}\n.navbar-inverse .navbar-brand:hover,\n.navbar-inverse .navbar-brand:focus {\n  color: #fff;\n  background-color: transparent;\n}\n.navbar-inverse .navbar-text {\n  color: #eee;\n}\n.navbar-inverse .navbar-nav > li > a {\n  color: #eee;\n}\n.navbar-inverse .navbar-nav > li > a:hover,\n.navbar-inverse .navbar-nav > li > a:focus {\n  color: #fff;\n  background-color: transparent;\n}\n.navbar-inverse .navbar-nav > .active > a,\n.navbar-inverse .navbar-nav > .active > a:hover,\n.navbar-inverse .navbar-nav > .active > a:focus {\n  color: #fff;\n  background-color: #285f8f;\n}\n.navbar-inverse .navbar-nav > .disabled > a,\n.navbar-inverse .navbar-nav > .disabled > a:hover,\n.navbar-inverse .navbar-nav > .disabled > a:focus {\n  color: #444;\n  background-color: transparent;\n}\n.navbar-inverse .navbar-toggle {\n  border-color: #333;\n}\n.navbar-inverse .navbar-toggle:hover,\n.navbar-inverse .navbar-toggle:focus {\n  background-color: #333;\n}\n.navbar-inverse .navbar-toggle .icon-bar {\n  background-color: #fff;\n}\n.navbar-inverse .navbar-collapse,\n.navbar-inverse .navbar-form {\n  border-color: #2b679b;\n}\n.navbar-inverse .navbar-nav > .open > a,\n.navbar-inverse .navbar-nav > .open > a:hover,\n.navbar-inverse .navbar-nav > .open > a:focus {\n  background-color: #285f8f;\n  color: #fff;\n}\n@media (max-width: 767px) {\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .dropdown-header {\n    border-color: #285f8f;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu .divider {\n    background-color: #285f8f;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a {\n    color: #eee;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:hover,\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:focus {\n    color: #fff;\n    background-color: transparent;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a,\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:hover,\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:focus {\n    color: #fff;\n    background-color: #285f8f;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a,\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:hover,\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:focus {\n    color: #444;\n    background-color: transparent;\n  }\n}\n.navbar-inverse .navbar-link {\n  color: #eee;\n}\n.navbar-inverse .navbar-link:hover {\n  color: #fff;\n}\n.navbar-inverse .btn-link {\n  color: #eee;\n}\n.navbar-inverse .btn-link:hover,\n.navbar-inverse .btn-link:focus {\n  color: #fff;\n}\n.navbar-inverse .btn-link[disabled]:hover,\nfieldset[disabled] .navbar-inverse .btn-link:hover,\n.navbar-inverse .btn-link[disabled]:focus,\nfieldset[disabled] .navbar-inverse .btn-link:focus {\n  color: #444;\n}\n.breadcrumb {\n  padding: 8px 15px;\n  margin-bottom: 20px;\n  list-style: none;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n}\n.breadcrumb > li {\n  display: inline-block;\n}\n.breadcrumb > li + li:before {\n  content: \"/\\00a0\";\n  padding: 0 5px;\n  color: #ccc;\n}\n.breadcrumb > .active {\n  color: #ccc;\n}\n.pagination {\n  display: inline-block;\n  padding-left: 0;\n  margin: 20px 0;\n  border-radius: 4px;\n}\n.pagination > li {\n  display: inline;\n}\n.pagination > li > a,\n.pagination > li > span {\n  position: relative;\n  float: left;\n  padding: 6px 12px;\n  line-height: 1.42857143;\n  text-decoration: none;\n  color: #337ab7;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  margin-left: -1px;\n}\n.pagination > li:first-child > a,\n.pagination > li:first-child > span {\n  margin-left: 0;\n  border-bottom-left-radius: 4px;\n  border-top-left-radius: 4px;\n}\n.pagination > li:last-child > a,\n.pagination > li:last-child > span {\n  border-bottom-right-radius: 4px;\n  border-top-right-radius: 4px;\n}\n.pagination > li > a:hover,\n.pagination > li > span:hover,\n.pagination > li > a:focus,\n.pagination > li > span:focus {\n  z-index: 2;\n  color: #22527b;\n  background-color: #eee;\n  border-color: #ccc;\n}\n.pagination > .active > a,\n.pagination > .active > span,\n.pagination > .active > a:hover,\n.pagination > .active > span:hover,\n.pagination > .active > a:focus,\n.pagination > .active > span:focus {\n  z-index: 3;\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #337ab7;\n  cursor: default;\n}\n.pagination > .disabled > span,\n.pagination > .disabled > span:hover,\n.pagination > .disabled > span:focus,\n.pagination > .disabled > a,\n.pagination > .disabled > a:hover,\n.pagination > .disabled > a:focus {\n  color: #ccc;\n  background-color: #fff;\n  border-color: #ccc;\n  cursor: not-allowed;\n}\n.pagination-lg > li > a,\n.pagination-lg > li > span {\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n}\n.pagination-lg > li:first-child > a,\n.pagination-lg > li:first-child > span {\n  border-bottom-left-radius: 6px;\n  border-top-left-radius: 6px;\n}\n.pagination-lg > li:last-child > a,\n.pagination-lg > li:last-child > span {\n  border-bottom-right-radius: 6px;\n  border-top-right-radius: 6px;\n}\n.pagination-sm > li > a,\n.pagination-sm > li > span {\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n}\n.pagination-sm > li:first-child > a,\n.pagination-sm > li:first-child > span {\n  border-bottom-left-radius: 3px;\n  border-top-left-radius: 3px;\n}\n.pagination-sm > li:last-child > a,\n.pagination-sm > li:last-child > span {\n  border-bottom-right-radius: 3px;\n  border-top-right-radius: 3px;\n}\n.pager {\n  padding-left: 0;\n  margin: 20px 0;\n  list-style: none;\n  text-align: center;\n}\n.pager li {\n  display: inline;\n}\n.pager li > a,\n.pager li > span {\n  display: inline-block;\n  padding: 5px 14px;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border-radius: 15px;\n}\n.pager li > a:hover,\n.pager li > a:focus {\n  text-decoration: none;\n  background-color: #eee;\n}\n.pager .next > a,\n.pager .next > span {\n  float: right;\n}\n.pager .previous > a,\n.pager .previous > span {\n  float: left;\n}\n.pager .disabled > a,\n.pager .disabled > a:hover,\n.pager .disabled > a:focus,\n.pager .disabled > span {\n  color: #ccc;\n  background-color: #fff;\n  cursor: not-allowed;\n}\n.label {\n  display: inline;\n  padding: .2em .6em .3em;\n  font-size: 75%;\n  font-weight: bold;\n  line-height: 1;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: .25em;\n}\na.label:hover,\na.label:focus {\n  color: #fff;\n  text-decoration: none;\n  cursor: pointer;\n}\n.label:empty {\n  display: none;\n}\n.btn .label {\n  position: relative;\n  top: -1px;\n}\n.label-default {\n  background-color: #ccc;\n}\n.label-default[href]:hover,\n.label-default[href]:focus {\n  background-color: #b3b3b3;\n}\n.label-primary {\n  background-color: #337ab7;\n}\n.label-primary[href]:hover,\n.label-primary[href]:focus {\n  background-color: #285f8f;\n}\n.label-success {\n  background-color: #2b9b5f;\n}\n.label-success[href]:hover,\n.label-success[href]:focus {\n  background-color: #207347;\n}\n.label-info {\n  background-color: #c1d7e9;\n}\n.label-info[href]:hover,\n.label-info[href]:focus {\n  background-color: #9bbfdc;\n}\n.label-warning {\n  background-color: #f0ad4e;\n}\n.label-warning[href]:hover,\n.label-warning[href]:focus {\n  background-color: #ec971f;\n}\n.label-danger {\n  background-color: #d9534f;\n}\n.label-danger[href]:hover,\n.label-danger[href]:focus {\n  background-color: #c9302c;\n}\n.badge {\n  display: inline-block;\n  min-width: 10px;\n  padding: 3px 7px;\n  font-size: 12px;\n  font-weight: bold;\n  color: #fff;\n  line-height: 1;\n  vertical-align: middle;\n  white-space: nowrap;\n  text-align: center;\n  background-color: #ccc;\n  border-radius: 10px;\n}\n.badge:empty {\n  display: none;\n}\n.btn .badge {\n  position: relative;\n  top: -1px;\n}\n.btn-xs .badge,\n.btn-group-xs > .btn .badge {\n  top: 0;\n  padding: 1px 5px;\n}\na.badge:hover,\na.badge:focus {\n  color: #fff;\n  text-decoration: none;\n  cursor: pointer;\n}\n.list-group-item.active > .badge,\n.nav-pills > .active > a > .badge {\n  color: #337ab7;\n  background-color: #fff;\n}\n.list-group-item > .badge {\n  float: right;\n}\n.list-group-item > .badge + .badge {\n  margin-right: 5px;\n}\n.nav-pills > li > a > .badge {\n  margin-left: 3px;\n}\n.jumbotron {\n  padding-top: 30px;\n  padding-bottom: 30px;\n  margin-bottom: 30px;\n  color: inherit;\n  background-color: #eee;\n}\n.jumbotron h1,\n.jumbotron .h1 {\n  color: inherit;\n}\n.jumbotron p {\n  margin-bottom: 15px;\n  font-size: 21px;\n  font-weight: 200;\n}\n.jumbotron > hr {\n  border-top-color: #d5d5d5;\n}\n.container .jumbotron,\n.container-fluid .jumbotron {\n  border-radius: 6px;\n  padding-left: 15px;\n  padding-right: 15px;\n}\n.jumbotron .container {\n  max-width: 100%;\n}\n@media screen and (min-width: 768px) {\n  .jumbotron {\n    padding-top: 48px;\n    padding-bottom: 48px;\n  }\n  .container .jumbotron,\n  .container-fluid .jumbotron {\n    padding-left: 60px;\n    padding-right: 60px;\n  }\n  .jumbotron h1,\n  .jumbotron .h1 {\n    font-size: 63px;\n  }\n}\n.thumbnail {\n  display: block;\n  padding: 4px;\n  margin-bottom: 20px;\n  line-height: 1.42857143;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  -webkit-transition: border 0.2s ease-in-out;\n  -o-transition: border 0.2s ease-in-out;\n  transition: border 0.2s ease-in-out;\n}\n.thumbnail > img,\n.thumbnail a > img {\n  margin-left: auto;\n  margin-right: auto;\n}\na.thumbnail:hover,\na.thumbnail:focus,\na.thumbnail.active {\n  border-color: #337ab7;\n}\n.thumbnail .caption {\n  padding: 9px;\n  color: #333333;\n}\n.alert {\n  padding: 15px;\n  margin-bottom: 20px;\n  border: 1px solid transparent;\n  border-radius: 4px;\n}\n.alert h4 {\n  margin-top: 0;\n  color: inherit;\n}\n.alert .alert-link {\n  font-weight: bold;\n}\n.alert > p,\n.alert > ul {\n  margin-bottom: 0;\n}\n.alert > p + p {\n  margin-top: 5px;\n}\n.alert-dismissable,\n.alert-dismissible {\n  padding-right: 35px;\n}\n.alert-dismissable .close,\n.alert-dismissible .close {\n  position: relative;\n  top: -2px;\n  right: -21px;\n  color: inherit;\n}\n.alert-success {\n  background-color: #dff0d8;\n  border-color: #d6e9c6;\n  color: #2b9b5f;\n}\n.alert-success hr {\n  border-top-color: #c9e2b3;\n}\n.alert-success .alert-link {\n  color: #207347;\n}\n.alert-info {\n  background-color: #d9edf7;\n  border-color: #bce8f1;\n  color: #c1d7e9;\n}\n.alert-info hr {\n  border-top-color: #a6e1ec;\n}\n.alert-info .alert-link {\n  color: #9bbfdc;\n}\n.alert-warning {\n  background-color: #fcf8e3;\n  border-color: #faebcc;\n  color: #8a6d3b;\n}\n.alert-warning hr {\n  border-top-color: #f7e1b5;\n}\n.alert-warning .alert-link {\n  color: #66512c;\n}\n.alert-danger {\n  background-color: #f2dede;\n  border-color: #ebccd1;\n  color: #d9534f;\n}\n.alert-danger hr {\n  border-top-color: #e4b9c0;\n}\n.alert-danger .alert-link {\n  color: #c9302c;\n}\n@-webkit-keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0;\n  }\n  to {\n    background-position: 0 0;\n  }\n}\n@keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0;\n  }\n  to {\n    background-position: 0 0;\n  }\n}\n.progress {\n  overflow: hidden;\n  height: 20px;\n  margin-bottom: 20px;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);\n}\n.progress-bar {\n  float: left;\n  width: 0%;\n  height: 100%;\n  font-size: 12px;\n  line-height: 20px;\n  color: #fff;\n  text-align: center;\n  background-color: #337ab7;\n  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);\n  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);\n  -webkit-transition: width 0.6s ease;\n  -o-transition: width 0.6s ease;\n  transition: width 0.6s ease;\n}\n.progress-striped .progress-bar,\n.progress-bar-striped {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-size: 40px 40px;\n}\n.progress.active .progress-bar,\n.progress-bar.active {\n  -webkit-animation: progress-bar-stripes 2s linear infinite;\n  -o-animation: progress-bar-stripes 2s linear infinite;\n  animation: progress-bar-stripes 2s linear infinite;\n}\n.progress-bar-success {\n  background-color: #2b9b5f;\n}\n.progress-striped .progress-bar-success {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n}\n.progress-bar-info {\n  background-color: #c1d7e9;\n}\n.progress-striped .progress-bar-info {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n}\n.progress-bar-warning {\n  background-color: #f0ad4e;\n}\n.progress-striped .progress-bar-warning {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n}\n.progress-bar-danger {\n  background-color: #d9534f;\n}\n.progress-striped .progress-bar-danger {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n}\n.media {\n  margin-top: 15px;\n}\n.media:first-child {\n  margin-top: 0;\n}\n.media,\n.media-body {\n  zoom: 1;\n  overflow: hidden;\n}\n.media-body {\n  width: 10000px;\n}\n.media-object {\n  display: block;\n}\n.media-object.img-thumbnail {\n  max-width: none;\n}\n.media-right,\n.media > .pull-right {\n  padding-left: 10px;\n}\n.media-left,\n.media > .pull-left {\n  padding-right: 10px;\n}\n.media-left,\n.media-right,\n.media-body {\n  display: table-cell;\n  vertical-align: top;\n}\n.media-middle {\n  vertical-align: middle;\n}\n.media-bottom {\n  vertical-align: bottom;\n}\n.media-heading {\n  margin-top: 0;\n  margin-bottom: 5px;\n}\n.media-list {\n  padding-left: 0;\n  list-style: none;\n}\n.list-group {\n  margin-bottom: 20px;\n  padding-left: 0;\n}\n.list-group-item {\n  position: relative;\n  display: block;\n  padding: 10px 15px;\n  margin-bottom: -1px;\n  background-color: #fff;\n  border: 1px solid #ccc;\n}\n.list-group-item:first-child {\n  border-top-right-radius: 4px;\n  border-top-left-radius: 4px;\n}\n.list-group-item:last-child {\n  margin-bottom: 0;\n  border-bottom-right-radius: 4px;\n  border-bottom-left-radius: 4px;\n}\na.list-group-item,\nbutton.list-group-item {\n  color: #555;\n}\na.list-group-item .list-group-item-heading,\nbutton.list-group-item .list-group-item-heading {\n  color: #333;\n}\na.list-group-item:hover,\nbutton.list-group-item:hover,\na.list-group-item:focus,\nbutton.list-group-item:focus {\n  text-decoration: none;\n  color: #555;\n  background-color: #f5f5f5;\n}\nbutton.list-group-item {\n  width: 100%;\n  text-align: left;\n}\n.list-group-item.disabled,\n.list-group-item.disabled:hover,\n.list-group-item.disabled:focus {\n  background-color: #eee;\n  color: #ccc;\n  cursor: not-allowed;\n}\n.list-group-item.disabled .list-group-item-heading,\n.list-group-item.disabled:hover .list-group-item-heading,\n.list-group-item.disabled:focus .list-group-item-heading {\n  color: inherit;\n}\n.list-group-item.disabled .list-group-item-text,\n.list-group-item.disabled:hover .list-group-item-text,\n.list-group-item.disabled:focus .list-group-item-text {\n  color: #ccc;\n}\n.list-group-item.active,\n.list-group-item.active:hover,\n.list-group-item.active:focus {\n  z-index: 2;\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #337ab7;\n}\n.list-group-item.active .list-group-item-heading,\n.list-group-item.active:hover .list-group-item-heading,\n.list-group-item.active:focus .list-group-item-heading,\n.list-group-item.active .list-group-item-heading > small,\n.list-group-item.active:hover .list-group-item-heading > small,\n.list-group-item.active:focus .list-group-item-heading > small,\n.list-group-item.active .list-group-item-heading > .small,\n.list-group-item.active:hover .list-group-item-heading > .small,\n.list-group-item.active:focus .list-group-item-heading > .small {\n  color: inherit;\n}\n.list-group-item.active .list-group-item-text,\n.list-group-item.active:hover .list-group-item-text,\n.list-group-item.active:focus .list-group-item-text {\n  color: #c7ddef;\n}\n.list-group-item-success {\n  color: #2b9b5f;\n  background-color: #dff0d8;\n}\na.list-group-item-success,\nbutton.list-group-item-success {\n  color: #2b9b5f;\n}\na.list-group-item-success .list-group-item-heading,\nbutton.list-group-item-success .list-group-item-heading {\n  color: inherit;\n}\na.list-group-item-success:hover,\nbutton.list-group-item-success:hover,\na.list-group-item-success:focus,\nbutton.list-group-item-success:focus {\n  color: #2b9b5f;\n  background-color: #d0e9c6;\n}\na.list-group-item-success.active,\nbutton.list-group-item-success.active,\na.list-group-item-success.active:hover,\nbutton.list-group-item-success.active:hover,\na.list-group-item-success.active:focus,\nbutton.list-group-item-success.active:focus {\n  color: #fff;\n  background-color: #2b9b5f;\n  border-color: #2b9b5f;\n}\n.list-group-item-info {\n  color: #c1d7e9;\n  background-color: #d9edf7;\n}\na.list-group-item-info,\nbutton.list-group-item-info {\n  color: #c1d7e9;\n}\na.list-group-item-info .list-group-item-heading,\nbutton.list-group-item-info .list-group-item-heading {\n  color: inherit;\n}\na.list-group-item-info:hover,\nbutton.list-group-item-info:hover,\na.list-group-item-info:focus,\nbutton.list-group-item-info:focus {\n  color: #c1d7e9;\n  background-color: #c4e3f3;\n}\na.list-group-item-info.active,\nbutton.list-group-item-info.active,\na.list-group-item-info.active:hover,\nbutton.list-group-item-info.active:hover,\na.list-group-item-info.active:focus,\nbutton.list-group-item-info.active:focus {\n  color: #fff;\n  background-color: #c1d7e9;\n  border-color: #c1d7e9;\n}\n.list-group-item-warning {\n  color: #8a6d3b;\n  background-color: #fcf8e3;\n}\na.list-group-item-warning,\nbutton.list-group-item-warning {\n  color: #8a6d3b;\n}\na.list-group-item-warning .list-group-item-heading,\nbutton.list-group-item-warning .list-group-item-heading {\n  color: inherit;\n}\na.list-group-item-warning:hover,\nbutton.list-group-item-warning:hover,\na.list-group-item-warning:focus,\nbutton.list-group-item-warning:focus {\n  color: #8a6d3b;\n  background-color: #faf2cc;\n}\na.list-group-item-warning.active,\nbutton.list-group-item-warning.active,\na.list-group-item-warning.active:hover,\nbutton.list-group-item-warning.active:hover,\na.list-group-item-warning.active:focus,\nbutton.list-group-item-warning.active:focus {\n  color: #fff;\n  background-color: #8a6d3b;\n  border-color: #8a6d3b;\n}\n.list-group-item-danger {\n  color: #d9534f;\n  background-color: #f2dede;\n}\na.list-group-item-danger,\nbutton.list-group-item-danger {\n  color: #d9534f;\n}\na.list-group-item-danger .list-group-item-heading,\nbutton.list-group-item-danger .list-group-item-heading {\n  color: inherit;\n}\na.list-group-item-danger:hover,\nbutton.list-group-item-danger:hover,\na.list-group-item-danger:focus,\nbutton.list-group-item-danger:focus {\n  color: #d9534f;\n  background-color: #ebcccc;\n}\na.list-group-item-danger.active,\nbutton.list-group-item-danger.active,\na.list-group-item-danger.active:hover,\nbutton.list-group-item-danger.active:hover,\na.list-group-item-danger.active:focus,\nbutton.list-group-item-danger.active:focus {\n  color: #fff;\n  background-color: #d9534f;\n  border-color: #d9534f;\n}\n.list-group-item-heading {\n  margin-top: 0;\n  margin-bottom: 5px;\n}\n.list-group-item-text {\n  margin-bottom: 0;\n  line-height: 1.3;\n}\n.panel {\n  margin-bottom: 20px;\n  background-color: #fff;\n  border: 1px solid transparent;\n  border-radius: 4px;\n  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);\n  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);\n}\n.panel-body {\n  padding: 15px;\n}\n.panel-heading {\n  padding: 10px 15px;\n  border-bottom: 1px solid transparent;\n  border-top-right-radius: 3px;\n  border-top-left-radius: 3px;\n}\n.panel-heading > .dropdown .dropdown-toggle {\n  color: inherit;\n}\n.panel-title {\n  margin-top: 0;\n  margin-bottom: 0;\n  font-size: 16px;\n  color: inherit;\n}\n.panel-title > a,\n.panel-title > small,\n.panel-title > .small,\n.panel-title > small > a,\n.panel-title > .small > a {\n  color: inherit;\n}\n.panel-footer {\n  padding: 10px 15px;\n  background-color: #f5f5f5;\n  border-top: 1px solid #eee;\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n}\n.panel > .list-group,\n.panel > .panel-collapse > .list-group {\n  margin-bottom: 0;\n}\n.panel > .list-group .list-group-item,\n.panel > .panel-collapse > .list-group .list-group-item {\n  border-width: 1px 0;\n  border-radius: 0;\n}\n.panel > .list-group:first-child .list-group-item:first-child,\n.panel > .panel-collapse > .list-group:first-child .list-group-item:first-child {\n  border-top: 0;\n  border-top-right-radius: 3px;\n  border-top-left-radius: 3px;\n}\n.panel > .list-group:last-child .list-group-item:last-child,\n.panel > .panel-collapse > .list-group:last-child .list-group-item:last-child {\n  border-bottom: 0;\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n}\n.panel > .panel-heading + .panel-collapse > .list-group .list-group-item:first-child {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n}\n.panel-heading + .list-group .list-group-item:first-child {\n  border-top-width: 0;\n}\n.list-group + .panel-footer {\n  border-top-width: 0;\n}\n.panel > .table,\n.panel > .table-responsive > .table,\n.panel > .panel-collapse > .table {\n  margin-bottom: 0;\n}\n.panel > .table caption,\n.panel > .table-responsive > .table caption,\n.panel > .panel-collapse > .table caption {\n  padding-left: 15px;\n  padding-right: 15px;\n}\n.panel > .table:first-child,\n.panel > .table-responsive:first-child > .table:first-child {\n  border-top-right-radius: 3px;\n  border-top-left-radius: 3px;\n}\n.panel > .table:first-child > thead:first-child > tr:first-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child {\n  border-top-left-radius: 3px;\n  border-top-right-radius: 3px;\n}\n.panel > .table:first-child > thead:first-child > tr:first-child td:first-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:first-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child td:first-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:first-child,\n.panel > .table:first-child > thead:first-child > tr:first-child th:first-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:first-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child th:first-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:first-child {\n  border-top-left-radius: 3px;\n}\n.panel > .table:first-child > thead:first-child > tr:first-child td:last-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:last-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child td:last-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:last-child,\n.panel > .table:first-child > thead:first-child > tr:first-child th:last-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:last-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child th:last-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:last-child {\n  border-top-right-radius: 3px;\n}\n.panel > .table:last-child,\n.panel > .table-responsive:last-child > .table:last-child {\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n}\n.panel > .table:last-child > tbody:last-child > tr:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child {\n  border-bottom-left-radius: 3px;\n  border-bottom-right-radius: 3px;\n}\n.panel > .table:last-child > tbody:last-child > tr:last-child td:first-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:first-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\n.panel > .table:last-child > tbody:last-child > tr:last-child th:first-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:first-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child th:first-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:first-child {\n  border-bottom-left-radius: 3px;\n}\n.panel > .table:last-child > tbody:last-child > tr:last-child td:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:last-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\n.panel > .table:last-child > tbody:last-child > tr:last-child th:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:last-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child th:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:last-child {\n  border-bottom-right-radius: 3px;\n}\n.panel > .panel-body + .table,\n.panel > .panel-body + .table-responsive,\n.panel > .table + .panel-body,\n.panel > .table-responsive + .panel-body {\n  border-top: 1px solid #ccc;\n}\n.panel > .table > tbody:first-child > tr:first-child th,\n.panel > .table > tbody:first-child > tr:first-child td {\n  border-top: 0;\n}\n.panel > .table-bordered,\n.panel > .table-responsive > .table-bordered {\n  border: 0;\n}\n.panel > .table-bordered > thead > tr > th:first-child,\n.panel > .table-responsive > .table-bordered > thead > tr > th:first-child,\n.panel > .table-bordered > tbody > tr > th:first-child,\n.panel > .table-responsive > .table-bordered > tbody > tr > th:first-child,\n.panel > .table-bordered > tfoot > tr > th:first-child,\n.panel > .table-responsive > .table-bordered > tfoot > tr > th:first-child,\n.panel > .table-bordered > thead > tr > td:first-child,\n.panel > .table-responsive > .table-bordered > thead > tr > td:first-child,\n.panel > .table-bordered > tbody > tr > td:first-child,\n.panel > .table-responsive > .table-bordered > tbody > tr > td:first-child,\n.panel > .table-bordered > tfoot > tr > td:first-child,\n.panel > .table-responsive > .table-bordered > tfoot > tr > td:first-child {\n  border-left: 0;\n}\n.panel > .table-bordered > thead > tr > th:last-child,\n.panel > .table-responsive > .table-bordered > thead > tr > th:last-child,\n.panel > .table-bordered > tbody > tr > th:last-child,\n.panel > .table-responsive > .table-bordered > tbody > tr > th:last-child,\n.panel > .table-bordered > tfoot > tr > th:last-child,\n.panel > .table-responsive > .table-bordered > tfoot > tr > th:last-child,\n.panel > .table-bordered > thead > tr > td:last-child,\n.panel > .table-responsive > .table-bordered > thead > tr > td:last-child,\n.panel > .table-bordered > tbody > tr > td:last-child,\n.panel > .table-responsive > .table-bordered > tbody > tr > td:last-child,\n.panel > .table-bordered > tfoot > tr > td:last-child,\n.panel > .table-responsive > .table-bordered > tfoot > tr > td:last-child {\n  border-right: 0;\n}\n.panel > .table-bordered > thead > tr:first-child > td,\n.panel > .table-responsive > .table-bordered > thead > tr:first-child > td,\n.panel > .table-bordered > tbody > tr:first-child > td,\n.panel > .table-responsive > .table-bordered > tbody > tr:first-child > td,\n.panel > .table-bordered > thead > tr:first-child > th,\n.panel > .table-responsive > .table-bordered > thead > tr:first-child > th,\n.panel > .table-bordered > tbody > tr:first-child > th,\n.panel > .table-responsive > .table-bordered > tbody > tr:first-child > th {\n  border-bottom: 0;\n}\n.panel > .table-bordered > tbody > tr:last-child > td,\n.panel > .table-responsive > .table-bordered > tbody > tr:last-child > td,\n.panel > .table-bordered > tfoot > tr:last-child > td,\n.panel > .table-responsive > .table-bordered > tfoot > tr:last-child > td,\n.panel > .table-bordered > tbody > tr:last-child > th,\n.panel > .table-responsive > .table-bordered > tbody > tr:last-child > th,\n.panel > .table-bordered > tfoot > tr:last-child > th,\n.panel > .table-responsive > .table-bordered > tfoot > tr:last-child > th {\n  border-bottom: 0;\n}\n.panel > .table-responsive {\n  border: 0;\n  margin-bottom: 0;\n}\n.panel-group {\n  margin-bottom: 20px;\n}\n.panel-group .panel {\n  margin-bottom: 0;\n  border-radius: 4px;\n}\n.panel-group .panel + .panel {\n  margin-top: 5px;\n}\n.panel-group .panel-heading {\n  border-bottom: 0;\n}\n.panel-group .panel-heading + .panel-collapse > .panel-body,\n.panel-group .panel-heading + .panel-collapse > .list-group {\n  border-top: 1px solid #eee;\n}\n.panel-group .panel-footer {\n  border-top: 0;\n}\n.panel-group .panel-footer + .panel-collapse .panel-body {\n  border-bottom: 1px solid #eee;\n}\n.panel-default {\n  border-color: #ccc;\n}\n.panel-default > .panel-heading {\n  color: #333333;\n  background-color: #f5f5f5;\n  border-color: #ccc;\n}\n.panel-default > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #ccc;\n}\n.panel-default > .panel-heading .badge {\n  color: #f5f5f5;\n  background-color: #333333;\n}\n.panel-default > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #ccc;\n}\n.panel-primary {\n  border-color: #337ab7;\n}\n.panel-primary > .panel-heading {\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #337ab7;\n}\n.panel-primary > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #337ab7;\n}\n.panel-primary > .panel-heading .badge {\n  color: #337ab7;\n  background-color: #fff;\n}\n.panel-primary > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #337ab7;\n}\n.panel-success {\n  border-color: #d6e9c6;\n}\n.panel-success > .panel-heading {\n  color: #2b9b5f;\n  background-color: #dff0d8;\n  border-color: #d6e9c6;\n}\n.panel-success > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #d6e9c6;\n}\n.panel-success > .panel-heading .badge {\n  color: #dff0d8;\n  background-color: #2b9b5f;\n}\n.panel-success > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #d6e9c6;\n}\n.panel-info {\n  border-color: #bce8f1;\n}\n.panel-info > .panel-heading {\n  color: #c1d7e9;\n  background-color: #d9edf7;\n  border-color: #bce8f1;\n}\n.panel-info > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #bce8f1;\n}\n.panel-info > .panel-heading .badge {\n  color: #d9edf7;\n  background-color: #c1d7e9;\n}\n.panel-info > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #bce8f1;\n}\n.panel-warning {\n  border-color: #faebcc;\n}\n.panel-warning > .panel-heading {\n  color: #8a6d3b;\n  background-color: #fcf8e3;\n  border-color: #faebcc;\n}\n.panel-warning > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #faebcc;\n}\n.panel-warning > .panel-heading .badge {\n  color: #fcf8e3;\n  background-color: #8a6d3b;\n}\n.panel-warning > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #faebcc;\n}\n.panel-danger {\n  border-color: #ebccd1;\n}\n.panel-danger > .panel-heading {\n  color: #d9534f;\n  background-color: #f2dede;\n  border-color: #ebccd1;\n}\n.panel-danger > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #ebccd1;\n}\n.panel-danger > .panel-heading .badge {\n  color: #f2dede;\n  background-color: #d9534f;\n}\n.panel-danger > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #ebccd1;\n}\n.embed-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden;\n}\n.embed-responsive .embed-responsive-item,\n.embed-responsive iframe,\n.embed-responsive embed,\n.embed-responsive object,\n.embed-responsive video {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n  border: 0;\n}\n.embed-responsive-16by9 {\n  padding-bottom: 56.25%;\n}\n.embed-responsive-4by3 {\n  padding-bottom: 75%;\n}\n.well {\n  min-height: 20px;\n  padding: 19px;\n  margin-bottom: 20px;\n  background-color: #f5f5f5;\n  border: 1px solid #e3e3e3;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);\n}\n.well blockquote {\n  border-color: #ddd;\n  border-color: rgba(0, 0, 0, 0.15);\n}\n.well-lg {\n  padding: 24px;\n  border-radius: 6px;\n}\n.well-sm {\n  padding: 9px;\n  border-radius: 3px;\n}\n.close {\n  float: right;\n  font-size: 21px;\n  font-weight: bold;\n  line-height: 1;\n  color: #000;\n  text-shadow: 0 1px 0 #fff;\n  opacity: 0.2;\n  filter: alpha(opacity=20);\n}\n.close:hover,\n.close:focus {\n  color: #000;\n  text-decoration: none;\n  cursor: pointer;\n  opacity: 0.5;\n  filter: alpha(opacity=50);\n}\nbutton.close {\n  padding: 0;\n  cursor: pointer;\n  background: transparent;\n  border: 0;\n  -webkit-appearance: none;\n}\n.modal-open {\n  overflow: hidden;\n}\n.modal {\n  display: none;\n  overflow: hidden;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1050;\n  -webkit-overflow-scrolling: touch;\n  outline: 0;\n}\n.modal.fade .modal-dialog {\n  -webkit-transform: translate(0, -25%);\n  -ms-transform: translate(0, -25%);\n  -o-transform: translate(0, -25%);\n  transform: translate(0, -25%);\n  -webkit-transition: -webkit-transform 0.3s ease-out;\n  -moz-transition: -moz-transform 0.3s ease-out;\n  -o-transition: -o-transform 0.3s ease-out;\n  transition: transform 0.3s ease-out;\n}\n.modal.in .modal-dialog {\n  -webkit-transform: translate(0, 0);\n  -ms-transform: translate(0, 0);\n  -o-transform: translate(0, 0);\n  transform: translate(0, 0);\n}\n.modal-open .modal {\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n.modal-dialog {\n  position: relative;\n  width: auto;\n  margin: 10px;\n}\n.modal-content {\n  position: relative;\n  background-color: #fff;\n  border: 1px solid #999;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 6px;\n  -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);\n  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);\n  background-clip: padding-box;\n  outline: 0;\n}\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1040;\n  background-color: #000;\n}\n.modal-backdrop.fade {\n  opacity: 0;\n  filter: alpha(opacity=0);\n}\n.modal-backdrop.in {\n  opacity: 0.5;\n  filter: alpha(opacity=50);\n}\n.modal-header {\n  padding: 15px;\n  border-bottom: 1px solid #e5e5e5;\n}\n.modal-header .close {\n  margin-top: -2px;\n}\n.modal-title {\n  margin: 0;\n  line-height: 1.42857143;\n}\n.modal-body {\n  position: relative;\n  padding: 15px;\n}\n.modal-footer {\n  padding: 15px;\n  text-align: right;\n  border-top: 1px solid #e5e5e5;\n}\n.modal-footer .btn + .btn {\n  margin-left: 5px;\n  margin-bottom: 0;\n}\n.modal-footer .btn-group .btn + .btn {\n  margin-left: -1px;\n}\n.modal-footer .btn-block + .btn-block {\n  margin-left: 0;\n}\n.modal-scrollbar-measure {\n  position: absolute;\n  top: -9999px;\n  width: 50px;\n  height: 50px;\n  overflow: scroll;\n}\n@media (min-width: 768px) {\n  .modal-dialog {\n    width: 600px;\n    margin: 30px auto;\n  }\n  .modal-content {\n    -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);\n    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);\n  }\n  .modal-sm {\n    width: 300px;\n  }\n}\n@media (min-width: 992px) {\n  .modal-lg {\n    width: 900px;\n  }\n}\n.tooltip {\n  position: absolute;\n  z-index: 1070;\n  display: block;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-style: normal;\n  font-weight: normal;\n  letter-spacing: normal;\n  line-break: auto;\n  line-height: 1.42857143;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  white-space: normal;\n  word-break: normal;\n  word-spacing: normal;\n  word-wrap: normal;\n  font-size: 12px;\n  opacity: 0;\n  filter: alpha(opacity=0);\n}\n.tooltip.in {\n  opacity: 0.95;\n  filter: alpha(opacity=95);\n}\n.tooltip.top {\n  margin-top: -3px;\n  padding: 5px 0;\n}\n.tooltip.right {\n  margin-left: 3px;\n  padding: 0 5px;\n}\n.tooltip.bottom {\n  margin-top: 3px;\n  padding: 5px 0;\n}\n.tooltip.left {\n  margin-left: -3px;\n  padding: 0 5px;\n}\n.tooltip-inner {\n  max-width: 250px;\n  padding: 3px 8px;\n  color: #333333;\n  text-align: center;\n  background-color: #ffffb2;\n  border-radius: 4px;\n}\n.tooltip-arrow {\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid;\n}\n.tooltip.top .tooltip-arrow {\n  bottom: 0;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #ffffb2;\n}\n.tooltip.top-left .tooltip-arrow {\n  bottom: 0;\n  right: 5px;\n  margin-bottom: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #ffffb2;\n}\n.tooltip.top-right .tooltip-arrow {\n  bottom: 0;\n  left: 5px;\n  margin-bottom: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #ffffb2;\n}\n.tooltip.right .tooltip-arrow {\n  top: 50%;\n  left: 0;\n  margin-top: -5px;\n  border-width: 5px 5px 5px 0;\n  border-right-color: #ffffb2;\n}\n.tooltip.left .tooltip-arrow {\n  top: 50%;\n  right: 0;\n  margin-top: -5px;\n  border-width: 5px 0 5px 5px;\n  border-left-color: #ffffb2;\n}\n.tooltip.bottom .tooltip-arrow {\n  top: 0;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #ffffb2;\n}\n.tooltip.bottom-left .tooltip-arrow {\n  top: 0;\n  right: 5px;\n  margin-top: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #ffffb2;\n}\n.tooltip.bottom-right .tooltip-arrow {\n  top: 0;\n  left: 5px;\n  margin-top: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #ffffb2;\n}\n.popover {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1060;\n  display: none;\n  max-width: 276px;\n  padding: 1px;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-style: normal;\n  font-weight: normal;\n  letter-spacing: normal;\n  line-break: auto;\n  line-height: 1.42857143;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  white-space: normal;\n  word-break: normal;\n  word-spacing: normal;\n  word-wrap: normal;\n  font-size: 14px;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid #ccc;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 6px;\n  -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);\n  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);\n}\n.popover.top {\n  margin-top: -10px;\n}\n.popover.right {\n  margin-left: 10px;\n}\n.popover.bottom {\n  margin-top: 10px;\n}\n.popover.left {\n  margin-left: -10px;\n}\n.popover-title {\n  margin: 0;\n  padding: 8px 14px;\n  font-size: 14px;\n  background-color: #f7f7f7;\n  border-bottom: 1px solid #ebebeb;\n  border-radius: 5px 5px 0 0;\n}\n.popover-content {\n  padding: 9px 14px;\n}\n.popover > .arrow,\n.popover > .arrow:after {\n  position: absolute;\n  display: block;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid;\n}\n.popover > .arrow {\n  border-width: 11px;\n}\n.popover > .arrow:after {\n  border-width: 10px;\n  content: \"\";\n}\n.popover.top > .arrow {\n  left: 50%;\n  margin-left: -11px;\n  border-bottom-width: 0;\n  border-top-color: #999999;\n  border-top-color: rgba(0, 0, 0, 0.25);\n  bottom: -11px;\n}\n.popover.top > .arrow:after {\n  content: \" \";\n  bottom: 1px;\n  margin-left: -10px;\n  border-bottom-width: 0;\n  border-top-color: #fff;\n}\n.popover.right > .arrow {\n  top: 50%;\n  left: -11px;\n  margin-top: -11px;\n  border-left-width: 0;\n  border-right-color: #999999;\n  border-right-color: rgba(0, 0, 0, 0.25);\n}\n.popover.right > .arrow:after {\n  content: \" \";\n  left: 1px;\n  bottom: -10px;\n  border-left-width: 0;\n  border-right-color: #fff;\n}\n.popover.bottom > .arrow {\n  left: 50%;\n  margin-left: -11px;\n  border-top-width: 0;\n  border-bottom-color: #999999;\n  border-bottom-color: rgba(0, 0, 0, 0.25);\n  top: -11px;\n}\n.popover.bottom > .arrow:after {\n  content: \" \";\n  top: 1px;\n  margin-left: -10px;\n  border-top-width: 0;\n  border-bottom-color: #fff;\n}\n.popover.left > .arrow {\n  top: 50%;\n  right: -11px;\n  margin-top: -11px;\n  border-right-width: 0;\n  border-left-color: #999999;\n  border-left-color: rgba(0, 0, 0, 0.25);\n}\n.popover.left > .arrow:after {\n  content: \" \";\n  right: 1px;\n  border-right-width: 0;\n  border-left-color: #fff;\n  bottom: -10px;\n}\n.carousel {\n  position: relative;\n}\n.carousel-inner {\n  position: relative;\n  overflow: hidden;\n  width: 100%;\n}\n.carousel-inner > .item {\n  display: none;\n  position: relative;\n  -webkit-transition: 0.6s ease-in-out left;\n  -o-transition: 0.6s ease-in-out left;\n  transition: 0.6s ease-in-out left;\n}\n.carousel-inner > .item > img,\n.carousel-inner > .item > a > img {\n  line-height: 1;\n}\n@media all and (transform-3d), (-webkit-transform-3d) {\n  .carousel-inner > .item {\n    -webkit-transition: -webkit-transform 0.6s ease-in-out;\n    -moz-transition: -moz-transform 0.6s ease-in-out;\n    -o-transition: -o-transform 0.6s ease-in-out;\n    transition: transform 0.6s ease-in-out;\n    -webkit-backface-visibility: hidden;\n    -moz-backface-visibility: hidden;\n    backface-visibility: hidden;\n    -webkit-perspective: 1000px;\n    -moz-perspective: 1000px;\n    perspective: 1000px;\n  }\n  .carousel-inner > .item.next,\n  .carousel-inner > .item.active.right {\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n    left: 0;\n  }\n  .carousel-inner > .item.prev,\n  .carousel-inner > .item.active.left {\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0);\n    left: 0;\n  }\n  .carousel-inner > .item.next.left,\n  .carousel-inner > .item.prev.right,\n  .carousel-inner > .item.active {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n    left: 0;\n  }\n}\n.carousel-inner > .active,\n.carousel-inner > .next,\n.carousel-inner > .prev {\n  display: block;\n}\n.carousel-inner > .active {\n  left: 0;\n}\n.carousel-inner > .next,\n.carousel-inner > .prev {\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n.carousel-inner > .next {\n  left: 100%;\n}\n.carousel-inner > .prev {\n  left: -100%;\n}\n.carousel-inner > .next.left,\n.carousel-inner > .prev.right {\n  left: 0;\n}\n.carousel-inner > .active.left {\n  left: -100%;\n}\n.carousel-inner > .active.right {\n  left: 100%;\n}\n.carousel-control {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  width: 15%;\n  opacity: 0.5;\n  filter: alpha(opacity=50);\n  font-size: 20px;\n  color: #fff;\n  text-align: center;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);\n  background-color: rgba(0, 0, 0, 0);\n}\n.carousel-control.left {\n  background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n  background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#80000000', endColorstr='#00000000', GradientType=1);\n}\n.carousel-control.right {\n  left: auto;\n  right: 0;\n  background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n  background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#80000000', GradientType=1);\n}\n.carousel-control:hover,\n.carousel-control:focus {\n  outline: 0;\n  color: #fff;\n  text-decoration: none;\n  opacity: 0.9;\n  filter: alpha(opacity=90);\n}\n.carousel-control .icon-prev,\n.carousel-control .icon-next,\n.carousel-control .glyphicon-chevron-left,\n.carousel-control .glyphicon-chevron-right {\n  position: absolute;\n  top: 50%;\n  margin-top: -10px;\n  z-index: 5;\n  display: inline-block;\n}\n.carousel-control .icon-prev,\n.carousel-control .glyphicon-chevron-left {\n  left: 50%;\n  margin-left: -10px;\n}\n.carousel-control .icon-next,\n.carousel-control .glyphicon-chevron-right {\n  right: 50%;\n  margin-right: -10px;\n}\n.carousel-control .icon-prev,\n.carousel-control .icon-next {\n  width: 20px;\n  height: 20px;\n  line-height: 1;\n  font-family: serif;\n}\n.carousel-control .icon-prev:before {\n  content: '\\2039';\n}\n.carousel-control .icon-next:before {\n  content: '\\203a';\n}\n.carousel-indicators {\n  position: absolute;\n  bottom: 10px;\n  left: 50%;\n  z-index: 15;\n  width: 60%;\n  margin-left: -30%;\n  padding-left: 0;\n  list-style: none;\n  text-align: center;\n}\n.carousel-indicators li {\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  margin: 1px;\n  text-indent: -999px;\n  border: 1px solid #fff;\n  border-radius: 10px;\n  cursor: pointer;\n  background-color: #000 \\9;\n  background-color: rgba(0, 0, 0, 0);\n}\n.carousel-indicators .active {\n  margin: 0;\n  width: 12px;\n  height: 12px;\n  background-color: #fff;\n}\n.carousel-caption {\n  position: absolute;\n  left: 15%;\n  right: 15%;\n  bottom: 20px;\n  z-index: 10;\n  padding-top: 20px;\n  padding-bottom: 20px;\n  color: #fff;\n  text-align: center;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);\n}\n.carousel-caption .btn {\n  text-shadow: none;\n}\n@media screen and (min-width: 768px) {\n  .carousel-control .glyphicon-chevron-left,\n  .carousel-control .glyphicon-chevron-right,\n  .carousel-control .icon-prev,\n  .carousel-control .icon-next {\n    width: 30px;\n    height: 30px;\n    margin-top: -10px;\n    font-size: 30px;\n  }\n  .carousel-control .glyphicon-chevron-left,\n  .carousel-control .icon-prev {\n    margin-left: -10px;\n  }\n  .carousel-control .glyphicon-chevron-right,\n  .carousel-control .icon-next {\n    margin-right: -10px;\n  }\n  .carousel-caption {\n    left: 20%;\n    right: 20%;\n    padding-bottom: 30px;\n  }\n  .carousel-indicators {\n    bottom: 20px;\n  }\n}\n.clearfix:before,\n.clearfix:after,\n.dl-horizontal dd:before,\n.dl-horizontal dd:after,\n.container:before,\n.container:after,\n.container-fluid:before,\n.container-fluid:after,\n.row:before,\n.row:after,\n.form-horizontal .form-group:before,\n.form-horizontal .form-group:after,\n.btn-toolbar:before,\n.btn-toolbar:after,\n.btn-group-vertical > .btn-group:before,\n.btn-group-vertical > .btn-group:after,\n.nav:before,\n.nav:after,\n.navbar:before,\n.navbar:after,\n.navbar-header:before,\n.navbar-header:after,\n.navbar-collapse:before,\n.navbar-collapse:after,\n.pager:before,\n.pager:after,\n.panel-body:before,\n.panel-body:after,\n.modal-header:before,\n.modal-header:after,\n.modal-footer:before,\n.modal-footer:after {\n  content: \" \";\n  display: table;\n}\n.clearfix:after,\n.dl-horizontal dd:after,\n.container:after,\n.container-fluid:after,\n.row:after,\n.form-horizontal .form-group:after,\n.btn-toolbar:after,\n.btn-group-vertical > .btn-group:after,\n.nav:after,\n.navbar:after,\n.navbar-header:after,\n.navbar-collapse:after,\n.pager:after,\n.panel-body:after,\n.modal-header:after,\n.modal-footer:after {\n  clear: both;\n}\n.center-block {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n.pull-right {\n  float: right !important;\n}\n.pull-left {\n  float: left !important;\n}\n.hide {\n  display: none !important;\n}\n.show {\n  display: block !important;\n}\n.invisible {\n  visibility: hidden;\n}\n.text-hide {\n  font: 0/0 a;\n  color: transparent;\n  text-shadow: none;\n  background-color: transparent;\n  border: 0;\n}\n.hidden {\n  display: none !important;\n}\n.affix {\n  position: fixed;\n}\n@-ms-viewport {\n  width: device-width;\n}\n.visible-xs,\n.visible-sm,\n.visible-md,\n.visible-lg {\n  display: none !important;\n}\n.visible-xs-block,\n.visible-xs-inline,\n.visible-xs-inline-block,\n.visible-sm-block,\n.visible-sm-inline,\n.visible-sm-inline-block,\n.visible-md-block,\n.visible-md-inline,\n.visible-md-inline-block,\n.visible-lg-block,\n.visible-lg-inline,\n.visible-lg-inline-block {\n  display: none !important;\n}\n@media (max-width: 767px) {\n  .visible-xs {\n    display: block !important;\n  }\n  table.visible-xs {\n    display: table !important;\n  }\n  tr.visible-xs {\n    display: table-row !important;\n  }\n  th.visible-xs,\n  td.visible-xs {\n    display: table-cell !important;\n  }\n}\n@media (max-width: 767px) {\n  .visible-xs-block {\n    display: block !important;\n  }\n}\n@media (max-width: 767px) {\n  .visible-xs-inline {\n    display: inline !important;\n  }\n}\n@media (max-width: 767px) {\n  .visible-xs-inline-block {\n    display: inline-block !important;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm {\n    display: block !important;\n  }\n  table.visible-sm {\n    display: table !important;\n  }\n  tr.visible-sm {\n    display: table-row !important;\n  }\n  th.visible-sm,\n  td.visible-sm {\n    display: table-cell !important;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-block {\n    display: block !important;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-inline {\n    display: inline !important;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-inline-block {\n    display: inline-block !important;\n  }\n}\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md {\n    display: block !important;\n  }\n  table.visible-md {\n    display: table !important;\n  }\n  tr.visible-md {\n    display: table-row !important;\n  }\n  th.visible-md,\n  td.visible-md {\n    display: table-cell !important;\n  }\n}\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-block {\n    display: block !important;\n  }\n}\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-inline {\n    display: inline !important;\n  }\n}\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-inline-block {\n    display: inline-block !important;\n  }\n}\n@media (min-width: 1200px) {\n  .visible-lg {\n    display: block !important;\n  }\n  table.visible-lg {\n    display: table !important;\n  }\n  tr.visible-lg {\n    display: table-row !important;\n  }\n  th.visible-lg,\n  td.visible-lg {\n    display: table-cell !important;\n  }\n}\n@media (min-width: 1200px) {\n  .visible-lg-block {\n    display: block !important;\n  }\n}\n@media (min-width: 1200px) {\n  .visible-lg-inline {\n    display: inline !important;\n  }\n}\n@media (min-width: 1200px) {\n  .visible-lg-inline-block {\n    display: inline-block !important;\n  }\n}\n@media (max-width: 767px) {\n  .hidden-xs {\n    display: none !important;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .hidden-sm {\n    display: none !important;\n  }\n}\n@media (min-width: 992px) and (max-width: 1199px) {\n  .hidden-md {\n    display: none !important;\n  }\n}\n@media (min-width: 1200px) {\n  .hidden-lg {\n    display: none !important;\n  }\n}\n.visible-print {\n  display: none !important;\n}\n@media print {\n  .visible-print {\n    display: block !important;\n  }\n  table.visible-print {\n    display: table !important;\n  }\n  tr.visible-print {\n    display: table-row !important;\n  }\n  th.visible-print,\n  td.visible-print {\n    display: table-cell !important;\n  }\n}\n.visible-print-block {\n  display: none !important;\n}\n@media print {\n  .visible-print-block {\n    display: block !important;\n  }\n}\n.visible-print-inline {\n  display: none !important;\n}\n@media print {\n  .visible-print-inline {\n    display: inline !important;\n  }\n}\n.visible-print-inline-block {\n  display: none !important;\n}\n@media print {\n  .visible-print-inline-block {\n    display: inline-block !important;\n  }\n}\n@media print {\n  .hidden-print {\n    display: none !important;\n  }\n}\n.modal {\n  z-index: 5000;\n}\n.navbar {\n  z-index: 990;\n}\n.btn {\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0);\n}\n.btn-default {\n  background-color: #fafafa;\n}\n.btn:hover {\n  color: #337ab7;\n}\n.btn.btn-primary:hover {\n  color: #fff;\n}\n.dropdown-menu {\n  color: #333333;\n  background-color: #fff;\n  z-index: -1;\n}\n.dropdown-menu li {\n  padding-left: 15px;\n  padding-top: calc(7.5px);\n  padding-bottom: calc(7.5px);\n  font-size: 0.85em;\n}\n.dropdown-menu li:hover {\n  background-color: #337ab7;\n  color: #fff;\n}\n.dropdown-menu li.selected {\n  background-color: #337ab7;\n  color: #fff;\n}\n.dropdown {\n  display: inline-block;\n}\n.dropdown.open {\n  z-index: 1000;\n}\n.table {\n  font-size: 12px;\n}\n.form-group {\n  margin-bottom: 10px;\n}\n.form-group label {\n  font-weight: normal;\n}\n.form-group label.required {\n  font-weight: bold;\n}\n.form-group label:after {\n  content: \": \";\n}\n.form-group-sm textarea.form-control {\n  height: 100%;\n}\n.form-group-sm select.form-control {\n  height: 26px;\n  line-height: 26px;\n}\n.form-group-sm .form-control {\n  height: 26px;\n  padding: 2px 10px;\n  font-size: 12px;\n  line-height: 1.25;\n}\n.form-horizontal {\n  font-size: 12px;\n}\n.form-horizontal .checkbox {\n  padding-top: 0;\n}\n.form-horizontal .checkbox label {\n  padding-left: 10px;\n}\n.form-horizontal .checkbox label input {\n  position: relative;\n  display: inline-block;\n}\n.form-horizontal .checkbox label span {\n  position: relative;\n  top: -2px;\n}\n.tooltip-inner {\n  text-align: left;\n  padding: 6px 12px;\n  font-size: 11px;\n}\n.badge {\n  background-color: #337ab7;\n}\nbody .datepicker table tr td.day:hover,\nbody .datepicker table tr td.day.focused {\n  background: #f5f5f5;\n}\nbody .datepicker thead tr:first-child th:hover,\nbody .datepicker tfoot tr th:hover {\n  background: #f5f5f5;\n}\nbody .picker-switch table tbody td span:hover,\nbody .picker-switch table tbody td span:focus {\n  background: #f5f5f5;\n}\n"; });
define('text!resources/elements/stamps/stamp-details.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"../../value-converters/empty-text\"></require>\n    <require from=\"../select-picker/select-picker\"></require>\n\n\t<div class=\"panel panel-default\">\n\t\t<div class=\"panel-heading panel-heading-with-actions\">\n\t\t\t<h4 class=\"panel-title\">${'editor.details-title'|t}</h4>\n            <div class=\"panel-actions btn-group\">\n                <button class=\"btn btn-xs btn-default ${(model.wantList) ? '' : 'active'}\" show.bind=\"!editing\" type=\"button\" click.delegate=\"changeEditMode('stamp')\" title=\"${'editor.createStamp-hint'|t}\">\n                    <span class=\"sw-icon-stamp\"></span>\n                </button>\n                <button class=\"btn btn-xs btn-default ${(model.wantList) ? 'active' : ''}\" if.bind=\"!editing\" type=\"button\" click.delegate=\"changeEditMode('wantList')\" title=\"${'editor.createWantlist-hint'|t}\">\n                    <span class=\"sw-icon-wantlist\"></span>\n                </button>\n                <button class=\"btn btn-xs btn-default ${(model.wantList) ? 'active' : ''}\" show.bind=\"editing\" type=\"button\" click.delegate=\"changeEditMode('create')\" title=\"${'editor.createStamp-hint'|t}\">\n                    <span class=\"sw-icon-plus\"></span>\n                </button>\n            </div>\n\t\t</div>\n\t\t<div class=\"panel-body\">\n\t\t\t<div class=\"form-group form-group-sm has-feedback\">\n\t\t\t\t<label for=\"details-countryRef\" class=\"col-sm-3 control-label\">${'editor.country'|t}</label>\n\t\t\t\t<div class=\"col-sm-9\">\n                    <select-picker items.bind=\"countries\" disabled.bind=\"loading\" class=\"country-selector\" value.two-way=\"model.countryRef\"\n                        config.bind=\"{ id: 'details-countryRef', tabIndex: 40, labelProperty: 'name', valueProperty: 'id', filterSearch: true, caption: 'editor.country-select' }\"></select-picker>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"form-group form-group-sm has-feedback\">\n\t\t\t\t<label for=\"details-rate\" class=\"col-sm-3 control-label\">${'editor.rate'|t}</label>\n\t\t\t\t<div class=\"col-sm-3\">\n\t\t\t\t\t<input type=\"text\" tabindex=\"51\" required aria-required=\"true\" class=\"form-control\" value.bind=\"model.rate | emptyText\" id=\"details-rate\" aria-describedby=\"rateStatus\">\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"form-group form-group-sm\">\n\t\t\t\t<label for=\"details-description\" class=\"col-sm-3 control-label\">${'editor.description'|t}</label>\n\t\t\t\t<div class=\"col-sm-9\">\n\t\t\t\t\t<input type=\"text\" tabindex=\"52\" class=\"form-control\" id=\"details-description\" value.bind=\"model.description | emptyText\" aria-describedby=\"descriptionStatus\">\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n</template>\n"; });
define('text!theme/color-mappings.css', ['module'], function(module) { module.exports = ""; });
define('text!theme/colors.css', ['module'], function(module) { module.exports = ""; });
define('text!resources/elements/stamps/stamp-editor.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"resources/elements/stamps/stamp-editor.css\"></require>\n    <require from=\"./stamp-details\"></require>\n\t<require from=\"../catalogue-numbers/cn-details\"></require>\n    <require from=\"../ownerships/ownership-editor\"></require>\n\n\n\t<div class=\"stamp-editor\" if.bind=\"duplicateModel && loaded\">\n        <div>\n            <form class=\"form-horizontal\">\n                <stamp-details model.bind=\"duplicateModel\"></stamp-details>\n                <catalogue-number-details model.bind=\"activeCatalogueNumber\"></catalogue-number-details>\n                <ownership-editor if.bind=\"!duplicateModel.wantList\" model.bind=\"ownership\"></ownership-editor>\n            </form>\n        </div>\n\n\t\t<div class=\"editor-buttons\">\n\t\t\t<button type=\"button\" class=\"btn btn-sm btn-primary\" click.delegate=\"save()\">${'actions.save'|t}</button>\n\t\t\t<button type=\"button\" class=\"btn btn-sm btn-default\" click.delegate=\"saveAndNew()\" if.bind=\"createMode\">${'actions.save-and-new'|t}</button>\n\t\t\t<button type=\"button\" class=\"btn btn-sm btn-default\" click.delegate=\"cancel()\">${'actions.cancel'|t}</button>\n\t\t</div>\n\t</div>\n\n</template>\n"; });
define('text!resources/elements/stamps/stamp-grid.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"./stamp-card\"></require>\n    <require from=\"../catalogue-numbers/cn-references\"></require>\n    <require from=\"resources/elements/stamps/stamp-grid.css\"></require>\n\n\t<div class=\"sw-stamp-grid\">\n\t\t<div class=\"scroller ${showCatalogueNumbers ? 'with-references' : ''}\">\n\t\t\t<stamp-card repeat.for=\"stamp of stamps\" model.bind=\"stamp\" selected.bind=\"stamp.selected\" highlight.bind=\"stamp.id===$parent.lastSelected.id\"></stamp-card>\n\t\t</div>\n        <div class=\"sw-reference-catalogue-numbers\" if.bind=\"showCatalogueNumbers\">\n            <catalogue-number-references model.bind=\"lastSelected\"></catalogue-number-references>\n        </div>\n\t</div>\n</template>\n"; });
define('text!resources/elements/stamps/stamp-replacement-table.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../../value-converters/as-enum\"></require>\n    <require from=\"../../value-converters/as-currency-formatted\"></require>\n    <require from=\"../../value-converters/as-number\"></require>\n    <require from=\"../../value-converters/by-name\"></require>\n    <require from=\"../select-picker/select-picker\"></require>\n\n    <require from=\"resources/elements/stamps/stamp-replacement-table.css\"></require>\n    <div class=\"stamp-replacement-header\">\n        <form class=\"form-horizontal\">\n        <div class=\"form-group form-group-sm\">\n            <label for=\"filter-catalogueRef\" class=\"col-sm-3 control-label\">${'editor.filtering-catalogue'|t}</label>\n            <div class=\"col-sm-3\">\n                <select-picker items.bind=\"catalogues\" disabled.bind=\"loading\" value.two-way=\"model.filterCatalogueRef\"\n                               config.bind=\"{ id: 'filter-catalogueRef', tabIndex: 0, labelProperty: 'displayName', valueProperty: 'id', caption: 'editor.catalogue-select' }\">\n                </select-picker>\n            </div>\n        </div>\n        <div class=\"form-group form-group-sm\">\n            <label for=\"replacement-catalogueRef\" class=\"col-sm-3 control-label\">${'editor.replacement-catalogue'|t}</label>\n            <div class=\"col-sm-3\">\n                <select-picker items.bind=\"catalogues\" disabled.bind=\"loading\" value.two-way=\"model.replacementCatalogueRef\"\n                               config.bind=\"{ id: 'replacement-catalogueRef', tabIndex: 0, labelProperty: 'displayName', valueProperty: 'id', caption: 'editor.catalogue-select' }\">\n                </select-picker>\n            </div>\n        </div>\n        <div>\n            <button type=\"button\" class=\"btn btn-sm btn-primary ${filterReady ? '' : 'disabled'}\" disabled.bind=\"!filterReady\" click.delegate=\"filterStamps()\">${'actions.apply'|t}</button>\n        </div>\n        </form>\n    </div>\n    <div class=\"stamp-replacement-table-wrapper\">\n        <form class=\"form-inline\">\n        <table class=\"table table-condensed table-hover\">\n            <thead>\n            <tr>\n                <th class=\"image-col hidden-xs\" title=\"${'table.image|t}\">&nbsp;</th>\n                <th>${'table.country'|t}</th>\n                <th>${'table.description'|t}</th>\n                <th>${'table.catalogue-number'|t}</th>\n                <th>${'table.condition'|t}</th>\n                <th>${'table.catalogue-value'|t}</th>\n                <th>${'table.modified'|t}</th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr repeat.for=\"stamp of filteredStamps\" click.trigger=\"select($index)\">\n                <td class=\"image-col hidden-xs\">\n                    <div class=\"stamp-thumbnail\">\n                        <img if.bind=\"!stamp.wantList\" src.one-way=\"getImagePath(stamp)\" onerror.bind=\"notFoundImage()\" click.trigger=\"showFullSizeImage($event,stamp)\"/>\n                    </div>\n                </td>\n                <td class=\"col-md-3\">${ stamp.countryRef | byName:'countries' }</td>\n                <td class=\"col-md-4\">${ stamp.rate + ' ' + stamp.description }</td>\n                <td class=\"col-md-1\">\n                    <span if.bind=\"editingRow === $index\">\n                        <input type=\"text\" class=\"form-control replacement-number-input\" tabindex=\"0\" value.bind=\"editingCatalogueNumber.number\">\n                    </span>\n                    <span if.bind=\"editingRow !== $index\">\n                        ${ getReplacementCatalogueNumber(stamp).number }\n                    </span>\n                </td>\n                <td class=\"col-md-1\">\n                    <span if.bind=\"editingRow === $index\">\n                        <select-picker items.bind=\"conditions\" disabled.bind=\"loading\" value.two-way=\"editingCatalogueNumber.condition\"\n                            config.bind=\"{ id: 'replacement-condition', tabIndex: 0, labelProperty: 'description', valueProperty: 'ordinal', filterSearch: false, caption: 'editor.condition-select' }\">\n                        </select-picker>\n                    </span>\n                    <span if.bind=\"editingRow !== $index\">\n                        ${ getReplacementCatalogueNumber(stamp).condition|asEnum:'Condition'|t }\n                    </span>\n                </td>\n                <td class=\"col-md-2\">\n                    <div class=\"form-group\" if.bind=\"editingRow === $index\">\n                        <input type=\"text\" class=\"form-control replacement-value-input\" disabled.bind=\"editingCatalogueNumber.unknown\"\n                               keydown.delegate=\"advanceToNextRow($event)\" tabindex=\"0\" value.bind=\"editingCatalogueNumber.value | asNumber:true\">\n                        <input type=\"checkbox\" tabindex=\"1000\" checked.bind=\"editingCatalogueNumber.unknown\">\n\t\t\t\t\t    <span>${'editor.no-value-short'|t}</span>\n                    </div>\n                    <span if.bind=\"editingRow !== $index\">\n                        <span show.bind=\"getReplacementCatalogueNumber(stamp).unknown\" class=\"unknown\">\n                            ${'table.catalogue-value-unknown'|t}\n                        </span>\n                        <span show.bind=\"!getReplacementCatalogueNumber(stamp).unknown\">\n                            ${ getReplacementCatalogueNumber(stamp).value|asCurrencyFormatted:getCurrencyCode(getReplacementCatalogueNumber(stamp)) }\n                        </span>\n                    </span>\n                </td>\n                <td class=\"editing-status\">\n                    <span if.bind=\"stamp.__modified__\" class=\"sw-icon-ok\"></span>\n                </td>\n\n            </tr>\n            </tbody>\n        </table>\n        </form>\n\n    </div>\n    <div class=\"stamp-replacement-footer\">\n        <button type=\"button\" class=\"btn btn-primary btn-sm ${editCount < 1 ? 'disabled': ''}\" disabled.bind=\"editCount < 1\" click.delegate=\"saveAll()\">${'actions.save'|t}\n        </button>\n        <span class=\"filtering-message\">\n            <label>${ 'footer.filtering-total'|t}</label> <span class=\"badge\">${filteredStamps.length}</span>\n            <label>${ 'footer.modified-total'|t}</label> <span class=\"badge\">${editCount}</span>\n        </span>\n    </div>\n</template>\n"; });
define('text!theme/variables.css', ['module'], function(module) { module.exports = ""; });
define('text!resources/elements/stamps/stamp-table.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../../value-converters/as-enum\"></require>\n    <require from=\"../../value-converters/as-currency-formatted\"></require>\n    <require from=\"../../value-converters/by-name\"></require>\n    <require from=\"../ownerships/ownership-notes\"></require>\n    <require from=\"../ownerships/ownership-cert\"></require>\n\n    <require from=\"resources/elements/stamps/stamp-table.css\"></require>\n\n    <table class=\"table table-condensed table-hover\">\n        <thead>\n            <tr>\n                <th class=\"image-col hidden-xs\" title=\"${'table.image|t}\">&nbsp;</th>\n                <th>${'table.country'|t}</th>\n                <th>${'table.description'|t}</th>\n                <th>${'table.catalogue-number'|t}</th>\n                <th>${'table.catalogue-value'|t}</th>\n                <th class=\"icon-col hidden-xs\" title=\"${'table.certification'|t}\">&nbsp;</th> <!-- cert -->\n                <th class=\"icon-col hidden-xs\" title=\"${'table.notes'|t}\">&nbsp;</th> <!-- notes -->\n                <th>${'table.condition'|t}</th>\n                <th>${'table.grade'|t}</th>\n                <th>${'table.price-paid'|t}</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr repeat.for=\"stamp of models\" class=\"${stamp.selected ? 'selected' : ''} ${stamp.id === $parent.lastSelected.id ? 'highlight' : ''}\"\n                dblclick.trigger=\"edit(stamp)\"\n                click.trigger=\"toggleSelection($event, stamp)\">\n                <td class=\"image-col hidden-xs\">\n                    <div class=\"stamp-thumbnail\">\n                        <img if.bind=\"!stamp.wantList\" src.one-way=\"getImagePath(stamp)\" onerror.bind=\"notFoundImage()\" click.trigger=\"showFullSizeImage($event,stamp)\"/>\n                    </div>\n                </td>\n                <td class=\"col-md-3\">${ stamp.countryRef | byName:'countries' }</td>\n                <td class=\"col-md-4\">${ stamp.rate + ' ' + stamp.description }</td>\n                <td class=\"col-md-1\">${ getActiveCatalogueNumber(stamp).number }</td>\n                <td class=\"col-md-1\">${ getActiveCatalogueNumber(stamp).value|asCurrencyFormatted:getCurrencyCode(getActiveCatalogueNumber(stamp)) }</td>\n                <td class=\"icon-col hidden-xs\"><ownership-cert model.one-way=\"getOwnership(stamp)\"></ownership-cert></td>\n                <td class=\"icon-col hidden-xs\"><ownership-notes model.one-way=\"getOwnership(stamp)\"></ownership-notes></td>\n                <td class=\"col-md-1\">${ getOwnership(stamp).condition|asEnum:'Condition'|t }</td>\n                <td class=\"col-md-1\">${ getOwnership(stamp).grade|asEnum:'Grade'|t }</td>\n                <td class=\"col-md-1\">${ getOwnership(stamp).pricePaid|asCurrencyFormatted:getOwnership(stamp).code }</td>\n            </tr>\n        </tbody>\n    </table>\n\n</template>\n"; });
define('text!resources/views/catalogues/catalogue-editor.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"../../value-converters/empty-text\"></require>\n\t<require from=\"../../value-converters/by-name\"></require>\n    <require from=\"../../elements/select-picker/select-picker\"></require>\n\t<form class=\"form-horizontal\">\n\t\t<div class=\"form-group form-group-sm\">\n\t\t\t<label for=\"editor-catalogueType\" class=\"col-sm-3 control-label\">${'editor.catalogue-type'|t}</label>\n\t\t\t<div class=\"col-sm-9\">\n                <select-picker items.bind=\"catalogueTypes\" class=\"catalogue-type-selector\" value.two-way=\"model.type\"\n                               config.bind=\"{ id: 'editor-catalogueType', tabIndex: 100, name: 'type', labelProperty: 'description', valueProperty: 'ordinal', caption: 'editor.catalogue-type-select' }\">\n                </select-picker>\n\t\t\t</div>\n\t\t</div>\n        <div class=\"form-group form-group-sm\">\n            <label for=\"editor-issue\" class=\"col-sm-3 control-label\">${'editor.issue'|t}</label>\n            <div class=\"col-sm-2\">\n                <input id=\"editor-issue\" tabindex=\"110\" class=\"form-control\" type=\"text\" value.bind=\"model.issue\">\n            </div>\n        </div>\n\t\t<div class=\"form-group form-group-sm\">\n\t\t\t<label for=\"editor-name\" class=\"col-sm-3 control-label\">${'editor.name'|t}</label>\n\t\t\t<div class=\"col-sm-9\">\n\t\t\t\t<input id=\"editor-name\" tabindex=\"120\" class=\"form-control\" type=\"text\" value.bind=\"model.name | emptyText\">\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"form-group form-group-sm\">\n\t\t\t<label for=\"editor-desc\" class=\"col-sm-3 control-label\">${'editor.description'|t}</label>\n\t\t\t<div class=\"col-sm-9\">\n\t\t\t\t<textarea id=\"editor-desc\" tabindex=\"130\" value.bind=\"model.description | emptyText\" class=\"form-control\" rows=\"4\"></textarea>\n\t\t\t</div>\n\t\t</div>\n        <div class=\"form-group form-group-sm\">\n            <label for=\"editor-code\" class=\"col-sm-3 control-label\">${'editor.currencyCode'|t}</label>\n            <div class=\"col-sm-3\">\n                <select-picker class=\"currency-selector\" items.bind=\"codes\" value.two-way=\"model.code\"\n                               config.bind=\"{ id: 'editor-code', tabindex: 140, valueType: 'String', labelProperty: 'description', valueProperty: 'keyName', filterSearch: false, caption: 'editor.currencyCode-select' }\">\n                </select-picker>\n            </div>\n        </div>\n\t</form>\n</template>\n"; });
define('text!resources/views/albums/album-editor.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"../../value-converters/empty-text\"></require>\n\t<require from=\"../../value-converters/by-name\"></require>\n    <require from=\"../../elements/select-picker/select-picker\"></require>\n\n\t<form class=\"form-horizontal\">\n\t\t<div class=\"form-group form-group-sm\">\n\t\t\t<label for=\"editor-stampCollection\" class=\"col-sm-3 control-label\">${'editor.stamp-collection'|t}</label>\n\t\t\t<div class=\"col-sm-9\">\n                <select-picker items.bind=\"stampCollections\" class=\"stamp-collection-selector\" value.two-way=\"model.stampCollectionRef\"\n                               config.bind=\"{ id: 'editor-stampCollection', tabIndex: 100, name: 'stampCollectionRef', labelProperty: 'name', valueProperty: 'id', caption: 'editor.stamp-collection-select' }\">\n                </select-picker>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"form-group form-group-sm\">\n\t\t\t<label for=\"editor-name\" class=\"col-sm-3 control-label\">${'editor.name'|t}</label>\n\t\t\t<div class=\"col-sm-9\">\n\t\t\t\t<input id=\"editor-name\" tabindex=\"150\" class=\"form-control\" type=\"text\" value.bind=\"model.name | emptyText\">\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"form-group form-group-sm\">\n\t\t\t<label for=\"editor-desc\" class=\"col-sm-3 control-label\">${'editor.description'|t}</label>\n\t\t\t<div class=\"col-sm-9\">\n\t\t\t\t<textarea id=\"editor-desc\" tabindex=\"200\" value.bind=\"model.description | emptyText\" class=\"form-control\" rows=\"4\"></textarea>\n\t\t\t</div>\n\t\t</div>\n\t</form>\n</template>\n"; });
define('text!resources/views/countries/country-editor.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"../../value-converters/empty-text\"></require>\n\t<form class=\"form-horizontal\">\n\t\t<div class=\"form-group form-group-sm\">\n\t\t\t<label for=\"editor-name\" class=\"col-sm-3 control-label\">Name</label>\n\t\t\t<div class=\"col-sm-9\">\n\t\t\t\t<input id=\"editor-name\" class=\"form-control\" tabindex=\"50\" type=\"text\" value.bind=\"model.name | emptyText\">\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"form-group form-group-sm\">\n\t\t\t<label for=\"editor-desc\" class=\"col-sm-3 control-label\">Description</label>\n\t\t\t<div class=\"col-sm-9\">\n\t\t\t\t<textarea id=\"editor-desc\" value.bind=\"model.description | emptyText\" tabindex=\"100\" class=\"form-control\" rows=\"4\"></textarea>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"form-group form-group-sm\" if.bind=\"model.id > 0\">\n\t\t\t<div class=\"col-sm-offset-4 col-sm-8\">\n\t\t\t\t<div class=\"checkbox\">\n\t\t\t\t\t<span>\n\t\t\t\t\t\t<input type=\"checkbox\" id=\"editor-updateCountries\" tabindex=\"150\" checked.bind=\"updateCountries\"> Update image paths\n\t\t\t\t\t</span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</form>\n</template>\n"; });
define('text!resources/views/manage/list.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"../../value-converters/stamp-count\"></require>\n    <require from=\"../../value-converters/filter-by-name\"></require>\n    <require from=\"../../attributes/find-target\"></require>\n\n    <div class=\"manage-list-toolbar\">\n        <form class=\"form-horizontal\">\n            <div class=\"form-group form-group-sm\">\n                <div class=\"col-sm-2 hidden-xs\">\n                    <label for=\"filter-text\">${'manage.filter'|t}</label>\n                </div>\n                <div class=\"col-sm-4\">\n\n                    <div class=\"input-group\">\n                        <input id=\"filter-text\" ref=\"filterInput\" find-target class=\"form-control\" placeholder=\"${'manage.filterPlaceholder'|t}\" type=\"text\" value.bind=\"filterText\">\n                        <button class=\"input-group-addon btn-sm btn btn-default\" disabled.bind=\"filterText===''\" click.delegate=\"clear()\">\n                            <span class=\"sw-icon-cancel\"></span>\n                        </button>\n                    </div>\n\n                </div>\n            </div>\n        </form>\n    </div>\n    <div class=\"manage-list-contents\">\n        <table class=\"table table-hover entity-list\">\n            <thead>\n            <tr>\n                <th if.bind=\"hasIssue\">Issue</th>\n                <th class=\"sw-entitylist-name\">Name</th>\n                <th class=\"sw-entitylist-actions\">Actions</th>\n                <th class=\"sw-entitylist-count\">Count</th>\n                <th if.bind=\"hasIssue\">Currency</th>\n                <th>Description</th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr repeat.for=\"model of models | filterByName:filterText\">\n                <td if.bind=\"$parent.hasIssue\">${model.issue}</td>\n                <td>${model.name}</td>\n                <td>\n                    <div class=\"btn-group actions\">\n                        <button type=\"button\" class=\"btn btn-default btn-sm\" click.delegate=\"$parent.edit(model)\" data-toggle=\"modal\" data-target=\"#editorDialog\">\n                            <span class=\"sw-icon-edit\"></span>\n                        </button>\n                        <button type=\"button\" class=\"btn btn-default btn-sm\" click.trigger=\"$parent.remove(model)\">\n                            <span class=\"sw-icon-trash\"></span>\n                        </button>\n                        <button type=\"button\" class=\"btn btn-default btn-sm\" title=\"View stamps for ${model.name}\" click.delegate=\"$parent.viewStamps(model)\">\n                            <i class=\"sw-icon-search\"></i>\n                        </button>\n                    </div>\n                </td>\n                <td>${model.stampCount | stampCount}</td>\n                <td if.bind=\"$parent.hasIssue\">${model.code}</td>\n                <td>${model.description}</td>\n                <td>\n\n                </td>\n            </tr>\n            </tbody>\n        </table>\n    </div>\n</template>\n"; });
define('text!resources/elements/catalogue-numbers/cn-details.css', ['module'], function(module) { module.exports = "catalogue-number-details .sw-conversion {\n  font-size: 1.2em;\n  position: absolute;\n}\ncatalogue-number-details .sw-conversion.sw-convert {\n  color: #c1d7e9;\n  cursor: pointer;\n}\ncatalogue-number-details .sw-conversion.sw-warning {\n  color: #f0ad4e;\n}\ncatalogue-number-details .sw-currency-label.control-label {\n  text-align: left;\n}\ncatalogue-number-details .help-block {\n  position: relative;\n  width: 420px;\n}\n"; });
define('text!resources/views/manage/manage-list.html', ['module'], function(module) { module.exports = "<template>\n\n\t<require from=\"../../elements/editor-dialog\"></require>\n    <require from=\"resources/views/manage/manage.css\"></require>\n\n\t<editor-dialog model.bind=\"editingModel\" content.bind=\"editorContent\" icon.bind=\"editorIcon\" title.bind=\"editorTitle\" dialog-id=\"editorDialog\" ></editor-dialog>\n\n\t<div class=\"container-fluid manage-list\">\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col-sm-2 hidden-xs\">\n\t\t\t\t<ul class=\"list-group entity-type\">\n\t\t\t\t\t<li class=\"list-group-item ${($parent.selectedEntity==entity) ? 'selected' : ''}\" repeat.for=\"entity of entityModels\">\n\t\t\t\t\t\t<div click.delegate=\"$parent.setEntity(entity.field)\">\n\t\t\t\t\t\t\t<span class=\"${entity.icon}\"></span> ${entity.label}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-default btn-xs sw-create-action\" click.trigger=\"$parent.create(entity)\" data-toggle=\"modal\" data-target=\"#editorDialog\">\n\t\t\t\t\t\t\t\t<span class=\"sw-icon-plus\"></span>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</div>\n\n\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t<div class=\"col-sm-10\">\n\t\t\t\t<router-view></router-view>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n</template>\n"; });
define('text!resources/views/preferences/user-settings.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../../value-converters/empty-text\"></require>\n    <require from=\"../../elements/select-picker/select-picker\"></require>\n    <require from=\"resources/views/preferences/user-settings.css\"></require>\n\n    <div class=\"container-fluid\">\n        <div class=\"row user-settings container-fluid\">\n            <div class=\"col-sm-2\">\n                <ul class=\"list-group\">\n                    <li class=\"list-group-item ${($parent.selectedView === viewModel) ? 'selected' : ''}\" repeat.for=\"viewModel of viewModels\">\n                        <div click.delegate=\"$parent.selectView(viewModel)\">${viewModel|t}</div>\n                    </li>\n                </ul>\n\n            </div>\n            <div class=\"col-sm-8 container-fluid\">\n                <form class=\"form-horizontal\">\n                    <div class=\"panel panel-default\" show.bind=\"selectedView === EDITOR\">\n                        <div class=\"panel-heading\">\n                            <h4 class=\"panel-title\">${'settings.editor'|t}</h4>\n                        </div>\n                        <div class=\"panel-body\">\n                            <div class=\"form-group form-group-sm\">\n                                <label for=\"settings-countryRef\" class=\"col-sm-3 control-label\">${'settings.country'|t}</label>\n                                <div class=\"col-sm-9\">\n                                    <select-picker items.bind=\"countries\" class=\"country-selector\" disabled.bind=\"loading\"  value.two-way=\"model.stamps.countryRef\"\n                                                   config.bind=\"{ id: 'settings-countryRef',labelProperty: 'name',tabIndex: 100, valueProperty: 'id', filterSearch: true, caption: 'settings.country-select' }\"></select-picker>\n                                </div>\n                            </div>\n                            <div class=\"form-group form-group-sm\">\n                                <label for=\"settings-albumRef\" class=\"col-sm-3 control-label\">${'settings.album'|t}</label>\n                                <div class=\"col-sm-9\">\n                                    <select-picker items.bind=\"albums\" class=\"album-selector\" disabled.bind=\"loading\"  value.two-way=\"model.stamps.albumRef\"\n                                                   config.bind=\"{ id: 'settings-albumRef',labelProperty: 'name',tabIndex: 150, valueProperty: 'id', filterSearch: true, caption: 'settings.album-select' }\"></select-picker>\n                                </div>\n                            </div>\n                            <div class=\"form-group form-group-sm\">\n                                <label for=\"settings-stampCollectionRef\" class=\"col-sm-3 control-label\">${'settings.stampCollection'|t}</label>\n                                <div class=\"col-sm-9\">\n                                    <select-picker items.bind=\"stampCollections\" class=\"stampCollection-selector\" disabled.bind=\"loading\"  value.two-way=\"model.stamps.stampCollectionRef\"\n                                                   config.bind=\"{ id: 'settings-stampCollectionRef',labelProperty: 'name',tabIndex: 200, valueProperty: 'id', filterSearch: true, caption: 'settings.stampCollection-select' }\"></select-picker>\n                                </div>\n                            </div>\n                            <div class=\"form-group form-group-sm\">\n                                <label for=\"settings-sellerRef\" class=\"col-sm-3 control-label\">${'settings.seller'|t}</label>\n                                <div class=\"col-sm-9\">\n                                    <select-picker items.bind=\"sellers\" class=\"seller-selector\" disabled.bind=\"loading\"  value.two-way=\"model.stamps.sellerRef\"\n                                                   config.bind=\"{ id: 'settings-sellerRef',labelProperty: 'name',tabIndex: 250, valueProperty: 'id', filterSearch: true, caption: 'settings.seller-select' }\"></select-picker>\n                                </div>\n                            </div>\n                            <div class=\"form-group form-group-sm\">\n                                <label for=\"settings-catalogueRef\" class=\"col-sm-3 control-label\">${'settings.catalogue'|t}</label>\n                                <div class=\"col-sm-9\">\n                                    <select-picker items.bind=\"catalogues\" class=\"catalogue-selector\" disabled.bind=\"loading\"  value.two-way=\"model.stamps.catalogueRef\"\n                                                   config.bind=\"{ id: 'settings-catalogueRef',labelProperty: 'displayName',tabIndex: 300, valueProperty: 'id', filterSearch: true, caption: 'settings.catalogue-select' }\">\n                                    </select-picker>\n                                </div>\n                            </div>\n                            <div class=\"form-group form-group-sm\">\n                                <label for=\"settings-condition\" class=\"col-sm-3 control-label\">${'settings.condition'|t}</label>\n                                <div class=\"col-sm-4\">\n                                    <select-picker class=\"condition-selector\" items.bind=\"conditions\" value.two-way=\"model.stamps.condition\"\n                                                   config.bind=\"{ id: 'settings-condition', labelProperty: 'description',tabIndex: 350, valueProperty: 'ordinal', filterSearch: false, caption: 'settings.condition-select' }\">\n                                    </select-picker>\n                                </div>\n                            </div>\n                            <div class=\"form-group form-group-sm\">\n                                <label for=\"settings-grade\" class=\"col-sm-3 control-label\">${'settings.grade'|t}</label>\n                                <div class=\"col-sm-4\">\n                                    <select-picker class=\"grade-selector\" items.bind=\"grades\" value.two-way=\"model.stamps.grade\"\n                                                   config.bind=\"{ id: 'settings-grade', labelProperty: 'description', tabIndex: 400, valueProperty: 'ordinal', filterSearch: false, caption: 'settings.grade-select' }\">\n                                    </select-picker>\n                                </div>\n                            </div>\n                            <div class=\"form-group form-group-sm\">\n                                <label for=\"settings-currencyCode\" class=\"col-sm-3 control-label\">${'settings.currencyCode'|t}</label>\n                                <div class=\"col-sm-2\">\n                                    <select-picker class=\"currency-selector\" items.bind=\"codes\" value.two-way=\"model.currency.CurrencyCode\"\n                                                   config.bind=\"{ id: 'settings-currencyCode', valueType: 'String', labelProperty: 'description', tabIndex: 450, valueProperty: 'keyName', filterSearch: false, caption: 'settings.currencyCode-select' }\">\n                                    </select-picker>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n\n                    <div class=\"panel panel-default\" show.bind=\"selectedView === REFERENCE\">\n                        <div class=\"panel-heading\">\n                            <h4 class=\"panel-title\">${'settings.reference'|t}</h4>\n                        </div>\n                        <div class=\"panel-body\">\n                            <div class=\"form-group form-group-sm\">\n                                <label for=\"settings-catalogueRefSecondary\" class=\"col-sm-3 control-label\">${'settings.catalogue-secondary'|t}</label>\n                                <div class=\"col-sm-9\">\n                                    <select-picker items.bind=\"catalogues\" class=\"catalogue-selector\" disabled.bind=\"loading\"  value.two-way=\"model.stamps.catalogueRefSecondary\"\n                                                   config.bind=\"{ id: 'settings-catalogueRefSecondary',labelProperty: 'displayName', tabIndex: 500, valueProperty: 'id', filterSearch: true, caption: 'settings.catalogue-select' }\">\n                                    </select-picker>\n                                </div>\n                            </div>\n                            <div class=\"form-group form-group-sm\">\n                                <label for=\"settings-conditionSecondary\" class=\"col-sm-3 control-label\">${'settings.condition-secondary'|t}</label>\n                                <div class=\"col-sm-4\">\n                                    <select-picker class=\"condition-selector\" items.bind=\"conditions\" value.two-way=\"model.stamps.conditionSecondary\"\n                                                   config.bind=\"{ id: 'settings-conditionSecondary', labelProperty: 'description',tabIndex: 550, valueProperty: 'ordinal', filterSearch: false, caption: 'settings.condition-select' }\">\n                                    </select-picker>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n\n                    <div class=\"panel panel-default\" show.bind=\"selectedView === SERVER\">\n                        <div class=\"panel-heading\">\n                            <h4 class=\"panel-title\">${'settings.server'|t}</h4>\n                        </div>\n                        <div class=\"panel-body\">\n                            <div class=\"form-group form-group-sm\">\n                                <label for=\"settings-imagePath\" class=\"col-sm-3 control-label\">${'settings.imagePath'|t}</label>\n                                <div class=\"col-sm-9\">\n                                    <input type=\"text\" class=\"form-control\" tabindex=\"600\" value.bind=\"model.stamps.imagePath\" id=\"settings-imagePath\">\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"panel panel-default\" show.bind=\"selectedView === USER\">\n                        <div class=\"panel-heading\">\n                            <h4 class=\"panel-title\">${'settings.user'|t}</h4>\n                        </div>\n                        <div class=\"panel-body\">\n                            <div class=\"form-group form-group-sm\">\n                                <label for=\"settings-locale\" class=\"col-sm-3 control-label\">${'settings.preferredLocale'|t}</label>\n                                <div class=\"col-sm-2\">\n                                    <select-picker class=\"locale-selector\" items.bind=\"locales\" value.two-way=\"model.user.locale\"\n                                                   config.bind=\"{ id: 'settings-locale', valueType: 'String', labelProperty: 'description', tabIndex: 650, valueProperty: 'keyName', filterSearch: false, caption: 'settings.locale-select' }\">\n                                    </select-picker>\n                                </div>\n                            </div>\n                            <div class=\"form-group form-group-sm\">\n                                <label for=\"settings-pageSize\" class=\"col-sm-3 control-label\">${'settings.pageSize'|t}</label>\n                                <div class=\"col-sm-2\">\n                                    <select id=\"settings-pageSize\" tabindex=\"700\" class=\"pageSize-selector form-control\" value.bind=\"model.stamps.pageSize\">\n                                        <option repeat.for=\"size of pageSizes\" model.bind=\"size\">${size}</option>\n                                    </select>\n                                </div>\n                            </div>\n                            <div class=\"form-group form-group-sm\">\n                                <label for=\"settings-applyCatalogueImagePrefix\" class=\"col-sm-3 control-label\">${'settings.applyCatalogueImagePrefix'|t}</label>\n                        <span class=\"col-sm-9\">\n                            <input type=\"checkbox\" tabindex=\"750\" checked.bind=\"model.stamps.applyCatalogueImagePrefix\" id=\"settings-applyCatalogueImagePrefix\">\n                            <span>${'settings.applyCatalogueImagePrefix-hint'|t}</span>\n                        </span>\n                            </div>\n                        </div>\n                    </div>\n                </form>\n                <div class=\"editor-buttons\">\n                    <button type=\"button\" disabled.bind=\"!valid\" class=\"btn btn-sm btn-primary\" tabindex=\"800\" click.trigger=\"save()\">${'actions.save'|t}</button>\n                    <button type=\"button\" disabled.bind=\"!valid\" class=\"btn btn-sm btn-default\" tabindex=\"820\" click.trigger=\"reset()\">${'actions.reset'|t}</button>\n                </div>\n            </div>\n        </div>\n    </div>\n\n\n\n\n\n</template>\n"; });
define('text!resources/views/sellers/seller-editor.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"../../value-converters/empty-text\"></require>\n\t<form class=\"form-horizontal\">\n\t\t<div class=\"form-group form-group-sm\">\n\t\t\t<label for=\"editor-name\" class=\"col-sm-3 control-label\">Name</label>\n\t\t\t<div class=\"col-sm-9\">\n\t\t\t\t<input id=\"editor-name\" tabindex=\"100\" class=\"form-control\" type=\"text\" value.bind=\"model.name | emptyText\">\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"form-group form-group-sm\">\n\t\t\t<label for=\"editor-desc\" class=\"col-sm-3 control-label\">Description</label>\n\t\t\t<div class=\"col-sm-9\">\n\t\t\t\t<textarea id=\"editor-desc\" tabindex=\"150\" value.bind=\"model.description | emptyText\" class=\"form-control\" rows=\"4\"></textarea>\n\t\t\t</div>\n\t\t</div>\n\t</form>\n</template>\n"; });
define('text!resources/views/stamp-collections/stamp-collection-editor.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"../../value-converters/empty-text\"></require>\n\t<form class=\"form-horizontal\">\n\t\t<div class=\"form-group form-group-sm\">\n\t\t\t<label for=\"editor-name\" class=\"col-sm-3 control-label\">Name</label>\n\t\t\t<div class=\"col-sm-9\">\n\t\t\t\t<input id=\"editor-name\" tabindex=\"100\" class=\"form-control\" type=\"text\" value.bind=\"model.name | emptyText\">\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"form-group form-group-sm\">\n\t\t\t<label for=\"editor-desc\" class=\"col-sm-3 control-label\">Description</label>\n\t\t\t<div class=\"col-sm-9\">\n\t\t\t\t<textarea id=\"editor-desc\" tabindex=\"150\" value.bind=\"model.description | emptyText\" class=\"form-control\" rows=\"4\"></textarea>\n\t\t\t</div>\n\t\t</div>\n\t</form>\n</template>\n"; });
define('text!resources/elements/catalogue-numbers/cn-references.css', ['module'], function(module) { module.exports = ".sw-catalogue-number-table {\n  margin: 10px;\n  font-size: 0.8em;\n}\n.sw-catalogue-number-table .sw-catalogue-number-content {\n  overflow-y: auto;\n  display: block;\n  height: 100%;\n  max-height: 155px;\n}\n.sw-catalogue-number-table thead {\n  border: #ccc 1px solid;\n}\n.sw-catalogue-number-table tbody {\n  border-right: #ccc 1px solid;\n  border-left: #ccc 1px solid;\n  border-bottom: #ccc 1px solid;\n}\n.sw-catalogue-number-table .editing-row .editable-cell {\n  width: 100%;\n}\n.sw-catalogue-number-table .editing-row .form-control {\n  font-size: 0.95em;\n  height: 28px;\n}\n.sw-catalogue-number-table .editing-row .action-edit-ok {\n  color: #2b9b5f;\n}\n.sw-catalogue-number-table .editing-row .action-edit-cancel {\n  color: #d9534f;\n}\n.sw-catalogue-number-table .editing-row .actions {\n  padding-top: 2px;\n}\n.sw-catalogue-number-table .row-being-edited {\n  display: none;\n}\n"; });
define('text!resources/views/stamps/purchase-form.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../../elements/select-picker/select-picker\"></require>\n    <require from=\"../../value-converters/as-percentage\"></require>\n    <require from=\"resources/views/stamps/purchase-form.css\"></require>\n    <ai-dialog class=\"purchase-form\">\n        <ai-dialog-body>\n            <div class=\"well\">${'editor.purchase-help'|t}</div>\n            <form class=\"form-horizontal\" validation-renderer=\"bootstrap-form\">\n                <div class=\"form-group form-group-sm1\">\n                    <span>\n                        <label class=\"col-sm-4 control-label\">${'editor.purchase-stamp-count'|t}</label>\n                        <div class=\"col-md-8 control-label label-value\">${model.selectedStamps.length}</div>\n                    </span>\n                </div>\n                <div class=\"form-group form-group-sm has-feedback\">\n                    <label for=\"price-paid\" class=\"col-sm-4 control-label\">${'editor.purchase-total'|t}</label>\n                    <div class=\"col-md-8 price-paid\">\n                            <input type=\"text\" tabindex=\"0\" class=\"form-control\" id=\"price-paid\" autofocus\n                                   value.bind=\"model.price & validate:rules\" keyup.delegate=\"priceChanged()\" aria-describedby=\"inputValueStatus\">\n                            <select-picker items.bind=\"codes\" class=\"currency-selector purchase-currency\" value.two-way=\"model.currency\" value-type=\"String\"\n                                       config.bind=\"{ id: 'currency-code', tabIndex: 0, name: 'code', noSearch: true, allowClear: false, labelProperty: 'description', valueProperty: 'keyName' }\">\n                            </select-picker>\n\n                    </div>\n                </div>\n                <div class=\"form-group form-group-sm\">\n                    <div class=\"col-sm-offset-2\">\n                        <div class=\"checkbox\">\n\t\t\t\t\t        <span>\n\t\t\t\t\t\t        <input type=\"checkbox\" id=\"update-existing\" checked.bind=\"model.updateExisting\">${'editor.modify-existing'|t}\n\t\t\t\t\t        </span>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"form-group form-group-sm1\">\n                    <span class=\"${(percentage <= 0) ? 'percentage-not-valid' : ''}\">\n                        <label class=\"col-sm-4 control-label\">${'editor.purchase-percentage'|t}</label>\n                        <div class=\"col-md-8 control-label label-value\">\n                            <span>${percentage | asPercentage}</span>\n                        </div>\n                    </span>\n                </div>\n            </form>\n        </ai-dialog-body>\n        <ai-dialog-footer>\n            <div class=\"process-progress\" if.bind=\"processing\">\n                <div class=\"progress\">\n                    <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow.bind=\"25\" aria-valuemin=\"0\" aria-valuemax=\"100\">\n                        ${processingCount / model.selectedStamps.length | asPercentage}\n                    </div>\n                </div>\n            </div>\n            <div class=\"messaging\" >\n                <i class=\"sw-icon-attention\" show.bind=\"!isValid\"></i> ${'editor.purchase-error'|t}\n            </div>\n            <div class=\"button-actions\">\n                <!---->\n                <button class=\"btn btn-primary\" disabled.bind=\"!isValid\" click.trigger=\"save()\">Ok</button>\n                <button class=\"btn\" click.trigger=\"controller.cancel()\">Cancel</button>\n            </div>\n\n        </ai-dialog-footer>\n    </ai-dialog>\n</template>\n"; });
define('text!resources/views/stamps/stamp-list.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"../../elements/stamps/stamp-grid\"></require>\n\t<require from=\"../../elements/stamps/stamp-editor\"></require>\n    <require from=\"../../elements/search/search-form\"></require>\n\t<require from=\"../../elements/stamps/stamp-table\"></require>\n    <require from=\"../../elements/stamps/stamp-replacement-table\"></require>\n    <require from=\"../../elements/paging/paging-toolbar\"></require>\n    <require from=\"../../elements/collapse-panel/collapse-panel\"></require>\n    <require from=\"../../elements/select-picker/select-picker\"></require>\n    <require from=\"../../elements/image-preview/image-preview\"></require>\n    <require from=\"../../attributes/find-target\"></require>\n\n    <require from=\"resources/views/stamps/stamp-list.css\"></require>\n\n\t<nav class=\"navbar navbar-default stamp-grid-nav\">\n\t\t<form class=\"navbar-form\" role=\"search\">\n\t\t\t<div class=\"btn-toolbar\" role=\"toolbar\">\n\t\t\t\t<div class=\"btn-group\" role=\"group\">\n\t\t\t\t\t<button type=\"button\" class=\"btn btn-sm btn-default\" title=\"${'nav.new-stamp'|t}\" click.trigger=\"showEditor('create-stamp')\">\n\t\t\t\t\t\t<span class=\"sw-icon-plus\"></span>\n\t\t\t\t\t</button>\n                    <button class=\"btn btn-sm btn-default\" title=\"${'nav.search'|t}\" click.trigger=\"showEditor('search-panel')\">\n                        <span class=\"sw-icon-search\"></span>\n                    </button>\n                    <button class=\"btn btn-sm btn-default ${selectedCount > 0 ? '' : 'disabled'}\" title=\"${'actions.purchase'|t}\" click.delegate=\"purchase()\">\n                        <span class=\"sw-icon-purchased\"></span>\n                    </button>\n\t\t\t\t</div>\n\n                <div class=\"btn-group\" role=\"group\">\n                    <button type=\"button\" class=\"btn btn-sm btn-default\" title=\"${'nav.select-all'|t}\" click.trigger=\"selectAll(true)\">\n                        <span class=\"sw-icon-select-all\"></span>\n                    </button>\n                    <button type=\"button\" class=\"btn btn-sm btn-default\" title=\"${'nav.clear-all'|t}\" click.trigger=\"selectAll(false)\">\n                        <span class=\"sw-icon-clear-all\"></span>\n                    </button>\n                </div>\n\n                <div class=\"btn-group input-group quick-search hidden-xs hidden-sm\">\n                    <input type=\"text\" find-target class=\"form-control\" value.two-way=\"searchText\" placeholder=\"Search\">\n                    <button class=\"btn btn-sm btn-default\" title=\"Search\" click.delegate=\"sendSearch()\">\n                        <span class=\"sw-icon-filter\"></span>\n                    </button>\n                    <button class=\"btn btn-sm btn-default\" title=\"Clear search\" click.delegate=\"clearSearch()\">\n                        <span class=\"sw-icon-cancel\"></span>\n                    </button>\n                </div>\n\n                <div class=\"btn-group\" role=\"group\">\n\t\t\t\t\t<button class=\"btn btn-sm btn-default ${  displayMode === 'Grid' ? 'active' : ''}\" title=\"${'actions.show-as-grid'|t}\" click.trigger=\"setDisplayMode('Grid')\">\n\t\t\t\t\t\t<span class=\"sw-icon-gridview\"></span>\n\t\t\t\t\t</button>\n\t\t\t\t\t<button class=\"btn btn-sm btn-default ${ displayMode === 'Table' ? 'active' : ''}\" title=\"${'actions.show-as-table'|t}\" click.trigger=\"setDisplayMode('List')\">\n\t\t\t\t\t\t<span class=\"sw-icon-list\"></span>\n\t\t\t\t\t</button>\n                    <button class=\"btn btn-sm btn-default ${ displayMode === 'Upgrade' ? 'active' : ''}\" title=\"${'actions.show-as-upgrade'|t}\" click.trigger=\"setDisplayMode('Upgrade')\">\n                        <span class=\"sw-icon-exchange\"></span>\n                    </button>\n\t\t\t\t</div>\n\n                <div class=\"btn-group\" role=\"group\">\n                    <button class=\"btn btn-sm btn-default ${ referenceTableState }\" disabled.bind=\"referenceTableState === 'disabled'\" title=\"${'actions.show-reference-cataloguenumbers'|t}\" click.delegate=\"toggleCatalogueNumbers()\">\n                        <span class=\"sw-icon-references\"></span>\n                    </button>\n                </div>\n\n\t\t\t\t<div class=\"btn-group sort-actions\">\n                    <div class=\"dropdown\">\n                        <button type=\"button\" class=\"btn btn-default btn-sm dropdown-toggle sort-selector\" data-toggle=\"dropdown\">\n                            <span class=\"selector-text\">${'sort.' + options.sort|t | defaultValue:'sort.placeholder'|t}</span>\n                            <span class=\"caret\"></span>\n                        </button>\n                        <ul class=\"dropdown-menu\" role=\"menu\">\n                            <li repeat.for=\"sortCol of sortColumns\" click.trigger=\"$parent.setSort(sortCol)\">${'sort.' + sortCol|t}</li>\n                        </ul>\n                    </div>\n                    <button class=\"btn btn-sm btn-default ${options.sort === 'placeholder' ? 'disabled' : ''}\" title=\"Clear sort\" click.trigger=\"clearSort()\">\n                        <span class=\"sw-icon-cancel\"></span>\n                    </button>\n\t\t\t\t\t<button class=\"btn btn-sm btn-default ${options.sort === 'placeholder' ? 'disabled' : ''}\" click.trigger=\"toggleSortDirection()\">\n\t\t\t\t\t\t<span class=\"${options.sortDirection === 'asc' ? 'sw-icon-sort-up' : 'sw-icon-sort-down'}\"></span>\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n                <div class=\"dropdown hidden-xs hidden-sm\">\n                    <button type=\"button\" class=\"btn btn-default btn-sm dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n                        <span class=\"selector-text\">${getFilterText(stampFilter)|t | defaultValue:'filters.filter'|t}</span>\n                        <span class=\"caret\"></span>\n                    </button>\n                    <ul class=\"dropdown-menu\" role=\"menu\">\n                        <li repeat.for=\"filter of filters\" click.trigger=\"$parent.setFilter($index)\">${$parent.getFilterText(filter)|t}</li>\n                    </ul>\n                </div>\n                <div class=\"dropdown hidden-xs hidden-sm\">\n                    <button type=\"button\" class=\"btn btn-default btn-sm dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n                        <span class=\"selector-text\">${getFilterText(conditionFilter)|t | defaultValue:'conditionFilters.ALL_STAMPS'|t}</span>\n                        <span class=\"caret\"></span>\n                    </button>\n                    <ul class=\"dropdown-menu\" role=\"menu\">\n                        <li repeat.for=\"filter of conditionFilters\" click.trigger=\"$parent.setConditionFilter($index)\">${$parent.getFilterText(filter)|t}</li>\n                    </ul>\n                </div>\n                <div class=\"dropdown hidden-xs hidden-sm\">\n                    <button type=\"button\" class=\"btn btn-default btn-sm dropdown-toggle result-size-selector\" data-toggle=\"dropdown\">\n                        <span class=\"selector-text\">${options.$top | defaultValue:'actions.page-size'|t}</span>\n                        <span class=\"caret\"></span>\n                    </button>\n                    <ul class=\"dropdown-menu\" role=\"menu\">\n                        <li repeat.for=\"size of pageSizes\" click.delegate=\"$parent.setSize(size)\">${size}</li>\n                    </ul>\n                </div>\n\n\t\t\t</div>\n\t\t</form>\n\n\t</nav>\n\t<div class=\"container-fluid stamp-content\" >\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col-md-12 col-lg-4 sw-editor-container\" if.bind=\"editorShown\">\n                <collapse-panel collapsed.bind=\"!editorShown\" name=\"stamp-list-editor-panel\" >\n                    <stamp-editor show.bind=\"panelContents === 'stamp-editor'\" model.bind=\"editingStamp\"></stamp-editor>\n                    <search-form show.bind=\"panelContents === 'search-panel'\"></search-form>\n                </collapse-panel>\n\t\t\t</div>\n            <div class=\"col-md-12 ${(editorShown) ? 'col-lg-8' : 'col-lg-12'} full-height\">\n                <stamp-grid if.bind=\"displayMode === 'Grid'\" class=\"\" stamps.bind=\"stamps\"\n                            last-selected.bind=\"lastSelected\" edit-id.bind=\"editingStamp.id\" show-catalogue-numbers.bind=\"referenceMode\">\n                </stamp-grid>\n                <stamp-table if.bind=\"displayMode === 'List'\" class=\"\" stamps.bind=\"stamps\" last-selected.bind=\"lastSelected\" total.bind=\"pageInfo.total\"></stamp-table>\n                <stamp-replacement-table if.bind=\"displayMode === 'Upgrade'\" stamps.bind=\"stamps\"></stamp-replacement-table>\n            </div>\n\n\t\t</div>\n\t</div>\n\t<image-preview image.bind=\"fullSizeImage\" show.bind=\"imageShown\" bounds-selector=\".stamp-content\"></image-preview>\n\t<nav class=\"navbar navbar-default stamp-list-footer\">\n\t\t<form class=\"navbar-form\" role=\"footer\">\n            <paging-toolbar page.bind=\"pageInfo.active\" total.bind=\"pageInfo.total\"></paging-toolbar>\n            <div class=\"btn-toolbar\" role=\"toolbar\">\n                <div class=\"results-group\">\n                    ${'footer.total'|t}: <span class=\"badge\">${pageInfo.active * options.$top + 1} - ${pageInfo.active * options.$top + stamps.length}</span> of <span class=\"badge\">${stampCount}</span>\n                </div>\n                <div class=\"selection-group\">\n                    ${'footer.totalSelected'|t}: <span class=\"badge\">${selectedCount}</span>\n                </div>\n            </div>\n            <div class=\"report-statistics hidden-xs\" role=\"group\">\n                <div class=\"btn-group\">\n                    <button class=\"btn btn-xs btn-default statistics-button ${(reportType==='CatalogueValue') ? 'active' : ''}\" title=\"${'footer-statistics.catalogue-value'|t}\" click.trigger=\"setStatistics('CatalogueValue')\" role=\"button\">\n                        <span class=\"sw-icon-catalogue\"></span>\n                    </button>\n                    <button class=\"btn btn-xs btn-default statistics-button ${(reportType==='CostBasis') ? 'active' : ''}\" title=\"${'footer-statistics.purchased'|t}\" click.trigger=\"setStatistics('CostBasis')\" role=\"button\">\n                        <span class=\"sw-icon-purchased\"></span>\n                    </button>\n                    <button class=\"btn btn-xs btn-default statistics-button ${(reportType==='CashValue') ? 'active' : ''}\" title=\"${'footer-statistics.cash-value'|t}\" click.trigger=\"setStatistics('CashValue')\" role=\"button\">\n                        <span class=\"sw-icon-cash-value\"></span>\n                    </button>\n                    <input class=\"value-display\" value.bind=\"reportValue\" readonly role=\"status\">\n                </div>\n\n            </div>\n\n\t\t</form>\n\t</nav>\n\n\n</template>\n"; });
define('text!resources/elements/collapse-panel/collapse-panel.css', ['module'], function(module) { module.exports = "collapse-panel {\n  width: 100%;\n  height: 100%;\n}\ncollapse-panel > .panel {\n  border: #c1d7e9 1px solid;\n  height: 100%;\n}\ncollapse-panel .collapse-header {\n  height: 35px;\n  background-color: #c1d7e9;\n}\ncollapse-panel .collapse-header h4.panel-title {\n  padding-left: 15px;\n  padding-top: 15px;\n}\ncollapse-panel .collapse-content {\n  height: calc(100% - 35px);\n  overflow-y: auto;\n}\ncollapse-panel .btn-close {\n  position: absolute;\n  top: 5px;\n  right: 5px;\n}\n"; });
define('text!resources/elements/date-picker/date-picker.css', ['module'], function(module) { module.exports = "date-picker {\n  outline-style: none;\n  -webkit-tap-highlight-color: transparent;\n}\n.date-wrapper label {\n  position: relative;\n  display: inline-block;\n  text-align: left;\n  margin-bottom: 0;\n  padding-top: 5px;\n  padding-right: 10px;\n  vertical-align: middle;\n  ussr-select: none;\n}\n.date-wrapper label:focus {\n  border: none;\n  outline: none;\n}\n.date-wrapper label:after {\n  content: '';\n}\n.date-wrapper:nth-child(2) label {\n  padding-left: 10px;\n}\n.date-control {\n  display: inline-block;\n  z-index: auto;\n  position: relative;\n}\n.date-control input[type=\"text\"] {\n  z-index: auto;\n  max-width: 110px;\n  border-top-right-radius: 4px !important;\n  border-bottom-right-radius: 4px !important;\n}\n.date-control input[type=\"text\"] input::selection,\n.date-control input[type=\"text\"] textarea::selection {\n  background: #337ab7;\n  color: #fff;\n}\n.date-control .sw-icon-calendar {\n  z-index: auto;\n  position: absolute;\n  color: #555;\n  right: 4px;\n  top: 4px;\n  cursor: pointer;\n}\n.date-control .sw-icon-calendar:focus {\n  outline: none;\n}\n.date-control .sw-icon-calendar:hover {\n  color: #337ab7;\n}\n.date-control .sw-icon-cancel {\n  z-index: auto;\n  position: absolute;\n  color: #555;\n  right: 18px;\n  cursor: pointer;\n  top: 5px;\n  transform: scale(0.6);\n}\n.date-control .sw-icon-cancel:focus {\n  outline: none;\n}\n.date-control .sw-icon-cancel:hover {\n  color: #337ab7;\n}\n.datepicker table tbody td.day {\n  font-size: 12px;\n  width: 30px;\n  max-width: 30px;\n  min-width: 30px;\n  border-color: #fff;\n  background-color: #fff;\n}\n.datepicker table tbody td.day.active:active,\n.datepicker table tbody td.day.active.highlighted:active {\n  border-color: #c1d7e9;\n  background-color: #e2edf7;\n  color: #fff;\n}\n.datepicker table tbody td.day.disabled {\n  color: #ccc;\n  backgroud-color: #f0f0f0;\n}\n.datepicker table tbody td.day.disabled:hover {\n  background-color: #fff;\n}\n.datepicker table tbody td.day.today {\n  background-color: #c1d7e9;\n}\n.datepicker table tbody td.day:hover {\n  background-color: #eee;\n  border-color: #ccc;\n}\n.datepicker table tbody td span.month,\n.datepicker table tbody td span.year {\n  font-size: 12px;\n}\n.datepicker table tbody th {\n  font-weight: normal;\n}\n.datepicker table thead tr:nth-child(3) {\n  border-bottom: 1px solid #ccc;\n}\n.datepicker table thead tr th {\n  font-weight: normal;\n  font-size: 11px;\n}\n.datepicker table thead tr .datepicker-switch:hover,\n.datepicker table thead tr .prev:hover,\n.datepicker table thead tr .next:hover {\n  background-color: #f9f9f9;\n  border: 1px solid #eee;\n}\n.datepicker table tfoot tr th {\n  font-size: 11px;\n  font-weight: normal;\n}\n.datepicker table tfoot tr th:hover {\n  background-color: #f9f9f9;\n  border: 1px solid #eee;\n}\n"; });
define('text!resources/elements/image-preview/image-preview.css', ['module'], function(module) { module.exports = "image-preview {\n  background-color: #333333;\n  position: fixed;\n  z-index: 9000;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n"; });
define('text!resources/elements/nav/nav-bar.css', ['module'], function(module) { module.exports = "nav-bar nav {\n  z-index: 750;\n}\nnav-bar nav .navbar-brand > span {\n  height: 28px;\n}\nnav-bar nav .navbar-brand span:last-child {\n  top: -9px;\n  position: relative;\n}\nnav-bar nav .sw-icon-pagegen {\n  padding-right: 30px;\n}\nnav-bar nav li.active a {\n  border-radius: 5px 5px 0 0;\n}\n"; });
define('text!resources/elements/ownerships/ownership-cert.css', ['module'], function(module) { module.exports = "ownership-cert .sw-icon-ribbon {\n  color: #2b9b5f;\n}\n"; });
define('text!resources/elements/ownerships/ownership-editor.css', ['module'], function(module) { module.exports = ".sw-ownership-editor .input-group[class*=\"col-\"] {\n  padding-left: 15px;\n}\n.sw-ownership-editor .input-group[class*=\"col-\"] .input-group-addon {\n  padding: 0 4px;\n}\n.sw-ownership-editor .form-control.price-paid {\n  width: 75px;\n  margin-right: 5px;\n}\n.sw-ownership-editor .checkbox input[type=\"checkbox\"] {\n  margin-left: 0;\n}\n"; });
define('text!resources/elements/ownerships/ownership-notes.css', ['module'], function(module) { module.exports = "ownership-notes .sw-icon-info {\n  color: #337ab7;\n}\nownership-notes .sw-icon-defect {\n  color: #d9534f;\n}\nownership-notes .sw-icon-deception {\n  color: #f0ad4e;\n}\n.tooltip-label:after {\n  content: ': ';\n}\n"; });
define('text!resources/elements/paging/paging-toolbar.css', ['module'], function(module) { module.exports = "paging-toolbar .paging-component {\n  display: inline-block;\n  float: left;\n}\npaging-toolbar div > div {\n  display: inline-block;\n}\npaging-toolbar .paging-button {\n  padding: 2.5px;\n  color: #337ab7;\n  background-color: #fff;\n  border-color: #ccc;\n}\npaging-toolbar .paging-button:disabled {\n  color: #ccc;\n  background-color: #fff;\n  border-color: #ccc;\n}\npaging-toolbar .paging-button:hover {\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #337ab7;\n}\npaging-toolbar .paging-button:hover:disabled {\n  color: #ccc;\n}\npaging-toolbar .current-page {\n  position: relative;\n  padding: 0 5px;\n  font-size: 11px;\n}\npaging-toolbar .current-page .enter-page {\n  border: 1px solid #ccc;\n  border-radius: 3px;\n  width: 28px;\n  height: 24px;\n  padding: 0 5px;\n}\npaging-toolbar .current-page .enter-page.invalid {\n  border-color: #d9534f;\n}\npaging-toolbar .current-page input::-webkit-outer-spin-button,\npaging-toolbar .current-page input::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n  /* <-- Apparently some margin are still there even though it's hidden */\n}\n"; });
define('text!resources/elements/search/search-form.css', ['module'], function(module) { module.exports = "search-form .search-button-bar label {\n  font-size: 10.8px;\n}\nsearch-form .search-button-bar .editor-buttons {\n  padding-right: 0;\n}\nsearch-form .search-button-bar .editor-buttons button {\n  float: right;\n}\nsearch-form .search-button-bar .editor-buttons button:first-child {\n  margin-left: 5px;\n}\nsearch-form .advanced-options label:after {\n  content: \"\";\n}\nsearch-form .advanced-options .checkbox input[type=\"checkbox\"],\nsearch-form .advanced-options .radio input[type=\"radio\"] {\n  margin-left: 0;\n}\nsearch-form label.disabled {\n  color: #ccc;\n}\n"; });
define('text!resources/elements/select-picker/select-picker.css', ['module'], function(module) { module.exports = ".select2-container.select2-container--open {\n  z-index: 7500;\n}\n.select2-container .select2-container--default,\n.select2-container .select2-selection--multiple {\n  border: 1px solid #ccc;\n}\n.select2-container .select2-container--default .select2-selection__choice,\n.select2-container .select2-selection--multiple .select2-selection__choice {\n  background-color: #f9f9f9;\n}\n.select2-container .select2-dropdown .select2-results .select2-results__option {\n  padding: 2px 6px;\n  font-size: 12px;\n}\n.select2-container .select2-dropdown .select2-results .select2-results__option .select2-results__option--highlighted {\n  background-color: #337ab7;\n  color: #fff;\n}\n.select2-container .select2-dropdown .select2-search input {\n  font-size: 12px;\n}\n.select2-container .select2-selection--single .select2-selection__rendered {\n  padding-left: 10px;\n}\n.select2-container .select2-search__field {\n  color: #555;\n}\n.select2-container .select2-selection__clear {\n  color: #555;\n}\n.select2-container--default .select2-results__option--highlighted[aria-selected] {\n  background-color: #337ab7;\n  color: #fff;\n}\n.select2-container--default.select2-container--focus .select2-selection--multiple,\n.select2-container--default .select2-selection--single {\n  border: 1px solid #ccc;\n}\n"; });
define('text!resources/elements/stamps/stamp-card.css', ['module'], function(module) { module.exports = ".stamp-card {\n  position: relative;\n  height: 285px;\n  width: 300px;\n  display: inline-block;\n  cursor: default;\n  padding: 15px;\n  border: #eee solid 2px;\n  border-radius: 4px;\n  margin: 2px;\n  font-size: 0.9em;\n  color: #333333;\n}\n.stamp-card::selection {\n  background: transparent;\n}\n.stamp-card::-moz-selection {\n  background: transparent;\n}\n.stamp-card:first-child {\n  margin-left: 0;\n}\n.stamp-card:last-child {\n  margin-right: 0;\n}\n.stamp-card.selected {\n  border: #c1d7e9 2px solid;\n}\n.stamp-card.selected.highlight {\n  border: #c9e2ad 2px solid;\n  background: #fbfdf8;\n}\n.stamp-card div {\n  margin: auto;\n}\n.stamp-card .action-panel {\n  height: 50px;\n  padding-top: 5px;\n  margin-left: auto;\n  margin-right: auto;\n  margin-top: 5px;\n  left: 50%;\n  position: relative;\n  transform: translate(-50%, 0);\n}\n.stamp-card .action-panel .btn,\n.stamp-card .action-panel .btn > span {\n  cursor: pointer;\n}\n.stamp-card .card-header {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  text-align: center;\n  position: relative;\n}\n.stamp-card .card-header .header-status {\n  display: inline-block;\n  float: left;\n  background-color: #fff;\n  margin-right: 5px;\n}\n.stamp-card .description {\n  text-align: center;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  font-size: 0.9em;\n  padding-bottom: 5px;\n}\n.stamp-card .stamp-thumbnail {\n  padding: 4px;\n  margin: auto;\n  height: 160px;\n  width: 160px;\n  background-color: #333333;\n  position: relative;\n  border-radius: 4px;\n}\n.stamp-card .stamp-thumbnail img {\n  cursor: pointer;\n  max-width: 150px;\n  max-height: 150px;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n"; });
define('text!resources/elements/stamps/stamp-editor.css', ['module'], function(module) { module.exports = "stamp-editor {\n  width: 100%;\n}\n.stamp-editor {\n  font-size: 0.8em;\n}\n.editor-buttons {\n  float: right;\n}\n"; });
define('text!resources/elements/stamps/stamp-grid.css', ['module'], function(module) { module.exports = "stamp-grid {\n  height: 100%;\n  display: flex;\n  display: -webkit-flex;\n  flex-direction: row;\n  -webkit-flex-direction: row;\n  -webkit-align-content: stretch;\n  align-content: stretch;\n}\n.sw-stamp-grid {\n  -webkit-flex: 1;\n  flex: 1;\n  position: relative;\n}\n.sw-stamp-grid .scroller {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  overflow-y: auto;\n}\n.sw-stamp-grid .with-references {\n  height: calc(100% - 170px);\n}\n.sw-reference-catalogue-numbers {\n  height: 170px;\n  width: 100%;\n  position: absolute;\n  bottom: 0;\n  border: #eee solid thin;\n  border-radius: 0 0 4px 4px;\n}\n"; });
define('text!resources/elements/stamps/stamp-replacement-table.css', ['module'], function(module) { module.exports = "stamp-replacement-table {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  width: 100%;\n  height: 100%;\n}\nstamp-replacement-table .stamp-replacement-header {\n  position: absolute;\n  top: 0;\n  height: 100px;\n  width: 100%;\n}\nstamp-replacement-table .stamp-replacement-table-wrapper {\n  overflow-y: auto;\n  overflow-x: hidden;\n  width: 100%;\n  position: absolute;\n  top: 100px;\n  bottom: 40px;\n  height: calc(100% - 140px);\n}\nstamp-replacement-table .stamp-replacement-table-wrapper tr {\n  height: 39px;\n}\nstamp-replacement-table .stamp-replacement-table-wrapper .replacement-value-input {\n  margin-right: 10px;\n}\nstamp-replacement-table .stamp-replacement-table-wrapper .unknown {\n  font-style: italic;\n}\nstamp-replacement-table .stamp-replacement-footer {\n  bottom: 0;\n  position: absolute;\n  border-top: 1px #ccc solid;\n  padding: 6px 12px;\n  height: 40px;\n  width: 100%;\n}\nstamp-replacement-table .stamp-replacement-footer .filtering-message {\n  font-size: 12px;\n}\nstamp-replacement-table .stamp-replacement-footer .filtering-message .badge {\n  margin-right: 12px;\n}\nstamp-replacement-table .stamp-replacement-footer button {\n  float: right;\n}\nstamp-replacement-table .form-control {\n  height: 28px;\n  font-size: 12px;\n}\nstamp-replacement-table .sw-icon-ok::before {\n  color: #2b9b5f;\n}\n"; });
define('text!resources/elements/stamps/stamp-table.css', ['module'], function(module) { module.exports = "stamp-table {\n  height: 100%;\n  width: 100%;\n  display: flex;\n  overflow-y: auto;\n  display: -webkit-flex;\n  flex-direction: row;\n  -webkit-flex-direction: row;\n  -webkit-align-content: stretch;\n  align-content: stretch;\n}\nstamp-table .grid-footer-container {\n  opacity: 0.01;\n}\nstamp-table table {\n  table-layout: fixed;\n}\nstamp-table table tbody tr.selected {\n  background-color: #e2edf7;\n}\nstamp-table table tbody tr.selected:hover {\n  background-color: #cee1f1;\n}\nstamp-table table tbody tr.selected.highlight {\n  background-color: #e2efd3;\n}\nstamp-table table * {\n  cursor: default;\n}\n"; });
define('text!resources/views/manage/manage.css', ['module'], function(module) { module.exports = ".entity-type {\n  padding: 15px;\n}\n.entity-type .list-group-item:hover {\n  background-color: #8bb8df;\n  color: #c7ddef;\n  cursor: pointer;\n}\n.entity-type .list-group-item.selected {\n  background-color: #337ab7;\n  color: #c7ddef;\n  cursor: default;\n}\n.entity-type .list-group-item div {\n  display: inline-block;\n}\n.entity-type .list-group-item div:last-child {\n  float: right;\n}\n.entity-type .list-group-item div:first-child {\n  width: calc(100% - 35px);\n}\n.entity-type .sw-create-action {\n  float: right;\n  opacity: 0.2;\n}\n.entity-type .sw-create-action:hover {\n  opacity: 1.0;\n}\n.manage-list-toolbar {\n  height: 40px;\n}\n.manage-list-toolbar .col-sm-2,\n.manage-list-toolbar .col-sm-4 {\n  padding-right: 0;\n}\n.manage-list-toolbar .input-group > input {\n  width: auto;\n}\n.manage-list-toolbar .input-group > button {\n  width: 32px;\n  padding-left: 6px;\n  height: 26px;\n  font-size: 12px;\n}\n.manage-list-toolbar label {\n  text-align: right;\n  float: right;\n  vertical-align: middle;\n  display: inline-block;\n  position: relative;\n  top: 5px;\n}\n.manage-list {\n  height: calc(100% - 56px);\n  padding-top: 15px;\n  position: relative;\n  top: 56px;\n  overflow-y: hidden;\n}\n.manage-list > .row {\n  height: 100%;\n}\n.manage-list > .row > div {\n  height: 100%;\n}\n.manage-list .manage-list-contents {\n  height: calc(100% - 40px);\n  overflow: auto;\n}\n.manage-list .actions {\n  width: 120px;\n}\n.manage-list .sw-entitylist-count,\n.manage-list .sw-entitylist-actions {\n  min-width: 120px;\n  width: 120px;\n}\n.manage-list .sw-entitylist-name {\n  max-width: 33%;\n}\n.manage-list .entity-list td,\n.manage-list .entity-list th {\n  cursor: default;\n  font-size: 11.9px;\n}\n"; });
define('text!resources/views/preferences/user-settings.css', ['module'], function(module) { module.exports = ".user-settings {\n  height: calc(100% - 56px);\n  padding-top: 15px;\n  position: relative;\n  top: 56px;\n  overflow-y: auto;\n  width: 100%;\n}\n.user-settings .editor-buttons {\n  margin-bottom: 10px;\n}\n.user-settings .list-group-item:hover {\n  background-color: #8bb8df;\n  color: #c7ddef;\n  cursor: pointer;\n}\n.user-settings .list-group-item.selected {\n  background-color: #337ab7;\n  color: #c7ddef;\n  cursor: default;\n}\n"; });
define('text!resources/views/stamps/purchase-form.css', ['module'], function(module) { module.exports = ".purchase-form {\n  width: 500px;\n}\n.purchase-form .price-paid {\n  padding-left: 0;\n}\n.purchase-form .price-paid input {\n  width: 75px;\n  margin-right: 10px;\n}\n.purchase-form .percentage-not-valid {\n  opacity: 0.5;\n}\n.purchase-form .label-value {\n  text-align: left;\n  padding-left: 0;\n}\n.purchase-form .purchase-currency {\n  position: absolute;\n  top: 0;\n  left: 85px;\n}\n.purchase-form .help-block {\n  padding-top: 25px;\n  margin-bottom: 0;\n  padding-left: 165px;\n}\nai-dialog-body > div.well {\n  background-color: #337ab7;\n  color: #eee;\n  margin-left: -12px;\n  margin-right: -12px;\n  margin-top: -12px;\n}\nai-dialog-footer {\n  position: relative;\n  height: 50px;\n}\nai-dialog-footer .process-progress,\nai-dialog-footer .messaging {\n  width: 60%;\n  display: inline-block;\n  float: left;\n  padding-top: 10px;\n  padding-left: 10px;\n  top: 50%;\n  transform: translate(0, -50%);\n  left: 0;\n  position: absolute;\n}\nai-dialog-footer .process-progress .progress {\n  margin-bottom: 10px;\n}\nai-dialog-footer .messaging {\n  text-align: left;\n  font-size: 12px;\n}\nai-dialog-footer .messaging i {\n  color: #d9534f;\n}\nai-dialog-footer .button-actions {\n  position: absolute;\n  right: 10px;\n  bottom: 0;\n  top: 0;\n  float: right;\n}\n"; });
define('text!resources/views/stamps/stamp-list.css', ['module'], function(module) { module.exports = ".stamp-content {\n  height: calc(100% - 110px);\n  position: relative;\n  top: 55px;\n}\n.stamp-content .row {\n  height: calc(100% - 60px);\n}\n.input-group.quick-search input.form-control {\n  width: auto;\n}\ncollapse-panel .panel {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.stamp-grid-nav {\n  top: 55px;\n  height: 55px;\n  margin-bottom: 10px;\n  border-radius: 0;\n  font-size: 0.9em;\n}\n.stamp-grid-nav .form-control {\n  height: 30px;\n  font-size: 0.9em;\n}\n.stamp-grid-nav .btn-toolbar {\n  width: 100%;\n  position: absolute;\n  top: 50%;\n  transform: translate(0, -50%);\n}\n.stamp-grid-nav .btn.disabled {\n  opacity: 0.35;\n}\n.stamp-list-footer {\n  bottom: 0px;\n  position: relative;\n  width: 100%;\n  border-radius: 0;\n  border-top: ridge 1px #efefef;\n  margin: 5px 0 0 0;\n  font-size: 0.9em;\n}\n.stamp-list-footer .form-control {\n  height: 30px;\n}\n.stamp-list-footer .pagination {\n  display: block;\n  margin: 0;\n}\n.stamp-list-footer .report-statistics {\n  float: right;\n  margin-right: 25px;\n  display: inline-block;\n}\n.stamp-list-footer .report-statistics .statistics-button {\n  padding: 2.5px;\n  color: #337ab7;\n  background-color: #fff;\n  border-color: #ccc;\n}\n.stamp-list-footer .report-statistics .statistics-button.active {\n  background-color: #fff;\n}\n.stamp-list-footer .report-statistics .statistics-button:focus {\n  outline: none;\n}\n.stamp-list-footer .report-statistics .statistics-button:hover {\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #337ab7;\n}\n.stamp-list-footer .report-statistics .statistics-button:hover:disabled {\n  color: #ccc;\n}\n.stamp-list-footer .report-statistics .value-display {\n  border: 1px solid #ccc;\n  border-radius: 0 3px 3px 0;\n  width: 100px;\n  height: 25px;\n  left: -1px;\n  position: relative;\n  background-color: #f9f9f9;\n  padding: 0 5px;\n  font-size: 12px;\n}\n.stamp-list-footer .btn-toolbar {\n  float: right;\n}\n.stamp-list-footer .btn-toolbar .badge {\n  position: relative;\n  top: -2px;\n  font-weight: normal;\n}\n.sort-actions {\n  margin-right: 5px;\n}\n.sort-actions .dropdown {\n  float: left;\n}\n.sort-actions .sort-selector {\n  width: 150px;\n  text-align: left;\n  float: left;\n  border-radius: 4px 0 0 4px;\n}\n.sort-actions .sort-selector .caret {\n  float: right;\n  top: 7px;\n  position: relative;\n}\n.result-size-selector {\n  width: 65px;\n  text-align: left;\n}\n.result-size-selector .caret {\n  float: right;\n  top: 7px;\n  position: relative;\n}\n.results-group {\n  float: right;\n  line-height: 30px;\n  position: relative;\n}\n.selection-group {\n  margin-right: 15px;\n  line-height: 30px;\n  position: relative;\n  float: right;\n}\n.sw-editor-container {\n  height: 100%;\n  display: flex;\n  display: -webkit-flex;\n  flex-direction: row;\n  -webkit-flex-direction: row;\n  -webkit-align-content: stretch;\n  align-content: stretch;\n  position: relative;\n  padding: 0;\n}\n.sw-dialog-wrapper .modal-body .bootbox-body {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n"; });
//# sourceMappingURL=app-bundle.js.map