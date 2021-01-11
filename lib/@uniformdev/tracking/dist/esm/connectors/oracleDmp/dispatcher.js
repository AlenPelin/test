"use strict";
export function getOracleDmpCallbackName(containerId) {
    if (!containerId) {
        return;
    }
    return "callback_" + containerId;
}
var OracleDmpDispatcher = /** @class */ (function () {
    function OracleDmpDispatcher(converters, settings) {
        this.requiresBrowser = true;
        this.type = "oracleDmp";
        this.activities = settings === null || settings === void 0 ? void 0 : settings.activities;
        this.converters = converters;
        this.containerIds = settings === null || settings === void 0 ? void 0 : settings.containerIds;
    }
    OracleDmpDispatcher.prototype.dispatchActivity = function (results, logger) {
        var _this = this;
        var _a;
        //
        //
        if (!results) {
            logger.debug("Oracle DMP dispatcher - No tracked activity results are available to dispatch.");
            return;
        }
        //
        //
        if (this.containerIds && this.containerIds.length == 0) {
            logger.debug("Oracle DMP dispatcher - An empty array of tracking ids means dispatch is disabled.", { activity: results });
            return;
        }
        //
        //Oracle DMP script must be loaded.
        if (!window.bk_doCallbackTag) {
            logger.error("Oracle DMP dispatcher - Oracle DMP tracking script has not been loaded. The tracking script must be loaded before phints can be dispatched. Dispatch aborted.", { containerIds: this.containerIds, activity: results });
            return;
        }
        //
        //
        if (this.activities && this.activities.length == 0) {
            logger.debug("Oracle DMP dispatcher - An empty array of activities was specified so no activities will be dispatched.");
            return;
        }
        //
        //
        var phintsArray = [];
        results.visitActivities.forEach(function (activity) {
            if (_this.activities && _this.activities.indexOf(activity.type) == -1) {
                logger.debug("Oracle DMP dispatcher - The activity type was not selected as an activity to dispatch.", { type: activity.type, allowed: _this.activities, activity: activity });
                return;
            }
            for (var i = 0; i < _this.converters.length; i++) {
                var phints = _this.converters[i].convert(activity);
                if (!phints) {
                    logger.debug("Oracle DMP dispatcher - The activity was not converted into a format that can be dispatched.", activity);
                    continue;
                }
                logger.debug("Oracle DMP dispatcher - The activity was converted into a format that can be dispatched.", { activity: activity, phints: phints });
                phintsArray.push(phints);
            }
        });
        //
        //
        if (phintsArray.length == 0) {
            logger.debug("Oracle DMP dispatcher - No Oracle DMP phints were resolved, so no phints will be dispatched.");
            return;
        }
        //
        //
        window.bk_allow_multiple_calls = true;
        window.bk_use_multiple_iframes = true;
        (_a = this.containerIds) === null || _a === void 0 ? void 0 : _a.forEach(function (containerId) {
            logger.debug("Oracle DMP dispatcher - Adding phints to page context for container " + containerId, phintsArray);
            phintsArray.forEach(function (phints) {
                Object.keys(phints).forEach(function (key) {
                    window.bk_addPageCtx(key, phints[key]);
                });
            });
            var callbackName = getOracleDmpCallbackName(containerId);
            if (!callbackName) {
                logger.error("Oracle DMP dispatcher - Unable to determine callback name for container " + containerId);
                return;
            }
            logger.debug("Oracle DMP dispatcher - Dispatching phints to container " + containerId, { callbackName: callbackName, phintsArray: phintsArray });
            window.bk_doCallbackTag(containerId, callbackName);
        });
    };
    return OracleDmpDispatcher;
}());
export { OracleDmpDispatcher };
//# sourceMappingURL=dispatcher.js.map