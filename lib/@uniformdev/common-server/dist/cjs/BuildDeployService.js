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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildDeployService = void 0;
var fs_1 = require("fs");
var del_1 = __importDefault(require("del"));
var common_1 = require("@uniformdev/common");
var _1 = require(".");
var _2 = require(".");
var _3 = require(".");
var BuildDeployService = /** @class */ (function () {
    function BuildDeployService() {
    }
    BuildDeployService.reset = function (tempDir, logger) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.info('Deleting ticket files to reset status of all publish jobs');
                        return [4 /*yield*/, del_1.default(tempDir + '/*.json')];
                    case 1:
                        _a.sent();
                        logger.info('Publish tickets were successfully deleted');
                        return [2 /*return*/];
                }
            });
        });
    };
    BuildDeployService.status = function (outputDir) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _2.Status.readStatus(outputDir)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // NOTE: prefix `req` with `_` to avoid TS complaining about unused parameters.
    BuildDeployService.process = function (tmp, buildAndExport, publishProvider, outputDir, paths, timer, config, logger, timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var map, publishMap_1, timestampDir, outDir, ex_1, ex_2, obj, ex_3, obj, ex_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 28, , 29]);
                        map = undefined;
                        if (!(paths && paths.length === 0)) return [3 /*break*/, 3];
                        // empty array really means no paths to be deployed
                        logger.warn('Deploy request does not contain any paths, downloading map...');
                        return [4 /*yield*/, _1.downloadSiteMap(config, logger)];
                    case 1:
                        map = _a.sent();
                        return [4 /*yield*/, _1.buildArrayOfPaths(map, logger)];
                    case 2:
                        paths = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (paths.length > 0 && publishProvider.behavior !== 'replace-on-deploy') {
                            publishMap_1 = {};
                            paths.forEach(function (path) {
                                var url = encodeURI(path);
                                logger.debug('Add publish map page "' + url + '"');
                                publishMap_1[url] = {
                                    page: '/index',
                                    query: {},
                                };
                            });
                            logger.info('Saving ' + tmp + '/.publish-map.json');
                            fs_1.writeFileSync(tmp + '/.publish-map.json', JSON.stringify(publishMap_1));
                        }
                        timestampDir = '';
                        outDir = outputDir;
                        if (publishProvider.behavior === 'update-on-deploy') {
                            timestampDir = outputDir + "/timestamp";
                            outDir = outputDir + "/out";
                        }
                        logger.info("Creating output dir: " + outputDir);
                        fs_1.mkdirSync(outputDir, { recursive: true });
                        logger.info('Starting export for ' + paths.length + ' page(s):\n' + paths.join("\n"));
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 10, , 11]);
                        if (!(paths.length <= 0)) return [3 /*break*/, 5];
                        _2.Status.writeStatus(outputDir, {
                            status: 'In progress',
                            message: 'Skip generating HTML site files (because no pages were changed since last publish)',
                        });
                        // the next export removes everything from the output folder so needs to be first
                        logger.info('Skip generating HTML site files (because no pages were changed since last publish)');
                        return [3 /*break*/, 9];
                    case 5:
                        _2.Status.writeStatus(outputDir, {
                            status: 'In progress',
                            message: 'Generating HTML site files',
                            total: paths.length + 2,
                        }); // 404.html and 404/index.html
                        // the next export removes everything from the output folder so needs to be first
                        logger.info('Starting build and export...');
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, buildAndExport.execute(outDir, config, logger)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        ex_1 = _a.sent();
                        logger.error('Failed to build or export app, so deploy process is interrupted.');
                        throw ex_1;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        ex_2 = _a.sent();
                        obj = {
                            status: 'Failed',
                            message: 'Failed to build and export site',
                            error: common_1.errorToJsonObject(ex_2),
                        };
                        logger.error(obj.message + '\r\n' + obj.error.stderr);
                        _2.Status.writeStatus(outputDir, obj);
                        clearInterval(timer);
                        return [2 /*return*/];
                    case 11:
                        _a.trys.push([11, 26, , 27]);
                        if (publishProvider.behavior !== 'update-on-deploy') {
                            _2.Status.writeStatus(outputDir, {
                                status: 'In progress',
                                message: 'Creating .timestamp.txt file',
                            });
                            logger.info('Creating .timestamp.txt file');
                            fs_1.writeFileSync(outDir + '/.timestamp.txt', JSON.stringify(timestamp));
                        }
                        logger.info('Starting deployment');
                        if (!(publishProvider.behavior !== 'replace-on-deploy')) return [3 /*break*/, 17];
                        _2.Status.writeStatus(outputDir, {
                            status: 'In progress',
                            message: 'Uploading site assets separately',
                        });
                        if (!fs_1.existsSync(outDir + '/static')) return [3 /*break*/, 14];
                        return [4 /*yield*/, publishProvider.deploy(outDir + '/static')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, del_1.default(outDir + '/static')];
                    case 13:
                        _a.sent();
                        return [3 /*break*/, 17];
                    case 14:
                        if (!fs_1.existsSync(outDir + '/public')) return [3 /*break*/, 17];
                        return [4 /*yield*/, publishProvider.deploy(outDir + '/public')];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, del_1.default(outDir + '/public')];
                    case 16:
                        _a.sent();
                        _a.label = 17;
                    case 17:
                        _2.Status.writeStatus(outputDir, {
                            status: 'In progress',
                            message: 'Uploading HTML site files',
                        });
                        return [4 /*yield*/, publishProvider.deploy(outDir)];
                    case 18:
                        _a.sent();
                        logger.info("Successfully deployed " + outDir + " folder");
                        if (!(publishProvider.behavior === 'update-on-deploy')) return [3 /*break*/, 20];
                        _2.Status.writeStatus(outputDir, {
                            status: 'In progress',
                            message: 'Creating .timestamp.txt file',
                        });
                        logger.info('Creating .timestamp.txt file');
                        fs_1.mkdirSync(timestampDir, { recursive: true });
                        fs_1.writeFileSync(timestampDir + '/.timestamp.txt', JSON.stringify(timestamp));
                        return [4 /*yield*/, publishProvider.deploy(timestampDir)];
                    case 19:
                        _a.sent();
                        _a.label = 20;
                    case 20:
                        _2.Status.writeStatus(outputDir, { status: 'Success', message: 'Deployment is complete' });
                        if (!(publishProvider !== undefined &&
                            !(publishProvider instanceof _3.FakePublishProvider) &&
                            !config.UNIFORM_OPTIONS_DEBUG)) return [3 /*break*/, 24];
                        logger.info('Deleting temp dir: ' + outDir);
                        return [4 /*yield*/, del_1.default([outDir])];
                    case 21:
                        _a.sent();
                        logger.info('Temp dir was deleted: ' + outDir);
                        if (!(publishProvider.behavior === 'update-on-deploy')) return [3 /*break*/, 23];
                        logger.info('Deleting temp dir: ' + timestampDir);
                        return [4 /*yield*/, del_1.default([timestampDir])];
                    case 22:
                        _a.sent();
                        logger.info('Temp dir was deleted: ' + timestampDir);
                        _a.label = 23;
                    case 23: return [3 /*break*/, 25];
                    case 24:
                        logger.debug('Skipping (due to debug mode or fake publish provider used) deleting temp dir: ' +
                            outputDir);
                        _a.label = 25;
                    case 25: return [3 /*break*/, 27];
                    case 26:
                        ex_3 = _a.sent();
                        obj = {
                            status: 'Failed',
                            message: 'Failed to deploy site',
                            error: common_1.errorToJsonObject(ex_3),
                        };
                        logger.error(obj);
                        _2.Status.writeStatus(outputDir, obj);
                        clearInterval(timer);
                        return [2 /*return*/];
                    case 27: return [3 /*break*/, 29];
                    case 28:
                        ex_4 = _a.sent();
                        logger.error('Unhandled error ' + JSON.stringify(common_1.errorToJsonObject(ex_4)));
                        if (timer) {
                            clearInterval(timer);
                        }
                        throw ex_4;
                    case 29: return [2 /*return*/];
                }
            });
        });
    };
    return BuildDeployService;
}());
exports.BuildDeployService = BuildDeployService;
//# sourceMappingURL=BuildDeployService.js.map