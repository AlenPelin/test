import { readFileSync, existsSync, } from 'fs';
import { tryGetUniformVersion } from '..';
export function attachStatusMiddleware(server, uniformConfig, logger) {
    server.get('/uniform/api/service/status', getStatusMiddleware(uniformConfig, logger));
}
export function getStatusMiddleware(uniformConfig, logger) {
    var token = uniformConfig.UNIFORM_API_TOKEN;
    return function (req, res) {
        logger.info('Received service status (and version) request');
        if (token && req.query['token'] !== token) {
            res.sendStatus(401);
            logger.warn('Unauthorized request has been rejected');
            return;
        }
        var app = tryGetAppInfo(logger);
        res.json({ status: 'ready', version: tryGetUniformVersion(logger) || 'unknown', appVersion: (app === null || app === void 0 ? void 0 : app.version) || '', appDescription: (app === null || app === void 0 ? void 0 : app.description) || '' });
    };
}
export function tryGetAppInfo(logger) {
    var packageFilePath = './package.json';
    if (!existsSync(packageFilePath)) {
        return null;
    }
    try {
        return JSON.parse(readFileSync(packageFilePath).toString());
    }
    catch (ex) {
        logger.error('Failed to deserialize file: ' + packageFilePath);
        throw ex;
    }
}
//# sourceMappingURL=statusMiddleware.js.map