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
import express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { createDisconnectedDictionaryService, createDisconnectedLayoutService, ManifestManager, } from '@sitecore-jss/sitecore-jss-dev-tools';
import { tryParseJsonOrYaml } from '@uniformdev/next-jss';
import { serverLogger } from '@uniformdev/common-server';
function isLegacyPackageJsonConfig(config) {
    return 'appName' in config;
}
var touchToReloadFilePath = path.resolve(path.join(process.cwd(), './temp/config.js'));
var dataPath = path.join(process.cwd(), './data');
export var getDisconnectedServerOptions = function (server, config) { return ({
    server: server,
    appRoot: path.join(__dirname, '..'),
    appName: isLegacyPackageJsonConfig(config) ? config.appName : config.jssAppName,
    watchPaths: [dataPath],
    language: isLegacyPackageJsonConfig(config) ? config.language : config.defaultLanguage,
    onManifestUpdated: function () {
        // if we can resolve the config file, we can alter it to force reloading the app automatically
        // instead of waiting for a manual reload. We must materially alter the _contents_ of the file to trigger
        // an actual reload, so we append "// reloadnow" to the file each time. This will not cause a problem,
        // since every build regenerates the config file from scratch and it's ignored from source control.
        if (fs.existsSync(touchToReloadFilePath)) {
            var currentFileContents = fs.readFileSync(touchToReloadFilePath, 'utf8');
            var newFileContents = currentFileContents + "\n// reloadnow";
            fs.writeFileSync(touchToReloadFilePath, newFileContents, 'utf8');
            console.log('Manifest data updated. Reloading the browser.');
        }
        else {
            console.log('Manifest data updated. Refresh the browser to see latest content!');
        }
    },
    customizeContext: customizeContext,
    customizeRendering: customizeRendering,
}); };
export function attachDisconnectedServices(server, config) {
    return createDefaultDisconnectedServer(getDisconnectedServerOptions(server, config));
}
function createDefaultDisconnectedServer(options) {
    serverLogger.debug('Creating Default Disconnected Server');
    var server = options.server;
    // backwards compatibility with fix for #80
    // for GA the appRoot was expected to be $app/scripts
    // which didn't make sense. This allows both sane app roots
    // and GA-style app roots to keep working.
    if (options.appRoot.endsWith('scripts')) {
        options.appRoot = path.join(options.appRoot, '..');
    }
    // further backwards compatibility for #80
    // allows apps with GA watch path of '../data' (relative to /scripts)
    // to keep working even with appRoot now relative to the actual app root
    // We do this by stripping '../' from path leads, making the path './data' instead - theoretically, the chance of
    // wanting to actually escape from the app root entirely otherwise is awfully low.
    options.watchPaths = options.watchPaths.map(function (path) {
        return path.startsWith('../') ? path.substring(1) : path;
    });
    // the manifest manager maintains the state of the disconnected manifest data during the course of the dev run
    // it provides file watching services, and language switching capabilities
    var manifestManager = new ManifestManager({
        appName: options.appName,
        rootPath: options.appRoot,
        watchOnlySourceFiles: options.watchPaths,
        requireArg: options.requireArg,
        sourceFiles: options.sourceFiles,
    });
    return manifestManager
        .getManifest(options.language)
        .then(function (manifest) {
        // creates a fake version of the Sitecore Layout Service that is powered by your disconnected manifest file
        var layoutService = createDisconnectedLayoutService({
            manifest: manifest,
            manifestLanguageChangeCallback: manifestManager.getManifest,
            customizeContext: options.customizeContext,
            customizeRoute: options.customizeRoute,
            customizeRendering: options.customizeRendering,
        });
        // creates a fake version of the Sitecore Dictionary Service that is powered by your disconnected manifest file
        var dictionaryService = createDisconnectedDictionaryService({
            manifest: manifest,
            manifestLanguageChangeCallback: manifestManager.getManifest,
        });
        // set up live reloading of the manifest when any manifest source file is changed
        manifestManager.setManifestUpdatedCallback(function (newManifest) {
            layoutService.updateManifest(newManifest);
            dictionaryService.updateManifest(newManifest);
            if (options.onManifestUpdated) {
                options.onManifestUpdated(newManifest);
            }
        });
        // attach our disconnected service mocking middleware to webpack dev server
        server.use('/assets', express.static(path.join(options.appRoot, 'assets')));
        server.use('/data/media', express.static(path.join(options.appRoot, 'data/media')));
        server.use('/sitecore/api/layout/render', layoutService.middleware);
        server.use('/sitecore/api/jss/dictionary/:appName/:language', dictionaryService.middleware);
        if (options.afterMiddlewareRegistered) {
            options.afterMiddlewareRegistered(server);
        }
    })
        .catch(function (error) {
        if (options.onError) {
            options.onError(error);
        }
        else {
            console.error(error);
            process.exit(1);
        }
    });
}
export var customizeContext = function (context, _routeData, _currentManifest, request) {
    var routePath = request.query.item;
    var language = request.query.sc_lang;
    var filenames = [language + ".json", language + ".yml"];
    var filepaths = filenames.map(function (filename) { return path.join(dataPath, 'context', routePath, filename); });
    // Attempt to find a matching `{language}.json` or `{language}.yml` file in `/data/context/{routePath}`
    // If no file is found, return default context;
    var contextFilePath = filepaths.find(function (filepath) { return fs.existsSync(filepath); });
    if (!contextFilePath) {
        return context;
    }
    var contextFileContents = fs.readFileSync(contextFilePath, 'utf8');
    var parsedFileContents = tryParseJsonOrYaml(contextFileContents);
    // If we can't parse the file contents, bail.
    if (!parsedFileContents) {
        return context;
    }
    // Merge custom context data with default context data.
    return __assign(__assign({}, context), parsedFileContents);
};
export var customizeRendering = function (transformedRendering, rendering) {
    // If a rendering has a `dataSource` value (which should be a guid), then use that value for the
    // transformed rendering `dataSource` value instead of the default `available-in-connected-mode` value.
    // This is primarily to accommodate personalization testing in disconnected mode with _actual_
    // Layout Service data that was captured from Sitecore but is being used in disconnected mode.
    if (rendering.dataSource.dataSource) {
        transformedRendering.dataSource = rendering.dataSource.dataSource;
    }
    return transformedRendering;
};
//# sourceMappingURL=disconnectedModeMiddleware.js.map