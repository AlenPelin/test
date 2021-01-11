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
export { Visit };
//# sourceMappingURL=visit.js.map