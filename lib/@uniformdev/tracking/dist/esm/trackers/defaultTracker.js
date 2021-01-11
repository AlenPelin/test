'use strict';
import { getVisitChanges, getVisitorChanges } from './utils';
import { TrackedActivityResults } from '../models/trackedActivity';
import { getNullLogger, getSubscriptionManager } from '@uniformdev/common';
/**
 * Default implementation of the Uniform tracker.
 */
var DefaultTracker = /** @class */ (function () {
    function DefaultTracker(settings) {
        var _a, _b, _c, _d, _e;
        this.contextReaders = new Map();
        this.state = 'unknown';
        this.contextReaders = (_a = settings.contextReaders) !== null && _a !== void 0 ? _a : new Map();
        this.dispatchers = (_b = settings.dispatchers) !== null && _b !== void 0 ? _b : [];
        this.logger = (_c = settings.logger) !== null && _c !== void 0 ? _c : getNullLogger();
        this.extensions = settings.extensions;
        this.repository = settings.repository;
        this.sessionTimeout = (_d = settings.sessionTimeout) !== null && _d !== void 0 ? _d : 20;
        this.subscriptions = (_e = settings.subscriptions) !== null && _e !== void 0 ? _e : getSubscriptionManager();
    }
    DefaultTracker.prototype.event = function (type, e, settings) {
        var _this = this;
        this.logger.debug('Default tracker - Start event() handling.', { event: e, settings: settings });
        var callback = function (_date, activity) {
            switch (type) {
                case "visit-activity":
                    activity.visitActivities.push(e);
                    break;
                case "visit-update":
                    activity.visitUpdates.push(e);
                    break;
                case "visitor-update":
                    activity.visitorUpdates.push(e);
                    break;
                default:
                    _this.logger.error("Default tracker - Specified event type is not supported. Event will not be captured.", { type: type, event: e });
            }
        };
        var results = this.doTracking(settings, callback);
        this.logger.debug('Default tracker - Finished event() handling.', { results: results });
        return results;
    };
    DefaultTracker.prototype.initialize = function (settings) {
        this.logger.debug('Default tracker - Start initialize() handling.', { settings: settings });
        var results = this.doTracking(settings, function (_date, _activity) { });
        this.logger.debug('Default tracker - Finished initialize() handling.', { results: results });
        return results;
    };
    DefaultTracker.prototype.subscribe = function (type, callback) {
        return this.subscriptions.subscribe(type, callback);
    };
    DefaultTracker.prototype.track = function (source, context, settings) {
        var _this = this;
        this.logger.debug('Default tracker - Start track() handling.', { source: source, context: context, settings: settings });
        var callback = function (date, activity) {
            var visit = activity.visit, visitor = activity.visitor;
            //
            //Get the url
            var url = new URL(window === null || window === void 0 ? void 0 : window.location.href);
            //
            //Make sure at least one context reader is available.
            var readers = source ? _this.contextReaders.get(source) : undefined;
            if (!readers) {
                _this.logger.warn('Default tracker - No context readers are registered for the source. No tracking data will be created.', { source: source });
                return;
            }
            //
            //Use the context reader to determine the tracked activity.
            var readerContext = {
                date: date, context: context, visit: visit, visitor: visitor, url: url,
                logger: _this.logger
            };
            _this.contextReaders.forEach(function (readers, id) {
                _this.logger.debug('Default tracker - Reading activity from context using context readers.', { id: id, readers: readers });
                readers.forEach(function (reader) {
                    var activity2 = reader.getTrackedActivity(source, readerContext);
                    _this.logger.debug('Default tracker - Activity read from reader.', { type: reader.type, activity: activity2 });
                    activity.append(activity2);
                });
            });
        };
        var results = this.doTracking(settings, callback);
        this.logger.debug('Default tracker - Finished track() handling.', { results: results });
        return results;
    };
    DefaultTracker.prototype.doTracking = function (settings, callback) {
        var _this = this;
        var _a;
        this.logger.debug('Default tracker - Start doTracking().');
        var visitorId = settings.visitorId, _b = settings.createVisitor, createVisitor = _b === void 0 ? false : _b;
        var visitor = undefined;
        var visit = undefined;
        //
        //
        var activity = new TrackedActivityResults();
        var date = new Date().toISOString();
        try {
            //
            //Get the visitor.
            if (visitorId) {
                visitor = this.repository.getVisitor(visitorId);
            }
            if (!visitor) {
                if (!createVisitor) {
                    this.logger.error('Default tracker - No visitor was returned from the repository. Tracking will abort.');
                    return activity;
                }
                //
                //Create a new visitor.
                visitor = this.repository.createVisitor();
                if (!visitor) {
                    this.logger.error('Default tracker - Unable to create new visitor. Tracking will abort.');
                    return activity;
                }
            }
            //
            //Get the visit.
            var result = this.repository.getCurrentVisit(visitor, this.sessionTimeout);
            visit = result.current;
            if (!visit) {
                this.logger.error('Default tracker - No visit was returned from the repository. Tracking will abort.');
                return activity;
            }
            if (result.isNewVisit && ((_a = this.extensions) === null || _a === void 0 ? void 0 : _a.onNewVisitCreated)) {
                var now = new Date();
                this.extensions.onNewVisitCreated(now, visitor, result.previous, visit, this.logger);
            }
            //
            //
            activity.visit = visit;
            activity.visitor = visitor;
            //
            //
            callback(date, activity);
            //
            //
            //Determine whether the visit or the visitor changed so
            //handlers can be called. This should be called before
            //any changes are applied to the visit or visitor in
            //case the current state of either is needed.
            var visitChanges = getVisitChanges(activity, visit, visitor);
            var visitorChanges = getVisitorChanges(activity, visit, visitor);
            //
            //
            if (visitChanges.size == 0 && visitorChanges.length == 0) {
                this.logger.debug('Default tracker - No changes were made to the visit or the visitor, so there is nothing to track.');
            }
            //
            //Update the visit.
            if (activity.visitActivities.length > 0 || activity.visitUpdates.length > 0) {
                visit.updated = date;
            }
            if (!visit.data) {
                visit.data = {};
            }
            if (!visit.data["activities"]) {
                visit.data["activities"] = [];
            }
            activity.visitActivities.forEach(function (activity) {
                visit.data["activities"].push(activity);
            });
            activity.visitUpdates.forEach(function (update) {
                visit.data[update.type] = {
                    date: date,
                    data: update.data
                };
            });
            activity.visitUpdateCommands.forEach(function (command) {
                command(visit);
            });
            //
            //Update the visitor.
            if (!visitor.data) {
                visitor.data = {};
            }
            activity.visitorUpdates.forEach(function (update) {
                visitor.data[update.type] = {
                    date: date,
                    data: update.data
                };
            });
            activity.visitorUpdateCommands.forEach(function (command) {
                command(visitor);
            });
            //
            //Provide a way to perform tasks like recalculating 
            //pattern matches. This logic should be handled by
            //the tracker, not the repository.
            var when = new Date();
            if (this.extensions && this.extensions.onBeforeVisitorSaved) {
                this.extensions.onBeforeVisitorSaved(when, visitor, visitChanges, visitorChanges, this.logger);
            }
            //
            //Save the visitor to persistent storage using the 
            //repository. The repository may trigger events to 
            //notify subscribers that something has changed.
            this.repository.saveVisitor(when, visitor, visitChanges, visitorChanges);
            //
            //Dispatch the results if any dispatchers are specified.
            if (this.dispatchers) {
                var isRunningInBrowser_1 = (typeof window !== 'undefined' && window.document != undefined);
                this.dispatchers.forEach(function (dispatcher) {
                    if (!dispatcher.requiresBrowser || isRunningInBrowser_1) {
                        _this.logger.debug("Default tracker - Dispatching activity.", { type: dispatcher.type, activity: activity });
                        dispatcher.dispatchActivity(activity, _this.logger);
                    }
                });
            }
            //
            //Update global objects.
            this.logger.debug("Default tracker - Updating global object.", { visit: visit, visitor: visitor });
            if (!window.uniform) {
                window.uniform = {};
            }
            window.uniform.tracker = this;
            window.uniform.visit = visit;
            window.uniform.visitor = visitor;
            //
            //Notify subscribers that tracking is finished.
            var trackingFinishedEvent = {
                type: "tracking-finished",
                when: new Date(),
                visit: activity.visit,
                visitor: activity.visitor
            };
            if (settings.silent !== true) {
                this.logger.debug("Default tracker - Notify subscribers that tracking is finished.", { subscriptions: this.subscriptions });
                this.subscriptions.publish(trackingFinishedEvent);
            }
            else {
                this.logger.debug("Default tracker - Tracking settings indicate silent mode. Tracking is finished but subscribers will not be notified.", { subscriptions: this.subscriptions });
            }
        }
        catch (ex) {
            this.logger.error('Default tracker - Error thrown during doTracking().', ex);
        }
        finally {
            this.state = 'ready';
            this.logger.debug('Default tracker - Finished doTracking().');
        }
        return activity;
    };
    return DefaultTracker;
}());
export { DefaultTracker };
//# sourceMappingURL=defaultTracker.js.map