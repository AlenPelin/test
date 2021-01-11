"use strict";
/**
 * Converts Sitecore-specific events into phints for Oracle DMP.
 */
export function getOracleDmpTrackedActivityConverterForSitecore() {
    return {
        type: "default",
        convert: function (activity) {
            switch (activity.type) {
                case "page view":
                    return convertPageView(activity);
                case "campaign":
                    return convertCampaign(activity);
                case "page event":
                    return convertEvent(activity);
                case "goal":
                    return convertEvent(activity);
                case "personalization":
                    return convertPersonalization(activity);
                default:
                    return undefined;
            }
        }
    };
}
/**
 * Converts campaigns.
 * @param activity
 */
function convertCampaign(activity) {
    var _a;
    var campaignName = (_a = activity === null || activity === void 0 ? void 0 : activity.data) === null || _a === void 0 ? void 0 : _a.name;
    if (!campaignName) {
        return;
    }
    return {
        campaigns: campaignName
    };
}
/**
 * Converts page event and goals.
 * @param activity
 */
function convertEvent(activity) {
    var _a;
    var eventName = (_a = activity === null || activity === void 0 ? void 0 : activity.data) === null || _a === void 0 ? void 0 : _a.name;
    // const engagementValue = activity?.data?.points ?? 0;
    if (!eventName) {
        return;
    }
    return {
        events: eventName
    };
}
/**
 * Converts page view event.
 * @param activity
 */
function convertPageView(activity) {
    var _a, _b, _c, _d;
    var itemId = (_b = (_a = activity === null || activity === void 0 ? void 0 : activity.data) === null || _a === void 0 ? void 0 : _a.item) === null || _b === void 0 ? void 0 : _b.id;
    var itemName = (_d = (_c = activity === null || activity === void 0 ? void 0 : activity.data) === null || _c === void 0 ? void 0 : _c.item) === null || _d === void 0 ? void 0 : _d.name;
    return {
        itemId: itemId,
        itemName: itemName
    };
}
/**
 * Converts personalization event.
 * @param activity
 */
function convertPersonalization(_activity) {
    // const pageName = activity?.data?.page?.name;
    // const componentName = activity?.data?.component?.name;
    // const isIncludedInTest = activity?.data?.isIncludedInTest ?? false != true;
    return;
}
//# sourceMappingURL=oracleDmpEventConverter.js.map