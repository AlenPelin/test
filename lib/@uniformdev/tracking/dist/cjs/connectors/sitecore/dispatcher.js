"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.XdbDispatcher = void 0;
var axios_1 = __importDefault(require("axios"));
var XdbDispatcher = /** @class */ (function () {
    function XdbDispatcher(settings) {
        this.requiresBrowser = true;
        this.type = "xdb";
        this.httpHeaders = settings === null || settings === void 0 ? void 0 : settings.httpHeaders;
        this.queryStringParameters = settings === null || settings === void 0 ? void 0 : settings.queryStringParameters;
    }
    XdbDispatcher.prototype.dispatchActivity = function (_results, logger) {
        var _this = this;
        var url = window.location.href;
        if (this.queryStringParameters) {
            var startPos = this.queryStringParameters.startsWith('?') ? 1 : 0;
            var qs_1 = this.queryStringParameters.substring(startPos);
            if (qs_1.length > 0) {
                if (window.location.search.length == 0) {
                    url = url + "?" + qs_1;
                }
                else {
                    url = url + "&" + qs_1;
                }
            }
        }
        axios_1["default"]
            .get(url, {
            method: 'GET',
            headers: this.httpHeaders,
            withCredentials: true
        })
            .then(function (response) { return logger.debug("XdbDispatcher - Response received after sending request to Sitecore CD instance.", { response: response, settings: { httpHeaders: _this.httpHeaders, queryStringParameters: _this.queryStringParameters } }); })["catch"](function (err) { return logger.error("XdbDispatcher - Error sending request to Sitecore CD instance.", { url: url, settings: { httpHeaders: _this.httpHeaders, queryStringParameters: _this.queryStringParameters }, err: err }); });
    };
    return XdbDispatcher;
}());
exports.XdbDispatcher = XdbDispatcher;
//# sourceMappingURL=dispatcher.js.map