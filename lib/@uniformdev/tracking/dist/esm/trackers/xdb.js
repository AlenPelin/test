import { XdbDispatcher } from "../connectors/sitecore/dispatcher";
export function getDispatchersForXdbDestinations(destinations, args) {
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
function getDispatcher(destination, _args) {
    if (!destination) {
        return;
    }
    var dispatcher = new XdbDispatcher(destination);
    return dispatcher;
}
//# sourceMappingURL=xdb.js.map