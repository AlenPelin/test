var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { replace, throwException, trim, parseUniformConfig } from '@uniformdev/common';
import { getPageUrl } from '@uniformdev/common-client';
import { getNextConfig } from '..';
var SmartLink = /** @class */ (function (_super) {
    __extends(SmartLink, _super);
    function SmartLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SmartLink.prototype.render = function () {
        var config = parseUniformConfig(getNextConfig());
        var prefetch = config.UNIFORM_OPTIONS_PREFETCH_LINKS;
        var _a = this.props, href = _a.href, className = _a.className, attribs = _a.attribs;
        attribs = attribs || {};
        if (className) {
            attribs.className = className;
        }
        if (attribs.href) {
            delete attribs.href;
        }
        if (attribs['class']) {
            delete attribs['class'];
        }
        var children = this.props.children || throwException('no props.children');
        if (!href) {
            return React.createElement("a", __assign({}, attribs), children);
        }
        if (href && !href.startsWith('/')) {
            return (React.createElement(Link, { href: href },
                React.createElement("a", __assign({}, attribs), children)));
        }
        var value = trim(href, '/');
        var link = replace("/" + value + "/", '//', '/');
        var newHref = '/index';
        var as = link;
        if (!prefetch) {
            return (React.createElement(Link, { href: newHref, as: as },
                React.createElement("a", __assign({}, attribs), children)));
        }
        var prefetchPage = !prefetch ? undefined : getPageUrl(href, 'page', config);
        // TODO: not possible to prefetch datasources this way
        //const prefetchDatasources = getPageUrl(href, 'ds', config);
        //const prefetchHtml = !prefetch ? undefined : getPageUrl(href, 'html', config);
        return (React.createElement(React.Fragment, null,
            React.createElement(Link, { href: newHref, as: as },
                React.createElement("a", __assign({}, attribs), children)),
            React.createElement(Head, null,
                React.createElement("link", { rel: "preload", crossOrigin: "anonymous", href: prefetchPage, as: "fetch", key: prefetchPage }))));
    };
    return SmartLink;
}(React.Component));
export { SmartLink };
//# sourceMappingURL=SmartLink.js.map