"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiUrlWithToken = void 0;
function getApiUrlWithToken(config, relativePath, uniformApiToken) {
    var apiUrl = config.UNIFORM_API_URL;
    var uri = new URL(apiUrl.endsWith('/') ? apiUrl : apiUrl + '/');
    if (relativePath) {
        relativePath = relativePath.toLowerCase();
        uri = new URL(relativePath.startsWith('.') ? relativePath : '.' + relativePath, uri);
    }
    if (config.UNIFORM_OPTIONS_PREVIEW) {
        uri.searchParams.set('uniform_preview', 'true');
    }
    if (uniformApiToken) {
        uri.searchParams.set('uniform_token', uniformApiToken);
    }
    return uri.href;
}
exports.getApiUrlWithToken = getApiUrlWithToken;
//# sourceMappingURL=getApiUrlWithToken.js.map