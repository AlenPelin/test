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
import { config as withUniformNextServer } from '@uniformdev/next-server';
var packageConfig = require(process.cwd() + "/package.json");
export function withUniform(nextConfig) {
    var config = withUniformNextServer(nextConfig);
    var uniformConfig = generateConfig();
    config.serverRuntimeConfig = __assign(__assign({}, (config.serverRuntimeConfig || {})), uniformConfig);
    config.publicRuntimeConfig = __assign(__assign({}, config.publicRuntimeConfig), { sitecoreSiteName: uniformConfig.sitecoreSiteName });
    config.env = __assign(__assign({}, (config.env || {})), { RUNTIME_MODE: process.env.RUNTIME_MODE || 'ssr', JSS_MODE: process.env.JSS_MODE || 'connected' });
    return config;
}
/**
 * Generate config
 * The object returned from this function will be made available by importing src/temp/config.js.
 * This is executed prior to the build running, so it's a way to inject environment or build config-specific
 * settings as variables into the JSS app.
 * NOTE! Any configs returned here will be written into the client-side JS bundle. DO NOT PUT SECRETS HERE.
 * @param {object} configOverrides Keys in this object will override any equivalent global config keys.
 */
function generateConfig(configOverrides) {
    if (configOverrides === void 0) { configOverrides = {}; }
    var defaultConfig = {
        sitecoreApiKey: 'no-api-key-set',
        sitecoreApiHost: '',
        jssAppName: 'Unknown',
        defaultLanguage: 'en',
        appLanguages: ['en'],
    };
    // require + combine config sources
    var packageJson = transformPackageConfig();
    var scjssConfig = transformScJssConfig();
    var environmentConfig = transformEnvironmentConfig();
    // optional:
    // do any other dynamic config source (e.g. environment-specific config files)
    // Object.assign merges the objects in order, so the
    // package.json config can override the calculated config,
    // scjssconfig.json overrides it,
    // and finally config passed in the configOverrides param wins.
    var config = mergeConfigs(defaultConfig, packageJson, scjssConfig, configOverrides, environmentConfig);
    // The GraphQL endpoint is an example of making a _computed_ config setting
    // based on other config settings.
    addGraphQLConfig(config);
    return config;
}
function transformScJssConfig() {
    // scjssconfig.json may not exist if you've never run setup
    // so if it doesn't we substitute a fake object
    var config;
    try {
        // eslint-disable-next-line global-require
        config = require(process.cwd() + "/scjssconfig.json");
    }
    catch (e) {
        return {};
    }
    if (!config)
        return {};
    return {
        sitecoreApiKey: config.sitecore.apiKey,
        sitecoreApiHost: config.sitecore.layoutServiceHost,
        sitecoreSiteName: config.sitecore.sitecoreSiteName,
    };
}
function transformPackageConfig() {
    if (!packageConfig.config)
        return {};
    return {
        jssAppName: packageConfig.config.appName,
        // Typically, app name and site name will be the same, but sometimes they're not.
        // And that causes all sorts of unpleasantness. So we allow for separate config values.
        sitecoreSiteName: packageConfig.config.sitecoreSiteName || packageConfig.config.appName,
        defaultLanguage: packageConfig.config.language || 'en',
        graphQLEndpointPath: packageConfig.config.graphQLEndpointPath || null,
        appLanguages: packageConfig.config.appLanguages || ['en'],
    };
}
function transformEnvironmentConfig() {
    return {
        sitecoreApiHost: process.env.UNIFORM_API_URL,
        sitecoreApiKey: process.env.UNIFORM_API_KEY,
        jssAppName: process.env.UNIFORM_API_SITENAME,
        sitecoreSiteName: process.env.UNIFORM_API_SITENAME,
    };
}
/**
 * Adds the GraphQL endpoint URL to the config object, and ensures that components needed to calculate it are valid
 */
function addGraphQLConfig(baseConfig) {
    if (baseConfig.graphQLEndpointPath) {
        baseConfig.graphQLEndpoint = "" + (baseConfig.sitecoreApiHost || '') + baseConfig.graphQLEndpointPath + "?sc_apikey=" + baseConfig.sitecoreApiKey;
    }
    else {
        console.warn('WARN The `graphQLEndpointPath` configuration was not defined. You may need to run `jss setup`.');
        baseConfig.graphQLEndpoint = (baseConfig.sitecoreApiHost || '') + "/api/" + baseConfig.sitecoreSiteName + "?sc_apikey=" + baseConfig.sitecoreApiKey;
    }
}
function mergeConfigs() {
    var configs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        configs[_i] = arguments[_i];
    }
    return configs.reduce(function (result, config) {
        for (var prop in config) {
            if (config[prop] !== undefined) {
                result[prop] = config[prop];
            }
        }
        return result;
    }, {});
}
//# sourceMappingURL=generateConfig.js.map