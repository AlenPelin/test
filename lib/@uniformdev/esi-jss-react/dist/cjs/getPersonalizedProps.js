"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@uniformdev/common");
var getPersonalizedProps = function (data, logger) {
    var _a, _b;
    logger.debug("getPersonalizedProps - Getting personalized props from data.", { data: data });
    if (!logger)
        logger = common_1.getNullLogger();
    if (!data) {
        logger.debug('getPersonalizedProps - No data was specified, so unable to retrieve personalized props for component.', { data: data });
        return {};
    }
    var newData = (_a = data.fields) === null || _a === void 0 ? void 0 : _a.__Esi;
    if (newData) {
        logger.debug('getPersonalizedProps - __Esi field is available in the data, so it will be used for personalized props.', { originalData: data, newData: newData });
    }
    var eventData = (_b = data.fields) === null || _b === void 0 ? void 0 : _b.__Personalization;
    if (eventData && Object.keys(eventData).length > 0) {
        logger.debug('getPersonalizedProps - __Personalization field is available in the data, so it will be used for event data.', { eventData: eventData });
    }
    return { props: newData, event: eventData };
};
exports.default = getPersonalizedProps;
//# sourceMappingURL=getPersonalizedProps.js.map