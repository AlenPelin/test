/// <reference types="react" />
import { Tracker } from '@uniformdev/tracking';
import { SubscriptionManager, UniformEvent } from '@uniformdev/common';
export declare type TrackerContextEventType = 'tracker-set';
export interface TrackerContextEvent extends UniformEvent {
    tracker?: Tracker;
}
export interface TrackerContextValue {
    tracker?: Tracker;
    subscriptions: SubscriptionManager<TrackerContextEvent>;
    visitorId?: string;
}
export declare const TrackerContext: import("react").Context<TrackerContextValue>;
//# sourceMappingURL=TrackerContext.d.ts.map