"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
var nuxt_1 = require("nuxt");
var common_server_1 = require("@uniformdev/common-server");
var _1 = require(".");
function server(_a) {
    var _this = this;
    var nuxtConfig = _a.config, logger = _a.logger, createPublishProvider = _a.createPublishProvider;
    if (!nuxtConfig) {
        throw new Error('config must be defined for `nuxt-server`');
    }
    if (!logger) {
        throw new Error('logger must be defined for `nuxt-server`');
    }
    var dev = process.env.NODE_ENV !== 'production';
    logger.info('NuxtJS is being activated...');
    // we accept config as an argument, so it may already have a value for `dev`
    // if `dev` is undefined, however, then set it accordingly.
    if (typeof nuxtConfig.dev === 'undefined') {
        nuxtConfig.dev = dev;
    }
    // instantiate nuxt with the resolved config
    var app = new nuxt_1.Nuxt(nuxtConfig);
    // get a reference to `Nuxt.render`, which is a middleware function
    // that can be used to handle/render routes in Express.
    // we don't need the handle here, but this is the same pattern used by in the `@uniformdev/next` package. Skip-Validate-PackagesDependenciesDeclarations
    // if we can share patterns, we can start extracting the common code to a separate package.
    var handle = app.render;
    // Build only in dev mode with hot-reloading
    var prepare = function () { return (dev ? new nuxt_1.Builder(app).build() : Promise.resolve()); };
    process.env.UNIFORM_IS_AT_RUNTIME = '1';
    var uniformServerConfig = common_server_1.parseUniformServerConfig(process.env, logger);
    // as with the `handle` code above, using the `prepare()` call to match the pattern used by next.
    prepare().then(function () { return __awaiter(_this, void 0, void 0, function () {
        var buildAndExportEngine, server;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buildAndExportEngine = new _1.NuxtBuildAndExportEngine();
                    return [4 /*yield*/, common_server_1.createUniformServer(buildAndExportEngine, logger, {
                            uniformServerConfig: uniformServerConfig,
                            createPublishProvider: createPublishProvider
                        })];
                case 1:
                    server = _a.sent();
                    server.get('*', function (req, res) {
                        var path = decodeURI(req.path) || '/';
                        // todo: consider an option to provide 'ignore' or 'exclude' route list via config.
                        if (path.startsWith('/_nuxt/') ||
                            path.startsWith('/__webpack_hmr') ||
                            path.startsWith('/_loading/') ||
                            path.startsWith('/__open-in-editor/')) {
                            return handle(req, res);
                        }
                        if (!/\/$|\.\w+$/g.exec(path)) {
                            // redirect if /foo and not /foo.png
                            res.redirect(req.path + '/', 302);
                            return;
                        }
                        logger.info('Incoming HTTP ' + req.method + ' ' + path);
                        try {
                            return handle(req, res);
                        }
                        catch (ex) {
                            logger.error('Failed to handle request\n' + JSON.stringify(ex));
                            return;
                        }
                    });
                    common_server_1.startUniformServer(server, uniformServerConfig, logger);
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.server = server;
