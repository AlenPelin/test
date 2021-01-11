import { Logger } from "@uniformdev/common";
import { Dispatcher } from "../../dispatchers";
import { TrackedActivityResults, TrackedActivity } from '../../models/trackedActivity';
declare global {
    interface Window {
        ga: any;
    }
}
export interface GaEvent {
    category: string;
    action?: string;
    label?: string;
    value?: number;
}
export interface GaTrackedActivityConverter {
    type: string;
    convert(activity: TrackedActivity): GaEvent | undefined;
}
export interface GaSetCustomDimensionValues {
    (results: TrackedActivityResults, values: Map<number, any>): void;
}
export interface GaDispatcherSettings {
    /**
     * Sets the values that are written as custom dimensions onto
     * a map whose key is used to identify the position of the
     * custom dimension. These values are added to every event
     * that is written to Google Analytics.
     */
    setCustomDimensionValues?: GaSetCustomDimensionValues;
    /**
     * If undefined, all available trackers are used.
     * If an empty array is specified, no trackers are used.
     */
    trackingIds?: string[];
    /**
     * If activities is undefined, all activities are dispatched.
     * If activities is an empty array, no activities are dispatched.
     */
    activities?: string[];
}
export declare class GaDispatcher implements Dispatcher {
    /**
     *
     * @param converter
     * @param trackingIds
     * @param setCustomDimensionValues Sets the values that are written
     * as custom dimensions onto a map whose key is used to identify the
     * position of the custom dimension. These values are added to every
     * event that is written to Google Analytics.
     */
    constructor(converters: GaTrackedActivityConverter[], settings?: GaDispatcherSettings);
    activities: string[] | undefined;
    converters: GaTrackedActivityConverter[];
    setCustomDimensionValues?: (results: TrackedActivityResults, values: Map<number, any>) => void;
    requiresBrowser: boolean;
    trackingIds: string[] | undefined;
    type: string;
    getCustomDimensionFields(results: TrackedActivityResults, logger: Logger): any;
    dispatchActivity(results: TrackedActivityResults, logger: Logger): void;
}
//# sourceMappingURL=dispatcher.d.ts.map