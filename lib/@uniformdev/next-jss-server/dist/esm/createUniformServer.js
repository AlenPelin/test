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
import next from 'next';
// @ts-ignore
import cors from 'cors';
import express from 'express';
import { attachJssRenderingHostMiddleware } from './renderingHost/attachJssRenderingHostMiddleware';
import { attachDisconnectedServices } from './disconnectedService';
import { attachUniformServicesToServer, parseUniformServerConfig, serverLogger, } from '@uniformdev/common-server';
import { NextBuildAndExportEngine } from '@uniformdev/next-server';
import { getNextServerConfig } from '@uniformdev/next';
export function createUniformServer(_a) {
    var _b = _a.dev, dev = _b === void 0 ? process.env.NODE_ENV !== 'production' : _b, _c = _a.jssMode, jssMode = _c === void 0 ? process.env.JSS_MODE || 'connected' : _c, _d = _a.port, port = _d === void 0 ? 3000 : _d, serverUrl = _a.serverUrl, createPublishProvider = _a.createPublishProvider;
    return __awaiter(this, void 0, void 0, function () {
        var app, defaultRequestHandler, server, uniformServerConfig, buildAndExportEngine, options;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    // Serve the local assets (css,js) from the serverUrl only
                    // when in ssr mode, we don't want this for static export
                    // this is needed for experience editor to request them
                    // from the correct location
                    process.env.UNIFORM_SSR_ASSET_PREFIX = serverUrl;
                    app = next({ dev: dev });
                    defaultRequestHandler = app.getRequestHandler();
                    return [4 /*yield*/, app.prepare()];
                case 1:
                    _e.sent();
                    server = express();
                    server.use(cors());
                    server.use(express.static('public'));
                    attachJssRenderingHostMiddleware(server, app);
                    if (!(jssMode === 'disconnected')) return [3 /*break*/, 3];
                    return [4 /*yield*/, attachDisconnectedServices(server, getNextServerConfig())];
                case 2:
                    _e.sent();
                    _e.label = 3;
                case 3:
                    uniformServerConfig = parseUniformServerConfig(process.env, serverLogger);
                    buildAndExportEngine = new NextBuildAndExportEngine();
                    options = {
                        uniformServerConfig: uniformServerConfig,
                        createPublishProvider: createPublishProvider,
                    };
                    attachUniformServicesToServer(server, buildAndExportEngine, serverLogger, options);
                    // We have to wrap defaultRequestHandler because it doesn't
                    // have the same function signature as an express RequestHandler
                    server.use(function (req, res) { return defaultRequestHandler(req, res); });
                    server.listen(port, function (err) {
                        if (err)
                            throw err;
                        console.log("> Ready on " + serverUrl);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=createUniformServer.js.map