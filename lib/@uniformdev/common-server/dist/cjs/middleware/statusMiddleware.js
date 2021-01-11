"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryGetAppInfo = exports.getStatusMiddleware = exports.attachStatusMiddleware = void 0;
var fs_1 = require("fs");
var __1 = require("..");
function attachStatusMiddleware(server, uniformConfig, logger) {
    server.get('/uniform/api/service/status', getStatusMiddleware(uniformConfig, logger));
}
exports.attachStatusMiddleware = attachStatusMiddleware;
function getStatusMiddleware(uniformConfig, logger) {
    var token = uniformConfig.UNIFORM_API_TOKEN;
    return function (req, res) {
        logger.info('Received service status (and version) request');
        if (token && req.query['token'] !== token) {
            res.sendStatus(401);
            logger.warn('Unauthorized request has been rejected');
            return;
        }
        var app = tryGetAppInfo(logger);
        res.json({ status: 'ready', version: __1.tryGetUniformVersion(logger) || 'unknown', appVersion: (app === null || app === void 0 ? void 0 : app.version) || '', appDescription: (app === null || app === void 0 ? void 0 : app.description) || '' });
    };
}
exports.getStatusMiddleware = getStatusMiddleware;
function tryGetAppInfo(logger) {
    var packageFilePath = './package.json';
    if (!fs_1.existsSync(packageFilePath)) {
        return null;
    }
    try {
        return JSON.parse(fs_1.readFileSync(packageFilePath).toString());
    }
    catch (ex) {
        logger.error('Failed to deserialize file: ' + packageFilePath);
        throw ex;
    }
}
exports.tryGetAppInfo = tryGetAppInfo;
//# sourceMappingURL=statusMiddleware.js.map