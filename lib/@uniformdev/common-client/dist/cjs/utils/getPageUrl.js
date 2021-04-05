"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageUrl = void 0;
var common_1 = require("@uniformdev/common");
function getPageUrl(itemPath, type, config) {
    var sitename = config.UNIFORM_API_SITENAME;
    var path = common_1.trim(itemPath, '/');
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
    var uniformApiToken = common_1.getEnv(process.env, 'UNIFORM_API_TOKEN', undefined);
    return common_1.getApiUrlWithToken(config, url, uniformApiToken);
}
exports.getPageUrl = getPageUrl;
//# sourceMappingURL=getPageUrl.js.map