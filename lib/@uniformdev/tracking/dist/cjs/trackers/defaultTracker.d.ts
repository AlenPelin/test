import { Tracker, TrackerExtensionPoints, TrackingSettings, TrackingEvent, TrackerState } from './tracker';
import { TrackingDataRepository } from '../repositories';
import { TrackedActivityResults, TrackedActivity, TrackedActivityType } from '../models/trackedActivity';
import { ContextReader } from '../contextReader';
import { Logger, SubscriptionManager, UniformUnsubscribe, UniformCallback } from '@uniformdev/common';
import { Dispatcher } from '../dispatchers';
/**
 * Settings used to specify how the default tracker works.
 */
export interface DefaultTrackerSettings {
    contextReaders?: Map<string, ContextReader[]>;
    dispatchers?: Dispatcher[];
    extensions?: TrackerExtensionPoints;
    logger?: Logger;
    repository: TrackingDataRepository;
    sessionTimeout?: number;
    subscriptions?: SubscriptionManager<TrackingEvent>;
}
/**
 * Default implementation of the Uniform tracker.
 */
export declare class DefaultTracker implements Tracker {
    contextReaders: Map<string, ContextReader[]>;
    dispatchers: Dispatcher[];
    extensions?: TrackerExtensionPoints;
    logger: Logger;
    repository: TrackingDataRepository;
    sessionTimeout: number;
    state: TrackerState;
    subscriptions: SubscriptionManager<TrackingEvent>;
    constructor(settings: DefaultTrackerSettings);
    event(type: TrackedActivityType, e: TrackedActivity, settings: TrackingSettings): TrackedActivityResults;
    initialize(settings: TrackingSettings): TrackedActivityResults;
    subscribe(type: string | undefined, callback: UniformCallback<TrackingEvent>): UniformUnsubscribe;
    track(source: string | undefined, context: any, settings: TrackingSettings): TrackedActivityResults;
    doTracking(settings: TrackingSettings, callback: (date: string, activity: TrackedActivityResults) => void): TrackedActivityResults;
}
//# sourceMappingURL=defaultTracker.d.ts.map