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
import { existsSync } from 'fs';
import util from 'util';
import child_process from 'child_process';
import { getEnv } from '@uniformdev/common';
var exec = util.promisify(child_process.exec);
export function buildAndExport(outputDir, config, logger) {
    return __awaiter(this, void 0, void 0, function () {
        var clientRepoDir, threads, threadsSwitch, def, exportCommand, command1, apiUrl, sitename, _a, stdout, stderr, message;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    clientRepoDir = '.';
                    threads = getEnv(config.env, 'UNIFORM_PUBLISH_NEXT_EXPORT_THREADS', '');
                    threadsSwitch = threads ? " --threads " + threads : '';
                    def = existsSync('./node_modules/next/dist/bin/next')
                        ? 'node node_modules/next/dist/bin/next build && node node_modules/next/dist/bin/next export --outdir "__DIR__"' +
                            threadsSwitch
                        : 'npx next build && npx next export --outdir "__DIR__"' + threadsSwitch;
                    exportCommand = getEnv(config.env, 'UNIFORM_PUBLISH_NEXT_EXPORT_COMMAND', '').trim();
                    if (!exportCommand) {
                        logger.info('UNIFORM_PUBLISH_NEXT_EXPORT_COMMAND is not defined, so switching to default: ' + def);
                        exportCommand = def;
                    }
                    if (!false) return [3 /*break*/, 1];
                    return [3 /*break*/, 3];
                case 1:
                    if (!exportCommand.includes('__DIR__')) {
                        throw new Error('The UNIFORM_PUBLISH_NEXT_EXPORT_COMMAND setting does not contain the __DIR__ token that will be replaced with dir to export to');
                    }
                    command1 = exportCommand.replace(/__DIR__/g, outputDir);
                    apiUrl = config.UNIFORM_CONTENT_URL.toLowerCase();
                    logger.debug('set UNIFORM_API_URL=' + apiUrl);
                    sitename = config.UNIFORM_API_SITENAME;
                    logger.info('Starting custom exec nextjs export process (with UNIFORM_API_SITENAME = ' + sitename + ')');
                    logger.debug('Exec: ' + command1);
                    return [4 /*yield*/, exec(command1, {
                            env: __assign(__assign({}, config.env), { EXPORT_OUT_DIR: outputDir, UNIFORM_BUILD_MODE: 'publish', NODE_ENV: 'production', UNIFORM_OPTIONS_PREVIEW: '0', UNIFORM_OPTIONS_DEBUG: '0', UNIFORM_API_URL: apiUrl, UNIFORM_API_SITENAME: sitename }),
                            cwd: clientRepoDir,
                            maxBuffer: 20 * 1024 * 1024,
                        })];
                case 2:
                    _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                    message = stdout.indexOf('Export successful') >= 0
                        ? 'success'
                        : 'fail, stdout: ' + stdout + ', stderr: ' + stderr;
                    if (message !== 'success') {
                        throw new Error('Exporting has failed. Message: ' + message + ', stdout: ' + stdout + ', stderr: ' + stderr);
                    }
                    _b.label = 3;
                case 3:
                    logger.info('Exporting has succeeded.');
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=buildAndExport.js.map