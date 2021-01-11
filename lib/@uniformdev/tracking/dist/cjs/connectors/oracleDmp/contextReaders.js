"use strict";
exports.__esModule = true;
exports.getOracleDmpContextReader = void 0;
var common_1 = require("@uniformdev/common");
var models_1 = require("../../models");
function getOracleDmpContextReader() {
    return {
        type: "oracleDmp",
        getTrackedActivity: function (source, readerContext) {
            var url = readerContext.url, context = readerContext.context, visit = readerContext.visit, visitor = readerContext.visitor, date = readerContext.date, _a = readerContext.logger, logger = _a === void 0 ? common_1.getNullLogger() : _a;
            console.log(url + date);
            var activity = new models_1.TrackedActivityResults(visit, visitor);
            if (source !== "oracleDmp") {
                return activity;
            }
            logger.debug("Oracle DMP context reader - Reading tracking activity from context.", { context: context });
            return activity;
        }
    };
}
exports.getOracleDmpContextReader = getOracleDmpContextReader;
//# sourceMappingURL=contextReaders.js.map