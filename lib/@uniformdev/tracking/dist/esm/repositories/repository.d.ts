import { Visit } from '../models/visit';
import { Visitor } from '../models/visitor';
export interface GetCurrentVisitResult {
    current: Visit | undefined;
    previous: Visit | undefined;
    isNewVisit: boolean;
}
/**
 * Adds functionality on top of a storage provider.
 */
export interface TrackingDataRepository {
    type: string;
    /**
     *
     * @param visitor
     * @param sessionTimeout
     * @returns
     */
    getCurrentVisit(visitor: Visitor | string, sessionTimeout: number): GetCurrentVisitResult;
    createVisitor(): Visitor | undefined;
    getVisitor(visitorId: string): Visitor | undefined;
    saveVisitor(date: Date, visitor: Visitor, visitChanges: Map<string, string[]>, visitorChanges: string[]): void;
    getNewVisitorId(): string;
    getNewVisitId(): string;
}
//# sourceMappingURL=repository.d.ts.map