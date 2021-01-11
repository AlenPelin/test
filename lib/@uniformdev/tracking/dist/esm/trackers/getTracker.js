'use strict';
import { getTrackingDataRepository } from '../repositories';
import { getStorageProvider } from '../storage';
import { getNullLogger } from '@uniformdev/common';
import { DefaultTracker } from './defaultTracker';
/**
 * This function is usually called by a custom tracker.
 * @param args - Settings that control the tracker that is retrieved.
 * @param args2 - Settings that control how this function works.
 */
export function getDefaultTracker(args, args2) {
    var _a;
    //
    //Get the logger.
    var logger = (_a = args2 === null || args2 === void 0 ? void 0 : args2.logger) !== null && _a !== void 0 ? _a : getNullLogger();
    //
    //Get the storage provider.
    var storageProvider = getStorageProvider(args.storage, args.getCustomStorageProvider, logger);
    if (!storageProvider) {
        logger.error("Tracker - No storage provider was resolved. This is required in order to create a tracker.", { settings: args });
        return undefined;
    }
    //
    //Get the repository.
    var repository = getTrackingDataRepository(storageProvider, {
        logger: logger,
        subscriptions: args.subscriptions
    });
    if (!repository) {
        logger.error("Tracker - No tracking data repository was resolved. This is required in order to create a tracker.", { settings: args });
        return undefined;
    }
    logger.debug("Tracker - Using repository type " + repository.type, repository);
    //
    //Get the session timeout value.
    if (!args.sessionTimeout || args.sessionTimeout < 0) {
        logger.debug("Tracker - Session timeout will be determined by the tracker.");
    }
    else {
        logger.debug("Tracker - Session timeout " + args.sessionTimeout + " minute(s).");
    }
    //
    //Create the tracker.
    var settings3 = {
        contextReaders: args.contextReaders,
        dispatchers: args.dispatchers,
        extensions: args.extensions,
        logger: logger,
        repository: repository,
        sessionTimeout: args.sessionTimeout,
        subscriptions: args.subscriptions
    };
    return new DefaultTracker(settings3);
}
//# sourceMappingURL=getTracker.js.map