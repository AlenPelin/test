"use strict";
exports.__esModule = true;
exports.getVisitActivities = void 0;
function getVisitActivities(type, visit) {
    var _a;
    var result = {};
    if (visit) {
        var activities = (_a = visit.data) === null || _a === void 0 ? void 0 : _a.activities;
        if (activities) {
            var filtered = activities.filter(function (a) { return a.type == type; });
            filtered.forEach(function (activity) {
                var _a, _b;
                var id = (_a = activity.data) === null || _a === void 0 ? void 0 : _a.id;
                var date = new Date(activity.date);
                if (id && date) {
                    var dates = (_b = result[id]) !== null && _b !== void 0 ? _b : [];
                    dates.push(date);
                    result[id] = dates;
                }
            });
        }
    }
    return result;
}
exports.getVisitActivities = getVisitActivities;
//# sourceMappingURL=activities.js.map