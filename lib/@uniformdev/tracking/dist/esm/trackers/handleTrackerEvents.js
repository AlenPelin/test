import { UniformCookieNames } from "./tracker";
import { getCookieValueFromVisit, getCookieValueFromVisitor } from "../connectors/sitecore/cookies";
import { SitecoreCookieNames } from "../connectors/sitecore/tracker";
import { getCurrentVisit } from "../models";
import { appendArray } from "@uniformdev/common";
/**
 * Certain tracker data can be configured to be set in cookies.
 * This function adds subscriptions to the tracker to set those
 * cookies.
 * @param subs
 * @params args
 */
export function addSubscriptionsForTrackerCookies(subs, args) {
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
export function getTrackerCookieTypes(trackingConfig) {
    var _a;
    var cookieTypes = [];
    appendArray((_a = trackingConfig === null || trackingConfig === void 0 ? void 0 : trackingConfig.settings) === null || _a === void 0 ? void 0 : _a.cookies, cookieTypes);
    return cookieTypes;
}
/**
 * Sets cookie values needed for server-side personalization.
 * @param e
 * @param args
 */
export function setCookiesForSitecoreVisitCreated(e, args) {
    var _a, _b, _c, _d;
    var cookieTypes = args.cookieTypes, logger = args.logger, loggerPrefix = args.loggerPrefix, removeCookie = args.removeCookie, setCookie = args.setCookie;
    if (cookieTypes.indexOf('visitCount') > -1) {
        var count = (_b = (_a = e.visitor) === null || _a === void 0 ? void 0 : _a.visits.length) !== null && _b !== void 0 ? _b : 0;
        if (count == 0) {
            logger.debug(loggerPrefix + " - Visit created event was triggered. No visits are assigned to the visitor, so removing the cookie for visit count.", { cookie: UniformCookieNames.VisitCount, event: e });
            removeCookie(UniformCookieNames.VisitCount);
        }
        else {
            logger.debug(loggerPrefix + " - Visit created event was triggered. Updating the cookie for visit count.", { cookie: UniformCookieNames.VisitCount, count: (_c = e.visitor) === null || _c === void 0 ? void 0 : _c.visits.length });
            setCookie(UniformCookieNames.VisitCount, (_d = e.visitor) === null || _d === void 0 ? void 0 : _d.visits.length);
        }
    }
    //
    //Remove visit-specific cookies.
    if (cookieTypes.indexOf('goals') > -1) {
        logger.debug(loggerPrefix + " - Visit created event was triggered. Resetting the cookie for goal tracking.", { cookie: SitecoreCookieNames.Goals });
        removeCookie(SitecoreCookieNames.Goals);
    }
}
/**
 * Sets cookie values needed for server-side personalization.
 * @param e
 * @param args
 */
export function setCookiesForSitecoreVisitUpdated(e, args) {
    var cookieTypes = args.cookieTypes, logger = args.logger, loggerPrefix = args.loggerPrefix, removeCookie = args.removeCookie, setCookie = args.setCookie;
    if (e.visitor) {
        var visit = getCurrentVisit(e.visitor);
        if (visit) {
            if (e.changes.get(visit.id)) {
                if (cookieTypes.indexOf('goals') > -1) {
                    var goals = getCookieValueFromVisit('goals', visit);
                    logger.debug(loggerPrefix + " - Visit updated event was triggered. Updating the cookie for goal tracking.", { cookie: SitecoreCookieNames.Goals, visit: visit });
                    if (!goals) {
                        removeCookie(SitecoreCookieNames.Goals);
                    }
                    else {
                        setCookie(SitecoreCookieNames.Goals, goals);
                    }
                }
                if (cookieTypes.indexOf('campaign') > -1) {
                    var campaignId = getCookieValueFromVisit('campaign', visit);
                    logger.debug(loggerPrefix + " - Visit updated event was triggered. Updating the cookie for campaign tracking.", { cookie: SitecoreCookieNames.Campaign, visit: visit });
                    if (!campaignId) {
                        removeCookie(SitecoreCookieNames.Campaign);
                    }
                    else {
                        setCookie(SitecoreCookieNames.Campaign, campaignId);
                    }
                }
            }
        }
    }
}
/**
 * Sets cookie values needed for server-side personalization.
 * @param e
 * @param args
 */
export function setCookiesForSitecoreVisitorUpdated(e, args) {
    var cookieTypes = args.cookieTypes, logger = args.logger, loggerPrefix = args.loggerPrefix, removeCookie = args.removeCookie, setCookie = args.setCookie;
    if (e.visitor) {
        if (cookieTypes.indexOf('patterns') > -1) {
            var patterns = getCookieValueFromVisitor('patterns', e.visitor);
            logger.debug(loggerPrefix + " - Visitor updated event was triggered. Updating the cookie for pattern match tracking.", { cookie: SitecoreCookieNames.PatternMatches, visitor: e.visitor });
            if (!patterns) {
                removeCookie(SitecoreCookieNames.PatternMatches);
            }
            else {
                setCookie(SitecoreCookieNames.PatternMatches, patterns);
            }
        }
        if (cookieTypes.indexOf('profiles') > -1) {
            var profiles = getCookieValueFromVisitor('profiles', e.visitor);
            logger.debug(loggerPrefix + " - Visitor updated event was triggered. Updating the cookie for profile score tracking.", { cookie: SitecoreCookieNames.ProfileScores, visitor: e.visitor });
            if (!profiles) {
                removeCookie(SitecoreCookieNames.ProfileScores);
            }
            else {
                setCookie(SitecoreCookieNames.ProfileScores, profiles);
            }
        }
    }
}
//# sourceMappingURL=handleTrackerEvents.js.map