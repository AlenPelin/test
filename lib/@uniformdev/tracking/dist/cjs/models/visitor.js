"use strict";
exports.__esModule = true;
exports.getCurrentVisit = exports.Visitor = void 0;
var DEFAULT_DATE = new Date(0).toISOString();
var Visitor = /** @class */ (function () {
    function Visitor(id, init) {
        this.updated = DEFAULT_DATE;
        this.visits = [];
        this.id = id;
        Object.assign(this, init);
    }
    return Visitor;
}());
exports.Visitor = Visitor;
function getCurrentVisit(visitor) {
    if (visitor === null || visitor === void 0 ? void 0 : visitor.visits) {
        var filtered = visitor.visits.filter(function (v) { return !v.end; });
        if (filtered.length == 1) {
            return filtered[0];
        }
        return filtered.reduce(function (prev, current) { return (new Date(prev.start) > new Date(current.start)) ? prev : current; });
    }
    return;
}
exports.getCurrentVisit = getCurrentVisit;
//# sourceMappingURL=visitor.js.map