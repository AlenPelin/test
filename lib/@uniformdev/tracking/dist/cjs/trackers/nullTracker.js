"use strict";
exports.__esModule = true;
exports.getNullTracker = void 0;
var trackedActivity_1 = require("../models/trackedActivity");
function getNullTracker() {
    return new NullTracker();
}
exports.getNullTracker = getNullTracker;
var NullTracker = /** @class */ (function () {
    function NullTracker() {
        this.contextReaders = new Map();
        this.state = "ready";
    }
    NullTracker.prototype.event = function (_type, _e, _settings) {
        return new trackedActivity_1.TrackedActivityResults();
    };
    NullTracker.prototype.initialize = function (_settings) {
        return new trackedActivity_1.TrackedActivityResults();
    };
    NullTracker.prototype.track = function (_source, _context, _settings) {
        return new trackedActivity_1.TrackedActivityResults();
    };
    NullTracker.prototype.subscribe = function (_type, _callback) {
        return function () { return false; };
    };
    return NullTracker;
}());
//# sourceMappingURL=nullTracker.js.map