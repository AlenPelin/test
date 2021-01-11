"use strict";
exports.__esModule = true;
exports.getSitecoreTracker = exports.SitecoreCookieNames = void 0;
var common_1 = require("@uniformdev/common");
var contextReaders_1 = require("./contextReaders");
var decay_1 = require("../../decay");
var trackers_1 = require("../../trackers");
var SitecoreCookieNames;
(function (SitecoreCookieNames) {
    SitecoreCookieNames["Campaign"] = "UNIFORM_TRACKER_SITECORE_campaign";
    SitecoreCookieNames["Goals"] = "UNIFORM_TRACKER_SITECORE_goals";
    SitecoreCookieNames["PatternMatches"] = "UNIFORM_TRACKER_SITECORE_pattern_matches";
    SitecoreCookieNames["ProfileScores"] = "UNIFORM_TRACKER_SITECORE_profile_scores";
})(SitecoreCookieNames = exports.SitecoreCookieNames || (exports.SitecoreCookieNames = {}));
/**
 * Gets a map of context readers that are able
 * to read Sitecore tracking data.
 * @param args
 * @param logger
 */
function getDefaultContextReadersForSitecoreTracker(args, logger) {
    var _a;
    var reader = contextReaders_1.getSitecoreContextReader((_a = args.type) !== null && _a !== void 0 ? _a : 'default', logger);
    var readers = new Map();
    readers.set(contextReaders_1.CONTEXT_SOURCE_SITECORE, [reader]);
    return readers;
}
/**
 * Adds default context readers to args based on settings in args.
 * @param args
 * @param logger
 */
function addDefaultContextReadersIfNeeded(args, logger) {
    if (args.doNotIncludeDefaultContextReaders == true) {
        logger.debug("getSitecoreTracker - Will not add default context readers.", args);
        return;
    }
    logger.debug("getSitecoreTracker - Adding default context readers.", args);
    var defaultMap = getDefaultContextReadersForSitecoreTracker(args, logger);
    if (!defaultMap) {
        logger.debug("getSitecoreTracker - No default default context readers were retrieved.", args);
        return;
    }
    if (!args.contextReaders) {
        args.contextReaders = defaultMap;
        return;
    }
    Array.from(defaultMap.keys()).forEach(function (key) {
        var _a, _b;
        var defaultReaders = (_a = defaultMap.get(key)) !== null && _a !== void 0 ? _a : [];
        if (defaultReaders.length == 0) {
            return;
        }
        var specifiedReaders = (_b = args.contextReaders.get(key)) !== null && _b !== void 0 ? _b : [];
        defaultReaders.forEach(function (defaultReader) {
            if ((specifiedReaders === null || specifiedReaders === void 0 ? void 0 : specifiedReaders.findIndex(function (specifiedReader) { return specifiedReader.type == defaultReader.type; })) != -1) {
                specifiedReaders.push(defaultReader);
            }
        });
        args.contextReaders.set(key, specifiedReaders);
    });
    args.contextReaders = getDefaultContextReadersForSitecoreTracker(args, logger);
}
/**
 * This function simplifies the process of creating
 * a tracker for a Sitecore site by adding default
 * settings that are needed when tracking data is
 * provided from Sitecore (whether the data comes
 * from JSS Layout Service or the Uniform Page
 * Service).
 * @param args
 * @param logger
 */
function getSitecoreTracker(args, logger) {
    if (!logger) {
        logger = common_1.getNullLogger();
    }
    addDefaultContextReadersIfNeeded(args, logger);
    if (!args.contextReaders) {
        logger.error("getSitecoreTracker - No context readers were resolved for the Sitecore tracker. Without a context reader, the tracker is unable to read trackable data. The null tracker will be used. This tracker does not track anything; it simply writes to the log.", args);
        return undefined;
    }
    logger.debug("getSitecoreTracker - Context reader(s) resolved for Sitecore tracker.", args.contextReaders);
    logger.debug("getSitecoreTracker - Using Sitecore profile decay settings.", args.decay);
    args.extensions = {
        onNewVisitCreated: function (date, visitor, oldVisit, newVisit, logger) {
            var _a, _b;
            var referrer = (_a = window === null || window === void 0 ? void 0 : window.document) === null || _a === void 0 ? void 0 : _a.referrer;
            newVisit.data.referrer = referrer;
            logger.debug("Sitecore tracker extensions - New visit created, so set referrer.", referrer);
            if (oldVisit) {
                var settings = (_b = args.decay) !== null && _b !== void 0 ? _b : decay_1.getDefaultDecaySettings();
                applyProfilesFromOldVisit(settings, date, visitor, oldVisit, newVisit, logger);
            }
        }
    };
    return trackers_1.getDefaultTracker(args, {
        logger: logger
    });
}
exports.getSitecoreTracker = getSitecoreTracker;
function getProfileDataWithDecay(oldData, differenceForDecay, settings, logger) {
    //
    //Add the decayed profile scores into a buffer.
    var newData = {};
    Object.keys(oldData).forEach(function (profileId) {
        var _a;
        var profile = oldData[profileId];
        var keys = {};
        //
        //If, after applying decay, the profile still has values,
        //the update count should be set to 1 to indicate
        var hasValues = false;
        Object.keys(profile.keys).forEach(function (profileKeyId) {
            var _a;
            var oldProfileKey = profile.keys[profileKeyId];
            var newProfileKey = JSON.parse(JSON.stringify(oldProfileKey));
            newProfileKey.value = decay_1.doDecay((_a = newProfileKey.value) !== null && _a !== void 0 ? _a : 0, differenceForDecay, settings, logger);
            if (!hasValues && newProfileKey.value > 0) {
                hasValues = true;
            }
            keys[profileKeyId] = newProfileKey;
        });
        //
        //Since the update count is decayed at the same rate as the 
        //profile, it is possible that the update count will be zero
        //while the decayed profile still has values. In this case,
        //the update count should be set to 1.
        var decayedUpdateCount = decay_1.doDecay((_a = profile.updateCount) !== null && _a !== void 0 ? _a : 0, differenceForDecay, settings, logger);
        if (hasValues && decayedUpdateCount == 0) {
            logger.debug("Sitecore tracker extensions - After decay was applied, the update count for the profile was zero. But since the decayed profile still has values, the update count will be set to one.", { profile: profileId, keys: keys });
            decayedUpdateCount = 1;
        }
        //
        //Set the decayed values on the buffer.
        newData[profileId] = {
            keys: keys,
            name: profile.name,
            updateCount: decay_1.doDecay(profile.updateCount, differenceForDecay, settings, logger)
        };
    });
    return newData;
}
/**
 * Applies the profile scores from an old visit to
 * a new visit and the associated visitor. This is
 * where decay logic is applied to the profile scores.
 * @param settings
 * @param date
 * @param oldVisit
 * @param newVisit
 * @param visitor
 * @param logger
 */
function applyProfilesFromOldVisit(settings, date, visitor, oldVisit, newVisit, logger) {
    var _a, _b;
    if (!oldVisit) {
        return;
    }
    if (!newVisit) {
        logger.error("Sitecore tracker extensions - Cannot copy profiles to new visit when no new visit is provided.", { oldVisitId: oldVisit.id });
        return;
    }
    logger.debug("Sitecore tracker extensions - New visit created, so apply profiles from the old visit.", { date: date, visitorId: visitor.id, oldVisit: oldVisit, newVisit: newVisit });
    //
    //Get values from the old visit
    var profileDataFromOldVisit = (_b = (_a = oldVisit.data) === null || _a === void 0 ? void 0 : _a.profiles) === null || _b === void 0 ? void 0 : _b.data;
    if (!profileDataFromOldVisit) {
        logger.debug("Sitecore tracker extensions - No profile data is set on the old visit, so there are no profiles to copy.", { oldVisitId: oldVisit.id, newVisitId: newVisit.id });
        return;
    }
    //
    //Get the decayed values
    var differenceForDecay = decay_1.getDifferenceAsTimeIncrements(oldVisit.updated, newVisit.updated, settings, logger);
    logger.debug("Sitecore tracker extensions - Profile decay values were determined.", { unit: settings.timeUnit, increments: differenceForDecay });
    var profileDataForNewVisit = getProfileDataWithDecay(profileDataFromOldVisit, differenceForDecay, settings, logger);
    logger.debug("Sitecore tracker extensions - Decayed profile was determined.", { withDecay: profileDataForNewVisit, withoutDecay: profileDataFromOldVisit });
    //
    //Set the decayed values on the new visit
    if (!newVisit.data) {
        newVisit.data = {};
    }
    if (newVisit.data.profiles) {
        logger.debug("Sitecore tracker extensions - The current profiles on the new visit will be replaced with decayed profile from the old visit.", { newVisitId: newVisit.id, current: newVisit.data.profiles });
    }
    logger.debug("Sitecore tracker extensions - The decayed profiles from the old visit will be applied to the new visit.", { oldVisitId: oldVisit.id, newVisitId: newVisit.id, decay: settings, differenceForDecay: differenceForDecay, newProfiles: profileDataForNewVisit });
    var newProfiles = {
        data: profileDataForNewVisit,
        date: date.toISOString()
    };
    newProfiles.date = date.toISOString();
    newVisit.data.profiles = newProfiles;
    //
    //Set the decayed values on the visitor
    if (!visitor) {
        logger.debug("Sitecore tracker extensions - No visitor was specified so the decayed profiles cannot be assigned to the visitor.", { visitorId: oldVisit.visitorId, newProfiles: newProfiles });
        return;
    }
    if (!visitor.data) {
        visitor.data = {};
    }
    logger.debug("Sitecore tracker extensions - The decayed profiles from the old visit will be applied to visitor.", { oldVisitId: oldVisit.id, visitorId: visitor.id, decay: settings, differenceForDecay: differenceForDecay, newProfiles: profileDataForNewVisit });
    visitor.data.profiles = JSON.parse(JSON.stringify(newProfiles));
}
//# sourceMappingURL=tracker.js.map