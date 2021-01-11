import { TrackingEvent } from "./tracker";
import { TrackerCookieType } from "../connectors/sitecore/cookies";
import { Logger, SubscriptionManager } from "@uniformdev/common";
/**
 * Certain tracker data can be configured to be set in cookies.
 * This function adds subscriptions to the tracker to set those
 * cookies.
 * @param subs
 * @params args
 */
export declare function addSubscriptionsForTrackerCookies(subs: SubscriptionManager<TrackingEvent>, args: TrackerCookieArgs): void;
export declare function getTrackerCookieTypes(trackingConfig: any): TrackerCookieType[];
export interface TrackerCookieArgs {
    cookieTypes: TrackerCookieType[];
    getCookie: {
        (name: string): any;
    };
    logger: Logger;
    loggerPrefix: string;
    removeCookie: {
        (name: string): void;
    };
    setCookie: {
        (name: string, value: any): void;
    };
}
/**
 * Sets cookie values needed for server-side personalization.
 * @param e
 * @param args
 */
export declare function setCookiesForSitecoreVisitCreated(e: TrackingEvent, args: TrackerCookieArgs): void;
/**
 * Sets cookie values needed for server-side personalization.
 * @param e
 * @param args
 */
export declare function setCookiesForSitecoreVisitUpdated(e: TrackingEvent, args: TrackerCookieArgs): void;
/**
 * Sets cookie values needed for server-side personalization.
 * @param e
 * @param args
 */
export declare function setCookiesForSitecoreVisitorUpdated(e: TrackingEvent, args: TrackerCookieArgs): void;
//# sourceMappingURL=handleTrackerEvents.d.ts.map