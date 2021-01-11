"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSitecorePersonalization = void 0;
const react_1 = require("react");
const SitecorePersonalizationContext_1 = require("./SitecorePersonalizationContext");
const common_1 = require("@uniformdev/common");
const react_2 = require("@uniformdev/react");
const tracking_1 = require("@uniformdev/tracking");
/**
 * Adds personalization to a Sitecore rendering.
 * @param props
 */
function useSitecorePersonalization(props) {
    var _a;
    //
    //
    const uniformContext = react_1.useContext(react_2.UniformContext);
    //
    //Get objects from the personalization context.
    const personalizationContext = react_1.useContext(SitecorePersonalizationContext_1.SitecorePersonalizationContext);
    const { personalizationManager, item } = personalizationContext;
    //
    //
    const { fields: nonPersonalizedFields, logger = (_a = personalizationContext.logger) !== null && _a !== void 0 ? _a : common_1.getNullLogger(), rendering, track = false, } = props;
    //
    //
    const { uid } = rendering;
    //
    //
    const dsInitial = common_1.tryFormatGuid(rendering.dataSource, 'D');
    //
    //
    const [state, setState] = react_1.useState({
        ds: dsInitial,
        error: null,
        loading: false,
        personalizedFields: nonPersonalizedFields,
    });
    //
    //Subscribe to trigger events from the personalization manager.
    //Triggers indicate that personalization may need to be re-executed.
    //An example of a trigger is that tracking finished.
    react_1.useEffect(() => {
        //
        //
        const triggers = (personalizationManager === null || personalizationManager === void 0 ? void 0 : personalizationManager.triggers) ? personalizationManager.triggers[rendering.uid]
            : undefined;
        if (!triggers) {
            return;
        }
        //
        //
        if (!uniformContext.subscriptions) {
            uniformContext.subscriptions = common_1.getSubscriptionManager();
        }
        const contextSubs = uniformContext.subscriptions;
        const unsubscribes = [];
        //
        //
        triggers.forEach((trigger) => {
            logger.debug('useSitecorePersonalization - Adding subscriber to context to trigger re-personalization.', { trigger, rendering });
            const unsubscribe = contextSubs.subscribe(trigger, (_e) => {
                personalizationManager === null || personalizationManager === void 0 ? void 0 : personalizationManager.onTrigger(trigger, rendering);
            });
            unsubscribes.push({ trigger, unsubscribe });
        });
        return function cleanup() {
            unsubscribes.forEach((unsub) => {
                logger.debug('useSitecorePersonalization - Removing subscriber from context that triggers re-personalization.', { trigger: unsub.trigger, rendering });
                unsub.unsubscribe();
            });
        };
    }, []);
    //
    //Subscribe to personalization manager events for this rendering.
    react_1.useEffect(() => {
        if (!(rendering === null || rendering === void 0 ? void 0 : rendering.uid)) {
            logger.debug('useSitecorePersonalization - No rendering was specified in the props.', { props });
            return;
        }
        if (!personalizationManager) {
            logger.debug('useSitecorePersonalization - No personalization manager was set on the personalization context.', { rendering });
            return;
        }
        if (personalizationManager === null || personalizationManager === void 0 ? void 0 : personalizationManager.disabled) {
            logger.debug('useSitecorePersonalization - Personalization is disabled.', { rendering });
            return;
        }
        //
        //Subscriber on the personalization manager updates the state
        //for the hook when personalization state changes.
        logger.debug('useSitecorePersonalization - Adding subscriber to personalization manager. This subscriber ensures the component is refreshed when it is finished loading and when new personalized fields are available.', {
            rendering,
            personalizationManager,
        });
        const unsubscribe = personalizationManager.subscriptions.subscribe('state-changed', (e) => {
            if (e.component == uid) {
                setState((prevState) => {
                    var _a, _b, _c;
                    const newState = {
                        changes: e.changes,
                        ds: prevState.ds,
                        error: e.error,
                        includedInTest: e.includedInTest,
                        loading: (_a = e.isLoading) !== null && _a !== void 0 ? _a : false,
                        personalizedFields: (_b = e.personalizedData) !== null && _b !== void 0 ? _b : nonPersonalizedFields,
                        rule: e.rule
                    };
                    if ((_c = e.changes) === null || _c === void 0 ? void 0 : _c.data) {
                        logger.debug('useSitecorePersonalization - Changing data source.', e.changes.data);
                        newState.ds = e.changes.data.after;
                    }
                    return newState;
                });
            }
        });
        personalizationManager.personalize(rendering);
        //
        //
        return function cleanup() {
            logger.debug('useSitecorePersonalization - Removing subscriber from personalization manager.', {
                rendering,
                personalizationManager,
            });
            unsubscribe();
        };
    }, [uid]);
    //
    //The data source has changed.
    react_1.useEffect(() => {
        var _a, _b, _c, _d;
        if (state.ds == dsInitial) {
            return;
        }
        if (track == true) {
            logger.debug('useSitecorePersonalization - Add entry to global queue so the tracker can be notified that a personalization event occurred.', { changes: state.changes });
            //
            //Create a visit activity to represent the
            //personalization that was applied.
            const data = {
                changes: state.changes,
                component: {
                    id: rendering.uid,
                    description: rendering.componentName
                },
                isIncludedInTest: state.includedInTest,
                page: {
                    id: item === null || item === void 0 ? void 0 : item.id,
                    description: item === null || item === void 0 ? void 0 : item.name
                },
                rule: {
                    id: (_a = state.rule) === null || _a === void 0 ? void 0 : _a.id,
                    description: (_b = state.rule) === null || _b === void 0 ? void 0 : _b.name
                }
            };
            const e = {
                type: "personalization",
                date: new Date().toISOString(),
                data
            };
            //
            //Create an entry to the global queue that the tracker
            //will be able to pick up. Queue entry must provide
            //enough information for the tracker to know how to 
            //handle the entry.
            const entry = {
                type: "visit-activity",
                e
            };
            //
            //Add the entry to the queue.
            (_d = (_c = window.uniform) === null || _c === void 0 ? void 0 : _c.queue) === null || _d === void 0 ? void 0 : _d.add(tracking_1.QUEUE_ENTRY_TYPE_TRACKER, entry);
            //
            //
            logger.debug('useSitecorePersonalization - Entry was added to global queue.', { type: tracking_1.QUEUE_ENTRY_TYPE_TRACKER, entry });
        }
    }, [state.ds]);
    const personalizedProps = {
        datasource: state.ds,
        fields: state.personalizedFields || nonPersonalizedFields,
        item: item,
        params: rendering.params,
        rendering,
    };
    return {
        changes: state.changes,
        loading: state.loading,
        error: state.error,
        personalizedProps,
        track,
    };
}
exports.useSitecorePersonalization = useSitecorePersonalization;
//# sourceMappingURL=useSitecorePersonalization.js.map