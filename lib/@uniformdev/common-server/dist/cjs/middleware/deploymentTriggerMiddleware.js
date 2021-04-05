"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicketlessDeploymentTriggerMiddleware = exports.getTicketDeploymentTriggerMiddleware = exports.attachTicketlessDeploymentTriggerMiddleware = exports.attachTicketDeploymentTriggerMiddleware = exports.attachDeploymentTriggerMiddleware = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var body_parser_1 = __importDefault(require("body-parser"));
var Status_1 = require("../Status");
var BuildDeployService_1 = require("../BuildDeployService");
var __1 = require("..");
function attachDeploymentTriggerMiddleware(server, buildAndExportEngine, createPublishProvider, tempDir, uniformConfig, logger) {
    attachTicketDeploymentTriggerMiddleware(server, buildAndExportEngine, createPublishProvider, tempDir, uniformConfig, logger);
    attachTicketlessDeploymentTriggerMiddleware(server, buildAndExportEngine, createPublishProvider, tempDir, uniformConfig, logger);
}
exports.attachDeploymentTriggerMiddleware = attachDeploymentTriggerMiddleware;
function attachTicketDeploymentTriggerMiddleware(server, buildAndExportEngine, createPublishProvider, tempDir, uniformConfig, logger) {
    var jsonBodyParser = body_parser_1.default.json({ limit: '50mb' });
    server.post('/uniform/api/deployment/start/:ticket', jsonBodyParser, getTicketDeploymentTriggerMiddleware(buildAndExportEngine, createPublishProvider, tempDir, uniformConfig, logger));
}
exports.attachTicketDeploymentTriggerMiddleware = attachTicketDeploymentTriggerMiddleware;
function attachTicketlessDeploymentTriggerMiddleware(server, buildAndExportEngine, createPublishProvider, tempDir, uniformConfig, logger) {
    var jsonBodyParser = body_parser_1.default.json({ limit: '50mb' });
    server.post('/uniform/api/deployment/start', jsonBodyParser, getTicketlessDeploymentTriggerMiddleware(buildAndExportEngine, createPublishProvider, tempDir, uniformConfig, logger));
}
exports.attachTicketlessDeploymentTriggerMiddleware = attachTicketlessDeploymentTriggerMiddleware;
function getTicketDeploymentTriggerMiddleware(buildAndExportEngine, createPublishProvider, tempDir, uniformConfig, logger) {
    var token = uniformConfig.UNIFORM_API_TOKEN;
    return function (req, res) {
        var _a;
        var ticket = req.params.ticket;
        logger.info('Received deploy request: ' + ticket);
        var mergedUniformConfig = mergeUniformConfig(uniformConfig, (_a = req.body) === null || _a === void 0 ? void 0 : _a.env, logger);
        if (token && (req.query['uniform_token'] || req.query['token']) !== token) {
            res.sendStatus(401);
            logger.warn('Unauthorized request has been rejected');
            return;
        }
        var outputDir = tempDir + "/" + ticket;
        if (outputDir.length > 2 && outputDir[1] !== ':') {
            outputDir = path_1.default.resolve(outputDir);
        }
        Status_1.Status.writeStatus(outputDir, { status: 'In progress', message: 'Pending' });
        Status_1.Status.writeTimer(outputDir);
        var timer = Status_1.Status.createTimer(outputDir);
        var publishProvider = createPublishProvider({
            config: mergedUniformConfig,
            logger: logger,
        });
        // IMPORTANT! NO AWAIT because it is background operation
        BuildDeployService_1.BuildDeployService.process(tempDir, buildAndExportEngine, publishProvider, outputDir, req.body.paths, timer, mergedUniformConfig, logger, req.body.timestamp);
        res.json(ticket);
    };
}
exports.getTicketDeploymentTriggerMiddleware = getTicketDeploymentTriggerMiddleware;
function getTicketlessDeploymentTriggerMiddleware(buildAndExportEngine, createPublishProvider, tempDir, uniformConfig, logger) {
    var token = uniformConfig.UNIFORM_API_TOKEN;
    return function (req, res) {
        var _a;
        logger.info('Received deploy request.');
        var mergedUniformConfig = mergeUniformConfig(uniformConfig, (_a = req.body) === null || _a === void 0 ? void 0 : _a.env, logger);
        if (token && (req.query['uniform_token'] || req.query['token']) !== token) {
            res.sendStatus(401);
            logger.warn('Unauthorized request has been rejected');
            return;
        }
        // generate next shortest ticket (important to make it short to avoid long-path issues)
        var ticket;
        var outputDir;
        var last = -1;
        var lastTicketFileName = tempDir + '/last-ticket.txt';
        if (fs_1.default.existsSync(lastTicketFileName)) {
            last = parseInt(fs_1.default.readFileSync(lastTicketFileName).toString(), 36);
        }
        for (var ticketDecimal = last + 1;; ticketDecimal++) {
            ticket = ticketDecimal.toString(36);
            outputDir = tempDir + '/' + ticket;
            if (!fs_1.default.existsSync(outputDir)) {
                break;
            }
        }
        fs_1.default.writeFileSync(lastTicketFileName, ticket);
        if (outputDir.length > 2 && outputDir[1] !== ':') {
            outputDir = path_1.default.resolve(outputDir);
        }
        var paths = req.body.paths;
        if (!Array.isArray(paths)) {
            res.status(400).send('The request must have Content-Type: application/json, and the body must contain JSON object with "paths" property that holds array of path strings (["about", "about/company", ...]) to publish; to publish whole site send empty array');
            return;
        }
        var timestamp = req.body.timestamp;
        if (!timestamp) {
            res.status(400).send('The request must have Content-Type: application/json, and the body must contain JSON object with "timestamp" property with current UTC datetime in ISO format');
            return;
        }
        Status_1.Status.writeStatus(outputDir, { status: 'In progress', message: 'Pending' });
        Status_1.Status.writeTimer(outputDir);
        var timer = Status_1.Status.createTimer(outputDir);
        var publishProvider = createPublishProvider({
            config: mergedUniformConfig,
            logger: logger,
        });
        // IMPORTANT! NO AWAIT because it is background operation
        // TODO: pull ticket file creation from the process method
        BuildDeployService_1.BuildDeployService.process(tempDir, buildAndExportEngine, publishProvider, outputDir, paths, timer, mergedUniformConfig, logger, timestamp);
        res.json(ticket);
    };
}
exports.getTicketlessDeploymentTriggerMiddleware = getTicketlessDeploymentTriggerMiddleware;
function mergeUniformConfig(uniformConfig, configDelta, logger) {
    if (!configDelta) {
        return uniformConfig;
    }
    logger.info('Deploy request contains ENV variables: config will be merged for the current deploy request');
    var delta = __assign({}, configDelta);
    // ensure we do not override API token
    delete delta.UNIFORM_API_TOKEN;
    logger.info('ENV delta: ' + JSON.stringify(delta));
    var mergedEnv = __assign(__assign({}, uniformConfig.env), delta);
    var mergedConfig = __1.parseUniformServerConfig(mergedEnv, logger);
    return mergedConfig;
}
//# sourceMappingURL=deploymentTriggerMiddleware.js.map