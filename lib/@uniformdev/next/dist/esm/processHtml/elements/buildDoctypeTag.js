/**
 * Remove any !doctype tags, React don't want them
 */
export var buildDoctypeTag = function () { return ({
    shouldProcessNode: function (node) { return /doctype/.test(node.name); },
    processNode: function () { return null; },
}); };
//# sourceMappingURL=buildDoctypeTag.js.map