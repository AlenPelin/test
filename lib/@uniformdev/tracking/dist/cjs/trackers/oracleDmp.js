"use strict";
exports.__esModule = true;
exports.getDispatchersForOracleDmpDestinations = void 0;
var dispatcher_1 = require("../connectors/oracleDmp/dispatcher");
var oracleDmpEventConverter_1 = require("../connectors/sitecore/oracleDmpEventConverter");
function getDispatchersForOracleDmpDestinations(destinations, args) {
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    var dispatchers = [];
    destinations.forEach(function (destination) {
        var dispatcher = getDispatcher(destination, args);
        if (!dispatcher) {
            logger.error(loggerPrefix + " - Unable to get dispatcher for Oracle DMP destination.", destination);
            return;
        }
        dispatchers.push(dispatcher);
    });
    return dispatchers;
}
exports.getDispatchersForOracleDmpDestinations = getDispatchersForOracleDmpDestinations;
function getDispatcher(destination, args) {
    if (!destination) {
        return;
    }
    var oracleDmp = args.oracleDmp, logger = args.logger, loggerPrefix = args.loggerPrefix;
    var initializeFromArgs = oracleDmp === null || oracleDmp === void 0 ? void 0 : oracleDmp.initializeOracleDmp;
    var wasInitialized = initializeFromArgs ? initializeFromArgs(destination, logger) : doInitializeOracleDmp(destination, args);
    if (!wasInitialized) {
        logger.debug(loggerPrefix + " - Unable to initialize Oracle DMP so no Oracle DMP dispatch will be performed.", destination);
        return;
    }
    var converters = getActivityConverters(destination, args);
    var dispatcher = new dispatcher_1.OracleDmpDispatcher(converters, destination);
    return dispatcher;
}
function doInitializeOracleDmp(destination, args) {
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    //
    //Add the callback function to window. This function must exist in order for data to be 
    if (!window) {
        logger.error(loggerPrefix + " - Cannot initialize Oracle DMP dispatcher when window is undefined.", destination);
        return false;
    }
    destination.containerIds.forEach(function (containerId) {
        var callbackName = dispatcher_1.getOracleDmpCallbackName(containerId);
        if (!callbackName) {
            logger.error(loggerPrefix + " - Cannot initialize Oracle DMP dispatcher for container because callback name could not be determined.", { containerId: containerId });
            return;
        }
        var callback = function (data) {
            var _a, _b;
            //
            //Use settings from destination.dataHandling to determine 
            //how to handle the data.
            if (!destination.dataHandling) {
                logger.info(loggerPrefix + " - No data handling settings were specified on the Oracle DMP destination, so the callback data will not be handled.", { data: data, destination: destination });
                return;
            }
            var wasDataChanged = false;
            if (data === null || data === void 0 ? void 0 : data.campaigns) {
                if (handleCampaigns(data.campaigns, destination, args)) {
                    wasDataChanged = true;
                }
                ;
            }
            if (wasDataChanged) {
                if (!((_a = window === null || window === void 0 ? void 0 : window.uniform) === null || _a === void 0 ? void 0 : _a.subscriptions)) {
                    logger.info(loggerPrefix + " - Unable to get a reference to the Uniform global subscription manager from the window, so unable to publish event to notify subscribers that Oracle DMP data was handled.", { data: data, destination: destination });
                    return;
                }
                if (!destination.triggerName) {
                    logger.info(loggerPrefix + " - No trigger name is specified on the Oracle DMP destination, so unable to publish event to notify subscribers that Oracle DMP data was handled.", { data: data, destination: destination });
                    return;
                }
                logger.info(loggerPrefix + " - Publishing event to notify subscribers that Oracle DMP data was handled.", { data: data, destination: destination });
                (_b = window.uniform.subscriptions) === null || _b === void 0 ? void 0 : _b.publish({
                    type: destination.triggerName,
                    when: new Date()
                });
            }
        };
        Object.defineProperty(window, callbackName, { get: function () { return callback; } });
    });
    return true;
}
function handleCampaigns(campaigns, destination, args) {
    var handling = destination.dataHandling;
    if (!handling) {
        return false;
    }
    var wasDataChanged = false;
    var dataTypes = ["campaigns", "audiences"];
    dataTypes.forEach(function (dataType) {
        var setting = handling[dataType];
        if (!setting) {
            return;
        }
        if (handleData(dataType, campaigns, function (member) { return member[setting.property]; }, destination, args)) {
            wasDataChanged = true;
        }
    });
    return wasDataChanged;
}
/**
 * Returns true if the data being handled is different from the data that was previously handled.
 * @param dataType
 * @param data
 * @param getValue
 * @param destination
 * @param logger
 */
function handleData(dataType, data, getValue, destination, args) {
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    if (!(destination === null || destination === void 0 ? void 0 : destination.dataHandling)) {
        return false;
    }
    if (!Array.isArray(data)) {
        logger.debug(loggerPrefix + " - Oracle DMP " + dataType + " are expected to be an array.", data);
        return false;
    }
    var setting = destination === null || destination === void 0 ? void 0 : destination.dataHandling[dataType];
    if (!setting) {
        logger.debug(loggerPrefix + " - Oracle DMP destination is not configured to handle " + dataType + " data.", { destination: destination, data: data });
        return false;
    }
    switch (setting.type) {
        case "cookie":
            return handleDataToCookie(setting.data, dataType, data, getValue, destination, args);
        default:
            logger.debug(loggerPrefix + " - Unsupported type specified for handling " + dataType + " data from Oracle DMP.", { type: setting.type, data: data });
            return false;
    }
}
function handleDataToCookie(cookieName, dataType, data, getValue, destination, args) {
    var logger = args.logger, loggerPrefix = args.loggerPrefix, getCookie = args.getCookie, removeCookie = args.removeCookie, setCookie = args.setCookie;
    if (!cookieName) {
        logger.debug(loggerPrefix + " - Oracle DMP destination is configured to save " + dataType + " to a cookie, but the cookie name is not specified. Data will not be saved.", { destination: destination, data: data });
        return false;
    }
    var values = [];
    data.forEach(function (member) {
        var value = getValue(member);
        if (value && values.indexOf(value) == -1) {
            values.push(value);
        }
    });
    var currentValue = getCookie(cookieName);
    if (!currentValue && values.length == 0) {
        logger.debug(loggerPrefix + " - No " + dataType + " were returned from Oracle DMP and no values are currently set in the cookie, so data handling is complete.", { cookie: cookieName, data: data });
        return false;
    }
    if (values.length == 0) {
        logger.debug(loggerPrefix + " - No " + dataType + " were returned from Oracle DMP so the cookie will be deleted.", { cookie: cookieName, data: data });
        removeCookie(cookieName);
        return true;
    }
    var newValue = values.sort().join(',');
    if (newValue == currentValue) {
        return false;
    }
    logger.debug(loggerPrefix + " - Data for " + dataType + " from Oracle DMP will be set on the cookie.", { cookie: cookieName, values: values });
    setCookie(cookieName, newValue);
    return true;
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
        var converter_1 = oracleDmpEventConverter_1.getOracleDmpTrackedActivityConverterForSitecore();
        if (converter_1) {
            if (converters.every(function (c) { return c.type != converter_1.type; })) {
                converters.push(converter_1);
                logger.debug(loggerPrefix + " - Added default GA tracked activity converter for Sitecore.", { converters: converters });
            }
        }
    }
    return converters;
}
//# sourceMappingURL=oracleDmp.js.map