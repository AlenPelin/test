import { getNullLogger } from '@uniformdev/common';
import { TrackedActivityResults } from '../../models';
export function getOracleDmpContextReader() {
    return {
        type: "oracleDmp",
        getTrackedActivity: function (source, readerContext) {
            var url = readerContext.url, context = readerContext.context, visit = readerContext.visit, visitor = readerContext.visitor, date = readerContext.date, _a = readerContext.logger, logger = _a === void 0 ? getNullLogger() : _a;
            console.log(url + date);
            var activity = new TrackedActivityResults(visit, visitor);
            if (source !== "oracleDmp") {
                return activity;
            }
            logger.debug("Oracle DMP context reader - Reading tracking activity from context.", { context: context });
            return activity;
        }
    };
}
//# sourceMappingURL=contextReaders.js.map