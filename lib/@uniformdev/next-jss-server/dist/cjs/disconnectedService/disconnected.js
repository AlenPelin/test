"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMockDictionaryData = exports.fetchMockLayoutServiceData = exports.invokeMockDisconnectedService = void 0;
var next_jss_1 = require("@uniformdev/next-jss");
var common_1 = require("@uniformdev/common");
function invokeMockDisconnectedService(service, requestOptions) {
    // Disconnected Layout Service and disconnected Dictionary Service are both exposed
    // as server middleware. So we can mock the request and response objects that we
    // send to the middleware and make simulated requests for data.
    return new Promise(function (resolve, reject) {
        var mockReq = __assign({}, requestOptions);
        // Mock the `response` object used by disconnected services.
        // NOTE: may need to add more response methods if the disconnected services implementations ever change.
        var mockRes = {
            sendStatus: function (statusCode) {
                reject(statusCode);
            },
            // note: do not use an arrow function for the `status` function, otherwise `this` will not be bound correctly.
            status: function () {
                return this;
            },
            json: function (result) {
                resolve(result);
            },
        };
        service.middleware(mockReq, mockRes);
    });
}
exports.invokeMockDisconnectedService = invokeMockDisconnectedService;
function fetchMockLayoutServiceData(layoutService, route, language, options) {
    if (options === void 0) { options = {}; }
    var formattedRoute = next_jss_1.formatRoute(route);
    // allow devs to override default options with custom options
    var requestOptions = __assign({ query: __assign({ sc_lang: language, item: formattedRoute }, options.queryStringParams) }, options);
    return invokeMockDisconnectedService(layoutService, requestOptions).catch(function (error) {
        if (error.response && error.response.status === 404 && error.response.data) {
            return error.response.data;
        }
        console.error("Route data fetch error for route: " + route, common_1.errorToJsonObject(error));
        return null;
    });
}
exports.fetchMockLayoutServiceData = fetchMockLayoutServiceData;
function fetchMockDictionaryData(dictionaryService, language, options) {
    if (options === void 0) { options = {}; }
    // allow devs to override default options with custom options
    var requestOptions = __assign({ params: {
            language: language,
        } }, options);
    return invokeMockDisconnectedService(dictionaryService, requestOptions).then(function (response) {
        return response.phrases;
    });
}
exports.fetchMockDictionaryData = fetchMockDictionaryData;
//# sourceMappingURL=disconnected.js.map