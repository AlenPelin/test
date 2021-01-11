"use strict";
exports.__esModule = true;
exports.getDispatchersForXdbDestinations = void 0;
var dispatcher_1 = require("../connectors/sitecore/dispatcher");
function getDispatchersForXdbDestinations(destinations, args) {
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    var dispatchers = [];
    destinations.forEach(function (destination) {
        var dispatcher = getDispatcher(destination, args);
        if (!dispatcher) {
            logger.error(loggerPrefix + " - Unable to get dispatcher for xDB destination.", destination);
            return;
        }
        dispatchers.push(dispatcher);
    });
    return dispatchers;
}
exports.getDispatchersForXdbDestinations = getDispatchersForXdbDestinations;
function getDispatcher(destination, _args) {
    if (!destination) {
        return;
    }
    var dispatcher = new dispatcher_1.XdbDispatcher(destination);
    return dispatcher;
}
//# sourceMappingURL=xdb.js.map