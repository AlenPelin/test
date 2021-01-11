var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TrackedActivity = /** @class */ (function () {
    function TrackedActivity(type, date, init) {
        this.type = type;
        this.date = date;
        Object.assign(this, init);
    }
    return TrackedActivity;
}());
export { TrackedActivity };
var VisitActivity = /** @class */ (function (_super) {
    __extends(VisitActivity, _super);
    function VisitActivity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VisitActivity;
}(TrackedActivity));
export { VisitActivity };
var VisitUpdate = /** @class */ (function (_super) {
    __extends(VisitUpdate, _super);
    function VisitUpdate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VisitUpdate;
}(TrackedActivity));
export { VisitUpdate };
var VisitorUpdate = /** @class */ (function (_super) {
    __extends(VisitorUpdate, _super);
    function VisitorUpdate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VisitorUpdate;
}(TrackedActivity));
export { VisitorUpdate };
var TrackedActivityResults = /** @class */ (function () {
    function TrackedActivityResults(visit, visitor) {
        this.visitUpdates = [];
        this.visitUpdateCommands = [];
        this.visitorUpdates = [];
        this.visitorUpdateCommands = [];
        this.visitActivities = [];
        this.visit = visit;
        this.visitor = visitor;
    }
    /**
     * Copies activities and updates from the source into this object.
     * The visit and visitor objects are NOT copied.
     * @param source
     * @param target
     */
    TrackedActivityResults.prototype.append = function (source) {
        var _this = this;
        if (!source) {
            return;
        }
        source.visitActivities.forEach(function (a) { return _this.visitActivities.push(a); });
        source.visitUpdates.forEach(function (a) { return _this.visitUpdates.push(a); });
        source.visitUpdateCommands.forEach(function (a) { return _this.visitUpdateCommands.push(a); });
        source.visitorUpdates.forEach(function (a) { return _this.visitorUpdates.push(a); });
        source.visitorUpdateCommands.forEach(function (a) { return _this.visitorUpdateCommands.push(a); });
    };
    return TrackedActivityResults;
}());
export { TrackedActivityResults };
export var QUEUE_ENTRY_TYPE_TRACKER = "tracker";
//# sourceMappingURL=trackedActivity.js.map