"use strict";
exports.__esModule = true;
var common_1 = require("@uniformdev/common");
var tracker_1 = require("./tracker");
describe('getSitecoreTracker context readers', function () {
    it('context readers should be empty when do not include option is true and no context readers are specified', function () {
        var tracker = tracker_1.getSitecoreTracker({
            doNotIncludeDefaultContextReaders: true,
            storage: "default"
        }, common_1.getNullLogger());
        expect(tracker).toBeDefined();
        expect(tracker === null || tracker === void 0 ? void 0 : tracker.contextReaders).toBeDefined();
        expect(tracker === null || tracker === void 0 ? void 0 : tracker.contextReaders.size).toBe(0);
    });
    it('context readers should be empty when do not include option is true and an empty context reader map is specified', function () {
        var tracker = tracker_1.getSitecoreTracker({
            contextReaders: new Map(),
            doNotIncludeDefaultContextReaders: true,
            storage: "default"
        }, common_1.getNullLogger());
        expect(tracker).toBeDefined();
        expect(tracker === null || tracker === void 0 ? void 0 : tracker.contextReaders).toBeDefined();
        expect(tracker === null || tracker === void 0 ? void 0 : tracker.contextReaders.size).toBe(0);
    });
});
//# sourceMappingURL=tracker.test.js.map