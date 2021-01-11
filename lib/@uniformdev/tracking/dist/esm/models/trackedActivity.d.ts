import { Visit } from './visit';
import { Visitor } from './visitor';
export declare class TrackedActivity {
    constructor(type: string, date: string, init?: Partial<TrackedActivity>);
    type: string;
    date: string;
    data: any;
}
export declare type TrackedActivityType = "visit-activity" | "visit-update" | "visitor-update";
export declare class VisitActivity extends TrackedActivity {
}
export declare class VisitUpdate extends TrackedActivity {
}
export interface VisitUpdateCommand {
    (visit: Visit): void;
}
export declare class VisitorUpdate extends TrackedActivity {
}
export interface VisitorUpdateCommand {
    (visitor: Visitor): void;
}
export declare class TrackedActivityResults {
    constructor(visit?: Visit, visitor?: Visitor);
    visit?: Visit;
    visitor?: Visitor;
    visitUpdates: VisitUpdate[];
    visitUpdateCommands: VisitUpdateCommand[];
    visitorUpdates: VisitorUpdate[];
    visitorUpdateCommands: VisitorUpdateCommand[];
    visitActivities: VisitActivity[];
    /**
     * Copies activities and updates from the source into this object.
     * The visit and visitor objects are NOT copied.
     * @param source
     * @param target
     */
    append(source: TrackedActivityResults): void;
}
/**
 * Entries written to the global queue for the tracker
 * (i.e. the type on the queue event is "tracker")
 * must be this type of object.
 */
export interface TrackerQueueEntry {
    type: TrackedActivityType;
    e: TrackedActivity;
}
export declare const QUEUE_ENTRY_TYPE_TRACKER = "tracker";
//# sourceMappingURL=trackedActivity.d.ts.map