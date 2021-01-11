import { Logger } from "@uniformdev/common";
import { Dispatcher } from "../../dispatchers";
import { TrackedActivityResults } from '../../models/trackedActivity';
export interface XdbDispatcherSettings {
    httpHeaders?: {
        [key: string]: any;
    };
    queryStringParameters?: string;
}
export declare class XdbDispatcher implements Dispatcher {
    constructor(settings?: XdbDispatcherSettings);
    requiresBrowser: boolean;
    type: string;
    httpHeaders?: {
        [key: string]: any;
    };
    queryStringParameters?: string;
    dispatchActivity(_results: TrackedActivityResults, logger: Logger): void;
}
//# sourceMappingURL=dispatcher.d.ts.map