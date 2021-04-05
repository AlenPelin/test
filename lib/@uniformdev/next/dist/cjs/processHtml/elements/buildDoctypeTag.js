"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDoctypeTag = void 0;
/**
 * Remove any !doctype tags, React don't want them
 */
exports.buildDoctypeTag = function () { return ({
    shouldProcessNode: function (node) { return /doctype/.test(node.name); },
    processNode: function () { return null; },
}); };
//# sourceMappingURL=buildDoctypeTag.js.map