import { Logger } from "@uniformdev/common";
import { Dispatcher } from "../../dispatchers";
import { TrackedActivityResults, TrackedActivity } from '../../models/trackedActivity';
interface DoCallbackTag {
    (containerId: string, callbackName: string): void;
}
interface AddPageCtx {
    (key: string, value: any): void;
}
declare global {
    interface Window {
        bk_doCallbackTag: DoCallbackTag;
        bk_addPageCtx: AddPageCtx;
        bk_allow_multiple_calls: boolean;
        bk_use_multiple_iframes: boolean;
    }
}
export interface OracleDmpPhints {
    [key: string]: any;
}
export interface OracleDmpTrackedActivityConverter {
    type: string;
    convert(activity: TrackedActivity): OracleDmpPhints | undefined;
}
export interface OracleDmpDispatcherSettings {
    containerIds?: string[];
    /**
     * If activities is undefined, all activities are dispatched.
     * If activities is an empty array, no activities are dispatched.
     */
    activities?: string[];
}
export declare function getOracleDmpCallbackName(containerId: string): string | undefined;
export declare class OracleDmpDispatcher implements Dispatcher {
    constructor(converters: OracleDmpTrackedActivityConverter[], settings?: OracleDmpDispatcherSettings);
    activities: string[] | undefined;
    converters: OracleDmpTrackedActivityConverter[];
    setCustomDimensionValues?: (results: TrackedActivityResults, values: Map<number, any>) => void;
    requiresBrowser: boolean;
    containerIds: string[] | undefined;
    type: string;
    dispatchActivity(results: TrackedActivityResults, logger: Logger): void;
}
export {};
//# sourceMappingURL=dispatcher.d.ts.map