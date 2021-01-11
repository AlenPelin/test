var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getNullLogger, getSubscriptionManager, tryFormatGuid, } from '@uniformdev/common';
import { getSitecoreContextDataReader } from './contextReaders';
const axios = require('axios').default;
function getDefaultDataFetcher() {
    const fetcher = (url, data) => {
        return axios({
            url,
            method: data ? 'POST' : 'GET',
            headers: {
                'Accept-ESI': 'true'
            },
            data,
            // note: axios needs to use `withCredentials: true` in order for Sitecore cookies to be included in CORS requests
            // which is necessary for analytics and such
            withCredentials: true,
        });
    };
    return fetcher;
}
function getDefaultDataFetcherReader(contextDataSource, logger) {
    if (!logger)
        logger = getNullLogger();
    if (contextDataSource == 'jss-esi') {
        const reader = (rendering, data, logger) => {
            var _a, _b, _c;
            if (!logger)
                logger = getNullLogger();
            if (!data) {
                logger.debug('Sitecore ESI personalization manager - No data was provided to the data fetcher result reader.');
                return;
            }
            const placeholders = (_c = (_b = (_a = data.sitecore) === null || _a === void 0 ? void 0 : _a.route) === null || _b === void 0 ? void 0 : _b.placeholders) !== null && _c !== void 0 ? _c : {};
            const keys = Object.keys(placeholders);
            for (let i = 0; i < keys.length; i++) {
                const placeholder = placeholders[keys[i]];
                const index = placeholder.findIndex(r => r.uid == rendering.uid);
                if (index != -1) {
                    return placeholder[index];
                }
            }
            return;
        };
        return reader;
    }
    logger.error('Sitecore ESI personalization manager - No data fetcher reader can be resolved for the specified context data source.', { contextDataSource });
    return;
}
/**
 * Gets a Sitecore personalization manager.
 * @param args
 */
export function getSitecoreEsiPersonalizationManager(args) {
    var _a, _b, _c;
    //Get data from context
    if (!args.contextDataSource) {
        args.contextDataSource = "jss-esi";
    }
    const reader = getSitecoreContextDataReader(args.contextDataSource);
    const definitions = reader === null || reader === void 0 ? void 0 : reader.getDefinitions(args.contextData);
    const item = reader === null || reader === void 0 ? void 0 : reader.getPageDetails(args.contextData);
    if (!definitions) {
        return getDisabledSitecoreEsiPersonalizationManager();
    }
    const testManager = (_a = args.testManager) !== null && _a !== void 0 ? _a : {
        disabled: false,
        getIsIncludedInTest: () => true,
    };
    const triggers = getTriggers(definitions);
    const settings = {
        disabled: args.disabled,
        item,
        logger: args.logger,
        dataFetcher: (_b = args.dataFetcher) !== null && _b !== void 0 ? _b : getDefaultDataFetcher(),
        dataFetcherReader: (_c = args.dataFetcherReader) !== null && _c !== void 0 ? _c : getDefaultDataFetcherReader(args.contextDataSource),
        getDataFetcherUrl: args.getDataFetcherUrl,
        sitecoreApiKey: args.sitecoreApiKey,
        sitecoreSiteName: args.sitecoreSiteName,
        testManager,
        triggers,
    };
    return new SitecoreEsiPersonalizationManager(settings);
}
function getTriggers(definitions) {
    const triggers = {};
    let hasTriggers = false;
    Object.keys(definitions).forEach(renderingUid => {
        const dependencies = definitions[renderingUid].dependencies;
        if (Array.isArray(dependencies)) {
            hasTriggers = true;
            triggers[renderingUid] = dependencies;
        }
    });
    return hasTriggers ? triggers : undefined;
}
function flattenArrays(source, target) {
    if (!Array.isArray(source)) {
        return;
    }
    for (let i = 0; i < source.length; i++) {
        const value = source[i];
        if (value == undefined || value == null) {
            continue;
        }
        if (Array.isArray(value)) {
            flattenArrays(value, target);
            continue;
        }
        if (target.indexOf(value) == -1) {
            target.push(value);
        }
    }
}
/**
 * Sitecore personalization manager.
 */
class SitecoreEsiPersonalizationManager {
    constructor(settings) {
        var _a, _b, _c;
        this.logger = getNullLogger();
        this.disabled = (_a = settings.disabled) !== null && _a !== void 0 ? _a : false;
        this.logger = (_b = settings.logger) !== null && _b !== void 0 ? _b : getNullLogger();
        this.page = settings.item;
        this.subscriptions = getSubscriptionManager();
        this.triggers = settings.triggers;
        this.dataFetcher = settings.dataFetcher;
        this.dataFetcherReader = settings.dataFetcherReader;
        this.getDataFetcherUrl = (_c = settings.getDataFetcherUrl) !== null && _c !== void 0 ? _c : this.getDefaultGetDataFetcherUrl;
        this.sitecoreApiKey = settings.sitecoreApiKey;
        this.sitecoreSiteName = settings.sitecoreSiteName;
        this.testManager = settings.testManager;
    }
    getDefaultGetDataFetcherUrl(item) {
        const url = `/sitecore/api/layout/render/jss?item=${item}&sc_apikey=${this.sitecoreApiKey}&sc_site=${this.sitecoreSiteName}`;
        if (!this.sitecoreApiKey) {
            this.logger.error("SitecoreEsiPersonalizationManager - The default getDataFetcherUrl is used in the personalization manager, but no Sitecore API key was specified. Layout Service calls will likely fail.", { url });
        }
        if (!this.sitecoreSiteName) {
            this.logger.error("SitecoreEsiPersonalizationManager - The default getDataFetcherUrl is used in the personalization manager, but no Sitecore site name was specified. Layout Service may call if Sitecore depends on this value for site resolution.", { url });
        }
        return url;
    }
    onTrigger(trigger, rendering) {
        return __awaiter(this, void 0, void 0, function* () {
            this.doPersonalize(rendering, [trigger]);
        });
    }
    personalize(rendering) {
        return __awaiter(this, void 0, void 0, function* () {
            this.doPersonalize(rendering);
        });
    }
    doPersonalize(rendering, triggers) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            if (!rendering) {
                this.logger.error('Sitecore ESI personalization manager - No rendering was specified.');
                return;
            }
            if (this.disabled) {
                this.logger.debug('Sitecore ESI personalization manager - Personalization is disabled.');
                return;
            }
            if (!this.triggers) {
                this.logger.debug('Sitecore ESI personalization manager - No rendering triggers map were specified.');
                return;
            }
            if (!this.dataFetcher) {
                this.logger.error('Sitecore ESI personalization manager - No dataFetcher implementation was provided.');
                return;
            }
            if (!this.dataFetcherReader) {
                this.logger.error('Sitecore ESI personalization manager - No dataFetcher reader implementation was provided.');
                return;
            }
            if (!triggers) {
                this.logger.debug('Sitecore ESI personalization manager - No triggers provided for personalization.');
                return;
            }
            //
            //With client-side personalization, all of the dependencies 
            //must be met in order for personalization to be performed
            //because personalization can be performed on a per-rule
            //basis.
            //
            //ESI personalization is different because it is performed
            //on a per-component basis. This means that as long as at
            //least one dependency is met, ESI personalization should
            //run.
            const dependencies = [];
            flattenArrays(this.triggers[rendering.uid], dependencies);
            //
            //
            if (dependencies.length > 0) {
                const atLeastOneDependencyIsMet = dependencies.some(dependency => triggers.includes(dependency));
                if (!atLeastOneDependencyIsMet) {
                    this.logger.debug('Sitecore ESI personalization manager - At least one rendering dependency must be met in order to fetch personalized data.', { dependencies, triggers, page: this.page });
                    return;
                }
                this.logger.debug('Sitecore ESI personalization manager - At least one rendering dependency was met, so personalized data will be fetched.', { dependencies, triggers, page: this.page });
            }
            this.logger.debug('Sitecore ESI personalization manager - Setting rendering state to loading.', { rendering, page: this.page });
            //Set to loading before applying the rules
            this.subscriptions.publish({
                component: rendering.uid,
                isLoading: true,
                page: this.page,
                type: 'state-changed',
                when: new Date(),
            });
            try {
                //
                //Get the data fetch url
                if (!((_a = this.page) === null || _a === void 0 ? void 0 : _a.id)) {
                    this.logger.error('Sitecore ESI personalization manager - No page id is available, so no personalized data will be fetched.', { page: this.page });
                    return;
                }
                const fetchUrl = this.getDataFetcherUrl(this.page.id);
                this.logger.debug('Sitecore ESI personalization manager - Fetching personalized data.', {
                    fetchUrl,
                    rendering,
                });
                const dataFetcherResult = yield this.dataFetcher(fetchUrl);
                const pzData = this.dataFetcherReader(rendering, dataFetcherResult === null || dataFetcherResult === void 0 ? void 0 : dataFetcherResult.data, this.logger);
                if (!pzData) {
                    this.logger.error('Sitecore ESI personalization manager - Data fetcher reader returned no data.', { fetchUrl, pzData });
                    return;
                }
                //
                //
                this.logger.debug('Sitecore ESI personalization manager - Data fetcher returned data.', { fetchUrl, pzData });
                const esiData = (_b = pzData === null || pzData === void 0 ? void 0 : pzData.fields) === null || _b === void 0 ? void 0 : _b.__Esi;
                const esiActivity = (_c = pzData === null || pzData === void 0 ? void 0 : pzData.fields) === null || _c === void 0 ? void 0 : _c.__Personalization;
                const context = rendering;
                const result = evaluatePersonalization({
                    activity: esiActivity,
                    data: esiData,
                    logger: this.logger,
                    page: this.page,
                    personalizationContext: context,
                });
                const includedInTest = (_e = (_d = this.testManager) === null || _d === void 0 ? void 0 : _d.getIsIncludedInTest()) !== null && _e !== void 0 ? _e : false;
                //
                //Publish a state-changed event to notify components that
                //personalization is done loading and that there may be
                //changes to render.
                const e = {
                    activity: esiActivity,
                    changes: result.changes,
                    component: rendering.uid,
                    data: esiData,
                    includedInTest,
                    isLoading: false,
                    page: this.page,
                    personalizedData: result.fields,
                    type: 'state-changed',
                    when: new Date(),
                };
                this.logger.debug('Sitecore ESI personalization manager - Personalization is done loading, so notify subscribers to the state-changed event on the personalization manager.', {
                    result,
                    rendering,
                    event: e,
                    me: this
                });
                this.subscriptions.publish(e);
            }
            catch (error) {
                this.logger.error('Sitecore ESI personalization manager - Error occured while personalizing, so change rendering state to finished loading.', {
                    error,
                    rendering
                });
                this.subscriptions.publish({
                    component: rendering.uid,
                    error,
                    isLoading: false,
                    page: this.page,
                    type: 'state-changed',
                    when: new Date(),
                });
                return;
            }
        });
    }
}
function evaluatePersonalization({ activity, data, logger, page, personalizationContext, }) {
    var _a, _b, _c, _d;
    const changes = {};
    const dsBefore = tryFormatGuid((_b = (_a = personalizationContext.dataSource) !== null && _a !== void 0 ? _a : personalizationContext.defaultDataSource) !== null && _b !== void 0 ? _b : page === null || page === void 0 ? void 0 : page.id, 'D');
    const component = getComponent(personalizationContext);
    // Return if no ESI data fetched.
    if (!data) {
        logger.debug('Sitecore ESI personalization manager - No personalized data was fetched.', {
            personalizationContext,
        });
        changes.data = {
            before: dsBefore,
            after: dsBefore,
        };
        return {
            activity,
            changes,
            component,
            data,
            fields: null,
        };
    }
    const dsAfter = tryFormatGuid((_d = (_c = data === null || data === void 0 ? void 0 : data.dataSource) !== null && _c !== void 0 ? _c : personalizationContext.defaultDataSource) !== null && _d !== void 0 ? _d : page === null || page === void 0 ? void 0 : page.id, 'D');
    const componentBefore = personalizationContext.uid;
    const componentAfter = data.uid;
    if (dsBefore != dsAfter) {
        changes.data = {
            before: dsBefore,
            after: dsAfter,
        };
    }
    if (componentBefore != componentAfter) {
        changes.component = {
            before: componentBefore,
            after: componentAfter,
        };
    }
    //
    //Return if no changes.
    if (!changes.data && !changes.component) {
        logger.debug('Sitecore ESI personalization manager - Component state did not change as a result of the ESI data fetched.', {
            personalizationContext,
        });
        return {
            changes,
            component,
            data: data,
            fields: null,
        };
    }
    const fieldsAfter = data.fields;
    const result = {
        changes,
        component,
        data: data,
        fields: fieldsAfter,
    };
    logger.debug('Sitecore ESI personalization manager - Component should be personalized.', Object.assign(Object.assign({}, result), { item: page }));
    return result;
}
function getComponent(context) {
    return {
        id: context.uid,
        description: context.componentName,
    };
}
function getDisabledSitecoreEsiPersonalizationManager() {
    return {
        disabled: true,
        onTrigger: () => __awaiter(this, void 0, void 0, function* () { }),
        page: {},
        personalize: () => __awaiter(this, void 0, void 0, function* () { }),
        subscriptions: {
            publish: (_data) => null,
            subscribe: (_type, _callback) => () => false,
            getSubscribers: (_type) => []
        },
        triggers: {},
    };
}
//# sourceMappingURL=sitecoreEsi.js.map