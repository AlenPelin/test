import { Visit } from '../models/visit';
import { Visitor } from '../models/visitor';
import { TrackedActivityResults, TrackedActivity, TrackedActivityType } from '../models/trackedActivity';
import { ContextReader } from '../contextReader';
import { Logger, UniformUnsubscribe, UniformCallback, UniformEvent, Description, Change } from '@uniformdev/common';
import { Dispatcher } from '../dispatchers';
export interface GetTrackingUrl {
    (): URL | undefined;
}
export declare type TrackerState = 'unknown' | 'ready' | 'tracking';
/**
 * Provides the ability to track visitor activity.
 */
export interface Tracker {
    state: TrackerState;
    /**
     * Writes a tracked activity event directly to the tracker.
     * @param type Specifies the type of event being tracked so it can be assigned to the results correctly.
     * @param e The tracked activity event to track.
     * @param settings Values that affect how a specific track event is executed.
     */
    event(type: TrackedActivityType, e: TrackedActivity, settings: TrackingSettings): TrackedActivityResults;
    /**
     * Initializes the tracker.
     * @param settings Values that affect how the tracker initialization is executed.
     */
    initialize(settings: TrackingSettings): TrackedActivityResults;
    /**
     *
     * @param type
     * @param callback
     */
    subscribe(type: TrackingEventType, callback: UniformCallback<TrackingEvent>): UniformUnsubscribe;
    /**
     * Uses information in the context to track visitor behavior.
     * @param source Identifies which context readers should be used to handle the context data.
     * @param context Data that context readers use to determine what to track.
     * @param settings Values that affect how a specific track event is executed.
     */
    track(source: string | undefined, context: any, settings: TrackingSettings): TrackedActivityResults;
    /**
     * Provides the ability to read data from the context.
     * When the tracker receives data, it uses the readers
     * subscribed to the specified source.
     */
    contextReaders: Map<string, ContextReader[]>;
    /**
     * Provides the ability to dispatch activity to external systems.
     */
    dispatchers?: Dispatcher[];
    /**
     * Provides the ability to execute additional logic
     * at certain points during the tracking process.
     */
    extensions?: TrackerExtensionPoints;
}
/**
 * Settings used during the tracking process.
 */
export interface TrackingSettings {
    visitorId?: string;
    createVisitor?: boolean;
    getUrl?: GetTrackingUrl;
    /**
     * If true, the tracker will not publish any events to its subscribers.
     */
    silent?: boolean;
}
export declare type TrackingEventType = 'visit-created' | 'visit-timeout' | 'visit-updated' | 'visitor-created' | 'visitor-updated' | 'tracking-finished';
export interface TrackingEvent extends UniformEvent {
    visit?: Visit;
    visitor?: Visitor;
    changes?: any;
}
export interface PersonalizationChanges {
    component?: Change;
    data?: Change;
}
export interface PersonalizationEventData {
    changes: PersonalizationChanges;
    component: Description;
    isIncludedInTest?: boolean;
    page: Description;
    rule: Description;
}
/**
 * Event handlers that are called by trackers to handle.
 * tracker-specific requirements. Client applications
 * should not use them.
 */
export interface TrackerExtensionPoints {
    onNewVisitCreated?: (date: Date, visitor: Visitor, oldVisit: Visit | undefined, newVisit: Visit, logger: Logger) => void;
    onBeforeVisitorSaved?: (date: Date, visitor: Visitor, visitChanges: Map<string, string[]>, visitorChanges: string[], logger: Logger) => void;
}
export declare enum UniformCookieNames {
    Testing = "UNIFORM_TRACKER_testing",
    VisitorId = "UNIFORM_TRACKER_visitor_id",
    VisitCount = "UNIFORM_TRACKER_visit_count"
}
//# sourceMappingURL=tracker.d.ts.map