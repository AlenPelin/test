import { Visit } from './visit';
import { Visitor } from './visitor';
import { getLatestVisit } from './utils';
describe('Visitor', function () {
    it('getLatestVisit returns undefined when no visits are provided.', function () {
        var visitor = new Visitor('111');
        var visit = getLatestVisit(visitor);
        expect(visit).toBeUndefined();
    });
    it('getLatestVisit returns Visit when at least one visit is provided.', function () {
        var visitor = new Visitor('111');
        var start = new Date().toISOString();
        visitor.visits = [new Visit('AAA', '111', start)];
        var visit = getLatestVisit(visitor);
        expect(visit).toBeDefined();
        expect(visit === null || visit === void 0 ? void 0 : visit.id).toBe('AAA');
        expect(visit === null || visit === void 0 ? void 0 : visit.start).toBe(start);
        expect(visit === null || visit === void 0 ? void 0 : visit.end).toBeUndefined();
    });
    it('getLatestVisit returns latest Visit when multiple visits are provided regardless of order.', function () {
        var start1 = new Date(2020, 1, 2).toISOString();
        var visits1 = [
            new Visit('AAA', '111', start1, { updated: new Date(1).toISOString() }),
            new Visit('BBB', '111', start1, { updated: new Date(2).toISOString() }),
        ];
        var start2 = new Date(2020, 2, 3).toISOString();
        var visits2 = [
            new Visit('BBB', '111', start2, { updated: new Date(2).toISOString() }),
            new Visit('AAA', '111', start2, { updated: new Date(1).toISOString() }),
        ];
        var visitor = new Visitor('111');
        visitor.visits = visits1;
        var visit1 = getLatestVisit(visitor);
        expect(visit1).toBeDefined();
        expect(visit1 === null || visit1 === void 0 ? void 0 : visit1.id).toBe('BBB');
        expect(visit1 === null || visit1 === void 0 ? void 0 : visit1.start).toBe(start1);
        expect(visit1 === null || visit1 === void 0 ? void 0 : visit1.end).toBeUndefined();
        visitor.visits = visits2;
        var visit2 = getLatestVisit(visitor);
        expect(visit2).toBeDefined();
        expect(visit2 === null || visit2 === void 0 ? void 0 : visit2.id).toBe('BBB');
        expect(visit2 === null || visit2 === void 0 ? void 0 : visit2.start).toBe(start2);
        expect(visit2 === null || visit2 === void 0 ? void 0 : visit2.end).toBeUndefined();
    });
});
//# sourceMappingURL=visitor.tests.js.map