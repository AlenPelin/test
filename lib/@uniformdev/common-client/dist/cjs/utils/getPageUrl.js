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
        url += type + '/' + path + '.json';
    }
    else {
        url += type + '.json';
    }
    return common_1.getApiUrlWithToken(config, url);
}
exports.getPageUrl = getPageUrl;
//# sourceMappingURL=getPageUrl.js.map