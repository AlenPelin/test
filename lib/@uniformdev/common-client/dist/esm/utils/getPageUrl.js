import { trim, getApiUrlWithToken, getEnv } from '@uniformdev/common';
export function getPageUrl(itemPath, type, config) {
    var sitename = config.UNIFORM_API_SITENAME;
    var path = trim(itemPath, '/');
    if (!path) {
        path = '';
    }
    var url = '/uniform/api/content/' + sitename + '/';
    if (path) {
        url += type + '/' + path;
    }
    else {
        url += type;
    }
    var uniformApiToken = getEnv(process.env, 'UNIFORM_API_TOKEN', undefined);
    return getApiUrlWithToken(config, url, uniformApiToken);
}
//# sourceMappingURL=getPageUrl.js.map