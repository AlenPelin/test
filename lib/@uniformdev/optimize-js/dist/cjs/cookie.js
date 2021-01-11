"use strict";
exports.__esModule = true;
exports.getCookieValues = exports.removeCookie = exports.setCookie = exports.getCookie = void 0;
var tracking_1 = require("@uniformdev/tracking");
exports.getCookie = tracking_1.getCookie;
exports.setCookie = tracking_1.setCookie;
exports.removeCookie = tracking_1.removeCookie;
function getCookieValues(name) {
    var value = tracking_1.getCookie(name);
    if (value) {
        return value.split(",");
    }
    return [];
}
exports.getCookieValues = getCookieValues;
//# sourceMappingURL=cookie.js.map