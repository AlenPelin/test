"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextServerConfig = exports.getNextConfig = void 0;
var config_1 = __importDefault(require("next/config"));
var common_1 = require("@uniformdev/common");
function getNextConfig() {
    return (config_1.default() || common_1.throwException('config')).publicRuntimeConfig || common_1.throwException('throwException');
}
exports.getNextConfig = getNextConfig;
function getNextServerConfig() {
    return (config_1.default() || common_1.throwException('config')).serverRuntimeConfig || common_1.throwException('throwException');
}
exports.getNextServerConfig = getNextServerConfig;
//# sourceMappingURL=getNextConfig.js.map