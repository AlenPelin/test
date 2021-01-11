"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendObject = void 0;
function appendObject(source, target) {
    if (!source) {
        return;
    }
    Object.keys(source).forEach(function (id) {
        target[id] = source[id];
    });
}
exports.appendObject = appendObject;
//# sourceMappingURL=objects.js.map