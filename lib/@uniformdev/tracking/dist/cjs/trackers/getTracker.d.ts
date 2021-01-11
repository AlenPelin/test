import { Tracker, TrackerExtensionPoints, TrackingEvent } from './tracker';
import { StorageProviderType, StorageProvider } from '../storage';
import { ContextReader } from '../contextReader';
import { Logger, SubscriptionManager } from '@uniformdev/common';
import { Dispatcher } from '../dispatchers';
/**
 * Settings used to get a reference to a tracker.
 */
export interface GetTrackerArgs {
    /**
     * If the storage type is set to "custom",
     * this callback is used to resolve the
     * storage provider.
     */
    getCustomStorageProvider?: () => StorageProvider;
    /**
     * Map of context readers that are able to read
     * data from different sources.
     */
    contextReaders?: Map<string, ContextReader[]>;
    /**
     * Components that handle tracking activity results,
     * usually for the purpose of writing that activity
     * to external storage.
     */
    dispatchers?: Dispatcher[];
    /**
     * Extension point handlers that extend the
     * functionality of the tracker itself.
     */
    extensions?: TrackerExtensionPoints;
    logger?: Logger;
    /**
     * Number of minutes a session will live
     * without new activity before time out.
     * */
    sessionTimeout?: number;
    storage: StorageProviderType;
    subscriptions?: SubscriptionManager<TrackingEvent>;
}
/**
 * Settings that control how the getDefaultTracker function works.
 */
export interface GetDefaultTrackerArgs {
    logger?: Logger;
}
/**
 * This function is usually called by a custom tracker.
 * @param args - Settings that control the tracker that is retrieved.
 * @param args2 - Settings that control how this function works.
 */
export declare function getDefaultTracker(args: GetTrackerArgs, args2?: GetDefaultTrackerArgs): Tracker | undefined;
//# sourceMappingURL=getTracker.d.ts.map