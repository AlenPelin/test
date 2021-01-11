"use strict";
exports.__esModule = true;
exports.getDispatchersFromTrackingConfig = void 0;
var common_1 = require("@uniformdev/common");
var ga_1 = require("./ga");
var oracleDmp_1 = require("./oracleDmp");
var xdb_1 = require("./xdb");
/**
 * Returns a map of destinations from tracking data, grouped by type.
 * @param trackingData
 * @param args
 */
function getDestinationMapFromTrackingConfig(trackingConfig, args) {
    var _a;
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    var map = new Map();
    if (!trackingConfig) {
        logger.warn(loggerPrefix + " - No tracking config was specified.", { args: args });
    }
    var allDestinations = trackingConfig.destinations;
    if ((_a = allDestinations === null || allDestinations === void 0 ? void 0 : allDestinations.length) !== null && _a !== void 0 ? _a : 0 > 0) {
        allDestinations.forEach(function (destination) {
            var _a;
            var type = destination.type;
            var destinations = (_a = map.get(type)) !== null && _a !== void 0 ? _a : [];
            if (destination.configId && destinations.some(function (d) { return d.configId == destination.configId; })) {
                logger.debug(loggerPrefix + " - Destination is included in the tracking data multiple times. It will not be added to the destination map more than once.", destination);
                return;
            }
            destinations.push(destination);
            map.set(type, destinations);
        });
    }
    return map;
}
/**
 * When dispatchers are configured in Sitecore, they
 * are exposed in tracking data as destinations. This
 * function controls the process responsible for
 * converting these destinations into dispatchers.
 * @param trackingConfig
 * @param args
 */
function getDispatchersFromTrackingConfig(trackingConfig, args) {
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    var dispatchers = [];
    var map = getDestinationMapFromTrackingConfig(trackingConfig, { logger: logger, loggerPrefix: loggerPrefix });
    var keys = Array.from(map.keys());
    keys.forEach(function (key) {
        var _a, _b, _c, _d;
        var destinations = (_a = map.get(key)) !== null && _a !== void 0 ? _a : [];
        if (destinations.length == 0) {
            return;
        }
        switch (key) {
            case "ga":
                if (!args.ga) {
                    logger.error(loggerPrefix + " - GA settings are missing from args so unable to configure GA dispatchers.", args);
                    return;
                }
                var gaDispatchers = (_b = ga_1.getDispatchersForGaDestinations(destinations, args)) !== null && _b !== void 0 ? _b : [];
                if (gaDispatchers.length > 0) {
                    logger.debug(loggerPrefix + " - GA dispatchers were registered.", gaDispatchers);
                    common_1.appendArray(gaDispatchers, dispatchers);
                }
                return;
            case "oracleDmp":
                var oracleDmpDispatchers = (_c = oracleDmp_1.getDispatchersForOracleDmpDestinations(destinations, args)) !== null && _c !== void 0 ? _c : [];
                if (oracleDmpDispatchers.length > 0) {
                    logger.debug(loggerPrefix + " - Oracle DMP dispatchers were registered.", oracleDmpDispatchers);
                    common_1.appendArray(oracleDmpDispatchers, dispatchers);
                }
                return;
            case "xdb":
                var xdbDispatchers = (_d = xdb_1.getDispatchersForXdbDestinations(destinations, args)) !== null && _d !== void 0 ? _d : [];
                if (xdbDispatchers.length > 0) {
                    logger.debug(loggerPrefix + " - xDB dispatchers were registered.", xdbDispatchers);
                    common_1.appendArray(xdbDispatchers, dispatchers);
                }
                return;
            default:
                logger.error(loggerPrefix + " - The specified destination type is not supported.", { type: key, destinations: destinations.length });
                return;
        }
    });
    return dispatchers;
}
exports.getDispatchersFromTrackingConfig = getDispatchersFromTrackingConfig;
//# sourceMappingURL=handleDestinations.js.map