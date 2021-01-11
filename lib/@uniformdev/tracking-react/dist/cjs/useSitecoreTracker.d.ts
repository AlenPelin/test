import { Logger, UniformUnsubscribe, UniformCallback } from '@uniformdev/common';
import { ClientScripts } from '@uniformdev/common-client';
import { Tracker, GetTrackingUrl } from '@uniformdev/tracking';
import { TrackingEventType, TrackingEvent } from '@uniformdev/tracking';
import { ContextReader } from '@uniformdev/tracking';
import { TrackerCookieType } from '@uniformdev/tracking';
import { GaDestination, OracleDmpDestination, XdbDestination } from '@uniformdev/tracking';
import { DecaySettings, StorageProviderType } from '@uniformdev/tracking';
import { SitecoreContextReaderType } from '@uniformdev/tracking';
export interface UseTrackerProps {
    /**
     * Client-side routing mode causes the hook to initialize the
     * tracker, but prevents the hook from tracking. In this mode,
     * the application must call the tracker when appropriate (e.g.
     * when the application determines the route has changed).
     */
    clientSideRouting?: boolean;
    ga?: GaDestination;
    xdb?: XdbDestination;
    oracleDmp?: OracleDmpDestination;
    logger?: Logger;
    sessionTimeout?: number;
    storage?: StorageProviderType;
    subscriptions?: (subscribe: (type: TrackingEventType, callback: UniformCallback<TrackingEvent>) => UniformUnsubscribe) => void;
    url?: GetTrackingUrl;
}
export interface UseSitecoreTrackerProps extends UseTrackerProps {
    /**
     * Identifies the shape of the Sitecore context data.
     */
    type?: SitecoreContextReaderType;
    /**
     * Specifies how profile scores decay over time.
     * These settings provide more detailed control
     * over decay than standard Sitecore offers.
     */
    decay?: DecaySettings;
    /**
     * If true, only the specified context readers are used.
     * If false, the specified context readers are used in
     * addition to the default context readers.
     *
     * This option should only be used when context readers
     * are explicitly specified.
     */
    doNotUseDefaultContextReader?: boolean;
    /**
     * These context readers are used to determine tracking
     * activity when tracker.track() is called.
     */
    contextReaders?: ContextReader[];
    /**
     * Setting context in cookies is important when visitor
     * behavior values must be transmitted on subsequent
     * origin calls (e.g. origin-based personalization).
     *
     * This setting specifies which values to set in cookies;
     */
    cookies?: TrackerCookieType[];
    /**
     * URLs for the scripts that need to be loaded before
     * tracking can begin. Each script has an id. This
     * makes it possible to override specific URLs.
     */
    scripts?: ClientScripts;
    /**
     * Knowing when the tracker is initialized is important when
     * client-side routing is used. The client app triggers the
     * tracker when the route changes. But the route may change
     * before the tracker is initialized. This callback enables
     * the client app to trigger the tracked in this case.
     */
    onInitialized?: () => void;
}
export declare function useSitecoreTracker(sitecoreContext: any, props?: UseSitecoreTrackerProps): Tracker | undefined;
//# sourceMappingURL=useSitecoreTracker.d.ts.map