"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveParams = exports.removeQueryStringFromRoute = exports.ensureLeadingSlash = exports.formatRoute = void 0;
function formatRoute(route) {
    if (!route) {
        return route;
    }
    // `removeQueryStringFromRoute` shouldn't be necessary, but we have it as a "safety" measure.
    return removeQueryStringFromRoute(ensureLeadingSlash(route));
}
exports.formatRoute = formatRoute;
function ensureLeadingSlash(route) {
    var formattedRoute = !route.startsWith('/') ? "/" + route : route;
    return formattedRoute;
}
exports.ensureLeadingSlash = ensureLeadingSlash;
function removeQueryStringFromRoute(route) {
    var queryIndex = route.indexOf('?');
    if (queryIndex !== -1) {
        var formattedRoute = route.substring(0, queryIndex);
        return formattedRoute;
    }
    return route;
}
exports.removeQueryStringFromRoute = removeQueryStringFromRoute;
function resolveParams(routeParams, getCurrentLanguage) {
    var sitecoreRoute = routeParams.sitecoreRoute, lang = routeParams.lang, queryStringParams = __rest(routeParams, ["sitecoreRoute", "lang"]);
    // `sitecoreRoute` param may be undefined when the current URL is `/` or
    // when the current URL is just a language parameter, e.g. `/en`, `/nl-NL`
    // In those scenarios, we default to `/` for the route.
    var resolvedRoute = sitecoreRoute || '/';
    // determine language by route first, then by "state" (i18n.language), else fallback to default config
    var resolvedLanguage = lang || getCurrentLanguage();
    return {
        resolvedRoute: resolvedRoute,
        resolvedLanguage: resolvedLanguage,
        queryStringParams: queryStringParams,
    };
}
exports.resolveParams = resolveParams;
//# sourceMappingURL=routeUtils.js.map