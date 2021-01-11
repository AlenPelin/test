"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDisabledPersonalizationRuleManager = void 0;
/**
 * Gets a manager that doesn't actually personalize.
 */
function getDisabledPersonalizationRuleManager() {
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
exports.getDisabledPersonalizationRuleManager = getDisabledPersonalizationRuleManager;
__exportStar(require("./sitecore"), exports);
//# sourceMappingURL=index.js.map