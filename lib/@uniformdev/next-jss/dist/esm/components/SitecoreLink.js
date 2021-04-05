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
import React, { useMemo } from 'react';
// Although the `formatWithValidation` and `addBasePath` functions are declared in the `next-server` package,
// we can still import them for usage in code that will run on the client.
// `next/link` does the same without issue.
import { formatWithValidation } from 'next/dist/next-server/lib/utils';
// @ts-ignore
import { addBasePath } from 'next/dist/next-server/lib/router/router';
import Link from 'next/link';
import { useSitecoreContext } from './SitecoreContext';
// When in experience editor, _attempt_ to render "standard" links, e.g. <a href="" /> instead
// of `next/link` components in order to avoid client-side route switches in experience editor.
// Client-side routing will usually break experience editor.
// NOTE: it is _not_ recommended for content editors to use app navigation to navigate between
// pages in experience editor. Especially in a multi-site configuration where the hostname of the
// site being edited may not match the hostname used for logging into the Sitecore CM server.
export var SitecoreNavLink = function (props) {
    var sitecoreContext = useSitecoreContext();
    var isPageEditingOrPreview = sitecoreContext && (sitecoreContext.pageEditing || sitecoreContext.pageState === 'preview');
    // The function is memoized so that no extra lifecycles are needed
    // as per https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html
    // This idea/code borrowed from the `next/link` component.
    var formatUrls = useMemo(function () { return memoizedFormatUrls; }, [
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
        return (React.createElement(React.Fragment, null, React.Children.map(props.children, function (child) {
            return React.cloneElement(child, { href: resolvedHref_1 });
        })));
    }
    else {
        return React.createElement(Link, __assign({}, props));
    }
};
// This code largely borrowed from `next/link`.
function memoizedFormatUrls(href, asHref, siteName) {
    var siteNameParam = "sc_site=" + siteName;
    var formattedHref = addQsParam(addBasePath(formatUrl(href)), siteNameParam);
    var formattedAs = asHref ? addQsParam(addBasePath(formatUrl(asHref)), siteNameParam) : asHref;
    return {
        href: formattedHref,
        as: formattedAs,
    };
}
function addQsParam(url, param) {
    return "" + url + (url.indexOf('?') !== -1 ? '&' : '?') + param;
}
function formatUrl(url) {
    return url && typeof url === 'object' ? formatWithValidation(url) : url;
}
//# sourceMappingURL=SitecoreLink.js.map