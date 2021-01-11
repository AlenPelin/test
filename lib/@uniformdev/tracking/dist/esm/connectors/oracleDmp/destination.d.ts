import { Destination } from '../../dispatchers/destination';
import { OracleDmpDispatcherSettings, OracleDmpTrackedActivityConverter } from './dispatcher';
/**
 * Setting that describes how to handle a specific value
 * received from the Oracle DMP callback function.
 */
export interface OracleDmpDataHandlingSetting {
    type: string;
    data: string;
    property: string;
}
/**
 * Collection of settings that describe how to handle
 * values received from the Oracle DMP callback function.
 */
export interface OracleDmpDataHandling {
    [key: string]: OracleDmpDataHandlingSetting;
}
export declare class OracleDmpDestination implements Destination, OracleDmpDispatcherSettings {
    constructor(containerIds: string[], init?: Partial<OracleDmpDestination>);
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
    activityConverters?: OracleDmpTrackedActivityConverter[];
    /**
     * If true, the default converter is not used and only
     * the converters specified in the activityConverters
     * setting are used.
     */
    doNotUseDefaultActivityConverter?: boolean;
    configId?: string;
    containerIds: string[];
    /**
     * Specifies how data received from the Oracle DMP callback
     * function should be handled.
     */
    dataHandling?: OracleDmpDataHandling;
    /**
     * Name of the subscription event that is published after
     * Oracle DMP data is handled.
     */
    triggerName?: string;
    type: string;
}
//# sourceMappingURL=destination.d.ts.map