import { getEnv, getBoolEnv } from '..';
export function parseUniformConfig(env, runtime) {
    if (runtime === void 0) { runtime = true; }
    var UNIFORM_API_URL = getEnv(env, 'UNIFORM_API_URL', runtime ? undefined : '');
    var UNIFORM_API_SITENAME = getEnv(env, 'UNIFORM_API_SITENAME', runtime ? undefined : '');
    var UNIFORM_CONTENT_URL = getEnv(env, 'UNIFORM_CONTENT_URL', UNIFORM_API_URL);
    var UNIFORM_API_MAPSERVICE = getEnv(env, 'UNIFORM_API_MAPSERVICE', '/uniform/api/content/${UNIFORM_API_SITENAME}/map');
    var UNIFORM_OPTIONS_PREVIEW = getBoolEnv(env, 'UNIFORM_OPTIONS_PREVIEW', true);
    var UNIFORM_OPTIONS_DEBUG = getBoolEnv(env, 'UNIFORM_OPTIONS_DEBUG', false);
    var UNIFORM_OPTIONS_PREFETCH_LINKS = getBoolEnv(env, 'UNIFORM_OPTIONS_PREFETCH_LINKS', false);
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
//# sourceMappingURL=parseUniformConfig.js.map