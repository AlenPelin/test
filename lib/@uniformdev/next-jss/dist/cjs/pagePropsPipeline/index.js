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
exports.getPageProps = void 0;
var routeUtils_1 = require("../routeUtils");
var pipeline_1 = require("./pipeline");
var next_1 = require("@uniformdev/next");
var pipeline_2 = require("./pipeline");
Object.defineProperty(exports, "pagePropsPipeline", { enumerable: true, get: function () { return pipeline_2.pagePropsPipeline; } });
function getPageProps(options) {
    var _a = routeUtils_1.resolveParams(options.routeParams, function () {
        return typeof options.env.getCurrentLanguage === 'function'
            ? options.env.getCurrentLanguage()
            : next_1.getNextConfig().defaultLanguage;
    }), resolvedRoute = _a.resolvedRoute, resolvedLanguage = _a.resolvedLanguage, queryStringParams = _a.queryStringParams;
    var context = __assign(__assign({ props: {} }, options), { routeParams: __assign({ sitecoreRoute: resolvedRoute, lang: resolvedLanguage }, queryStringParams) });
    return pipeline_1.pagePropsPipeline.run(context).then(function (context) { return context.props; });
}
exports.getPageProps = getPageProps;
//# sourceMappingURL=index.js.map