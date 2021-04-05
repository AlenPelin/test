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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDisconnectedExportPathMap = void 0;
var sitecore_jss_dev_tools_1 = require("@sitecore-jss/sitecore-jss-dev-tools");
var common_server_1 = require("@uniformdev/common-server");
var next_1 = require("@uniformdev/next");
exports.getDisconnectedExportPathMap = function (_a) {
    var _b = _a.rootPath, rootPath = _b === void 0 ? process.cwd() : _b;
    return function (defaultPathMap) { return __awaiter(void 0, void 0, void 0, function () {
        function generateManifestPathMap(route, parentPath, params, depth) {
            if (depth === void 0) { depth = 0; }
            // first/initial route should resolve to `/` instead of a named route.
            // i.e. we don't want `/home`, we just want `/` for the first/initial route.
            var routeName = depth === 0 ? '' : route.name;
            var routePath = "" + urlJoin(parentPath, routeName).toLowerCase();
            manifestPathMap[routePath] = {
                page: '/index',
            };
            // traverse the route tree
            if (route.children) {
                route.children.forEach(function (child) {
                    generateManifestPathMap(child, routePath, params, (depth += 1));
                });
            }
        }
        var _a, jssAppName, defaultLanguage, appLanguages, manifestPathMap, manifestManager, index, root, nonManifestPathMap, resolvedPathMap, appLanguages_1, appLanguages_1_1, language, manifest, _b, _c, _d, key, value, pathWithLanguage, manifestPath, e_1_1, language, manifest, error_1;
        var e_1, _e, e_2, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    common_server_1.serverLogger.debug('Getting disconnected export path map');
                    _a = next_1.getNextServerConfig(), jssAppName = _a.jssAppName, defaultLanguage = _a.defaultLanguage, appLanguages = _a.appLanguages;
                    manifestPathMap = {};
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 13, , 14]);
                    manifestManager = new sitecore_jss_dev_tools_1.ManifestManager({
                        appName: jssAppName,
                        rootPath: rootPath,
                    });
                    index = defaultPathMap["/index"], root = defaultPathMap["/"], nonManifestPathMap = __rest(defaultPathMap, ['/index', '/']);
                    resolvedPathMap = {};
                    if (!(Array.isArray(appLanguages) && appLanguages.length > 1)) return [3 /*break*/, 10];
                    _g.label = 2;
                case 2:
                    _g.trys.push([2, 7, 8, 9]);
                    appLanguages_1 = __values(appLanguages), appLanguages_1_1 = appLanguages_1.next();
                    _g.label = 3;
                case 3:
                    if (!!appLanguages_1_1.done) return [3 /*break*/, 6];
                    language = appLanguages_1_1.value;
                    return [4 /*yield*/, manifestManager.getManifest(language)];
                case 4:
                    manifest = _g.sent();
                    // Prefix manifest routes with language name
                    generateManifestPathMap(manifest.items.routes[0], "/" + language);
                    try {
                        // `nonManifestPathMap` entries will not have a language prefix, so we iterate the paths and
                        // add a language prefix where possible.
                        for (_b = (e_2 = void 0, __values(Object.entries(nonManifestPathMap))), _c = _b.next(); !_c.done; _c = _b.next()) {
                            _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                            pathWithLanguage = "" + urlJoin(language, key);
                            manifestPath = manifestPathMap[pathWithLanguage];
                            // If the generated path map already contains the constructed `{language}/{path}` key, use it
                            // instead of the default/nonManifest path.
                            if (manifestPath) {
                                continue;
                            }
                            manifestPathMap[pathWithLanguage] = value;
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_f = _b.return)) _f.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    _g.label = 5;
                case 5:
                    appLanguages_1_1 = appLanguages_1.next();
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 9];
                case 8:
                    try {
                        if (appLanguages_1_1 && !appLanguages_1_1.done && (_e = appLanguages_1.return)) _e.call(appLanguages_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 9:
                    resolvedPathMap = manifestPathMap;
                    return [3 /*break*/, 12];
                case 10:
                    language = defaultLanguage;
                    return [4 /*yield*/, manifestManager.getManifest(language)];
                case 11:
                    manifest = _g.sent();
                    generateManifestPathMap(manifest.items.routes[0], "/");
                    // Merged the `nonManifestPathMap` with the generated path map.
                    // Duplicate path keys will be overwritten by the generated path map.
                    resolvedPathMap = __assign(__assign({}, nonManifestPathMap), manifestPathMap);
                    _g.label = 12;
                case 12: return [2 /*return*/, resolvedPathMap];
                case 13:
                    error_1 = _g.sent();
                    common_server_1.serverLogger.error(error_1);
                    return [2 /*return*/, {}];
                case 14: return [2 /*return*/];
            }
        });
    }); };
};
function urlJoin() {
    var parts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
    }
    // Trim each part to remove slashes (leading or trailing), then join the parts using a slash.
    var joinedParts = parts.map(function (part) { return trim(part, '/'); }).join('/');
    // Trim any extraneous slashes from the joined parts, then prefix the result with a slash
    // to ensure a leading slash.
    return "/" + trim(joinedParts, '/');
}
function trim(str, char) {
    function getSliceStartIndex(str1) {
        var startCharIndex = -1;
        while (str1.charAt(++startCharIndex) === char)
            ;
        return startCharIndex;
    }
    function getSliceEndIndex(str1) {
        var endCharIndex = str1.length;
        while (str1.charAt(--endCharIndex) === char)
            ;
        return endCharIndex + 1;
    }
    return str.slice(getSliceStartIndex(str), getSliceEndIndex(str));
}
//# sourceMappingURL=exportPathMap.js.map