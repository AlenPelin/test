import { Logger } from "@uniformdev/common";
import { TrackedActivityResults } from '../models/trackedActivity';
export interface Dispatcher {
    /**
     * Dispatches the activities described in the results.
     * Only activity that the dispatcher is configured to
     * handle are dispatched. The configuration for a
     * dispatcher depends on the implementation of the
     * dispatcher.
     * @param results
     * @param logger
     */
    dispatchActivity(results: TrackedActivityResults, logger: Logger): void;
    /**
     * Descriptive name used for debugging and logging.
     */
    type: string;
    /**
     * If true, this dispatcher depends on objects that
     * are only available on the browser.
     */
    requiresBrowser: boolean;
}
//# sourceMappingURL=dispatcher.d.ts.map