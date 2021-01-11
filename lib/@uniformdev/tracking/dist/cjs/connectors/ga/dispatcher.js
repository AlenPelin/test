"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.GaDispatcher = void 0;
var GaDispatcher = /** @class */ (function () {
    /**
     *
     * @param converter
     * @param trackingIds
     * @param setCustomDimensionValues Sets the values that are written
     * as custom dimensions onto a map whose key is used to identify the
     * position of the custom dimension. These values are added to every
     * event that is written to Google Analytics.
     */
    function GaDispatcher(converters, settings) {
        this.requiresBrowser = true;
        this.type = "ga";
        this.activities = settings === null || settings === void 0 ? void 0 : settings.activities;
        this.converters = converters;
        this.trackingIds = settings === null || settings === void 0 ? void 0 : settings.trackingIds;
        this.setCustomDimensionValues = settings === null || settings === void 0 ? void 0 : settings.setCustomDimensionValues;
    }
    GaDispatcher.prototype.getCustomDimensionFields = function (results, logger) {
        var fields = {};
        var map = new Map();
        if (this.setCustomDimensionValues) {
            this.setCustomDimensionValues(results, map);
        }
        map.forEach(function (value, key) {
            fields["dimension" + key] = value;
        });
        logger.debug("GA dispatcher - Converted tracking results into Google Analytics custom dimensions.", { map: map, fields: fields });
        return fields;
    };
    GaDispatcher.prototype.dispatchActivity = function (results, logger) {
        var _this = this;
        var _a;
        //
        //
        if (!results) {
            logger.debug("GA dispatcher - No tracked activity results are available to dispatch.");
            return;
        }
        //
        //Google Analytics tracking script must be loaded.
        if (!window.ga) {
            logger.error("GA dispatcher - GA tracking script has not been loaded. The tracking script must be loaded before the GA dispatcher can dispatch events to GA. Dispatch aborted.", { trackingIds: this.trackingIds, activity: results });
            return;
        }
        //
        //
        if (this.activities && this.activities.length == 0) {
            logger.debug("GA dispatcher - An empty array of activities was specified so no activities will be dispatched.");
            return;
        }
        //
        //
        var events = [];
        results.visitActivities.forEach(function (activity) {
            if (_this.activities && _this.activities.indexOf(activity.type) == -1) {
                logger.debug("GA dispatcher - The activity type was not selected as an activity to dispatch.", { type: activity.type, allowed: _this.activities, activity: activity });
                return;
            }
            for (var i = 0; i < _this.converters.length; i++) {
                var gaEvent = _this.converters[i].convert(activity);
                if (!gaEvent) {
                    logger.debug("GA dispatcher - The activity was not converted into a format that can be dispatched.", activity);
                    continue;
                }
                logger.debug("GA dispatcher - The activity was converted into a format that can be dispatched.", { activity: activity, gaEvent: gaEvent });
                events.push(gaEvent);
            }
        });
        //
        //
        var fields = this.getCustomDimensionFields(results, logger);
        //
        //
        if (events.length == 0) {
            logger.debug("GA dispatcher - No GA events were resolved, so no events will be dispatched.");
            if (fields && Object.keys(fields).length > 0) {
                logger.debug("GA dispatcher - Since no events will be dispatched, no custom dimensions will be dispatched.", fields);
            }
            return;
        }
        //
        //Create trackers for the specified tracking ids.
        (_a = this.trackingIds) === null || _a === void 0 ? void 0 : _a.forEach(function (id) {
            logger.debug("GA dispatcher - Creating tracker for tracking id " + id);
            window.ga('create', id, 'auto', id);
        });
        var trackingIds = this.trackingIds;
        //
        //
        window.ga(function (_tracker) {
            var trackers = [];
            if (trackingIds) {
                //
                //Only use the trackers that are specified.
                logger.debug("GA dispatcher - Events will be dispatched to the specified Google Analytics tracker(s).", { trackingIds: trackingIds });
                trackingIds === null || trackingIds === void 0 ? void 0 : trackingIds.forEach(function (id) {
                    var tracker = window.ga.getByName(id);
                    if (tracker) {
                        trackers.push(tracker);
                    }
                });
            }
            else {
                //
                //Since no trackers were specified, use them all.
                logger.debug("GA dispatcher - No tracking ids were specified, so events will be dispatched to all Google Analytics trackers.");
                window.ga.getAll().forEach(function (tracker) {
                    trackers.push(tracker);
                });
            }
            if (trackers.length == 0) {
                logger.debug("GA dispatcher - No trackers were resolved, so no events will be dispatched to Google Analytics.", { trackingIds: trackingIds });
                return;
            }
            logger.debug("GA dispatcher - Ready to dispatch events to Google Analytics.", { events: events, trackers: trackers.map(function (t) { return t.get("name"); }) });
            trackers.forEach(function (tracker) {
                events.forEach(function (event) {
                    doSendEvent(tracker, event, fields, logger);
                });
            });
        });
    };
    return GaDispatcher;
}());
exports.GaDispatcher = GaDispatcher;
function doSendEvent(tracker, e, fields, logger) {
    fields.nonInteraction = true;
    var trackingId = tracker.get('trackingId');
    tracker.send('event', e.category, e.action, e.label, e.value, fields);
    logger.debug("GA dispatcher - Event dispatched to Google Analytics.", __assign(__assign({ trackingId: trackingId }, e), { fields: fields }));
}
//# sourceMappingURL=dispatcher.js.map