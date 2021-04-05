var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { UniformServerMode } from '.';
import { createServer } from './createServer';
import { parseUniformServerConfig } from '.';
import { attachStatusMiddleware } from './middleware/statusMiddleware';
import { attachDeploymentStatusMiddleware } from './middleware/deploymentStatusMiddleware';
import { attachDeploymentTriggerMiddleware } from './middleware/deploymentTriggerMiddleware';
import { attachPreviewMiddleware } from './middleware/previewMiddleware';
import { attachMediaMiddleware } from './middleware/mediaMiddleware';
import { getTempDir } from './getTempDir';
import { BuildDeployService } from '.';
export function createUniformServer(buildAndExportEngine, logger, options) {
    return __awaiter(this, void 0, void 0, function () {
        var server;
        return __generator(this, function (_a) {
            logger.info('Server is being activated...');
            if (!options || !options.uniformServerConfig) {
                throw new Error('options argument is either missing or lacks uniformServerConfig property');
            }
            server = createServer(logger);
            attachUniformServicesToServer(server, buildAndExportEngine, logger, options);
            return [2 /*return*/, server];
        });
    });
}
export function attachUniformServicesToServer(server, buildAndExportEngine, logger, options) {
    var config = (options && options.uniformServerConfig) || parseUniformServerConfig(process.env, logger);
    if (config.UNIFORM_MODE !== UniformServerMode.publish) {
        attachPreviewMiddleware(server, config, logger);
        attachMediaMiddleware(server, config, logger);
    }
    if (config.UNIFORM_MODE === UniformServerMode.preview) {
        server.get([
            '/uniform/api/service/status',
            '/uniform/api/deployment/status',
            '/uniform/api/deployment/status/:ticket',
        ], function (_req, res) {
            var msg = 'The Uniform service is configured to be preview only, but it was attempted to be used for publishing. If this was intentional, set UNIFORM_MODE=mixed or UNIFORM_MODE=publish';
            logger.error(msg);
            res.status(500).send(msg);
            return;
        });
    }
    else {
        // publish or mixed
        var createPublishProvider = options && options.createPublishProvider;
        if (!createPublishProvider) {
            throw new Error('Publish provider factory is not defined. It is only allowed in preview mode.');
        }
        var publishProvider = createPublishProvider({
            config: config,
            logger: logger,
        });
        if (!publishProvider) {
            throw new Error("createPublishProvider hasn't passed validation.");
        }
        var tempDir = getTempDir(config);
        // the server is restarted so delete all tickets so if there's Uniform module waits for deploy to complete
        // it is notified that the job was interrupted
        // no await as it is a background task
        BuildDeployService.reset(tempDir, logger);
        // attach middlewares
        attachStatusMiddleware(server, config, logger);
        attachDeploymentStatusMiddleware(server, tempDir, config, logger);
        attachDeploymentTriggerMiddleware(server, buildAndExportEngine, createPublishProvider, tempDir, config, logger);
    }
    server.get(['/uniform/api/*'], function (_req, res) {
        var msg = 'Bad request';
        logger.error(msg);
        res.status(400).send(msg);
        return;
    });
}
export function startUniformServer(server, uniformServerConfig, logger) {
    // NOTE: when hosting on IIS (iisnode; on Windows or Azure), PORT may be named-pipe, not a number
    var port = uniformServerConfig.PORT;
    server.listen(port, function (err) {
        if (err) {
            throw err;
        }
        if (!uniformServerConfig.UNIFORM_OPTIONS_DEBUG) {
            logger.info('Uniform debug logging is disabled. UNIFORM_OPTIONS_DEBUG env variable is undefined or false.');
        }
        var isPreview = uniformServerConfig.UNIFORM_OPTIONS_PREVIEW;
        logger.info("Uniform preview is " + (isPreview ? 'enabled' : 'disabled') + ". UNIFORM_OPTIONS_PREVIEW env variable is " + (isPreview ? 'undefined or true' : 'false') + ".");
        logger.info("HTTP server is ready on port " + port);
    });
}
//# sourceMappingURL=uniformServer.js.map