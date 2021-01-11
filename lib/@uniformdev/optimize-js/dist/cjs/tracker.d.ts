import { StorageProviderType, Tracker, ContextReader } from '@uniformdev/tracking';
interface DoTrackingSettings {
    /**
     * If true, the debug logger is assigned to the tracker.
     */
    debug?: boolean;
    /**
     * Provides extra information that can be used to initialize the tracker.
     */
    mode?: string;
    /**
     * Name of a function to call when the tracking finished event is fired.
     */
    onTrackingFinished?: string;
    /**
     * Name of a function to call when the visit created event is fired.
     */
    onVisitCreated?: string;
    /**
     * Name of a function to call when the visit update event is fired.
     */
    onVisitUpdated?: string;
    /**
     * Name of a function to call when the visitor update event is fired.
     */
    onVisitorUpdated?: string;
    /**
     * Number of minutes between visit activity that will result in a new visit being created.
     */
    sessionTimeout?: number;
    /**
     * Storage location for the visitor data collected by the tracker.
     */
    storage?: StorageProviderType;
    /**
     * Tells the tracker the source of the tracking data so the tracker can determine how to handle the data.
     */
    source: string;
    /**
     * Context passed to the tracker.
     */
    context?: any;
    /**
     * Context reader used to read data from the context.
     */
    contextReader?: ContextReader;
    /**
     * If true, the tracker will not publish any events to its subscribers.
     */
    silent?: boolean;
}
export declare var gaNewElem: any;
export declare var gaElems: any;
/**
 * Prepares the tracker and makes it available as a global JavaScript object.
 * No data is tracked when this function is called.
 * @param settings
 */
export declare function initializeTracker(settings: DoTrackingSettings): Promise<Tracker | undefined>;
/**
 * Tracks using tracking data from the global JavaScript object.
 * If the tracker is not already initialized, this function
 * initializes it.
 * @param settings
 */
export declare function doTracking(settings: DoTrackingSettings): void;
export {};
//# sourceMappingURL=tracker.d.ts.map