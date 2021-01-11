"use strict";
exports.__esModule = true;
var getTracker_1 = require("./getTracker");
var visitor_1 = require("../models/visitor");
var trackedActivity_1 = require("../models/trackedActivity");
function getMatcherResult(message, pass) {
    if (pass === void 0) { pass = false; }
    return {
        message: function () { return message; },
        pass: pass
    };
}
expect.extend({
    toBeEmptyResults: function (received) {
        var _a, _b, _c;
        if (!received) {
            return getMatcherResult('Results object is undefined.');
        }
        if (!Array.isArray(received.visitActivities)) {
            return getMatcherResult('Visit activities must be an array.');
        }
        if (((_a = received.visitActivities) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            return getMatcherResult('Visit activities must be an empty array.');
        }
        if (!Array.isArray(received.visitUpdates)) {
            return getMatcherResult('Visit updates must be an array.');
        }
        if (((_b = received.visitUpdates) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            return getMatcherResult('Visit updates must be an empty array.');
        }
        if (!Array.isArray(received.visitorUpdates)) {
            return getMatcherResult('Visitor updates must be an array.');
        }
        if (((_c = received.visitorUpdates) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            return getMatcherResult('Visitor updates must be an empty array.');
        }
        return getMatcherResult('Passed', true);
    }
});
describe('Tracking', function () {
    it('No visitor returns empty results.', function () {
        var dummyStorageProvider = {
            read: function (visitorId, _logger) {
                if (visitorId == '') {
                    return undefined;
                }
                return new visitor_1.Visitor(visitorId);
            },
            write: function (_visitor, _logger) { }
        };
        var tracker = getTracker_1.getDefaultTracker({
            storage: 'custom',
            getCustomStorageProvider: function () { return dummyStorageProvider; }
        });
        var results = tracker === null || tracker === void 0 ? void 0 : tracker.track('test', {}, { visitorId: '', createVisitor: false });
        expect(results).toBeEmptyResults();
        expect(results === null || results === void 0 ? void 0 : results.visit).toBeUndefined();
        expect(results === null || results === void 0 ? void 0 : results.visitor).toBeUndefined();
    });
    it('New visit is created for new visitor.', function () {
        var _a, _b;
        var dummyStorageProvider = {
            read: function (visitorId, _logger) {
                return new visitor_1.Visitor(visitorId);
            },
            write: function (_visitor, _logger) { }
        };
        var tracker = getTracker_1.getDefaultTracker({
            storage: 'custom',
            getCustomStorageProvider: function () { return dummyStorageProvider; }
        });
        var results = tracker === null || tracker === void 0 ? void 0 : tracker.track('test', {}, { visitorId: '111', createVisitor: true });
        expect(results).toBeEmptyResults();
        expect(results === null || results === void 0 ? void 0 : results.visit).toBeDefined();
        expect((_a = results === null || results === void 0 ? void 0 : results.visit) === null || _a === void 0 ? void 0 : _a.id).not.toBe('');
        expect(results === null || results === void 0 ? void 0 : results.visitor).toBeDefined();
        expect((_b = results === null || results === void 0 ? void 0 : results.visitor) === null || _b === void 0 ? void 0 : _b.id).toBe('111');
    });
    it('Dispatchers are called when visit activity is determined.', function () {
        var dummyStorageProvider = {
            read: function (visitorId, _logger) {
                return new visitor_1.Visitor(visitorId);
            },
            write: function (_visitor, _logger) { }
        };
        var dispatchCount = 0;
        var dummyDispatcher1 = {
            dispatchActivity: function (_results, _logger) {
                dispatchCount++;
            },
            requiresBrowser: false,
            type: 'dummy1'
        };
        var dummyDispatcher2 = {
            dispatchActivity: function (_results, _logger) {
                dispatchCount++;
            },
            requiresBrowser: false,
            type: 'dummy2'
        };
        var tracker = getTracker_1.getDefaultTracker({
            storage: 'custom',
            getCustomStorageProvider: function () { return dummyStorageProvider; },
            dispatchers: [dummyDispatcher1, dummyDispatcher2]
        });
        var dummyReader = {
            getTrackedActivity: function (_source, _context) {
                return new trackedActivity_1.TrackedActivityResults();
            },
            type: 'dummy'
        };
        tracker === null || tracker === void 0 ? void 0 : tracker.contextReaders.set('test', [dummyReader]);
        var results = tracker === null || tracker === void 0 ? void 0 : tracker.track('test', {}, { visitorId: '111', createVisitor: true });
        expect(results).toBeEmptyResults();
        expect(dispatchCount).toBe(2);
    });
});
describe('Single event tracking', function () {
    var dummyStorageProvider = {
        read: function (visitorId, _logger) {
            return new visitor_1.Visitor(visitorId);
        },
        write: function (_visitor, _logger) { }
    };
    var tracker = getTracker_1.getDefaultTracker({
        storage: 'custom',
        getCustomStorageProvider: function () { return dummyStorageProvider; }
    });
    var eventData = {};
    var eventDate = new Date().toISOString();
    var eventType = 'new-event-type';
    var e = { data: eventData, date: eventDate, type: eventType };
    var visitorId = '1111';
    it('Visit activity is captured.', function () {
        var _a, _b, _c, _d;
        var results = tracker === null || tracker === void 0 ? void 0 : tracker.event('visit-activity', e, { visitorId: visitorId });
        expect(results).toBeDefined();
        expect((_a = results === null || results === void 0 ? void 0 : results.visitor) === null || _a === void 0 ? void 0 : _a.id).toBe(visitorId);
        expect((_b = results === null || results === void 0 ? void 0 : results.visitActivities) === null || _b === void 0 ? void 0 : _b.length).toBe(1);
        var activity = results === null || results === void 0 ? void 0 : results.visitActivities[0];
        expect(activity).toBeDefined();
        expect(activity === null || activity === void 0 ? void 0 : activity.data).toBe(eventData);
        expect(activity === null || activity === void 0 ? void 0 : activity.date).toBe(eventDate);
        expect(activity === null || activity === void 0 ? void 0 : activity.type).toBe(eventType);
        expect((_c = results === null || results === void 0 ? void 0 : results.visitUpdates) === null || _c === void 0 ? void 0 : _c.length).toBe(0);
        expect((_d = results === null || results === void 0 ? void 0 : results.visitorUpdates) === null || _d === void 0 ? void 0 : _d.length).toBe(0);
    });
    it('Visit update is captured.', function () {
        var _a, _b, _c, _d;
        var results = tracker === null || tracker === void 0 ? void 0 : tracker.event('visit-update', e, { visitorId: visitorId });
        expect(results).toBeDefined();
        expect((_a = results === null || results === void 0 ? void 0 : results.visitor) === null || _a === void 0 ? void 0 : _a.id).toBe(visitorId);
        expect((_b = results === null || results === void 0 ? void 0 : results.visitActivities) === null || _b === void 0 ? void 0 : _b.length).toBe(0);
        expect((_c = results === null || results === void 0 ? void 0 : results.visitUpdates) === null || _c === void 0 ? void 0 : _c.length).toBe(1);
        var activity = results === null || results === void 0 ? void 0 : results.visitUpdates[0];
        expect(activity).toBeDefined();
        expect(activity === null || activity === void 0 ? void 0 : activity.data).toBe(eventData);
        expect(activity === null || activity === void 0 ? void 0 : activity.date).toBe(eventDate);
        expect(activity === null || activity === void 0 ? void 0 : activity.type).toBe(eventType);
        expect((_d = results === null || results === void 0 ? void 0 : results.visitorUpdates) === null || _d === void 0 ? void 0 : _d.length).toBe(0);
    });
    it('Visitor update is captured.', function () {
        var _a, _b, _c, _d;
        var results = tracker === null || tracker === void 0 ? void 0 : tracker.event('visitor-update', e, { visitorId: visitorId });
        expect(results).toBeDefined();
        expect((_a = results === null || results === void 0 ? void 0 : results.visitor) === null || _a === void 0 ? void 0 : _a.id).toBe(visitorId);
        expect((_b = results === null || results === void 0 ? void 0 : results.visitActivities) === null || _b === void 0 ? void 0 : _b.length).toBe(0);
        expect((_c = results === null || results === void 0 ? void 0 : results.visitUpdates) === null || _c === void 0 ? void 0 : _c.length).toBe(0);
        expect((_d = results === null || results === void 0 ? void 0 : results.visitorUpdates) === null || _d === void 0 ? void 0 : _d.length).toBe(1);
        var activity = results === null || results === void 0 ? void 0 : results.visitorUpdates[0];
        expect(activity).toBeDefined();
        expect(activity === null || activity === void 0 ? void 0 : activity.data).toBe(eventData);
        expect(activity === null || activity === void 0 ? void 0 : activity.date).toBe(eventDate);
        expect(activity === null || activity === void 0 ? void 0 : activity.type).toBe(eventType);
    });
});
//# sourceMappingURL=defaultTracker.test.js.map