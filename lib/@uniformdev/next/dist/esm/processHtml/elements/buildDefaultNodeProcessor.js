import React from 'react';
import { convertAttribs } from '../attribMap';
var ProcessNodeDefinitions = require('html-to-react').ProcessNodeDefinitions;
var processNodeDefinitions = new ProcessNodeDefinitions(React);
export var processDefaultNode = function (node, children, index) {
    return processNodeDefinitions.processDefaultNode(node, children, index);
};
function trimTextNode(data) {
    return data ? data.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') : '';
}
// Anything else
export var buildDefaultNodeProcessor = function (logger) { return ({
    shouldProcessNode: function () { return true; },
    processNode: function (node, children, index) {
        if (node.type === 'text') {
            var data = trimTextNode(node.data);
            if (!data)
                return null;
            node.data = data;
        }
        convertAttribs(node, logger);
        return processDefaultNode(node, children, index);
    },
}); };
//# sourceMappingURL=buildDefaultNodeProcessor.js.map