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
exports.Status = void 0;
var fs_1 = require("fs");
var _1 = require(".");
var common_1 = require("@uniformdev/common");
function getStatusPath(outputDir) {
    return outputDir + '.json';
}
function getTimerPath(outputDir) {
    return outputDir + '-time.json';
}
var Status = /** @class */ (function () {
    function Status() {
    }
    Status.writeStatus = function (outputDir, obj) {
        fs_1.writeFileSync(getStatusPath(outputDir), JSON.stringify(obj));
    };
    Status.writeTimer = function (outputDir) {
        fs_1.writeFileSync(getTimerPath(outputDir), JSON.stringify(new Date().toJSON()));
    };
    Status.readStatus = function (outputDir) {
        return __awaiter(this, void 0, void 0, function () {
            var statusPath, timerPath, obj, time;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        statusPath = getStatusPath(outputDir);
                        timerPath = getTimerPath(outputDir);
                        obj = fs_1.existsSync(statusPath)
                            ? JSON.parse(fs_1.readFileSync(statusPath).toString())
                            : undefined;
                        time = fs_1.existsSync(timerPath) ? JSON.parse(fs_1.readFileSync(timerPath).toString()) : undefined;
                        if (!obj || !time) {
                            return [2 /*return*/, undefined];
                        }
                        if (!common_1.getBoolEnv(process.env, 'UNIFORM_EXPORT_PRECISE_PROGRESS_ENABLED', false)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Status.updateProgress(obj, outputDir)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        obj.time = time;
                        return [2 /*return*/, obj];
                }
            });
        });
    };
    Status.createTimer = function (outputDir) {
        return setInterval(function () {
            Status.writeTimer(outputDir);
        }, 1000);
    };
    Status.updateProgress = function (obj, outputDir) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(obj.total && obj.total > 0)) return [3 /*break*/, 6];
                        _a = obj.message;
                        switch (_a) {
                            case 'Generating HTML site files': return [3 /*break*/, 1];
                            case 'Generating revision .txt files': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1:
                        _b = obj;
                        return [4 /*yield*/, _1.countFiles(outputDir, '.html')];
                    case 2:
                        _b.processed = _d.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        _c = obj;
                        return [4 /*yield*/, _1.countFiles(outputDir, '.txt')];
                    case 4:
                        _c.processed = _d.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        if (obj.processed !== undefined && obj.processed !== null) {
                            obj.message +=
                                ', progress: ' +
                                    Math.round((obj.processed * 100) / obj.total) +
                                    '% (' +
                                    obj.processed +
                                    '/' +
                                    obj.total +
                                    ')';
                        }
                        _d.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return Status;
}());
exports.Status = Status;
//# sourceMappingURL=Status.js.map