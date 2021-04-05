"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDataServices = exports.dataServices = void 0;
// import getNextConfig from 'next/config';
var sitecore_jss_dev_tools_1 = require("@sitecore-jss/sitecore-jss-dev-tools");
var disconnectedModeMiddleware_1 = require("./disconnectedModeMiddleware");
exports.dataServices = {
    initialized: false,
};
// export const getPropsFromDisconnectedMockStep: PagePropsPipelineStep = {
//     name: 'disconnected-mock',
//     run: async (context) => {
//         const { serverRuntimeConfig } = getNextConfig();
//         // The export process may run in multiple threads/workers, and each worker will have
//         // a distinct `process` which does not have the same env vars as the original process.
//         // Therefore, we need to use next config to retrieve env vars that have been defined in next.config.js.
//         if (serverRuntimeConfig?.JSS_MODE === 'disconnected') {
//             return initializeDataServices(context).then(() => {
//                 // Fetch layout data and dictionary data from disconnected services, then write the data to disk.
//                 return Promise.all([
//                     fetchMockLayoutServiceData(
//                         dataServices.layoutService,
//                         context.routeParams.sitecoreRoute,
//                         context.routeParams.lang
//                     ),
//                     fetchMockDictionaryData(dataServices.dictionaryService, context.routeParams.lang),
//                 ]).then((results) => {
//                     const props: any = {
//                         layoutData: results[0],
//                         dictionary: results[1],
//                     };
//
//                     if (!props.layoutData || !props.layoutData.sitecore || !props.layoutData.sitecore.route) {
//                         // If no route data was fetched, then:
//                         // Pass a statusCode as prop for any interested components.
//                         props.statusCode = 404;
//                     }
//
//                     return props;
//                 });
//             });
//         }
//         return context;
//     },
// };
function initializeDataServices(_a) {
    var env = _a.env;
    // If services have already been initialized, return early.
    if (exports.dataServices.initialized) {
        return Promise.resolve();
    }
    var jssConfig = env.getConfig();
    // Create a ManifestManager instance with minimum configuration required.
    var manifestManager = new sitecore_jss_dev_tools_1.ManifestManager({
        appName: jssConfig.jssAppName,
        rootPath: process.cwd(),
    });
    // Set `initialManifest` to false to avoid writing manifest to disk.
    manifestManager.initialManifest = false;
    return manifestManager.getManifest(jssConfig.defaultLanguage).then(function (manifest) {
        exports.dataServices.layoutService = sitecore_jss_dev_tools_1.createDisconnectedLayoutService({
            manifest: manifest,
            manifestLanguageChangeCallback: manifestManager.getManifest,
            customizeContext: disconnectedModeMiddleware_1.customizeContext,
            customizeRendering: disconnectedModeMiddleware_1.customizeRendering,
        });
        exports.dataServices.dictionaryService = sitecore_jss_dev_tools_1.createDisconnectedDictionaryService({
            manifest: manifest,
            manifestLanguageChangeCallback: manifestManager.getManifest,
        });
        exports.dataServices.initialized = true;
    });
}
exports.initializeDataServices = initializeDataServices;
//# sourceMappingURL=disconnectedDataServices.js.map