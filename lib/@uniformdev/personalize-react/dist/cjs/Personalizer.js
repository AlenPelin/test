"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonalizer = void 0;
const react_1 = __importStar(require("react"));
const common_1 = require("@uniformdev/common");
const SitecorePersonalizationContext_1 = require("./SitecorePersonalizationContext");
const react_2 = require("@uniformdev/react");
const tracking_1 = require("@uniformdev/tracking");
const tracking_react_1 = require("@uniformdev/tracking-react");
function isPersonalizable(rendering, args) {
    const { allowed } = args;
    if (!allowed || allowed.length == 0) {
        return true;
    }
    return allowed.indexOf(rendering.componentName) > -1;
}
function doPersonalizationOnStateChange(rendering, e, getPersonalizedProps, tracker, visitorId, logger) {
    logger.debug("Personalizer component - Getting personalized props due to state change.", { rendering, event: e });
    const result1 = {
        props: e.data,
        event: e.activity
    };
    const result2 = getPersonalizedProps(rendering, logger);
    //
    //TODO: More testing is needed to ensure the right values are being used in all cases.
    logger.debug("Personalizer component - ********** TEMP **********", { result1, result2 });
    // //
    // //The event may have activity...
    // if (e.activity && Object.keys(e.activity).length > 0) {
    //   if (result.event && Object.keys(result.event).length > 0) {
    //     logger.debug("Personalizer component - Activity is set on the state-change event and an event was retrieved with personalized props. Activity from the event will be used.", { "from event": e.activity, "from result": result.event });
    //   }
    //   else {
    //     logger.debug("Personalizer component - Activity from the state-change event will be used.", { activity: e.activity });
    //   }
    //   result.event = e.activity;
    // }
    //
    //
    return doPersonalization(rendering, result1, tracker, visitorId, logger);
}
function doPersonalizationOnRouteChange(rendering, getPersonalizedProps, tracker, visitorId, logger) {
    logger.debug("Personalizer component - Getting personalized props due to route change.", { rendering });
    const result = getPersonalizedProps(rendering, logger);
    return doPersonalization(rendering, result, tracker, visitorId, logger);
}
function doPersonalization(rendering, result, tracker, visitorId, logger) {
    if (!result) {
        logger.debug("Personalizer component - No result was returned when getting personalized props.", { rendering });
        return;
    }
    if (!result.props) {
        logger.debug("Personalizer component - No personalized props were returned from getPersonalizedProps, so no personalization can be performed. Note: If server-side rendering is used, personalization may have already been performed.", { rendering });
        return;
    }
    logger.info("Personalizer component - Personalized props were returned so they will be used.", { result });
    if (!result.event) {
        logger.debug("Personalizer component - No personalization event data was returned with the personalized props, so personalization cannot be tracked.", { rendering, result });
    }
    else if (!visitorId) {
        logger.error("Personalizer component - No visitor id is available, so personalization cannot be tracked.", { rendering, result });
    }
    else {
        const activity = {
            type: "personalization",
            date: new Date().toISOString(),
            data: result.event
        };
        const settings = { silent: true, visitorId };
        logger.debug("Personalizer component - Start using tracker to capture personalization activity.", { activity, settings });
        const results = tracker.event('visit-activity', activity, settings);
        logger.debug("Personalizer component - Finished using tracker to capture personalization activity.", { results });
    }
    return result.props;
}
function getPersonalizer(args) {
    const { components, getPersonalizedProps } = args;
    const Personalizer = (props) => {
        var _a, _b;
        //
        //prop variables
        const rendering = props === null || props === void 0 ? void 0 : props.rendering;
        //
        //global context variables
        const gContext = react_1.useContext(react_2.UniformContext);
        //
        //personalization context variables
        const pContext = react_1.useContext(SitecorePersonalizationContext_1.SitecorePersonalizationContext);
        const logger = (_a = pContext === null || pContext === void 0 ? void 0 : pContext.logger) !== null && _a !== void 0 ? _a : common_1.getNullLogger();
        const personalizationManager = pContext === null || pContext === void 0 ? void 0 : pContext.personalizationManager;
        //
        //tracker context variables
        const tContext = react_1.useContext(tracking_react_1.TrackerContext);
        const tracker = (_b = tContext === null || tContext === void 0 ? void 0 : tContext.tracker) !== null && _b !== void 0 ? _b : tracking_1.getNullTracker();
        const visitorId = tContext.visitorId;
        //
        //state variables
        const [personalizedProps, setPersonalizedProps] = react_1.useState(rendering);
        //
        //route-change effect
        react_1.useEffect(() => {
            if (!(rendering === null || rendering === void 0 ? void 0 : rendering.uid))
                return;
            if (!personalizationManager)
                return;
            if (!isPersonalizable(rendering, args)) {
                logger.debug("Personalizer component - The component is not on the whitelist of components that support personalization. Personalization will not be configured for this component.", { whitelist: args.allowed, rendering });
                return;
            }
            //
            //no triggers
            const triggersOnRendering = personalizationManager.triggers ? personalizationManager.triggers[rendering.uid] : undefined;
            if (!triggersOnRendering) {
                logger.debug("Personalizer component - No triggers are defined on the personalization manager. This probably means the component is either not personalized, or is personalized but none of the personalization rules has any dependencies. Will attempt to get personalized props that might have been set on props.", { props, args });
                const newProps = doPersonalizationOnRouteChange(rendering, getPersonalizedProps, tracker, visitorId, logger);
                if (newProps) {
                    logger.debug("Personalizer component - New props were returned during route-change personalization. Set these props in component state.", { newProps });
                    setPersonalizedProps(() => newProps);
                }
                return;
            }
            //
            //
            if (!Array.isArray(triggersOnRendering)) {
                logger.error("Personalizer component - Triggers defined on the personalization manager is not an array. This probably means the tracking data was corrupted or the service that generated the tracking data is out of sync with components used in the front-end code.", { triggers: triggersOnRendering, rendering });
                return;
            }
            //
            //Add subscriptions to start the personalization 
            //process when a trigger event happens.
            const gContextUnsubs = [];
            const triggers = [];
            common_1.flattenArray(triggersOnRendering, triggers);
            const gContextSubs = gContext.subscriptions;
            if (gContextSubs) {
                triggers.forEach(trigger => {
                    logger.debug("Personalizer component - Subscribe to the trigger event on the global context subscription manager. When the event is published, start the personalization process.", { trigger, triggers, rendering, personalizationManager });
                    const unsubscribe = gContextSubs.subscribe(trigger, () => {
                        personalizationManager.onTrigger(trigger, rendering);
                    });
                    gContextUnsubs.push({ type: trigger, unsubscribe });
                });
            }
            else {
                logger.error("Personalizer component - No subscription manager is set on the global context so trigger-based personalization cannot be activated.", { "global context": gContext });
            }
            //
            //Add subscription to handle state changes on the rendering.
            const pmUnsubs = [];
            logger.debug("Personalizer component - Subscribe to the state-changed event on the personalization manager subscription manager. When the component's state changes, handle personalized props.");
            const pmUnsubscribe = personalizationManager.subscriptions.subscribe('state-changed', e => {
                var _a, _b;
                if (((_a = e === null || e === void 0 ? void 0 : e.changes) === null || _a === void 0 ? void 0 : _a.data) || ((_b = e === null || e === void 0 ? void 0 : e.changes) === null || _b === void 0 ? void 0 : _b.component)) {
                    logger.debug("Personalizer component - Trigger resulted in changes.", { event: e });
                    const newProps = doPersonalizationOnStateChange(rendering, e, getPersonalizedProps, tracker, visitorId, logger);
                    if (newProps) {
                        logger.debug("Personalizer component - New props were returned during trigger personalization. Set these props in component state.", { newProps, currentProps: personalizedProps });
                        setPersonalizedProps(() => newProps);
                    }
                }
                else if (e === null || e === void 0 ? void 0 : e.data) {
                    const newProps = e.data;
                    logger.debug("Personalizer component - No changes were reported in the event, but personalized props should still be updated because server-side rendering may have updated the props. This can happen when server-side rendering results in personalization.", { newProps, currentProps: personalizedProps });
                    setPersonalizedProps(() => newProps);
                }
            });
            pmUnsubs.push({ type: 'state-changed', unsubscribe: pmUnsubscribe });
            //
            //
            return function cleanup() {
                gContextUnsubs.forEach(unsub => {
                    logger.debug("Personalizer component - Removing subscriber from global context subscription manager that handles trigger events.", { trigger: unsub.type, rendering });
                    unsub.unsubscribe();
                });
                pmUnsubs.forEach(unsub => {
                    logger.debug("Personalizer component - Removing subscriber from personalization manager that handles component state changes.", { type: unsub.type, rendering, personalizationManager });
                    unsub.unsubscribe();
                });
            };
            //
            //
        }, [rendering === null || rendering === void 0 ? void 0 : rendering.uid, personalizationManager]);
        const component = components.get(rendering.componentName);
        const PersonalizedComponent = component;
        return react_1.default.createElement(PersonalizedComponent, Object.assign({}, personalizedProps));
    };
    return Personalizer;
}
exports.getPersonalizer = getPersonalizer;
//# sourceMappingURL=Personalizer.js.map