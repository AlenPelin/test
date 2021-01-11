var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getDisabledPersonalizationRuleManager, } from './index';
import { getNullLogger, tryFormatGuid } from '@uniformdev/common';
function getComponent(context) {
    return {
        id: context.uid,
        description: context.componentName,
    };
}
/**
 * Gets a new manager using the specified settings.
 * @param args
 */
export function getSitecorePersonalizationRuleManager(args) {
    const { definitions, item, logger = getNullLogger() } = args;
    if (!definitions) {
        return getDisabledPersonalizationRuleManager();
    }
    if (!item) {
        return getDisabledPersonalizationRuleManager();
    }
    //
    //
    const { data: dataSources, rules: rulesForRenderings } = definitions;
    if (!dataSources || !rulesForRenderings) {
        return getDisabledPersonalizationRuleManager();
    }
    //
    //
    function getTriggers() {
        const triggers = {};
        const keys = Object.keys(rulesForRenderings);
        if (!keys || !Array.isArray(keys)) {
            return undefined;
        }
        keys.forEach((renderingUid) => {
            const rules = rulesForRenderings[renderingUid];
            if (!rules || rules.length == 0) {
                //No rules for the rendering.
                return;
            }
            const values = [];
            for (const rule of rules) {
                if (!rule.dependencies || rule.dependencies.length == 0 || !Array.isArray(rule.dependencies)) {
                    //No dependencies for the rule.
                    continue;
                }
                rule.dependencies.forEach((d) => {
                    if (d && values.indexOf(d) == -1) {
                        values.push(d);
                    }
                });
            }
            if (values.length > 0) {
                triggers[renderingUid] = values;
            }
        });
        if (Object.keys(triggers).length == 0) {
            return undefined;
        }
        return triggers;
    }
    const triggers = getTriggers();
    //
    //
    function getRulesForRendering(context) {
        return rulesForRenderings[context.uid];
    }
    function renderingHasPersonalizationRules(context) {
        // todo: currently returning true if we find any value for the renderingUid, even if
        // the rule set is empty. Should we return false if the rule set is empty? Or is it
        // expected that the server won't emit an empty rule set?
        return Boolean(getRulesForRendering(context));
    }
    function evaluateRuleCondition(condition, data) {
        // Assumes condition is a string that can be wrapped in a function, which is what the `Function` constructor does.
        // Example: { condition: "var a = 'bobloblaw'; return a === 'bobloblaw';" }
        // Using `Function(condition)` will result in something like this:
        // function() { var a = 'bobloblaw'; return a === 'bobloblaw' }
        // Which we can then invoke with custom `data`.
        // The `data` object can be accessed in the condition code via `arguments[0]`:
        // { condition: "var a = arguments.length > 0 ? arguments[0].someProperty : ''; return a === 'bobloblaw';" }
        return Function(condition)(data);
    }
    /*
    if rule has "dependencies" property, then:
      - don't evaluate the condition right away
      - do we need to stop evaluating other rules that _can_ run immediately?
      - subscribe to external dependency by name, e.g. "Bluekai"
        - when event is triggered for dependency, evaluate the rule against the eventName
        - the rule condition _should_ determine if the rule should be applied for the eventName
        - also consider ability to evaluate rule against data passed with the eventName
    
    create Uniform api service that allows events to be triggered
      - Uniform.personalization.events.trigger('Bluekai', 'eventName');
      - trigger should probably accept a data object as well?
  */
    function getFirstMatchingRule(context, triggers) {
        return __awaiter(this, void 0, void 0, function* () {
            const rulesForRendering = getRulesForRendering(context);
            if (rulesForRendering) {
                for (const rule of rulesForRendering) {
                    if (rule.dependencies && rule.dependencies.length > 0) {
                        //
                        //If the dependencies for the rule are not met, skip the rule.
                        if (triggers) {
                            const unmet = [];
                            rule.dependencies.forEach((d1) => {
                                if (!triggers.find((trigger) => d1 == trigger)) {
                                    if (!unmet.find((d2) => d2 == d1)) {
                                        unmet.push(d1);
                                    }
                                }
                            });
                            if (unmet.length > 0) {
                                logger.debug('Sitecore personalization rule manager - Rule has dependencies so it will not be evaluated.', { rule });
                                continue;
                            }
                            logger.debug('Sitecore personalization rule manager - All rule dependencies have been met so rule will be evaluated.', { rule });
                        }
                    }
                    //The default rule has no id. It is also the
                    //last rule. If the default rule is reached,
                    //it should be returned. Otherwise, only
                    //return the rule if the condition passes.
                    if (rule.id == undefined || evaluateRuleCondition(rule.condition)) {
                        return rule;
                    }
                }
            }
            return null;
        });
    }
    function runRuleActions(rule, context) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            //
            //TODO: For non-client-side personalization, a call
            //      to retrieve content is needed.
            const dsBefore = tryFormatGuid((_b = (_a = context.dataSource) !== null && _a !== void 0 ? _a : context.defaultDataSource) !== null && _b !== void 0 ? _b : item === null || item === void 0 ? void 0 : item.id, 'D');
            const dsAfter = tryFormatGuid((_d = (_c = rule.data) !== null && _c !== void 0 ? _c : context.defaultDataSource) !== null && _d !== void 0 ? _d : item === null || item === void 0 ? void 0 : item.id, 'D');
            const componentBefore = context.uid;
            const componentAfter = context.uid;
            const changes = {};
            if (dsBefore != dsAfter) {
                changes.data = {
                    before: dsBefore,
                    after: dsAfter,
                };
            }
            if (componentBefore != componentAfter) {
                changes.component = {
                    before: componentBefore,
                    after: componentAfter,
                };
            }
            const fieldsAfter = dataSources[dsAfter];
            const component = getComponent(context);
            //
            //Return if no changes.
            if (!changes.data && !changes.component) {
                logger.debug('Sitecore personalization rule manager - Component state did not change as a result of the personalization rule.', {
                    context,
                });
                return {
                    changes,
                    component,
                    fields: null,
                    rule,
                };
            }
            //
            //Return changes.
            const result = {
                changes,
                component,
                fields: fieldsAfter,
                rule,
            };
            logger.debug('Sitecore personalization rule manager - Component should be personalized.', Object.assign(Object.assign({}, result), { item }));
            return result;
        });
    }
    return {
        getFirstMatchingRule,
        getRulesForRendering,
        renderingHasPersonalizationRules,
        runRuleActions,
        triggers,
    };
}
//# sourceMappingURL=sitecore.js.map