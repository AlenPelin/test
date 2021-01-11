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
import { TrackedActivityResults } from '../../models/trackedActivity';
import { getPatternMatcher } from './patternMatchers';
import { getNullLogger } from '@uniformdev/common';
import { getScorer } from './scoring';
import { getCookie } from '../../cookies';
import { UniformCookieNames } from '../../trackers';
export var CONTEXT_SOURCE_SITECORE = "sitecore";
export function getSitecoreContextReader(type, logger) {
    if (logger === void 0) { logger = getNullLogger(); }
    switch (type) {
        case 'cookie':
            return getNotImplementedContextReader(type);
        case 'js':
            return getJsContextReader();
        case 'jss':
            return getJssContextReader();
        case 'default':
        case 'uniform':
            break;
        default:
            logger.info("Sitecore context reader - The specified Sitecore context reader type is not supported. The default type will be used.", { source: type });
    }
    return getUniformContextReader();
}
function getNotImplementedContextReader(type) {
    return {
        type: type,
        getTrackedActivity: function (source, context) {
            var visit = context.visit, visitor = context.visitor, _a = context.logger, logger = _a === void 0 ? getNullLogger() : _a;
            var activity = new TrackedActivityResults(visit, visitor);
            if (source !== "sitecore") {
                return activity;
            }
            logger.error("Sitecore context reader - Context reader not implemented.", { source: source, type: this.type });
            return activity;
        }
    };
}
function getJsContextReader() {
    return {
        type: "js",
        getTrackedActivity: function (source, readerContext) {
            var _a;
            var url = readerContext.url, context = readerContext.context, visit = readerContext.visit, visitor = readerContext.visitor, date = readerContext.date, _b = readerContext.logger, logger = _b === void 0 ? getNullLogger() : _b;
            var activity = new TrackedActivityResults(visit, visitor);
            if (source !== "sitecore") {
                return activity;
            }
            var tracking = (_a = context === null || context === void 0 ? void 0 : context.tracking) !== null && _a !== void 0 ? _a : {};
            logger.debug("JS context reader - Reading tracking activity from context.", { tracking: tracking, context: context });
            var context2 = {
                page: {
                    item: tracking.item,
                    url: url
                },
                goals: tracking.goals,
                pageEvents: tracking.events,
                campaigns: tracking.campaigns,
                profiles: tracking.profiles
            };
            doSetActivityResults(context2, date, activity, logger);
            return activity;
        }
    };
}
function getTrackingForJss(readerContext, logger) {
    var _a, _b;
    var context = readerContext.context;
    if ((_b = (_a = context === null || context === void 0 ? void 0 : context.sitecore) === null || _a === void 0 ? void 0 : _a.context) === null || _b === void 0 ? void 0 : _b.tracking) {
        logger.debug("JSS context reader - Tracking data retrieved from context.sitecore.context.tracking.", context);
        return context.sitecore.context.tracking;
    }
    if (context === null || context === void 0 ? void 0 : context.tracking) {
        logger.debug("JSS context reader - Tracking data retrieved from context.tracking.", context);
        return context.tracking;
    }
    return undefined;
}
function getJssContextReader() {
    return {
        type: "jss",
        getTrackedActivity: function (source, readerContext) {
            var _a;
            var url = readerContext.url, context = readerContext.context, visit = readerContext.visit, visitor = readerContext.visitor, date = readerContext.date, _b = readerContext.logger, logger = _b === void 0 ? getNullLogger() : _b;
            var activity = new TrackedActivityResults(visit, visitor);
            if (source !== "sitecore") {
                return activity;
            }
            var tracking = (_a = getTrackingForJss(readerContext, logger)) !== null && _a !== void 0 ? _a : {};
            logger.debug("JSS context reader - Reading tracking activity from context.", { tracking: tracking, context: context });
            var context2 = {
                page: {
                    item: tracking.item,
                    url: url
                },
                goals: tracking.goals,
                pageEvents: tracking.events,
                campaigns: tracking.campaigns,
                profiles: tracking.profiles
            };
            doSetActivityResults(context2, date, activity, logger);
            return activity;
        }
    };
}
function getUniformContextReader() {
    return {
        type: "uniform",
        getTrackedActivity: function (source, readerContext) {
            var url = readerContext.url, context = readerContext.context, visit = readerContext.visit, visitor = readerContext.visitor, date = readerContext.date, _a = readerContext.logger, logger = _a === void 0 ? getNullLogger() : _a;
            var activity = new TrackedActivityResults(visit, visitor);
            if (source !== "sitecore") {
                return activity;
            }
            logger.debug("Uniform context reader - Reading tracking activity from context.", { context: context });
            var tracking = context.tracking;
            var context2 = {
                page: {
                    item: tracking === null || tracking === void 0 ? void 0 : tracking.item,
                    url: url
                },
                goals: tracking === null || tracking === void 0 ? void 0 : tracking.goals,
                pageEvents: tracking === null || tracking === void 0 ? void 0 : tracking.events,
                campaigns: tracking === null || tracking === void 0 ? void 0 : tracking.campaigns,
                profiles: tracking === null || tracking === void 0 ? void 0 : tracking.profiles
            };
            doSetActivityResults(context2, date, activity, logger);
            return activity;
        }
    };
}
function doSetActivityResults(context, date, activity, logger) {
    var _a, _b;
    if (!context.page) {
        logger.debug("Sitecore context reader - No page was found in the context so page view will be tracked.", context);
    }
    else {
        handlePageView(context.page, activity, date, logger);
    }
    //
    //
    if (!context.goals) {
        logger.debug("Sitecore context reader - No goals were found in the context so none will be tracked.", context);
    }
    else {
        handleGoals(context.goals, activity, date, logger);
    }
    //
    //
    if (!context.pageEvents) {
        logger.debug("Sitecore context reader - No page events were found in the context so none will be tracked.", context);
    }
    else {
        handlePageEvents(context.pageEvents, activity, date, logger);
    }
    //
    //
    if (!context.campaigns) {
        logger.debug("Sitecore context reader - No campaigns were found in the context so none will be tracked.", context);
    }
    else {
        handleCampaigns(context.campaigns, activity, date, logger);
    }
    //
    //
    var points = getEngagementValue(context);
    if (points == 0) {
        logger.debug("Sitecore context reader - No changes to engagement value were found in the context so it will not be updated.", context);
    }
    else {
        handleEngagementValue(points, activity, date, logger);
    }
    //
    //
    if (!context.profiles) {
        logger.debug("Sitecore context reader - No profiles were found in the context so none will be tracked.", context);
    }
    else {
        handleProfiles(context.profiles, activity, date, logger);
    }
    //
    //
    var personalization = (_b = (_a = window === null || window === void 0 ? void 0 : window.uniform) === null || _a === void 0 ? void 0 : _a.tracking) === null || _b === void 0 ? void 0 : _b.personalization;
    if (!personalization) {
        logger.debug("Sitecore context reader - No personalization details were found so no origin-generated personalization activity will be tracked. Note: Personalization details will only be included when origin-based personalization occurs. If no origin-based personalization is used, this message indicates things are working as expected.");
    }
    else {
        handlePersonalization(personalization, activity, date, logger);
    }
}
function getEngagementValue(context) {
    if (!(context === null || context === void 0 ? void 0 : context.goals)) {
        return 0;
    }
    var points = 0;
    Object.keys(context.goals).forEach(function (key) {
        var goal = context.goals[key];
        if (!isNaN(goal === null || goal === void 0 ? void 0 : goal.points)) {
            points += goal.points;
        }
    });
    Object.keys(context.pageEvents).forEach(function (key) {
        var pageEvent = context.pageEvents[key];
        if (!isNaN(pageEvent === null || pageEvent === void 0 ? void 0 : pageEvent.points)) {
            points += pageEvent.points;
        }
    });
    return points;
}
function handleEngagementValue(points, activity, date, _logger) {
    if (isNaN(points) || points <= 0) {
        return;
    }
    var doUpdateValue = function (source) {
        var _a, _b;
        if (!source.data) {
            source.data = {};
        }
        var currentValue = (_b = (_a = source.data.value) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : 0;
        source.data.value = {
            date: date,
            data: currentValue + points
        };
    };
    activity.visitUpdateCommands.push(function (visit) {
        doUpdateValue(visit);
    });
    activity.visitorUpdateCommands.push(function (visitor) {
        doUpdateValue(visitor);
    });
}
function handleGoals(goals, activity, date, _logger) {
    if (!goals) {
        return;
    }
    Object.keys(goals).forEach(function (key) {
        var goal = goals[key];
        activity.visitActivities.push({
            type: "goal",
            date: date,
            data: __assign({ id: key }, goal)
        });
    });
}
function handlePageEvents(pageEvents, activity, date, _logger) {
    if (!pageEvents) {
        return;
    }
    Object.keys(pageEvents).forEach(function (key) {
        var pageEvent = pageEvents[key];
        activity.visitActivities.push({
            type: "page event",
            date: date,
            data: __assign({ id: key }, pageEvent)
        });
    });
}
function handlePageView(page, activity, date, _logger) {
    if (!page) {
        return;
    }
    activity.visitActivities.push({
        type: "page view",
        date: date,
        data: page
    });
}
function handlePersonalization(personalization, activity, date, logger) {
    if (!personalization) {
        return;
    }
    Object.keys(personalization).forEach(function (key) {
        var obj = personalization[key];
        if (!obj) {
            logger.error("Sitecore context reader - Key was included in personalization data but no object was set. Personalization data is corrupt.", { key: key });
            return;
        }
        var data = obj.activity;
        if (!data) {
            logger.debug("Sitecore context reader - Key was included in personalization data but no activity was set. This usually means the component has personalization but none of the personalization rules were activated.", { key: key });
            return;
        }
        //
        //With server-side rendering, two separate tasks are performed:
        // 1. Conditional logic determines what content to display.
        // 2. Personalization events are created for the client tracker.
        //
        //The code that creates the personalization events does not know
        //whether the visitor is in a test. The personalization event is
        //the same regardless of whether the visitor is in a test, with
        //the exception of the isIncludedInTest value. 
        //
        //The following code sets this value on the personalization event
        //to the value from the testing cookie. This must happen before 
        //the event is associated with the visit.
        var cookie = getCookie(UniformCookieNames.Testing);
        if (cookie) {
            var parts = cookie.split('|');
            if (parts.length == 2) {
                var included = parts[1] == 'T' ? true : false;
                if (data.isIncludedInTest != true && included) {
                    logger.debug("Sitecore context reader - Setting the isIncludedInTest value on the personalization event to true in order to match the testing cookie value.", { key: key, data: data });
                    data.isIncludedInTest = true;
                }
            }
        }
        var e = {
            type: "personalization",
            date: date,
            data: data
        };
        logger.debug("Sitecore context reader - Adding personalization activity from origin-based personalization.", { event: e });
        activity.visitActivities.push(e);
        logger.debug("Sitecore context reader - Origin-based personalization event was handled, so remove the definition from the collection.", { key: key, personalization: __assign({}, personalization) });
        delete personalization[key];
    });
}
function getStoredProfile(profileId, source) {
    var _a, _b;
    var profilesData = (_b = (_a = source.data) === null || _a === void 0 ? void 0 : _a.profiles) === null || _b === void 0 ? void 0 : _b.data;
    if (profilesData) {
        return profilesData[profileId];
    }
    return undefined;
}
function getCurrentProfileScoresFromSource(profileId, source) {
    var scores = {};
    var profile = getStoredProfile(profileId, source);
    if (profile) {
        scores.updateCount = profile.updateCount;
        Object.keys(profile.keys).forEach(function (profileKeyId) {
            scores[profileKeyId] = profile.keys[profileKeyId].value;
        });
    }
    return scores;
}
function getProfileUpdateCountFromSource(profileId, source) {
    var profile = getStoredProfile(profileId, source);
    if (profile) {
        return profile.updateCount;
    }
    return 0;
}
function updateProfileKeys(updatedScores, currentProfile, profileDefinition) {
    Object.keys(updatedScores.keys).forEach(function (profileKeyId) {
        var updatedProfileKeyValue = updatedScores.keys[profileKeyId];
        //
        //Add the profile key to the current profile if needed.
        if (!currentProfile.keys) {
            currentProfile.keys = {};
        }
        if (!currentProfile.keys[profileKeyId]) {
            currentProfile.keys[profileKeyId] = {};
        }
        //
        //Update the profile name on the current profile.
        if (profileDefinition.name) {
            currentProfile.name = profileDefinition.name;
        }
        //
        //Get the updated profile key name if available.
        var updatedProfileKeyName = undefined;
        if (profileDefinition.keys) {
            var profileKeyDefinition = profileDefinition.keys[profileKeyId];
            if (profileKeyDefinition) {
                updatedProfileKeyName = profileKeyDefinition.name;
            }
        }
        //
        //Update the profile key on the current profile.
        var currentProfileKey = currentProfile.keys[profileKeyId];
        if (updatedProfileKeyName) {
            currentProfileKey.name = updatedProfileKeyName;
        }
        currentProfileKey.value = updatedProfileKeyValue;
    });
}
function applyPatternMatching(matcher, profileDefinition, updatedScores, patternMatches, profileId) {
    if (matcher && profileDefinition.patterns) {
        var match = matcher.match(updatedScores.keys, profileDefinition);
        if (match) {
            var pattern = profileDefinition.patterns[match.patternId];
            var patternMatch = {
                patternId: match.patternId,
                distance: match.distance,
                name: pattern.name
            };
            patternMatches[profileId] = patternMatch;
        }
        else {
            delete patternMatches[profileId];
        }
    }
}
function getUpdatesForTrackedActivityResults(date, profiles, patternMatches) {
    //
    //
    var updates = [];
    if (Object.keys(profiles).length > 0) {
        //
        //Add a visit activity to indicate the profile values were updated.
        if (Object.keys(profiles).length > 0) {
            updates.push({
                type: "profiles",
                date: date,
                data: profiles
            });
        }
        //
        //Add a visit activity to indicate the pattern matches were updated.
        if (Object.keys(patternMatches).length > 0) {
            updates.push({
                type: "patterns",
                date: date,
                data: patternMatches
            });
        }
    }
    return updates;
}
function handleProfiles(profileDefinitions, activity, date, logger) {
    if (!profileDefinitions || !activity.visit) {
        return;
    }
    var matcher = getPatternMatcher();
    if (!matcher) {
        logger.warn("Sitecore context reader - No pattern matcher was resolved, so no pattern matches will be tracked.");
    }
    //
    //Create buffers to store the changes to the visit and visitor.
    //These changes are written to the visit and visitor after all
    //of the profiles are processed.
    var profilesVisit = {};
    var profilesVisitor = {};
    var patternMatchesVisit = {};
    var patternMatchesVisitor = {};
    //
    //For each profile, update the values and pattern matches on the visit.
    Object.keys(profileDefinitions).forEach(function (profileId) {
        //
        //Get the profile key values from the profile.
        var profileDefinition = profileDefinitions[profileId];
        //
        //Get the component responsible for updating the profile values.
        var score = getScorer(profileDefinition.type);
        if (!score) {
            logger.error("Sitecore context reader - No scorer was resolved, so this profile will not be tracked.", profileDefinition);
            return;
        }
        //
        //Get the profile key values to add to the current 
        //profile values. These are used to determine whether
        //to continue with the scoring process, and to provide
        //data for the visit activity event.
        var eventData = {
            id: profileId,
            keys: {}
        };
        Object.keys(profileDefinition.keys).forEach(function (profileKeyId) {
            var profileKey = profileDefinition.keys[profileKeyId];
            eventData.keys[profileKeyId] = profileKey.value;
        });
        //
        //If no scores were set, continue to the next profile.
        if (Object.keys(eventData.keys).length == 0) {
            logger.debug("Sitecore context reader - No profile key values were greater than zero, so this profile will not be tracked.", profileDefinition);
            return;
        }
        //
        //Add a visit activity with the profile key values.
        activity.visitActivities.push({
            type: "profile score",
            date: date,
            data: eventData
        });
        //
        //Get the current profile values for the visit.
        var currentScoresVisit = getCurrentProfileScoresFromSource(profileId, activity.visit);
        var currentUpdateCountVisit = getProfileUpdateCountFromSource(profileId, activity.visit);
        var updatedScoresVisit = score(currentScoresVisit, profileId, profileDefinition, currentUpdateCountVisit);
        //
        //Get the current profile values for the visitor.
        var currentScoresVisitor = getCurrentProfileScoresFromSource(profileId, activity.visitor);
        var currentUpdateCountVisitor = getProfileUpdateCountFromSource(profileId, activity.visitor);
        var updatedScoresVisitor = score(currentScoresVisitor, profileId, profileDefinition, currentUpdateCountVisitor);
        //
        //Update the buffer with names and values for the visit.
        if (!profilesVisit[profileId]) {
            profilesVisit[profileId] = {
                updateCount: 0
            };
        }
        var currentProfileVisit = profilesVisit[profileId];
        //
        //Update the buffer with names and values for the visitor.
        if (!profilesVisitor[profileId]) {
            profilesVisitor[profileId] = {
                updateCount: 0
            };
        }
        var currentProfileVisitor = profilesVisitor[profileId];
        //
        //Keep track of the number of times the profile values
        //are updated. This value is needed to calculate
        //profile values in certain cases (i.e. when the 
        //profile is set to the type "Average").
        currentProfileVisit.updateCount = updatedScoresVisit.updateCount;
        currentProfileVisitor.updateCount = updatedScoresVisitor.updateCount;
        //
        //
        updateProfileKeys(updatedScoresVisit, currentProfileVisit, profileDefinition);
        profilesVisit[profileId] = currentProfileVisit;
        updateProfileKeys(updatedScoresVisitor, currentProfileVisitor, profileDefinition);
        profilesVisitor[profileId] = currentProfileVisitor;
        //
        //Pattern matching.
        applyPatternMatching(matcher, profileDefinition, updatedScoresVisit, patternMatchesVisit, profileId);
        applyPatternMatching(matcher, profileDefinition, updatedScoresVisitor, patternMatchesVisitor, profileId);
    });
    //
    //
    var updatesVisit = getUpdatesForTrackedActivityResults(date, profilesVisit, patternMatchesVisit);
    if (updatesVisit.length == 0) {
        logger.debug("Sitecore context reader - No profile scores changed on the visit, so no profile scoring will be tracked.");
    }
    else {
        updatesVisit.forEach(function (update) {
            activity.visitUpdates.push(update);
        });
    }
    //
    //
    var updatesVisitor = getUpdatesForTrackedActivityResults(date, profilesVisitor, patternMatchesVisitor);
    if (updatesVisitor.length == 0) {
        logger.debug("Sitecore context reader - No profile scores changed on the visitor, so no profile scoring will be tracked.");
    }
    else {
        updatesVisitor.forEach(function (update) {
            activity.visitorUpdates.push(update);
        });
    }
}
function handleCampaigns(campaigns, activity, date, logger) {
    if (!campaigns) {
        return;
    }
    //
    //There should be only 1 campaign. Create visit activity 
    //for each so there is tracking, but only create a visit
    //update for the first campaign.
    var trackableCampaigns = getTrackableCampaigns(campaigns, date, logger);
    if (trackableCampaigns.length == 0) {
        return;
    }
    //
    //Add visit activities
    trackableCampaigns.forEach(function (trackableCampaign) {
        activity.visitActivities.push({
            type: "campaign",
            date: date,
            data: trackableCampaign
        });
    });
    //
    //Add visit update
    activity.visitUpdates.push({
        type: "campaign",
        date: date,
        data: trackableCampaigns[trackableCampaigns.length - 1]
    });
}
function getTrackableCampaigns(campaigns, _date, _logger) {
    var trackableCampaigns = [];
    if (campaigns) {
        for (var key in campaigns) {
            var trackableCampaign = campaigns[key];
            trackableCampaigns.push({
                id: key,
                name: trackableCampaign.name
            });
        }
    }
    return trackableCampaigns;
}
//# sourceMappingURL=contextReaders.js.map