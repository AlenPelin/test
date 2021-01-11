'use strict';
import { Visitor } from '../models/visitor';
import { getLatestVisit } from '../models/utils';
import { getNullLogger } from '@uniformdev/common';
import { v4 as uuid } from 'uuid';
export function getTrackingDataRepository(storage, settings) {
    return new DefaultTrackingDataRepository(storage, settings === null || settings === void 0 ? void 0 : settings.subscriptions, settings === null || settings === void 0 ? void 0 : settings.logger);
}
var DefaultTrackingDataRepository = /** @class */ (function () {
    function DefaultTrackingDataRepository(storageProvider, subscriptions, logger) {
        this.type = "default";
        this.logger = logger !== null && logger !== void 0 ? logger : getNullLogger();
        this.storageProvider = storageProvider;
        this.subscriptions = subscriptions;
    }
    DefaultTrackingDataRepository.prototype.getNewVisitId = function () {
        return uuid();
    };
    DefaultTrackingDataRepository.prototype.getNewVisitorId = function () {
        return uuid();
    };
    /**
     *
     * @param visitor -
     * @param sessionTimeout - Number of minutes of inactivity before a new visit is created.
     * @param logger
     */
    DefaultTrackingDataRepository.prototype.getCurrentVisit = function (visitor, sessionTimeout) {
        var now = new Date();
        var visit = getLatestVisit(visitor);
        if (visit) {
            //
            //Determine if the current visit has timed out.
            var timeoutDate = calculateTimeout(visit.updated, sessionTimeout);
            if (now < timeoutDate) {
                var diff = getDifference(timeoutDate, now);
                this.logger.debug('Default tracking data repository - Most recent visit is still active.', {
                    ttl: diff,
                    visit: visit,
                    now: now,
                    end: timeoutDate,
                });
                return {
                    current: visit,
                    previous: undefined,
                    isNewVisit: false,
                };
            }
            //
            //The visit has timed out, so update the visit.
            visit.end = timeoutDate.toISOString();
            this.saveVisitorNoUpdate(visitor);
            //
            //Publish event.
            this.logger.debug('Default tracking data repository - Most recent visit is no longer active.', visit);
            if (this.subscriptions) {
                this.subscriptions.publish({
                    type: "visit-timeout",
                    when: now,
                    visit: visit,
                    visitor: visitor,
                });
            }
        }
        //
        //Create a new visit.
        var newVisit = this.addVisit(visitor, now);
        //
        //Publish event.
        if (this.subscriptions) {
            this.subscriptions.publish({
                type: "visit-created",
                when: new Date(),
                visit: newVisit,
                visitor: visitor
            });
        }
        return {
            current: newVisit,
            previous: visit,
            isNewVisit: true,
        };
    };
    /**
     * Get the specified visitor from persistent storage.
     * @param visitorId - Id of the visitor to retrieve.
     * @param logger
     */
    DefaultTrackingDataRepository.prototype.getVisitor = function (visitorId) {
        if (!this.storageProvider) {
            this.logger.error('Default tracking data repository - No storage provider is available, so unable to get data for visitor ' + visitorId);
            return undefined;
        }
        if (visitorId != undefined && visitorId != '') {
            var visitor = this.storageProvider.read(visitorId, this.logger);
            if (visitor) {
                return visitor;
            }
        }
        return undefined;
    };
    DefaultTrackingDataRepository.prototype.createVisitor = function () {
        return this.doCreateVisitor(this.getNewVisitorId());
    };
    DefaultTrackingDataRepository.prototype.doCreateVisitor = function (visitorId) {
        var now = new Date();
        var visitor = new Visitor(visitorId, { updated: now.toISOString() });
        this.storageProvider.write(visitor, this.logger);
        this.logger.debug('Default tracking data repository - New visitor created.', visitor);
        //
        //Publish event.
        if (this.subscriptions) {
            this.subscriptions.publish({
                type: "visitor-created",
                when: new Date(),
                visitor: visitor
            });
        }
        return visitor;
    };
    /**
     * Save the visitor but do not treat it as an update.
     * No events are fired and no updated timestamp is
     * set. This is used in cases like when a visit is
     * determined to have timed out.
     * @param visitor
     */
    DefaultTrackingDataRepository.prototype.saveVisitorNoUpdate = function (visitor) {
        this.storageProvider.write(visitor);
        this.logger.debug('Default tracking data repository - Visitor saved to the repository but update events were fired.', visitor);
    };
    /**
     *
     * @param date
     * @param visitor
     * @param visitChanges
     * @param visitorChanges
     * @param logger
     */
    DefaultTrackingDataRepository.prototype.saveVisitor = function (date, visitor, visitChanges, visitorChanges) {
        //
        //
        visitor.updated = date.toISOString();
        this.storageProvider.write(visitor);
        this.logger.debug('Default tracking data repository - Visitor saved to the repository.', visitor);
        //
        //Publish event.
        if (this.subscriptions) {
            var now = new Date();
            if (visitChanges.size > 0) {
                this.subscriptions.publish({
                    type: "visit-updated",
                    when: now,
                    changes: visitChanges,
                    visitor: visitor
                });
            }
            if (visitorChanges.length > 0) {
                this.subscriptions.publish({
                    type: "visitor-updated",
                    when: now,
                    changes: visitorChanges,
                    visitor: visitor
                });
            }
        }
    };
    /**
     * Creates a new visit and associates it with the specified visitor.
     * @param visitor - Visitor to associate with the visit.
     * @param when -
     * @param logger -
     */
    DefaultTrackingDataRepository.prototype.addVisit = function (visitor, when) {
        var updated = when.toISOString();
        visitor.updated = updated;
        var visit = {
            id: this.getNewVisitId(),
            visitorId: visitor.id,
            start: updated,
            updated: updated,
            data: {}
        };
        this.logger.debug('Default tracking data repository - New visit created.', visit);
        if (!visitor.visits) {
            visitor.visits = [];
        }
        visitor.visits.push(visit);
        this.storageProvider.write(visitor);
        return visit;
    };
    return DefaultTrackingDataRepository;
}());
/**
 * Returns a new Date by adding the timeout to an existing date.
 * @param date - The date.
 * @param timeout - Number of minutes to add to the date.
 */
function calculateTimeout(date, timeout) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return new Date(date.getTime() + timeout * 1000 * 60);
}
/**
 *
 * @param date1
 * @param date2
 */
function getDifference(date1, date2) {
    if (typeof date1 === 'string') {
        date1 = new Date(date1);
    }
    if (typeof date2 === 'string') {
        date2 = new Date(date2);
    }
    var diff = date1.getTime() - date2.getTime();
    var ms = diff % 1000;
    var sec = Math.floor((diff / 1000) % 60);
    var min = Math.floor((diff / 1000 / 60) % 60);
    var hours = Math.floor((diff / 1000 / 60 / 60) % 60);
    var days = Math.floor(diff / 1000 / 60 / 60 / 24);
    return { diff: diff, milliseconds: ms, seconds: sec, minutes: min, hours: hours, days: days };
}
//# sourceMappingURL=defaultRepository.js.map