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
exports.getClientScriptLoader = void 0;
var common_1 = require("@uniformdev/common");
function getClientScriptLoader() {
    return {
        type: 'default',
        load: loadClientScripts,
    };
}
exports.getClientScriptLoader = getClientScriptLoader;
function loadClientScripts(scripts, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, cachedScripts, callback, _b, logger, ids, idsNotCached, promises, loadedScripts, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = args.cachedScripts, cachedScripts = _a === void 0 ? {} : _a, callback = args.callback, _b = args.logger, logger = _b === void 0 ? common_1.getNullLogger() : _b;
                    ids = Object.keys(scripts);
                    if (ids.length == 0) {
                        return [2 /*return*/, true];
                    }
                    idsNotCached = [];
                    ids.forEach(function (id) {
                        var cachedUrl = cachedScripts[id];
                        if (cachedUrl != scripts[id]) {
                            idsNotCached.push(id);
                        }
                    });
                    if (idsNotCached.length == 0) {
                        return [2 /*return*/, true];
                    }
                    promises = [];
                    idsNotCached.forEach(function (id) {
                        var url = scripts[id];
                        promises.push(load.js({ id: id, url: url }));
                    });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all(promises)];
                case 2:
                    loadedScripts = _c.sent();
                    loadedScripts.forEach(function (script) {
                        cachedScripts[script.id] = script.url;
                    });
                    if (callback) {
                        logger.debug('Client script loader - Scripts were loaded so invoking callback.', { scripts: scripts });
                        callback();
                    }
                    logger.debug('Client script loader - Finished loading scripts.', { scripts: loadedScripts });
                    return [2 /*return*/, true];
                case 3:
                    err_1 = _c.sent();
                    logger.error('Client script loader - Error while loading scripts.', { scripts: scripts });
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var load = (function () {
    return {
        css: _load('link'),
        js: _load('script'),
        img: _load('img'),
    };
})();
function _load(tag) {
    return function (script) {
        return new Promise(function (resolve, reject) {
            var element = document.createElement(tag);
            var parent = document.body;
            var attr = 'src';
            element.onload = function () {
                resolve(script);
            };
            element.onerror = function () {
                element.remove();
                reject(script);
            };
            switch (tag) {
                case 'script':
                    element.async = script.notAsync == true ? false : true;
                    parent = document.head;
                    break;
                case 'link':
                    element.type = 'text/css';
                    element.rel = 'stylesheet';
                    attr = 'href';
                    parent = document.head;
            }
            var attr2 = document.createAttribute(attr);
            attr2.value = script.url;
            element.attributes.setNamedItem(attr2);
            parent.appendChild(element);
        });
    };
}
//# sourceMappingURL=scriptLoader.js.map