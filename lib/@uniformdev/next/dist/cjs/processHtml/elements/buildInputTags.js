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
exports.buildInputTags = void 0;
var react_1 = __importDefault(require("react"));
var buildDefaultNodeProcessor_1 = require("./buildDefaultNodeProcessor");
/**
 * Form input tag processors
 */
exports.buildInputTags = function () { return [
    // Checkbox
    {
        shouldProcessNode: function (node) {
            return node.name === 'input' && node.attribs.type === 'checkbox';
        },
        processNode: function (node) {
            //console.log("processing input with 'checked' attribute");
            var newAttrs = __assign({}, node.attribs);
            var checked = Object.keys(node.attribs).includes('checked');
            if (checked) {
                // removing the original value
                delete newAttrs.checked;
                // setting defaultChecked
                newAttrs['defaultChecked'] = checked;
            }
            return react_1.default.createElement(node.name, __assign({}, newAttrs));
        },
    },
    // Any other input with a value
    {
        shouldProcessNode: function (node) {
            return node.name === 'input';
        },
        processNode: function (node, children, index) {
            //var inputValue = node.attribs['value'];
            //console.log('processing input id ' + node.attribs["id"] + ' with value attribute = ' + inputValue);
            // setting default value
            node.attribs['defaultValue'] = node.attribs['value'] || '';
            delete node.attribs.value;
            // removing the original value
            // setting className
            node.attribs.className = node.attribs['class'];
            delete node.attribs.class;
            //console.log(node.attribs);
            return buildDefaultNodeProcessor_1.processDefaultNode(node, children, index);
        },
    },
]; };
//# sourceMappingURL=buildInputTags.js.map