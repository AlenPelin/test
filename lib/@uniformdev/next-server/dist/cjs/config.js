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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var common_1 = require("@uniformdev/common");
var common_server_1 = require("@uniformdev/common-server");
function config(_a) {
    var _this = this;
    if (_a === void 0) { _a = {}; }
    var logger = _a.logger, nextConfig = __rest(_a, ["logger"]);
    nextConfig = nextConfig || {};
    var runtime = common_1.getBoolEnv(process.env, 'UNIFORM_IS_AT_RUNTIME', false);
    logger = logger || common_server_1.serverLogger;
    var ver = common_server_1.tryGetUniformVersion(logger);
    if (runtime && ver) {
        logger.info('Uniform version: ' + ver);
    }
    var config = common_server_1.parseUniformServerConfig(process.env, logger, runtime);
    console.debug = config.UNIFORM_OPTIONS_DEBUG ? console.info : function () { };
    var publicRuntimeConfig = __assign(__assign({}, (nextConfig.publicRuntimeConfig || {})), common_1.parseUniformConfig(process.env, runtime));
    nextConfig.env = __assign(__assign({}, (nextConfig.env || {})), { UNIFORM_BUILD_MODE: process.env.UNIFORM_BUILD_MODE || 'ssr' });
    process.env.UNIFORM_BUILD_MODE = nextConfig.env.UNIFORM_BUILD_MODE;
    // Keep the same build Id when we are creating a static website
    if (['export', 'publish'].includes(nextConfig.env.UNIFORM_BUILD_MODE)) {
        nextConfig.generateBuildId = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, 'uniform-build'];
        }); }); };
    }
    if (nextConfig.env.UNIFORM_BUILD_MODE === 'publish') {
        // TODO: we need to pass ticket as well, see where UNIFORM_API_URL is assigned
        nextConfig.distDir = ".temp/.next";
    }
    // Serve the local assets (css,js) from the serverUrl only
    // when in ssr mode, we don't want this for static export
    // this is needed for experience editor to request them
    // from the correct location
    logger.debug("Checking build mode (" + nextConfig.env.UNIFORM_BUILD_MODE + ") and asset prefix (" + process.env.UNIFORM_SSR_ASSET_PREFIX + ")");
    if (nextConfig.env.UNIFORM_BUILD_MODE === 'ssr' && process.env.UNIFORM_SSR_ASSET_PREFIX) {
        nextConfig.assetPrefix = process.env.UNIFORM_SSR_ASSET_PREFIX;
    }
    logger.info('publicRuntimeConfig: ' + JSON.stringify(publicRuntimeConfig));
    return Object.assign(nextConfig, 
    // these properties are forced by the uniform config
    {
        publicRuntimeConfig: publicRuntimeConfig,
    }, 
    // enforce `trailingSlash:true`
    {
        trailingSlash: true,
    });
}
exports.config = config;
//# sourceMappingURL=config.js.map