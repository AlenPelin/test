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
export { Visitor };
export function getCurrentVisit(visitor) {
    if (visitor === null || visitor === void 0 ? void 0 : visitor.visits) {
        var filtered = visitor.visits.filter(function (v) { return !v.end; });
        if (filtered.length == 1) {
            return filtered[0];
        }
        return filtered.reduce(function (prev, current) { return (new Date(prev.start) > new Date(current.start)) ? prev : current; });
    }
    return;
}
//# sourceMappingURL=visitor.js.map