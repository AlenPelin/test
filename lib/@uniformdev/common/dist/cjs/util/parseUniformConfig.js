"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUniformConfig = void 0;
var __1 = require("..");
function parseUniformConfig(env, runtime) {
    if (runtime === void 0) { runtime = true; }
    var UNIFORM_API_URL = __1.getEnv(env, 'UNIFORM_API_URL', runtime ? undefined : '');
    var UNIFORM_API_SITENAME = __1.getEnv(env, 'UNIFORM_API_SITENAME', runtime ? undefined : '');
    var UNIFORM_CONTENT_URL = __1.getEnv(env, 'UNIFORM_CONTENT_URL', UNIFORM_API_URL);
    var UNIFORM_API_MAPSERVICE = __1.getEnv(env, 'UNIFORM_API_MAPSERVICE', '/uniform/api/content/${UNIFORM_API_SITENAME}/map');
    var UNIFORM_OPTIONS_PREVIEW = __1.getBoolEnv(env, 'UNIFORM_OPTIONS_PREVIEW', true);
    var UNIFORM_OPTIONS_DEBUG = __1.getBoolEnv(env, 'UNIFORM_OPTIONS_DEBUG', false);
    var UNIFORM_OPTIONS_PREFETCH_LINKS = __1.getBoolEnv(env, 'UNIFORM_OPTIONS_PREFETCH_LINKS', false);
    return {
        UNIFORM_API_URL: UNIFORM_API_URL,
        UNIFORM_API_SITENAME: UNIFORM_API_SITENAME,
        UNIFORM_CONTENT_URL: UNIFORM_CONTENT_URL,
        UNIFORM_API_MAPSERVICE: UNIFORM_API_MAPSERVICE,
        UNIFORM_OPTIONS_PREVIEW: UNIFORM_OPTIONS_PREVIEW,
        UNIFORM_OPTIONS_DEBUG: UNIFORM_OPTIONS_DEBUG,
        UNIFORM_OPTIONS_PREFETCH_LINKS: UNIFORM_OPTIONS_PREFETCH_LINKS,
    };
}
exports.parseUniformConfig = parseUniformConfig;
//# sourceMappingURL=parseUniformConfig.js.map