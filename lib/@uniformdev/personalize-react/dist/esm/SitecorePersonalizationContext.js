import React, { createContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { getTestManager } from '@uniformdev/personalize';
import { getSitecorePersonalizationManager } from '@uniformdev/personalize';
import { getSitecoreEsiPersonalizationManager } from '@uniformdev/personalize';
import { getNullLogger } from '@uniformdev/common';
import { UniformCookieNames } from '@uniformdev/tracking';
export const SitecorePersonalizationContext = createContext({});
function getTestManagerFromCookie(cookies, setCookie, deleteCookie, props, logger) {
    var _a;
    const { contextData, disabled } = props;
    const getValue = (settings) => {
        if (!cookies)
            return;
        const cookie = cookies[UniformCookieNames.Testing];
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
                setCookie(UniformCookieNames.Testing, value2);
            }
        },
        setTestNotRunning: () => {
            if (cookies[UniformCookieNames.Testing]) {
                logger.debug("Sitecore personalization context - No personalization test is running so delete the testing cookie.", { cookie: cookies[UniformCookieNames.Testing] });
            }
            deleteCookie(UniformCookieNames.Testing);
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
    return getTestManager(args);
}
function getPersonalizationManager(props, args) {
    const { personalizationMode = 'default', sitecoreApiKey = '', sitecoreSiteName = '' } = props;
    if (personalizationMode == 'jss-esi') {
        return getSitecoreEsiPersonalizationManager(Object.assign(Object.assign({}, args), { sitecoreApiKey, sitecoreSiteName }));
    }
    return getSitecorePersonalizationManager(args);
}
export const SitecorePersonalizationContextProvider = (props) => {
    var _a;
    const { children, contextData, contextDataSource, disabled = false, logger = getNullLogger(), subscriptions, } = props;
    const tracking = contextData === null || contextData === void 0 ? void 0 : contextData.tracking;
    const itemId = (_a = tracking === null || tracking === void 0 ? void 0 : tracking.item) === null || _a === void 0 ? void 0 : _a.id;
    //
    //Create test manager.
    const [cookies, setCookie, deleteCookie] = useCookies([]);
    //
    //Create personalization manager.
    const [personalizationManager, setPersonalizationManager] = useState();
    useEffect(() => {
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
    return (React.createElement(SitecorePersonalizationContext.Provider, { value: value }, children));
};
//# sourceMappingURL=SitecorePersonalizationContext.js.map