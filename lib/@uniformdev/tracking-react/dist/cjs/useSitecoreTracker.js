"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSitecoreTracker = void 0;
const react_1 = require("react");
const react_cookie_1 = require("react-cookie");
const common_1 = require("@uniformdev/common");
const react_2 = require("@uniformdev/react");
const TrackerContext_1 = require("./TrackerContext");
const useScripts_1 = require("./useScripts");
const tracking_1 = require("@uniformdev/tracking");
const tracking_2 = require("@uniformdev/tracking");
const tracking_3 = require("@uniformdev/tracking");
const tracking_4 = require("@uniformdev/tracking");
const tracking_5 = require("@uniformdev/tracking");
const tracking_6 = require("@uniformdev/tracking");
const tracking_7 = require("@uniformdev/tracking");
const react_ga_1 = __importDefault(require("react-ga"));
/**
 * Merge tracking scripts from tracking data and props, with
 * values from props having priority.
 * @param trackingConfig
 * @param props
 */
function getTrackerScripts(trackingConfig, props) {
    var _a;
    const scripts = {};
    common_1.appendObject((_a = trackingConfig === null || trackingConfig === void 0 ? void 0 : trackingConfig.settings) === null || _a === void 0 ? void 0 : _a.scripts, scripts);
    common_1.appendObject(props === null || props === void 0 ? void 0 : props.scripts, scripts);
    if (!scripts['optimize']) {
        scripts['optimize'] = '/uniform.optimize.min.js';
    }
    return scripts;
}
/**
 * When dispatchers are configured by a developer, they
 * are exposed in hook's props as destinations. This
 * function controls the process responsible for
 * converting these destinations into dispatchers.
 * @param props
 * @param logger
 */
function getDispatchersFromProps(props, args) {
    const dispatchers = [];
    if (props.ga) {
        common_1.appendArray(tracking_4.getDispatchersForGaDestinations([props.ga], args), dispatchers);
    }
    if (props.oracleDmp) {
        common_1.appendArray(tracking_4.getDispatchersForOracleDmpDestinations([props.oracleDmp], args), dispatchers);
    }
    if (props.xdb) {
        common_1.appendArray(tracking_4.getDispatchersForXdbDestinations([props.xdb], args), dispatchers);
    }
    return dispatchers;
}
/**
 * Get dispatchers from tracking data and props.
 * @param trackingConfig
 * @param props
 * @param logger
 */
function getDispatchers(trackingConfig, props, args) {
    //
    //
    const { logger } = args;
    const fromProps = getDispatchersFromProps(props, args);
    if (fromProps.length > 0) {
        logger.debug("useSitecoreTracker - Dispatchers retrieved from destinations set on props.", fromProps);
    }
    //
    //
    const fromTrackingConfig = tracking_5.getDispatchersFromTrackingConfig(trackingConfig, args);
    if (fromTrackingConfig.length > 0) {
        logger.debug("useSitecoreTracker - Dispatchers retrieved from tracking config.", fromTrackingConfig);
    }
    //
    //
    return fromProps.concat(fromTrackingConfig);
}
function getTrackingConfig(sitecoreContext) {
    var _a, _b;
    let tracking = sitecoreContext === null || sitecoreContext === void 0 ? void 0 : sitecoreContext.tracking;
    if (!tracking) {
        tracking = (_b = (_a = sitecoreContext === null || sitecoreContext === void 0 ? void 0 : sitecoreContext.sitecore) === null || _a === void 0 ? void 0 : _a.context) === null || _b === void 0 ? void 0 : _b.tracking;
    }
    return tracking;
}
function useSitecoreTracker(sitecoreContext, props) {
    var _a;
    const logger = (_a = props === null || props === void 0 ? void 0 : props.logger) !== null && _a !== void 0 ? _a : common_1.getNullLogger();
    const uniformContext = react_1.useContext(react_2.UniformContext);
    const trackerContext = react_1.useContext(TrackerContext_1.TrackerContext);
    const [cookies, setCookie, removeCookie] = react_cookie_1.useCookies([]);
    const [tracker, setTracker] = react_1.useState(undefined);
    const [scriptsLoaded, setScriptsLoaded] = react_1.useState(false);
    const [clientScripts, setClientScripts] = react_1.useState({});
    const trackingConfig = getTrackingConfig(sitecoreContext);
    react_1.useEffect(() => {
        //
        //This hook usually is passed the Sitecore context, and this context
        //may change as the page is loaded. As a result, this hook shouldn't
        //run until it's clear that enough context data is available to run.
        if (!trackingConfig) {
            logger.debug("Sitecore context is undefined or Sitecore context is defined but there is no tracking config object available. The tracker cannot be loaded until this object is available.", { sitecoreContext });
            return;
        }
        const scripts = getTrackerScripts(trackingConfig, props);
        setClientScripts(scripts);
    }, [sitecoreContext]);
    useScripts_1.useScripts(clientScripts, () => {
        if (scriptsLoaded == true) {
            return;
        }
        common_1.initializeGlobalObject();
        if (Object.keys(clientScripts).length == 0) {
            logger.info("useSitecoreTracker - No scripts were specified to be loaded.");
        }
        else {
            logger.info("useSitecoreTracker - Scripts are loaded.", clientScripts);
        }
        setScriptsLoaded(true);
    });
    react_1.useEffect(() => {
        var _a, _b, _c, _d, _e;
        if (scriptsLoaded != true) {
            return;
        }
        //
        //Add subscriptions to tracker.
        const trackerSubs = common_1.getSubscriptionManager();
        if (props === null || props === void 0 ? void 0 : props.subscriptions) {
            logger.debug("useSitecoreTracker - Adding subscribers from props to the tracker.");
            props.subscriptions(trackerSubs.subscribe);
        }
        //
        //
        const cookieTypes = tracking_3.getTrackerCookieTypes(trackingConfig);
        common_1.appendArray(props === null || props === void 0 ? void 0 : props.cookies, cookieTypes);
        //
        //
        tracking_3.addSubscriptionsForTrackerCookies(trackerSubs, {
            cookieTypes,
            logger,
            loggerPrefix: "useSitecoreTracker",
            getCookie: (name) => cookies[name],
            removeCookie,
            setCookie
        });
        //
        //Add subscription to publish tracker events to the context.
        const unsubscribes = [];
        if (!uniformContext.subscriptions) {
            uniformContext.subscriptions = common_1.getSubscriptionManager();
        }
        const contextSubs = uniformContext.subscriptions;
        if (contextSubs) {
            logger.debug("useSitecoreTracker - Adding subscriber to tracker to publish tracker events to context.");
            const unsubscribe = trackerSubs.subscribe(undefined, e => {
                contextSubs.publish(e);
            });
            if (unsubscribe) {
                unsubscribes.push(unsubscribe);
            }
        }
        //
        //React-specific code is needed to initialize the GA dispatcher.
        //This code is passed to the dispatcher
        const dispatchers = getDispatchers(trackingConfig, props !== null && props !== void 0 ? props : {}, {
            logger,
            loggerPrefix: "useSitecoreTracker",
            getCookie: (name) => cookies[name],
            setCookie,
            removeCookie,
            ga: {
                initializeGa: (destination, logger) => {
                    if (!destination.trackingIds || destination.trackingIds.length == 0) {
                        logger.debug("useSitecoreTracker - GA destination has no tracking ids assigned, so no GA initialization will be performed.", destination);
                        return false;
                    }
                    var didInitialize = true;
                    destination.trackingIds.forEach(id => {
                        logger.debug("useSitecoreTracker - Will initialize GA from tracking id " + id);
                        try {
                            react_ga_1.default.initialize(id, { gaOptions: { name: id } });
                        }
                        catch (ex) {
                            logger.error("useSitecoreTracker - Error while initializing GA from tracking id " + id, ex);
                            didInitialize = false;
                        }
                    });
                    return didInitialize;
                }
            }
        });
        if (dispatchers.length == 0) {
            logger.debug("useSitecoreTracker - No dispatchers were found.");
        }
        //
        //
        const contextReaders = new Map();
        if (props === null || props === void 0 ? void 0 : props.contextReaders) {
            contextReaders.set(tracking_2.CONTEXT_SOURCE_SITECORE, props.contextReaders);
        }
        //
        //
        const args = {
            decay: (_a = props === null || props === void 0 ? void 0 : props.decay) !== null && _a !== void 0 ? _a : tracking_6.getDefaultDecaySettings(),
            dispatchers,
            logger,
            sessionTimeout: (_b = props === null || props === void 0 ? void 0 : props.sessionTimeout) !== null && _b !== void 0 ? _b : 20,
            type: (_c = props === null || props === void 0 ? void 0 : props.type) !== null && _c !== void 0 ? _c : 'default',
            storage: (_d = props === null || props === void 0 ? void 0 : props.storage) !== null && _d !== void 0 ? _d : 'default',
            subscriptions: trackerSubs,
            contextReaders
        };
        //
        //Get the tracker
        logger.debug('useSitecoreTracker - Initializing the tracker.', { settings: args });
        const scTracker = tracking_7.getSitecoreTracker(args, logger);
        if (!scTracker) {
            logger.error('useSitecoreTracker - No tracker was resolved.');
            return;
        }
        setTracker(scTracker);
        logger.debug('useSitecoreTracker - Tracker was resolved.', scTracker);
        //
        //Update the tracker context.
        logger.debug('useSitecoreTracker - Updating the tracker context.', trackerContext);
        trackerContext.tracker = scTracker;
        if (trackerContext.subscriptions) {
            logger.debug('useSitecoreTracker - Notifying tracker context subscribers that the tracker is ready.', trackerContext);
            trackerContext.subscriptions.publish({
                type: "tracker-set",
                when: new Date(),
                tracker: scTracker
            });
        }
        //
        //Get the tracker settings.
        let visitorId = cookies[tracking_3.UniformCookieNames.VisitorId];
        if (visitorId) {
            logger.debug('useSitecoreTracker - Found visitor id in cookie.', { cookie: tracking_3.UniformCookieNames.VisitorId, value: visitorId });
        }
        const trackingSettings = {
            visitorId,
            createVisitor: true,
        };
        //
        //Use the tracker.
        if ((props === null || props === void 0 ? void 0 : props.clientSideRouting) == true) {
            logger.debug('useSitecoreTracker - Client-side routing is enabled, so the hook will only initialize the tracker. ' +
                'The tracker must be called in the application, when the application determines the route has changed.');
            const results = scTracker.initialize(trackingSettings);
            logger.debug('useSitecoreTracker - Received tracking results from tracker initialization.', results);
            visitorId = updateCookie(visitorId, results);
        }
        else {
            logger.debug('useSitecoreTracker - Client-side routing is disabled, so track using tracking data.', { props, trackingConfig, trackingSettings });
            const results = scTracker.track('sitecore', trackingConfig, trackingSettings);
            logger.debug('useSitecoreTracker - Received tracking results from tracking with tracking data.', { visitorId, results });
            visitorId = updateCookie(visitorId, results);
        }
        trackerContext.visitorId = visitorId;
        //
        //
        if (props === null || props === void 0 ? void 0 : props.onInitialized) {
            props.onInitialized();
        }
        //
        //Components can use the global queue to capture
        //tracker events even if the tracker is not yet
        //initialized. Now that the tracker is being 
        //initialized, it is time to handle those events.
        const queue = (_e = window.uniform) === null || _e === void 0 ? void 0 : _e.queue;
        if (queue) {
            const handleEntry = (entry) => {
                var _a;
                if (entry) {
                    const tracker = (_a = window.uniform) === null || _a === void 0 ? void 0 : _a.tracker;
                    if (tracker) {
                        const settings = {
                            visitorId
                        };
                        logger.debug('useSitecoreTracker - Will track using global queue entry data.', { entry, settings });
                        const results = tracker.event(entry.type, entry.e, settings);
                        logger.debug('useSitecoreTracker - Received tracking results from tracking with global queue entry data.', results);
                        visitorId = updateCookie(visitorId, results);
                    }
                }
            };
            //
            //Process entries already in the global queue.
            while (queue.count(tracking_1.QUEUE_ENTRY_TYPE_TRACKER) > 0) {
                const entry = queue.get(tracking_1.QUEUE_ENTRY_TYPE_TRACKER);
                handleEntry(entry);
            }
            //
            //Subscribe to the global queue.
            const unsubscribe = queue.subscribe(tracking_1.QUEUE_ENTRY_TYPE_TRACKER, e => {
                const entry = e.entry;
                handleEntry(entry);
            });
            if (unsubscribe) {
                unsubscribes.push(unsubscribe);
            }
        }
        else {
            logger.debug('useSitecoreTracker - No global queue is available, so no queue processing will run.');
        }
        //
        //
        return function cleanup() {
            logger.debug('useSitecoreTracker - Removing subscriber from context that publishes tracker events to context.');
            unsubscribes.forEach(unsub => unsub());
        };
    }, [scriptsLoaded]);
    function updateCookie(visitorId, results) {
        var _a, _b;
        let newId = (_b = (_a = results.visitor) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : visitorId;
        if (visitorId != newId) {
            logger.debug('useSitecoreTracker - Updating the visitor id cookie.', { old: visitorId, new: newId });
            setCookie(tracking_3.UniformCookieNames.VisitorId, newId, {
                path: "/"
            });
        }
        return newId;
    }
    return tracker;
}
exports.useSitecoreTracker = useSitecoreTracker;
//# sourceMappingURL=useSitecoreTracker.js.map