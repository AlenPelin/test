"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzurePublishProvider = void 0;
var azure_storage_1 = __importDefault(require("azure-storage"));
var common_1 = require("@uniformdev/common");
var common_server_1 = require("@uniformdev/common-server");
var util_1 = __importDefault(require("util"));
var child_process_1 = __importDefault(require("child_process"));
var exec = util_1.default.promisify(child_process_1.default.exec);
var path_1 = require("path");
var fs_1 = require("fs");
var AzurePublishProvider = /** @class */ (function (_super) {
    __extends(AzurePublishProvider, _super);
    function AzurePublishProvider(_a) {
        var config = _a.config, _b = _a.logger, logger = _b === void 0 ? common_server_1.serverLogger : _b;
        var _this = _super.call(this, common_1.getEnv(config.env, 'AZURE_FILE', 'azure.config.json'), logger) || this;
        logger.info('Initializing AzurePublishProvider');
        _this.container = common_1.getEnv(config.env, 'AZURE_CONTAINER');
        _this.connectionString = common_1.getEnv(config.env, 'AZURE_STORAGE_CONNECTION_STRING', '');
        _this.accessKey = common_1.getEnv(config.env, 'AZURE_STORAGE_ACCESS_KEY', '');
        _this.accountName = common_1.getEnv(config.env, 'AZURE_STORAGE_ACCOUNT', '');
        _this.azureTargetUrlWithSAS = common_1.getEnv(config.env, 'AZURE_TARGET_URL_WITH_SAS', '');
        _this.azureFallbackEnabled = common_1.getEnv(config.env, 'AZURE_FALLBACK_ENABLED', '1');
        var az1 = common_1.getEnv(config.env, 'AZCOPY_PATH', '');
        var az2 = common_1.getEnv(config.env, 'UNIFORM_PUBLISH_PROVIDER_AZUREBLOB_AZCOPY_PATH', '');
        if (az1 && az2) {
            throw new Error('Both AZCOPY_PATH and UNIFORM_PUBLISH_PROVIDER_AZUREBLOB_AZCOPY_PATH are defined which is not supported, only one can be defined at a time.');
        }
        var azcopyPath = az1;
        if (azcopyPath) {
            if (!fs_1.existsSync(azcopyPath)) {
                throw new Error('The AZCOPY_PATH env variable points to file that does not exist: ' + azcopyPath);
            }
        }
        else {
            azcopyPath = az2;
            if (azcopyPath) {
                if (!fs_1.existsSync(azcopyPath)) {
                    throw new Error('The UNIFORM_PUBLISH_PROVIDER_AZUREBLOB_AZCOPY_PATH env variable points to file that does not exist: ' +
                        azcopyPath);
                }
            }
            else {
                throw new Error('Neither AZCOPY_PATH nor UNIFORM_PUBLISH_PROVIDER_AZUREBLOB_AZCOPY_PATH are defined, at least one of them must be defined.');
            }
        }
        _this.azcopyPath = azcopyPath;
        _this.blobService = _this.createBlobService() || common_1.throwException('FATAL Cannot create blob service');
        return _this;
    }
    Object.defineProperty(AzurePublishProvider.prototype, "behavior", {
        get: function () {
            return 'update-on-deploy';
        },
        enumerable: false,
        configurable: true
    });
    AzurePublishProvider.prototype.createBlobService = function () {
        if (this.connectionString) {
            return azure_storage_1.default.createBlobService(this.connectionString);
        }
        if (this.accessKey && this.accountName) {
            return azure_storage_1.default.createBlobService(this.accountName, this.accessKey);
        }
        return azure_storage_1.default.createBlobService();
    };
    AzurePublishProvider.prototype.enableWebSite = function () {
        return __awaiter(this, void 0, void 0, function () {
            var blobService, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blobService = this.blobService;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                blobService.setServiceProperties({ StaticWebsite: { Enabled: true, IndexDocument: 'index.html' } }, function (error) {
                                    if (error)
                                        reject(error);
                                    resolve({ message: 'Site was enabled.' });
                                });
                            }).then(function (result) { return _this.logger.info(result); })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.logger.error(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AzurePublishProvider.prototype.createContainerIfNotExist = function () {
        return __awaiter(this, void 0, void 0, function () {
            var blobService, container, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blobService = this.blobService;
                        container = this.container;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                blobService.createContainerIfNotExists(container, { publicAccessLevel: 'private' }, function (err) {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve({ message: "Container '" + container + "' created" });
                                    }
                                });
                            }).then(function (result) { return _this.logger.info(result); })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AzurePublishProvider.prototype.deploy = function (rootPath) {
        return __awaiter(this, void 0, void 0, function () {
            var container, logger, target, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rootPath = common_1.trimEnd(rootPath, '/');
                        rootPath = common_1.trimEnd(rootPath, '\\');
                        return [4 /*yield*/, this.createContainerIfNotExist()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.enableWebSite()];
                    case 2:
                        _a.sent();
                        container = this.container;
                        logger = this.logger;
                        return [4 /*yield*/, this.createAuthenticatedContainerUrl(container)];
                    case 3:
                        target = _a.sent();
                        logger.info("Start uploading file to azure. container: " + this.container + ", folder: " + rootPath);
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 8]);
                        return [4 /*yield*/, this.deployUsingAzCopy(rootPath, target)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        err_1 = _a.sent();
                        if (this.azureFallbackEnabled.trim() == '0') {
                            throw err_1;
                        }
                        logger.error("Failed to upload using azcopy, retrying using fallback logic. " + err_1);
                        return [4 /*yield*/, this.deployUsingJavaScriptSDK(rootPath)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 8:
                        logger.info('AzurePublishProvider deployed site files: ' + rootPath);
                        return [2 /*return*/];
                }
            });
        });
    };
    AzurePublishProvider.prototype.createAuthenticatedContainerUrl = function (container) {
        return __awaiter(this, void 0, void 0, function () {
            var policy, sas, containerUrl;
            return __generator(this, function (_a) {
                if (this.azureTargetUrlWithSAS) {
                    return [2 /*return*/, this.azureTargetUrlWithSAS];
                }
                policy = {
                    AccessPolicy: {
                        ServiceVersion: '2019-02-02',
                        // the order of permissions must be: read add create write delete list
                        Permissions: azure_storage_1.default.BlobUtilities.SharedAccessPermissions.READ +
                            // @ts-ignore
                            azure_storage_1.default.BlobUtilities.SharedAccessPermissions.ADD +
                            // @ts-ignore
                            azure_storage_1.default.BlobUtilities.SharedAccessPermissions.CREATE +
                            azure_storage_1.default.BlobUtilities.SharedAccessPermissions.WRITE +
                            azure_storage_1.default.BlobUtilities.SharedAccessPermissions.DELETE +
                            azure_storage_1.default.BlobUtilities.SharedAccessPermissions.LIST,
                        Start: new Date(0),
                        Expiry: new Date(Date.now() + 10 * 60 * 60 * 1000),
                        Protocols: 'https',
                    },
                };
                sas = this.blobService.generateSharedAccessSignature(container, '', policy);
                containerUrl = this.blobService.getUrl(container, '', sas);
                return [2 /*return*/, containerUrl];
            });
        });
    };
    AzurePublishProvider.prototype.deployUsingAzCopy = function (source, target) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceIsDir, targetIsDir, command, _a, stdout, stderr, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sourceIsDir = !source.startsWith('http://') && !source.startsWith('https://');
                        targetIsDir = !target.startsWith('http://') && !target.startsWith('https://');
                        if (sourceIsDir && targetIsDir) {
                            throw new Error('Both source and target are local directories which is not supported');
                        }
                        else if (sourceIsDir) {
                            if (!fs_1.existsSync(source)) {
                                throw new Error('The source is a local directory and it does not exit: ' + source);
                            }
                            else {
                                source = common_1.trimEnd(common_1.replace(source, '\\', '/'), '/') + '/*';
                                if (process.platform == 'win32') {
                                    source = common_1.replace(source, '/', '\\');
                                }
                            }
                        }
                        else if (targetIsDir) {
                            if (!fs_1.existsSync(target)) {
                                throw new Error('The target is a local directory and it does not exit: ' + target);
                            }
                            else {
                                target = common_1.trimEnd(common_1.replace(target, '\\', '/'), '/') + '/*';
                                if (process.platform == 'win32') {
                                    source = common_1.replace(source, '/', '\\');
                                }
                            }
                        }
                        command = process.platform == 'win32'
                            ? "\"" + this.azcopyPath + "\" copy \"" + source + "\" \"" + target + "\" --recursive --overwrite true"
                            : "'" + this.azcopyPath + "' copy '" + source + "' '" + target + "' --recursive --overwrite true";
                        console.log('Exec: ' + command);
                        return [4 /*yield*/, exec(command, {
                                cwd: '.',
                                maxBuffer: 20 * 1024 * 1024,
                            })];
                    case 1:
                        _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                        message = stdout.indexOf('Final Job Status: Completed') >= 0
                            ? 'success'
                            : 'fail, stdout: ' + stdout + ', stderr: ' + stderr;
                        if (message !== 'success') {
                            throw new Error('Exporting has failed. Message: ' + message + ', stdout: ' + stdout + ', stderr: ' + stderr);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AzurePublishProvider.prototype.deployUsingJavaScriptSDK = function (rootPath) {
        return __awaiter(this, void 0, void 0, function () {
            function walkSync(currentDirPath, callback) {
                return __awaiter(this, void 0, void 0, function () {
                    var files, promises, files_1, files_1_1, file, filePath, stat, e_1_1;
                    var e_1, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, fs_1.readdirSync(currentDirPath)];
                            case 1:
                                files = _b.sent();
                                promises = [];
                                _b.label = 2;
                            case 2:
                                _b.trys.push([2, 9, 10, 11]);
                                files_1 = __values(files), files_1_1 = files_1.next();
                                _b.label = 3;
                            case 3:
                                if (!!files_1_1.done) return [3 /*break*/, 8];
                                file = files_1_1.value;
                                filePath = path_1.join(currentDirPath, file);
                                return [4 /*yield*/, fs_1.statSync(filePath)];
                            case 4:
                                stat = _b.sent();
                                if (!stat.isFile()) return [3 /*break*/, 5];
                                promises.push(callback(filePath, stat));
                                return [3 /*break*/, 7];
                            case 5:
                                if (!stat.isDirectory()) return [3 /*break*/, 7];
                                return [4 /*yield*/, walkSync(filePath, callback)];
                            case 6:
                                _b.sent();
                                _b.label = 7;
                            case 7:
                                files_1_1 = files_1.next();
                                return [3 /*break*/, 3];
                            case 8: return [3 /*break*/, 11];
                            case 9:
                                e_1_1 = _b.sent();
                                e_1 = { error: e_1_1 };
                                return [3 /*break*/, 11];
                            case 10:
                                try {
                                    if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                                return [7 /*endfinally*/];
                            case 11: 
                            //wait until all files from directory will be uploaded
                            return [4 /*yield*/, Promise.all(promises)];
                            case 12:
                                //wait until all files from directory will be uploaded
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
            var blobService, container, logger;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rootPath = common_1.trimEnd(rootPath, '/');
                        rootPath = common_1.trimEnd(rootPath, '\\');
                        blobService = this.blobService;
                        container = this.container;
                        logger = this.logger;
                        logger.info("Start uploading file to azure. container: " + this.container + ", folder: " + rootPath);
                        logger.info("Start uploading file to azure. container: " + this.container + ", folder: " + rootPath);
                        return [4 /*yield*/, walkSync(rootPath, function (filePath) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var localPath, azurePath, createResult;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                localPath = filePath.replace(/\\/g, '/');
                                                azurePath = localPath.substring(rootPath.length + 1);
                                                return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                        blobService.createBlockBlobFromLocalFile(container, azurePath, localPath, function (error) {
                                                            if (error) {
                                                                reject(error);
                                                            }
                                                            resolve("Uploaded: " + azurePath + " (" + localPath + ")");
                                                        });
                                                    })];
                                            case 1:
                                                createResult = _a.sent();
                                                logger.debug(createResult);
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            })];
                    case 1:
                        _a.sent();
                        logger.info('AzurePublishProvider deployed site files: ' + rootPath);
                        return [2 /*return*/];
                }
            });
        });
    };
    return AzurePublishProvider;
}(common_server_1.PublishProviderWithLocalJsonDatabase));
exports.AzurePublishProvider = AzurePublishProvider;
//# sourceMappingURL=AzurePublishProvider.js.map