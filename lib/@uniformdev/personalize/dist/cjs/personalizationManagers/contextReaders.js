"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSitecoreContextDataReader = void 0;
/**
 * Gets a Sitecore context data reader based on the specified source.
 * @param source
 */
function getSitecoreContextDataReader(source) {
    switch (source !== null && source !== void 0 ? source : 'default') {
        case 'jss':
            return JssContextDataReader;
        case 'jss-esi':
            return JssEsiContextDataReader;
        case 'uniform':
        case 'default':
            break;
    }
    return UniformContextDataReader;
}
exports.getSitecoreContextDataReader = getSitecoreContextDataReader;
/**
 * Reads data from the JSS Layout Service.
 */
const JssContextDataReader = {
    getDefinitions(contextData) {
        var _a, _b, _c, _d;
        if ((_b = (_a = contextData === null || contextData === void 0 ? void 0 : contextData.sitecore) === null || _a === void 0 ? void 0 : _a.context) === null || _b === void 0 ? void 0 : _b.personalization) {
            return (_d = (_c = contextData === null || contextData === void 0 ? void 0 : contextData.sitecore) === null || _c === void 0 ? void 0 : _c.context) === null || _d === void 0 ? void 0 : _d.personalization;
        }
        return contextData === null || contextData === void 0 ? void 0 : contextData.personalization;
    },
    getPageDetails(contextData) {
        var _a, _b, _c, _d, _e, _f, _g;
        if ((_a = contextData === null || contextData === void 0 ? void 0 : contextData.sitecore) === null || _a === void 0 ? void 0 : _a.route) {
            return {
                id: (_c = (_b = contextData === null || contextData === void 0 ? void 0 : contextData.sitecore) === null || _b === void 0 ? void 0 : _b.route) === null || _c === void 0 ? void 0 : _c.itemId,
                name: (_e = (_d = contextData === null || contextData === void 0 ? void 0 : contextData.sitecore) === null || _d === void 0 ? void 0 : _d.route) === null || _e === void 0 ? void 0 : _e.name,
            };
        }
        return {
            id: (_f = contextData === null || contextData === void 0 ? void 0 : contextData.route) === null || _f === void 0 ? void 0 : _f.itemId,
            name: (_g = contextData === null || contextData === void 0 ? void 0 : contextData.route) === null || _g === void 0 ? void 0 : _g.name,
        };
    }
};
/**
 * Reads data from the Uniform Page Service.
 */
const UniformContextDataReader = {
    getDefinitions(contextData) {
        return contextData.personalization;
    },
    getPageDetails(contextData) {
        return contextData;
    }
};
const JssEsiContextDataReader = {
    getDefinitions: (contextData) => {
        var _a, _b, _c, _d;
        if ((_b = (_a = contextData === null || contextData === void 0 ? void 0 : contextData.sitecore) === null || _a === void 0 ? void 0 : _a.context) === null || _b === void 0 ? void 0 : _b.personalization) {
            return (_d = (_c = contextData === null || contextData === void 0 ? void 0 : contextData.sitecore) === null || _c === void 0 ? void 0 : _c.context) === null || _d === void 0 ? void 0 : _d.personalization;
        }
        return contextData === null || contextData === void 0 ? void 0 : contextData.personalization;
    },
    getPageDetails: (contextData) => {
        var _a, _b, _c, _d, _e, _f, _g;
        if ((_a = contextData === null || contextData === void 0 ? void 0 : contextData.sitecore) === null || _a === void 0 ? void 0 : _a.route) {
            return {
                id: (_c = (_b = contextData === null || contextData === void 0 ? void 0 : contextData.sitecore) === null || _b === void 0 ? void 0 : _b.route) === null || _c === void 0 ? void 0 : _c.itemId,
                name: (_e = (_d = contextData === null || contextData === void 0 ? void 0 : contextData.sitecore) === null || _d === void 0 ? void 0 : _d.route) === null || _e === void 0 ? void 0 : _e.name,
            };
        }
        return {
            id: (_f = contextData === null || contextData === void 0 ? void 0 : contextData.route) === null || _f === void 0 ? void 0 : _f.itemId,
            name: (_g = contextData === null || contextData === void 0 ? void 0 : contextData.route) === null || _g === void 0 ? void 0 : _g.name,
        };
    },
};
//# sourceMappingURL=contextReaders.js.map