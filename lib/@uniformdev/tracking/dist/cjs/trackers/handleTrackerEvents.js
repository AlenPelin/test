"use strict";
exports.__esModule = true;
exports.setCookiesForSitecoreVisitorUpdated = exports.setCookiesForSitecoreVisitUpdated = exports.setCookiesForSitecoreVisitCreated = exports.getTrackerCookieTypes = exports.addSubscriptionsForTrackerCookies = void 0;
var tracker_1 = require("./tracker");
var cookies_1 = require("../connectors/sitecore/cookies");
var tracker_2 = require("../connectors/sitecore/tracker");
var models_1 = require("../models");
var common_1 = require("@uniformdev/common");
/**
 * Certain tracker data can be configured to be set in cookies.
 * This function adds subscriptions to the tracker to set those
 * cookies.
 * @param subs
 * @params args
 */
function addSubscriptionsForTrackerCookies(subs, args) {
    var cookieTypes = args.cookieTypes;
    if (!cookieTypes || cookieTypes.length == 0) {
        return;
    }
    subs.subscribe("visit-created", function (e) {
        setCookiesForSitecoreVisitCreated(e, args);
    });
    subs.subscribe("visit-updated", function (e) {
        setCookiesForSitecoreVisitUpdated(e, args);
    });
    subs.subscribe("visitor-updated", function (e) {
        setCookiesForSitecoreVisitorUpdated(e, args);
    });
}
exports.addSubscriptionsForTrackerCookies = addSubscriptionsForTrackerCookies;
function getTrackerCookieTypes(trackingConfig) {
    var _a;
    var cookieTypes = [];
    common_1.appendArray((_a = trackingConfig === null || trackingConfig === void 0 ? void 0 : trackingConfig.settings) === null || _a === void 0 ? void 0 : _a.cookies, cookieTypes);
    return cookieTypes;
}
exports.getTrackerCookieTypes = getTrackerCookieTypes;
/**
 * Sets cookie values needed for server-side personalization.
 * @param e
 * @param args
 */
function setCookiesForSitecoreVisitCreated(e, args) {
    var _a, _b, _c, _d;
    var cookieTypes = args.cookieTypes, logger = args.logger, loggerPrefix = args.loggerPrefix, removeCookie = args.removeCookie, setCookie = args.setCookie;
    if (cookieTypes.indexOf('visitCount') > -1) {
        var count = (_b = (_a = e.visitor) === null || _a === void 0 ? void 0 : _a.visits.length) !== null && _b !== void 0 ? _b : 0;
        if (count == 0) {
            logger.debug(loggerPrefix + " - Visit created event was triggered. No visits are assigned to the visitor, so removing the cookie for visit count.", { cookie: tracker_1.UniformCookieNames.VisitCount, event: e });
            removeCookie(tracker_1.UniformCookieNames.VisitCount);
        }
        else {
            logger.debug(loggerPrefix + " - Visit created event was triggered. Updating the cookie for visit count.", { cookie: tracker_1.UniformCookieNames.VisitCount, count: (_c = e.visitor) === null || _c === void 0 ? void 0 : _c.visits.length });
            setCookie(tracker_1.UniformCookieNames.VisitCount, (_d = e.visitor) === null || _d === void 0 ? void 0 : _d.visits.length);
        }
    }
    //
    //Remove visit-specific cookies.
    if (cookieTypes.indexOf('goals') > -1) {
        logger.debug(loggerPrefix + " - Visit created event was triggered. Resetting the cookie for goal tracking.", { cookie: tracker_2.SitecoreCookieNames.Goals });
        removeCookie(tracker_2.SitecoreCookieNames.Goals);
    }
}
exports.setCookiesForSitecoreVisitCreated = setCookiesForSitecoreVisitCreated;
/**
 * Sets cookie values needed for server-side personalization.
 * @param e
 * @param args
 */
function setCookiesForSitecoreVisitUpdated(e, args) {
    var cookieTypes = args.cookieTypes, logger = args.logger, loggerPrefix = args.loggerPrefix, removeCookie = args.removeCookie, setCookie = args.setCookie;
    if (e.visitor) {
        var visit = models_1.getCurrentVisit(e.visitor);
        if (visit) {
            if (e.changes.get(visit.id)) {
                if (cookieTypes.indexOf('goals') > -1) {
                    var goals = cookies_1.getCookieValueFromVisit('goals', visit);
                    logger.debug(loggerPrefix + " - Visit updated event was triggered. Updating the cookie for goal tracking.", { cookie: tracker_2.SitecoreCookieNames.Goals, visit: visit });
                    if (!goals) {
                        removeCookie(tracker_2.SitecoreCookieNames.Goals);
                    }
                    else {
                        setCookie(tracker_2.SitecoreCookieNames.Goals, goals);
                    }
                }
                if (cookieTypes.indexOf('campaign') > -1) {
                    var campaignId = cookies_1.getCookieValueFromVisit('campaign', visit);
                    logger.debug(loggerPrefix + " - Visit updated event was triggered. Updating the cookie for campaign tracking.", { cookie: tracker_2.SitecoreCookieNames.Campaign, visit: visit });
                    if (!campaignId) {
                        removeCookie(tracker_2.SitecoreCookieNames.Campaign);
                    }
                    else {
                        setCookie(tracker_2.SitecoreCookieNames.Campaign, campaignId);
                    }
                }
            }
        }
    }
}
exports.setCookiesForSitecoreVisitUpdated = setCookiesForSitecoreVisitUpdated;
/**
 * Sets cookie values needed for server-side personalization.
 * @param e
 * @param args
 */
function setCookiesForSitecoreVisitorUpdated(e, args) {
    var cookieTypes = args.cookieTypes, logger = args.logger, loggerPrefix = args.loggerPrefix, removeCookie = args.removeCookie, setCookie = args.setCookie;
    if (e.visitor) {
        if (cookieTypes.indexOf('patterns') > -1) {
            var patterns = cookies_1.getCookieValueFromVisitor('patterns', e.visitor);
            logger.debug(loggerPrefix + " - Visitor updated event was triggered. Updating the cookie for pattern match tracking.", { cookie: tracker_2.SitecoreCookieNames.PatternMatches, visitor: e.visitor });
            if (!patterns) {
                removeCookie(tracker_2.SitecoreCookieNames.PatternMatches);
            }
            else {
                setCookie(tracker_2.SitecoreCookieNames.PatternMatches, patterns);
            }
        }
        if (cookieTypes.indexOf('profiles') > -1) {
            var profiles = cookies_1.getCookieValueFromVisitor('profiles', e.visitor);
            logger.debug(loggerPrefix + " - Visitor updated event was triggered. Updating the cookie for profile score tracking.", { cookie: tracker_2.SitecoreCookieNames.ProfileScores, visitor: e.visitor });
            if (!profiles) {
                removeCookie(tracker_2.SitecoreCookieNames.ProfileScores);
            }
            else {
                setCookie(tracker_2.SitecoreCookieNames.ProfileScores, profiles);
            }
        }
    }
}
exports.setCookiesForSitecoreVisitorUpdated = setCookiesForSitecoreVisitorUpdated;
//# sourceMappingURL=handleTrackerEvents.js.map