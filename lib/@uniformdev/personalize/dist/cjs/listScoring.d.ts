import { Logger } from "@uniformdev/common";
import { Tracker, Visitor, Visit, PersonalizationEventData } from "@uniformdev/tracking";
import { TestManager } from "./testManagers";
export interface ListScoringSettings {
    conditions: any;
    testManager?: TestManager;
    tracker?: Tracker;
    logger?: Logger;
}
export interface ScoredItem {
    item: any;
    score: number;
}
interface ConditionsMatchSummary {
    [key: string]: {
        [key: string]: boolean;
    };
}
export declare class ListScoring {
    constructor(settings: ListScoringSettings);
    conditions: any[];
    testManager?: TestManager;
    tracker?: Tracker;
    logger: Logger;
    calculateWeight(weight: any, score: number): any;
    executeCondition(condition: any, scoringParams: any): {
        score: any;
        matches: any;
    };
    shouldListBePersonalized(_visitor: Visitor, _visit: Visit): boolean;
    buildRuleSummary(matchData: ConditionsMatchSummary): string;
    buildChangesAfter(matchData: ConditionsMatchSummary): string;
    triggerPersonalizationListEvents(visitor: Visitor, isIncludedInTest: boolean, eventData: Partial<PersonalizationEventData>, matchData: ConditionsMatchSummary): void;
    execute(visitor: Visitor, visit: Visit, list: any, eventData: Partial<PersonalizationEventData>): {
        items: ScoredItem[];
        personalized: boolean;
    };
}
export {};
//# sourceMappingURL=listScoring.d.ts.map