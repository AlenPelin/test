"use strict";
exports.__esModule = true;
exports.getCookieValueFromVisit = exports.getCookieValueFromVisitor = void 0;
var activities_1 = require("./activities");
/**
 * Gets the values for a property from the visitor
 * in a format that can be set as a cookie value.
 * @param visitor
 */
function getCookieValueFromVisitor(type, visitor) {
    var _a, _b;
    if (visitor === null || visitor === void 0 ? void 0 : visitor.data) {
        if (type == 'patterns') {
            return getValueForCookie((_a = visitor.data.patterns) === null || _a === void 0 ? void 0 : _a.data, function (p) { return p.patternId; });
        }
        if (type == 'profiles') {
            return getValueForCookie((_b = visitor.data.profiles) === null || _b === void 0 ? void 0 : _b.data, function (p) {
                if (p.keys) {
                    var values = [];
                    Object.keys(p.keys).forEach(function (key) {
                        var _a, _b;
                        var value = (_b = (_a = p.keys[key]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 0;
                        if (value > 0) {
                            values.push(key + "_" + value);
                        }
                    });
                    if (values.length > 0) {
                        return values.join("|");
                    }
                }
                return undefined;
            });
        }
    }
    return undefined;
}
exports.getCookieValueFromVisitor = getCookieValueFromVisitor;
;
/**
 * Gets the values for a property from the visit
 * in a format that can be set as a cookie value.
 * @param visit
 */
function getCookieValueFromVisit(type, visit) {
    var _a, _b;
    if (visit === null || visit === void 0 ? void 0 : visit.data) {
        if (type == 'goals') {
            var goals = activities_1.getVisitActivities('goal', visit);
            var value = getValueForCookie(goals, function (dates) {
                return dates.map(function (date) { return date.getTime(); }).join("|");
            });
            return value;
        }
        if (type == 'campaign') {
            return (_b = (_a = visit.data.campaign) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id;
        }
    }
    return undefined;
}
exports.getCookieValueFromVisit = getCookieValueFromVisit;
;
function getValueForCookie(data, getValue) {
    if (data) {
        var values_1 = [];
        Object.keys(data).forEach(function (key) {
            var value = getValue(data[key]);
            if (value) {
                values_1.push(key + "=" + value);
            }
        });
        return values_1.join(",");
    }
    return undefined;
}
//# sourceMappingURL=cookies.js.map