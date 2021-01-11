"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendArray = exports.flattenArray = void 0;
function flattenArray(source, target) {
    if (!Array.isArray(source)) {
        return;
    }
    for (var i = 0; i < source.length; i++) {
        var value = source[i];
        if (value == undefined || value == null) {
            continue;
        }
        if (Array.isArray(value)) {
            flattenArray(value, target);
            continue;
        }
        if (target.indexOf(value) == -1) {
            target.push(value);
        }
    }
}
exports.flattenArray = flattenArray;
function appendArray(source, target) {
    if (!source) {
        return;
    }
    source.forEach(function (value) {
        if (target.indexOf(value) == -1) {
            target.push(value);
        }
    });
}
exports.appendArray = appendArray;
//# sourceMappingURL=arrays.js.map