"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.doTracking = exports.initializeTracker = exports.gaElems = exports.gaNewElem = void 0;
var tracking_1 = require("@uniformdev/tracking");
var common_1 = require("@uniformdev/common");
var common_client_1 = require("@uniformdev/common-client");
var debugLogger = {
    debug: function (message, data) { console.log(new Date().toISOString() + " [Uniform Tracker  DEBUG] " + message, data); },
    error: function (message, data) { console.log(new Date().toISOString() + " [Uniform Tracker  ERROR] " + message, data); },
    info: function (message, data) { console.log(new Date().toISOString() + " [Uniform Tracker   INFO] " + message, data); },
    trace: function (message, data) { console.log(new Date().toISOString() + " [Uniform Tracker  TRACE] " + message, data); },
    warn: function (message, data) { console.log(new Date().toISOString() + " [Uniform Tracker   WARN] " + message, data); }
};
function getLogger(settings) {
    return (settings === null || settings === void 0 ? void 0 : settings.debug) == true ? debugLogger : common_1.getNullLogger();
}
function shouldAddSubscriptionsForContextCookies(settings) {
    return (settings === null || settings === void 0 ? void 0 : settings.mode) == "mvc";
}
function getTrackingConfig(settings, logger) {
    var _a, _b;
    if ((_a = settings === null || settings === void 0 ? void 0 : settings.context) === null || _a === void 0 ? void 0 : _a.tracking) {
        logger.debug("Uniform tracking - initializeTracker - Using tracking config from settings to determine tracker cookie types.", { settings: settings });
        return settings.context;
    }
    if ((_b = window.uniform) === null || _b === void 0 ? void 0 : _b.tracking) {
        logger.debug("Uniform tracking - initializeTracker - Using tracking config from global object to determine tracker cookie types.", { global: window.uniform });
        return window.uniform.tracking;
    }
}
function addSubscriptionsForContextCookies(trackingConfig, subs, logger) {
    var cookieTypes = tracking_1.getTrackerCookieTypes(trackingConfig);
    tracking_1.addSubscriptionsForTrackerCookies(subs, {
        cookieTypes: cookieTypes,
        logger: logger,
        loggerPrefix: "Uniform tracking - initializeTracker",
        getCookie: tracking_1.getCookie,
        removeCookie: tracking_1.removeCookie,
        setCookie: tracking_1.setCookie
    });
}
exports.gaNewElem = {};
exports.gaElems = {};
function gaInit() {
    var currdate = new Date();
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments);
        }, i[r].l = 1 * currdate;
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga', exports.gaNewElem, exports.gaElems);
}
/**
 * Prepares the tracker and makes it available as a global JavaScript object.
 * No data is tracked when this function is called.
 * @param settings
 */
function initializeTracker(settings) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var logger, trackingConfig, scripts, scriptLoader, error_1, addSubscription, subscriptions, dispatchers, args, tracker;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    logger = getLogger(settings);
                    trackingConfig = getTrackingConfig(settings, logger);
                    if (!trackingConfig) {
                        logger.error("Uniform tracking - initializeTracker - Unable to resolve tracking config so tracker cannot be initialized.", { settings: settings });
                        return [2 /*return*/, Promise.resolve(undefined)];
                    }
                    if (!((_a = trackingConfig.settings) === null || _a === void 0 ? void 0 : _a.scripts)) return [3 /*break*/, 4];
                    scripts = __assign({}, trackingConfig.settings.scripts);
                    //
                    //If the optimize script is included, remove it because this is that script.
                    if (scripts.optimize) {
                        delete scripts.optimize;
                        logger.debug("Uniform tracking - initializeTracker - Optimize script was removed from the collection of client scripts to load because that script is running this code.", { scripts: scripts });
                    }
                    scriptLoader = common_client_1.getClientScriptLoader();
                    if (!scriptLoader) {
                        logger.error("Uniform tracking - initializeTracker - Unable to resolve script loader so tracker cannot be initialized.", { trackingConfig: trackingConfig });
                        return [2 /*return*/, Promise.resolve(undefined)];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, scriptLoader.load(scripts, { logger: logger })];
                case 2:
                    _d.sent();
                    logger.debug("Uniform tracking - initializeTracker - Scripts finished loading.", { scripts: scripts });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _d.sent();
                    logger.error("Uniform tracking - initializeTracker - Error occurred while loading scripts so tracker cannot be initialized.", { trackingConfig: trackingConfig, scripts: scripts, error: error_1 });
                    return [2 /*return*/, Promise.reject(error_1)];
                case 4:
                    addSubscription = function (name, type) {
                        if (!name) {
                            return;
                        }
                        var parts = name.split('.');
                        if (parts.length > 1 && parts[0] == "window") {
                            parts.splice(0, 1);
                        }
                        var callback = window;
                        for (var i = 0; i < parts.length; i++) {
                            if (!callback) {
                                break;
                            }
                            callback = callback[parts[i]];
                        }
                        if (callback == undefined || typeof callback !== "function") {
                            logger.error("Uniform tracking - initializeTracker - Unable to add a tracker subscription because the specified function does not exist.", { name: name, type: type });
                            return;
                        }
                        if (callback) {
                            subscriptions.subscribe(type, callback);
                        }
                    };
                    subscriptions = common_1.getSubscriptionManager();
                    //
                    //Add handlers for setting context data in cookies.
                    if (shouldAddSubscriptionsForContextCookies(settings)) {
                        logger.debug("Uniform tracking - initializeTracker - Adding subscriptions for context cookies.", { settings: settings });
                        addSubscriptionsForContextCookies(trackingConfig, subscriptions, logger);
                    }
                    //
                    //Add custom handlers specified on the settings.
                    addSubscription(settings.onTrackingFinished, "tracking-finished");
                    addSubscription(settings.onVisitCreated, "visit-created");
                    addSubscription(settings.onVisitUpdated, "visit-updated");
                    addSubscription(settings.onVisitorUpdated, "visitor-updated");
                    dispatchers = tracking_1.getDispatchersFromTrackingConfig(trackingConfig, {
                        getCookie: tracking_1.getCookie,
                        logger: logger,
                        loggerPrefix: "Uniform tracking - initializeTracker",
                        removeCookie: tracking_1.removeCookie,
                        setCookie: tracking_1.setCookie,
                        ga: {
                            initializeGa: function (destination, logger) {
                                if (!window.ga) {
                                    logger.error("Uniform tracking - initializeTracker - The global function ga is not defined, so initializing the GA library.", { destination: destination });
                                    gaInit();
                                }
                                if (!window.ga) {
                                    logger.error("Uniform tracking - initializeTracker - The global function ga is not defined, suggesting the GA library has not been loaded.", { destination: destination });
                                    return false;
                                }
                                if (!destination.trackingIds) {
                                    logger.debug("Uniform tracking - initializeTracker - No tracking ids set on GA destination so no GA tracker objects will be created.", { destination: destination });
                                    return false;
                                }
                                destination.trackingIds.forEach(function (trackingId) {
                                    try {
                                        window.ga("create", trackingId, "auto");
                                        logger.debug("Uniform tracking - initializeTracker - GA tracker object was created.", { trackingId: trackingId, destination: destination });
                                    }
                                    catch (error) {
                                        logger.error("Uniform tracking - initializeTracker - Error while creating GA tracker object.", { trackingId: trackingId, error: error });
                                    }
                                });
                                return true;
                            }
                        }
                    });
                    args = {
                        dispatchers: dispatchers,
                        sessionTimeout: (_b = settings.sessionTimeout) !== null && _b !== void 0 ? _b : 20,
                        storage: (_c = settings.storage) !== null && _c !== void 0 ? _c : "default",
                        subscriptions: subscriptions,
                        type: "js"
                    };
                    tracker = tracking_1.getSitecoreTracker(args, logger);
                    if (!tracker) {
                        logger.error("Uniform tracking - initializeTracker - No tracker was returned from getSitecoreTracker.", { args: args });
                        return [2 /*return*/, Promise.resolve(undefined)];
                    }
                    //
                    //Set the tracker on the global object.
                    if (!window.uniform) {
                        window.uniform = {};
                    }
                    window.uniform.tracker = tracker;
                    return [2 /*return*/, Promise.resolve(tracker)];
            }
        });
    });
}
exports.initializeTracker = initializeTracker;
/**
 * Tracks using tracking data from the global JavaScript object.
 * If the tracker is not already initialized, this function
 * initializes it.
 * @param settings
 */
function doTracking(settings) {
    var _a;
    var logger = getLogger(settings);
    if (!window.uniform) {
        return;
    }
    var source = settings.source;
    if (!source) {
        logger.error("Uniform tracking - doTracking - No source was specified.", { settings: settings });
        return;
    }
    var context = (_a = settings.context) !== null && _a !== void 0 ? _a : window.uniform;
    if (!context) {
        logger.warn("Uniform tracking - doTracking - No context was was resolved.", { settings: settings });
        return;
    }
    var useTracker = function (tracker) {
        if (!tracker) {
            logger.error("Uniform tracking - doTracking - No tracker is available.", { settings: settings });
            return;
        }
        logger.debug("Uniform tracking - doTracking - Tracker is available.", { settings: settings });
        var visitorId = tracking_1.getCookie(tracking_1.UniformCookieNames.VisitorId);
        logger.debug("Uniform tracking - doTracking - Visitor id was retrieved from cookie.", { visitorId: visitorId, cookie: tracking_1.UniformCookieNames.VisitorId });
        var results = tracker.track(source, context, { visitorId: visitorId, createVisitor: true, silent: settings.silent });
        logger.debug("Uniform tracking - doTracking - Tracking results were returned.", { results: results });
        if (results && results.visitor) {
            tracking_1.setCookie(tracking_1.UniformCookieNames.VisitorId, results.visitor.id);
            logger.debug("Uniform tracking - doTracking - Visitor id cookie was updated.", { visitorId: visitorId, cookie: tracking_1.UniformCookieNames.VisitorId });
        }
    };
    if (window.uniform.tracker) {
        logger.debug("Uniform tracking - doTracking - Using the tracker set on the global object.", { settings: settings });
        useTracker(window.uniform.tracker);
    }
    else {
        initializeTracker(settings).then(function (tracker) {
            logger.debug("Uniform tracking - doTracking - Using the newly initialized tracker.", { settings: settings });
            useTracker(tracker);
            logger.debug("Uniform tracking - doTracking - Tracking is finished.", { settings: settings });
        });
    }
}
exports.doTracking = doTracking;
//# sourceMappingURL=tracker.js.map