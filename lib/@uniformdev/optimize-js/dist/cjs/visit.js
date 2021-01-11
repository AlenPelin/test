"use strict";
exports.__esModule = true;
exports.getVisitGoals = void 0;
var tracking_1 = require("@uniformdev/tracking");
function getVisitGoals(visit) {
    return tracking_1.getVisitActivities('goal', visit);
}
exports.getVisitGoals = getVisitGoals;
//# sourceMappingURL=visit.js.map