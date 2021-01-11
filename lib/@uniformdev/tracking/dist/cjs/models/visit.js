"use strict";
exports.__esModule = true;
exports.Visit = void 0;
var DEFAULT_DATE = new Date(0).toISOString();
var Visit = /** @class */ (function () {
    function Visit(id, visitorId, start, init) {
        this.updated = DEFAULT_DATE;
        this.id = id;
        this.visitorId = visitorId;
        this.start = start;
        Object.assign(this, init);
    }
    return Visit;
}());
exports.Visit = Visit;
//# sourceMappingURL=visit.js.map