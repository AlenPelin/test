import { getNullLogger } from '@uniformdev/common';
import { getSitecoreTracker } from './tracker';
describe('getSitecoreTracker context readers', function () {
    it('context readers should be empty when do not include option is true and no context readers are specified', function () {
        var tracker = getSitecoreTracker({
            doNotIncludeDefaultContextReaders: true,
            storage: "default"
        }, getNullLogger());
        expect(tracker).toBeDefined();
        expect(tracker === null || tracker === void 0 ? void 0 : tracker.contextReaders).toBeDefined();
        expect(tracker === null || tracker === void 0 ? void 0 : tracker.contextReaders.size).toBe(0);
    });
    it('context readers should be empty when do not include option is true and an empty context reader map is specified', function () {
        var tracker = getSitecoreTracker({
            contextReaders: new Map(),
            doNotIncludeDefaultContextReaders: true,
            storage: "default"
        }, getNullLogger());
        expect(tracker).toBeDefined();
        expect(tracker === null || tracker === void 0 ? void 0 : tracker.contextReaders).toBeDefined();
        expect(tracker === null || tracker === void 0 ? void 0 : tracker.contextReaders.size).toBe(0);
    });
});
//# sourceMappingURL=tracker.test.js.map