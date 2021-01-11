import { Destination } from '../../dispatchers/destination';
import { GaDispatcherSettings, GaTrackedActivityConverter } from './dispatcher';
interface CustomDimensionMapping {
    action: string;
    id: string;
    index: number;
}
export declare class GaDestination implements Destination, GaDispatcherSettings {
    constructor(trackingIds: string[], init?: Partial<GaDestination>);
    /**
     * If activities is undefined, all activities are dispatched.
     * If activities is an empty array, no activities are dispatched.
     */
    activities?: string[];
    /**
     * Converters used to transform tracker activity into
     * a format that can be passed to Google Analytics.
     * These converters are in addition to the default
     * converter, unless the doNotUseDefaultActivityConverter
     * setting is enabled.
     */
    activityConverters?: GaTrackedActivityConverter[];
    /**
     * If true, the default converter is not used and only
     * the converters specified in the activityConverters
     * setting are used.
     */
    doNotUseDefaultActivityConverter?: boolean;
    configId?: string;
    mappings?: CustomDimensionMapping[];
    trackingIds: string[];
    type: string;
}
export {};
//# sourceMappingURL=destination.d.ts.map