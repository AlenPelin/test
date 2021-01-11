import { TrackedActivityResults } from '../models/trackedActivity';
export function getNullTracker() {
    return new NullTracker();
}
var NullTracker = /** @class */ (function () {
    function NullTracker() {
        this.contextReaders = new Map();
        this.state = "ready";
    }
    NullTracker.prototype.event = function (_type, _e, _settings) {
        return new TrackedActivityResults();
    };
    NullTracker.prototype.initialize = function (_settings) {
        return new TrackedActivityResults();
    };
    NullTracker.prototype.track = function (_source, _context, _settings) {
        return new TrackedActivityResults();
    };
    NullTracker.prototype.subscribe = function (_type, _callback) {
        return function () { return false; };
    };
    return NullTracker;
}());
//# sourceMappingURL=nullTracker.js.map