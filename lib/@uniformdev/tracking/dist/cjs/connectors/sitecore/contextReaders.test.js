"use strict";
exports.__esModule = true;
var contextReaders_1 = require("./contextReaders");
function getNewVisitor(visitorId, visitId, when) {
    var updated = when.toISOString();
    var visit = {
        data: {},
        id: visitId,
        start: updated,
        updated: updated,
        visitorId: visitorId
    };
    var visitor = {
        data: {},
        id: visitorId,
        updated: updated,
        visits: [visit]
    };
    return visitor;
}
describe('JSS context reader', function () {
    it('should return a jss reader when the source is jss', function () {
        var reader = contextReaders_1.getSitecoreContextReader('jss');
        expect(reader).toBeDefined();
        expect(reader.type).toBe("jss");
    });
    it('should return results based on jss context when the source is sitecore', function () {
        var now = new Date();
        var reader = contextReaders_1.getSitecoreContextReader('jss');
        expect(reader).toBeDefined();
        var visitor = getNewVisitor('visitor-1', 'visit-1', now);
        var visit = visitor.visits[0];
        var context = {
            context: {},
            date: new Date().toISOString(),
            url: new URL("http://localhost"),
            visitor: visitor,
            visit: visit
        };
        var results = reader.getTrackedActivity('sitecore', context);
        expect(results).toBeDefined();
        expect(results.visit).toBe(visit);
        expect(results.visitor).toBe(visitor);
        expect(results.visitActivities).toBeDefined();
        expect(results.visitActivities.length).toBe(1);
        var activity = results.visitActivities[0];
        expect(activity).toBeDefined();
        expect(activity.type).toBe("page view");
        expect(new Date(activity.date) >= now).toBe(true);
        expect(activity.data).toBeDefined();
        expect(activity.data.url).toBeDefined();
        expect(activity.data.url).toBe(context.url);
    });
    it('should return results with no activities from the jss context when an unsupported source is specified', function () {
        var now = new Date();
        var reader = contextReaders_1.getSitecoreContextReader('jss');
        expect(reader).toBeDefined();
        var visitor = getNewVisitor('visitor-1', 'visit-1', now);
        var visit = visitor.visits[0];
        var context = {
            context: {},
            date: new Date().toISOString(),
            url: new URL("http://localhost"),
            visitor: visitor,
            visit: visit
        };
        var results = reader.getTrackedActivity('unsupported', context);
        expect(results).toBeDefined();
        expect(results.visit).toBe(visit);
        expect(results.visitor).toBe(visitor);
        expect(results.visitActivities).toBeDefined();
        expect(results.visitActivities.length).toBe(0);
    });
});
describe('getSitecoreContextReader', function () {
    it('should return a cookie reader when the source is cookie', function () {
        var reader = contextReaders_1.getSitecoreContextReader('cookie');
        expect(reader).toBeDefined();
        expect(reader.type).toBe("cookie");
    });
    it('should return a js reader when the source is js', function () {
        var reader = contextReaders_1.getSitecoreContextReader('js');
        expect(reader).toBeDefined();
        expect(reader.type).toBe("js");
    });
    it('should return a uniform reader when the source is uniform', function () {
        var reader = contextReaders_1.getSitecoreContextReader('uniform');
        expect(reader).toBeDefined();
        expect(reader.type).toBe("uniform");
    });
});
//# sourceMappingURL=contextReaders.test.js.map