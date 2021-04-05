// import getNextConfig from 'next/config';
import { createDisconnectedDictionaryService, createDisconnectedLayoutService, ManifestManager, } from '@sitecore-jss/sitecore-jss-dev-tools';
import { customizeContext, customizeRendering } from './disconnectedModeMiddleware';
export var dataServices = {
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
export function initializeDataServices(_a) {
    var env = _a.env;
    // If services have already been initialized, return early.
    if (dataServices.initialized) {
        return Promise.resolve();
    }
    var jssConfig = env.getConfig();
    // Create a ManifestManager instance with minimum configuration required.
    var manifestManager = new ManifestManager({
        appName: jssConfig.jssAppName,
        rootPath: process.cwd(),
    });
    // Set `initialManifest` to false to avoid writing manifest to disk.
    manifestManager.initialManifest = false;
    return manifestManager.getManifest(jssConfig.defaultLanguage).then(function (manifest) {
        dataServices.layoutService = createDisconnectedLayoutService({
            manifest: manifest,
            manifestLanguageChangeCallback: manifestManager.getManifest,
            customizeContext: customizeContext,
            customizeRendering: customizeRendering,
        });
        dataServices.dictionaryService = createDisconnectedDictionaryService({
            manifest: manifest,
            manifestLanguageChangeCallback: manifestManager.getManifest,
        });
        dataServices.initialized = true;
    });
}
//# sourceMappingURL=disconnectedDataServices.js.map