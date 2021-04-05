"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNodeJs = void 0;
function isNodeJs() {
    return !!(typeof process !== 'undefined' && process.env && process.env['PATH']);
}
exports.isNodeJs = isNodeJs;
//# sourceMappingURL=isNodeJs.js.map