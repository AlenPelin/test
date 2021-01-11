"use strict";
exports.__esModule = true;
exports.getGaTrackedActivityConverterForSitecore = void 0;
/**
 * Converts Sitecore-specific events into events for Google Analytics.
 */
function getGaTrackedActivityConverterForSitecore() {
    return {
        type: "default",
        convert: function (activity) {
            switch (activity.type) {
                case "page view":
                    return convertPageView("Sitecore Page View", activity);
                case "page event":
                    return convertEvent("Sitecore Event", activity);
                case "goal":
                    return convertEvent("Sitecore Goal", activity);
                case "personalization":
                    return convertPersonalization("Uniform Personalization", activity);
                default:
                    return undefined;
            }
        }
    };
}
exports.getGaTrackedActivityConverterForSitecore = getGaTrackedActivityConverterForSitecore;
/**
 * Converts page event and goals.
 * @param category
 * @param activity
 */
function convertEvent(category, activity) {
    return {
        category: category,
        action: activity.data.name,
        label: undefined,
        value: activity.data.points
    };
}
/**
 * Converts page view event.
 * @param category
 * @param activity
 */
function convertPageView(category, activity) {
    return {
        category: category,
        action: activity.data.item.id,
        label: activity.data.item.name,
        value: 0
    };
}
/**
 * Converts personalization event.
 * @param category
 * @param activity
 */
function convertPersonalization(category, activity) {
    var _a, _b, _c, _d;
    var pageName = (_b = (_a = activity === null || activity === void 0 ? void 0 : activity.data) === null || _a === void 0 ? void 0 : _a.page) === null || _b === void 0 ? void 0 : _b.name;
    var componentName = (_d = (_c = activity === null || activity === void 0 ? void 0 : activity.data) === null || _c === void 0 ? void 0 : _c.component) === null || _d === void 0 ? void 0 : _d.name;
    return {
        category: category,
        action: pageName + "|" + componentName,
        label: activity.data.rule.name,
        value: activity.data.isIncludedInTest
    };
}
//# sourceMappingURL=gaEventConverter.js.map