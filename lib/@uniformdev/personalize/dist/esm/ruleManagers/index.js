var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Gets a manager that doesn't actually personalize.
 */
export function getDisabledPersonalizationRuleManager() {
    return {
        getFirstMatchingRule: (_context, _triggers) => __awaiter(this, void 0, void 0, function* () { return null; }),
        getRulesForRendering: (_context) => null,
        renderingHasPersonalizationRules: (_context) => false,
        runRuleActions: (rule, _context) => __awaiter(this, void 0, void 0, function* () {
            return {
                changed: false,
                component: {
                    id: '',
                    description: ''
                },
                dataSource: '',
                fields: null,
                rule
            };
        }),
        triggers: undefined
    };
}
export * from './sitecore';
//# sourceMappingURL=index.js.map