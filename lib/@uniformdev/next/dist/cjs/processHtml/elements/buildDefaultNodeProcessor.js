"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDefaultNodeProcessor = exports.processDefaultNode = void 0;
var react_1 = __importDefault(require("react"));
var attribMap_1 = require("../attribMap");
var ProcessNodeDefinitions = require('html-to-react').ProcessNodeDefinitions;
var processNodeDefinitions = new ProcessNodeDefinitions(react_1.default);
exports.processDefaultNode = function (node, children, index) {
    return processNodeDefinitions.processDefaultNode(node, children, index);
};
function trimTextNode(data) {
    return data ? data.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') : '';
}
// Anything else
exports.buildDefaultNodeProcessor = function (logger) { return ({
    shouldProcessNode: function () { return true; },
    processNode: function (node, children, index) {
        if (node.type === 'text') {
            var data = trimTextNode(node.data);
            if (!data)
                return null;
            node.data = data;
        }
        attribMap_1.convertAttribs(node, logger);
        return exports.processDefaultNode(node, children, index);
    },
}); };
//# sourceMappingURL=buildDefaultNodeProcessor.js.map