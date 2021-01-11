"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitecorePersonalizationContextProvider = exports.SitecorePersonalizationContext = void 0;
const react_1 = __importStar(require("react"));
const react_cookie_1 = require("react-cookie");
const personalize_1 = require("@uniformdev/personalize");
const personalize_2 = require("@uniformdev/personalize");
const personalize_3 = require("@uniformdev/personalize");
const common_1 = require("@uniformdev/common");
const tracking_1 = require("@uniformdev/tracking");
exports.SitecorePersonalizationContext = react_1.createContext({});
function getTestManagerFromCookie(cookies, setCookie, deleteCookie, props, logger) {
    var _a;
    const { contextData, disabled } = props;
    const getValue = (settings) => {
        if (!cookies)
            return;
        const cookie = cookies[tracking_1.UniformCookieNames.Testing];
        if (!cookie)
            return;
        const parts = cookie.split("|");
        if (parts.length != 2)
            return;
        if (parts[0] != settings.id)
            return;
        return (parts[1] === 'T');
    };
    const testStateManager = {
        getIsTestingStateKnown: (settings) => {
            return getValue(settings) != undefined;
        },
        getIsIncludedInTest: (settings) => {
            if (cookies) {
                const value = getValue(settings);
                return (value == true);
            }
            return false;
        },
        setIsIncludedInTest: (value, settings) => {
            if (settings === null || settings === void 0 ? void 0 : settings.id) {
                const value2 = `${settings.id}|${value}`;
                setCookie(tracking_1.UniformCookieNames.Testing, value2);
            }
        },
        setTestNotRunning: () => {
            if (cookies[tracking_1.UniformCookieNames.Testing]) {
                logger.debug("Sitecore personalization context - No personalization test is running so delete the testing cookie.", { cookie: cookies[tracking_1.UniformCookieNames.Testing] });
            }
            deleteCookie(tracking_1.UniformCookieNames.Testing);
        },
    };
    let testSettingsSource = "props";
    let testSettings = props.testSettings;
    if (!testSettings) {
        testSettingsSource = "context data";
        testSettings = (_a = contextData === null || contextData === void 0 ? void 0 : contextData.testing) === null || _a === void 0 ? void 0 : _a.data;
    }
    logger.debug(`Sitecore personalization context - Using personalization test settings from ${testSettingsSource}.`, { testSettings, props, contextData });
    const args = {
        testSettings: testSettings !== null && testSettings !== void 0 ? testSettings : [],
        testStateManager,
        options: { disabled, logger }
    };
    return personalize_1.getTestManager(args);
}
function getPersonalizationManager(props, args) {
    const { personalizationMode = 'default', sitecoreApiKey = '', sitecoreSiteName = '' } = props;
    if (personalizationMode == 'jss-esi') {
        return personalize_3.getSitecoreEsiPersonalizationManager(Object.assign(Object.assign({}, args), { sitecoreApiKey, sitecoreSiteName }));
    }
    return personalize_2.getSitecorePersonalizationManager(args);
}
exports.SitecorePersonalizationContextProvider = (props) => {
    var _a;
    const { children, contextData, contextDataSource, disabled = false, logger = common_1.getNullLogger(), subscriptions, } = props;
    const tracking = contextData === null || contextData === void 0 ? void 0 : contextData.tracking;
    const itemId = (_a = tracking === null || tracking === void 0 ? void 0 : tracking.item) === null || _a === void 0 ? void 0 : _a.id;
    //
    //Create test manager.
    const [cookies, setCookie, deleteCookie] = react_cookie_1.useCookies([]);
    //
    //Create personalization manager.
    const [personalizationManager, setPersonalizationManager] = react_1.useState();
    react_1.useEffect(() => {
        if (!itemId) {
            logger.debug("Sitecore personalization context - Context data does not have the expected shape, so personalization will not be wired up at this time. This should only happen once when a full page refresh occurs. If this happens at other points during the rendering process, check to ensure the context includes the tracking property.", { contextData });
            return;
        }
        logger.debug("Sitecore personalization context - Context data changed", { contextData });
        const testManager = getTestManagerFromCookie(cookies, setCookie, deleteCookie, props, logger);
        const args2 = {
            contextData,
            contextDataSource,
            disabled,
            logger,
            testManager
        };
        //
        //   
        const manager = getPersonalizationManager(props, args2);
        if (manager) {
            if (subscriptions && (manager === null || manager === void 0 ? void 0 : manager.subscriptions.subscribe)) {
                logger.debug("Sitecore personalization context - Adding subscriptions from props to personalization manager.");
                subscriptions(manager.subscriptions.subscribe);
            }
        }
        logger.debug("Sitecore personalization context - Personalization manager set in state.", { manager, props, args2 });
        setPersonalizationManager(() => manager);
    }, [itemId]);
    //
    //
    const value = {
        item: personalizationManager === null || personalizationManager === void 0 ? void 0 : personalizationManager.page,
        logger,
        personalizationManager,
        timestamp: 0,
    };
    return (react_1.default.createElement(exports.SitecorePersonalizationContext.Provider, { value: value }, children));
};
//# sourceMappingURL=SitecorePersonalizationContext.js.map