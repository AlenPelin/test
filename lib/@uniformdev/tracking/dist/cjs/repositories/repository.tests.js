"use strict";
exports.__esModule = true;
var defaultRepository_1 = require("./defaultRepository");
var visitor_1 = require("../models/visitor");
var DummyStorageProvider = /** @class */ (function () {
    function DummyStorageProvider(ids) {
        this.ids = ids;
    }
    DummyStorageProvider.prototype.read = function (visitorId, _logger) {
        if (this.ids.indexOf(visitorId) == -1) {
            return undefined;
        }
        return new visitor_1.Visitor(visitorId);
    };
    DummyStorageProvider.prototype.write = function (_visitor, _logger) {
    };
    return DummyStorageProvider;
}());
;
describe('getTrackingDataRepository', function () {
    it('getNewVisitId returns a value.', function () {
        var repo = defaultRepository_1.getTrackingDataRepository(new DummyStorageProvider([]));
        expect(repo).toBeDefined();
        var id = repo === null || repo === void 0 ? void 0 : repo.getNewVisitId();
        expect(id).toBeDefined();
    });
    it('getNewVisitorId returns a value.', function () {
        var repo = defaultRepository_1.getTrackingDataRepository(new DummyStorageProvider([]));
        expect(repo).toBeDefined();
        var id = repo === null || repo === void 0 ? void 0 : repo.getNewVisitorId();
        expect(id).toBeDefined();
    });
    it('getVisitor returns a visitor for a visitor that exists.', function () {
        var expectedId = '111';
        var repo = defaultRepository_1.getTrackingDataRepository(new DummyStorageProvider([expectedId]));
        expect(repo).toBeDefined();
        var visitor = repo === null || repo === void 0 ? void 0 : repo.getVisitor(expectedId);
        expect(visitor).toBeDefined();
        expect(visitor === null || visitor === void 0 ? void 0 : visitor.id).toBe(expectedId);
    });
    it('getVisitor returns undefined for visitor that does not exist.', function () {
        var repo = defaultRepository_1.getTrackingDataRepository(new DummyStorageProvider([]));
        expect(repo).toBeDefined();
        var visitor = repo === null || repo === void 0 ? void 0 : repo.getVisitor('111');
        expect(visitor).toBeUndefined();
    });
});
//# sourceMappingURL=repository.tests.js.map