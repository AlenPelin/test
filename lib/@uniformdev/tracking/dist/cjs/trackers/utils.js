"use strict";
exports.__esModule = true;
exports.getVisitorChanges = exports.getVisitChanges = void 0;
function getVisitChanges(activity, visit, _visitor) {
    var _a, _b, _c;
    var changes = [];
    if (((_a = activity === null || activity === void 0 ? void 0 : activity.visitActivities) === null || _a === void 0 ? void 0 : _a.length) > 0 || ((_b = activity === null || activity === void 0 ? void 0 : activity.visitUpdates) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        changes.push("activities");
    }
    if (((_c = activity === null || activity === void 0 ? void 0 : activity.visitUpdates) === null || _c === void 0 ? void 0 : _c.length) > 0) {
        activity.visitUpdates.forEach(function (update) {
            if (!changes.includes(update.type)) {
                changes.push(update.type);
            }
        });
    }
    var map = new Map();
    map.set(visit.id, changes);
    return map;
}
exports.getVisitChanges = getVisitChanges;
function getVisitorChanges(activity, _visit, _visitor) {
    var _a;
    var changes = [];
    if (((_a = activity === null || activity === void 0 ? void 0 : activity.visitorUpdates) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        activity.visitorUpdates.forEach(function (update) {
            if (!changes.includes(update.type)) {
                changes.push(update.type);
            }
        });
    }
    return changes;
}
exports.getVisitorChanges = getVisitorChanges;
//# sourceMappingURL=utils.js.map