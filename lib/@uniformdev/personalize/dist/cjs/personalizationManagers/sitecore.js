"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSitecorePersonalizationManager = void 0;
const common_1 = require("@uniformdev/common");
const sitecore_1 = require("../ruleManagers/sitecore");
const contextReaders_1 = require("./contextReaders");
;
;
/**
 * Gets a Sitecore personalization manager.
 * @param args
 */
function getSitecorePersonalizationManager(args) {
    var _a;
    //
    //Get data from context
    const reader = contextReaders_1.getSitecoreContextDataReader(args.contextDataSource);
    const definitions = reader === null || reader === void 0 ? void 0 : reader.getDefinitions(args.contextData);
    const item = reader === null || reader === void 0 ? void 0 : reader.getPageDetails(args.contextData);
    const testManager = (_a = args.testManager) !== null && _a !== void 0 ? _a : {
        disabled: false,
        getIsIncludedInTest: () => false,
    };
    const args2 = {
        definitions,
        item,
        logger: args.logger,
    };
    const ruleManager = sitecore_1.getSitecorePersonalizationRuleManager(args2);
    const settings = {
        disabled: args.disabled,
        item,
        logger: args.logger,
        ruleManager: ruleManager,
        testManager,
    };
    return new SitecorePersonalizationManager(settings);
}
exports.getSitecorePersonalizationManager = getSitecorePersonalizationManager;
/**
 * Sitecore personalization manager.
 */
class SitecorePersonalizationManager {
    constructor(settings) {
        var _a, _b, _c;
        this.disabled = (_a = settings === null || settings === void 0 ? void 0 : settings.disabled) !== null && _a !== void 0 ? _a : false;
        this.logger = (_b = settings === null || settings === void 0 ? void 0 : settings.logger) !== null && _b !== void 0 ? _b : common_1.getNullLogger();
        this.page = settings === null || settings === void 0 ? void 0 : settings.item;
        this.ruleManager = settings === null || settings === void 0 ? void 0 : settings.ruleManager;
        this.subscriptions = common_1.getSubscriptionManager();
        this.testManager = settings === null || settings === void 0 ? void 0 : settings.testManager;
        this.triggers = (_c = settings === null || settings === void 0 ? void 0 : settings.ruleManager) === null || _c === void 0 ? void 0 : _c.triggers;
    }
    onTrigger(trigger, rendering) {
        return __awaiter(this, void 0, void 0, function* () {
            this.doPersonalize(rendering, [trigger]);
        });
    }
    personalize(rendering) {
        return __awaiter(this, void 0, void 0, function* () {
            this.doPersonalize(rendering);
        });
    }
    doPersonalize(rendering, triggers) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!rendering) {
                this.logger.error('Sitecore personalization manager - No rendering was specified.');
                return;
            }
            if (this.disabled) {
                this.logger.debug('Sitecore personalization manager - Personalization is disabled.');
                return;
            }
            if (!this.ruleManager) {
                this.logger.debug('Sitecore personalization manager - No rule manager is configured.');
                return;
            }
            const rules = this.ruleManager.getRulesForRendering(rendering);
            if (!rules || rules.length == 0) {
                this.logger.debug('Sitecore personalization manager - No rules were resolved for the rendering.', { rendering });
                return;
            }
            //
            //Set to loading before applying the rules
            this.subscriptions.publish({
                component: rendering.uid,
                isLoading: true,
                page: this.page,
                type: 'state-changed',
                when: new Date(),
            });
            try {
                //
                //Get the first matching rule. If a rule has dependencies
                //that are not met, the rule is skipped. When an event
                //occurs that might change the dependencies,
                const rule = yield this.ruleManager.getFirstMatchingRule(rendering, triggers);
                if (!rule) {
                    this.logger.debug('Sitecore personalization manager - No personalization rule found that applies to the rendering.', { rendering });
                    this.subscriptions.publish({
                        component: rendering.uid,
                        isLoading: false,
                        page: this.page,
                        type: 'state-changed',
                        when: new Date(),
                    });
                    return;
                }
                this.logger.debug('Sitecore personalization manager - Will run the actions associated with the rule.', { rule, rendering });
                const result = yield this.ruleManager.runRuleActions(rule, rendering);
                const includedInTest = (_b = (_a = this.testManager) === null || _a === void 0 ? void 0 : _a.getIsIncludedInTest()) !== null && _b !== void 0 ? _b : false;
                //
                //Publish a state-changed event to notify components that
                //personalization is done loading and that there may be
                //changes to render.
                this.logger.debug('Sitecore personalization manager - Result of running the rule actions.', {
                    result,
                    rule,
                    rendering,
                });
                this.subscriptions.publish({
                    changes: result.changes,
                    component: rendering.uid,
                    includedInTest,
                    isLoading: false,
                    page: this.page,
                    personalizedData: result.fields,
                    rule,
                    type: 'state-changed',
                    when: new Date(),
                });
            }
            catch (error) {
                this.subscriptions.publish({
                    component: rendering.uid,
                    error,
                    isLoading: false,
                    page: this.page,
                    type: 'state-changed',
                    when: new Date(),
                });
                return;
            }
        });
    }
}
//# sourceMappingURL=sitecore.js.map