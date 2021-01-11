"use strict";
exports.__esModule = true;
exports.getDispatchersForGaDestinations = void 0;
var dispatcher_1 = require("../connectors/ga/dispatcher");
var gaEventConverter_1 = require("../connectors/sitecore/gaEventConverter");
function getDispatchersForGaDestinations(destinations, args) {
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    var dispatchers = [];
    destinations.forEach(function (destination) {
        var dispatcher = getDispatcher(destination, args);
        if (!dispatcher) {
            logger.error(loggerPrefix + " - Unable to get dispatcher for GA destination.", destination);
            return;
        }
        dispatchers.push(dispatcher);
    });
    return dispatchers;
}
exports.getDispatchersForGaDestinations = getDispatchersForGaDestinations;
function getDispatcher(destination, args) {
    if (!destination) {
        return;
    }
    var ga = args.ga, logger = args.logger, loggerPrefix = args.loggerPrefix;
    if (!ga) {
        logger.debug(loggerPrefix + " - No GA settings were specified on args so no GA dispatch will be performed.", args);
        return;
    }
    var initializeGa = ga.initializeGa;
    if (!initializeGa) {
        logger.debug(loggerPrefix + " - No function to initialize GA was specified on args so no GA dispatch will be performed.", args);
        return;
    }
    if (!initializeGa(destination, logger)) {
        logger.debug(loggerPrefix + " - Unable to initialize GA so no GA dispatch will be performed.", destination);
        return;
    }
    var converters = getActivityConverters(destination, args);
    var dispatcher = new dispatcher_1.GaDispatcher(converters, destination);
    if (destination.mappings) {
        var mappings_1 = destination.mappings;
        var setValues = function (_results, values) {
            mappings_1.forEach(function (mapping) {
                if (!mapping.action) {
                    return;
                }
                var action = new Function(mapping.action);
                var result = action();
                if (result) {
                    values.set(mapping.index, result);
                }
            });
        };
        dispatcher.setCustomDimensionValues = setValues;
    }
    return dispatcher;
}
/**
 * Gets the tracked activity converters for the specified destination.
 * @param destination
 * @param logger
 */
function getActivityConverters(destination, args) {
    var _a;
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    var converters = (_a = destination.activityConverters) !== null && _a !== void 0 ? _a : [];
    if (destination.doNotUseDefaultActivityConverter != true) {
        var converter_1 = gaEventConverter_1.getGaTrackedActivityConverterForSitecore();
        if (converter_1) {
            if (converters.every(function (c) { return c.type != converter_1.type; })) {
                converters.push(converter_1);
                logger.debug(loggerPrefix + " - Added default GA tracked activity converter for Sitecore.", { converters: converters });
            }
        }
    }
    return converters;
}
//# sourceMappingURL=ga.js.map