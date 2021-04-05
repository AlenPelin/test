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
exports.buildCustomElements = void 0;
var react_1 = __importDefault(require("react"));
/**
 * workaround to issue with "html-to-react" where
 * it chokes on elements with a hyphen in their name
 *
 * ie: <custom-element />
 *
 * https://github.com/aknuds1/html-to-react/issues/43
 */
exports.buildCustomElements = function () { return ({
    replaceChildren: false,
    shouldProcessNode: function (node) {
        return node.name && node.name.indexOf('-') >= 0 && node.attribs && node.attribs['class'];
    },
    processNode: function (node, children, index) {
        if (node.attribs['classname']) {
            node.attribs['class'] = node.attribs['classname'];
        }
        delete node.attribs.classname;
        return react_1.default.createElement(node.name, __assign({ key: index }, node.attribs), children);
    },
}); };
//# sourceMappingURL=buildCustomElements.js.map