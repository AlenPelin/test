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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitecoreNavLink = void 0;
var react_1 = __importStar(require("react"));
// Although the `formatWithValidation` and `addBasePath` functions are declared in the `next-server` package,
// we can still import them for usage in code that will run on the client.
// `next/link` does the same without issue.
var utils_1 = require("next/dist/next-server/lib/utils");
// @ts-ignore
var router_1 = require("next/dist/next-server/lib/router/router");
var link_1 = __importDefault(require("next/link"));
var SitecoreContext_1 = require("./SitecoreContext");
// When in experience editor, _attempt_ to render "standard" links, e.g. <a href="" /> instead
// of `next/link` components in order to avoid client-side route switches in experience editor.
// Client-side routing will usually break experience editor.
// NOTE: it is _not_ recommended for content editors to use app navigation to navigate between
// pages in experience editor. Especially in a multi-site configuration where the hostname of the
// site being edited may not match the hostname used for logging into the Sitecore CM server.
exports.SitecoreNavLink = function (props) {
    var sitecoreContext = SitecoreContext_1.useSitecoreContext();
    var isPageEditingOrPreview = sitecoreContext && (sitecoreContext.pageEditing || sitecoreContext.pageState === 'preview');
    // The function is memoized so that no extra lifecycles are needed
    // as per https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html
    // This idea/code borrowed from the `next/link` component.
    var formatUrls = react_1.useMemo(function () { return memoizedFormatUrls; }, [
        props.href,
        props.asHref,
        sitecoreContext.site.name,
    ]);
    if (isPageEditingOrPreview) {
        // need to resolve the intended `href` of the link here, and append the `sc_site` param.
        // presumably, if an `as` prop is provided, that is the "actual" URL that would be sent in a server request to Sitecore?
        // or not?
        var _a = formatUrls(props.href, props.as, sitecoreContext.site.name), href = _a.href, as = _a.as;
        var resolvedHref_1 = as || href;
        return (react_1.default.createElement(react_1.default.Fragment, null, react_1.default.Children.map(props.children, function (child) {
            return react_1.default.cloneElement(child, { href: resolvedHref_1 });
        })));
    }
    else {
        return react_1.default.createElement(link_1.default, __assign({}, props));
    }
};
// This code largely borrowed from `next/link`.
function memoizedFormatUrls(href, asHref, siteName) {
    var siteNameParam = "sc_site=" + siteName;
    var formattedHref = addQsParam(router_1.addBasePath(formatUrl(href)), siteNameParam);
    var formattedAs = asHref ? addQsParam(router_1.addBasePath(formatUrl(asHref)), siteNameParam) : asHref;
    return {
        href: formattedHref,
        as: formattedAs,
    };
}
function addQsParam(url, param) {
    return "" + url + (url.indexOf('?') !== -1 ? '&' : '?') + param;
}
function formatUrl(url) {
    return url && typeof url === 'object' ? utils_1.formatWithValidation(url) : url;
}
//# sourceMappingURL=SitecoreLink.js.map