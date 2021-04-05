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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFormBuilderForm = void 0;
var react_1 = __importDefault(require("react"));
/**
 * Disabling antiforgery token on all forms with action
 */
exports.buildFormBuilderForm = function () { return ({
    shouldProcessNode: function (node) {
        return node.name === 'form' && node.attribs.action && node.attribs.action.startsWith('/formbuilder');
    },
    processNode: function (node, children) {
        console.log('processing form with action');
        var newAttrs = __assign({}, node.attribs);
        newAttrs['asp-antiforgery'] = 'false';
        return react_1.default.createElement(node.name, __assign({}, newAttrs), children);
    },
}); };
//# sourceMappingURL=buildFormBuilderForm.js.map