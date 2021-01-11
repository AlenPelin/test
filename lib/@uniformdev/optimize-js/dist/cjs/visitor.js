"use strict";
exports.__esModule = true;
exports.getVisitorProfilePatternMatch = exports.getVisitorProperty = void 0;
function getVisitor() {
    var _a;
    return (_a = window === null || window === void 0 ? void 0 : window.uniform) === null || _a === void 0 ? void 0 : _a.visitor;
}
function getVisitorProperty(property) {
    if (property) {
        var visitor = getVisitor();
        if (visitor) {
            var i = Object.keys(visitor).findIndex(function (key) { return key == property; });
            if (i != -1) {
                return Object.values(visitor)[i];
            }
        }
    }
    return undefined;
}
exports.getVisitorProperty = getVisitorProperty;
function getVisitorProfilePatternMatch(profile, usePatternId) {
    var _a, _b;
    if (profile) {
        var visitor = getVisitor();
        if (visitor) {
            var data = (_b = (_a = visitor.data) === null || _a === void 0 ? void 0 : _a.patterns) === null || _b === void 0 ? void 0 : _b.data;
            if (data) {
                if (data[profile]) {
                    if (usePatternId === true) {
                        return data[profile].patternId;
                    }
                    return data[profile].name;
                }
            }
        }
    }
    return undefined;
}
exports.getVisitorProfilePatternMatch = getVisitorProfilePatternMatch;
//# sourceMappingURL=visitor.js.map