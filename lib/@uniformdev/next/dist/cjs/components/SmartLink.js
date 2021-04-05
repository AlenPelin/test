"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartLink = void 0;
var react_1 = __importDefault(require("react"));
var link_1 = __importDefault(require("next/link"));
var head_1 = __importDefault(require("next/head"));
var common_1 = require("@uniformdev/common");
var common_client_1 = require("@uniformdev/common-client");
var __1 = require("..");
var SmartLink = /** @class */ (function (_super) {
    __extends(SmartLink, _super);
    function SmartLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SmartLink.prototype.render = function () {
        var config = common_1.parseUniformConfig(__1.getNextConfig());
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
        var children = this.props.children || common_1.throwException('no props.children');
        if (!href) {
            return react_1.default.createElement("a", __assign({}, attribs), children);
        }
        if (href && !href.startsWith('/')) {
            return (react_1.default.createElement(link_1.default, { href: href },
                react_1.default.createElement("a", __assign({}, attribs), children)));
        }
        var value = common_1.trim(href, '/');
        var link = common_1.replace("/" + value + "/", '//', '/');
        var newHref = '/index';
        var as = link;
        if (!prefetch) {
            return (react_1.default.createElement(link_1.default, { href: newHref, as: as },
                react_1.default.createElement("a", __assign({}, attribs), children)));
        }
        var prefetchPage = !prefetch ? undefined : common_client_1.getPageUrl(href, 'page', config);
        // TODO: not possible to prefetch datasources this way
        //const prefetchDatasources = getPageUrl(href, 'ds', config);
        //const prefetchHtml = !prefetch ? undefined : getPageUrl(href, 'html', config);
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(link_1.default, { href: newHref, as: as },
                react_1.default.createElement("a", __assign({}, attribs), children)),
            react_1.default.createElement(head_1.default, null,
                react_1.default.createElement("link", { rel: "preload", crossOrigin: "anonymous", href: prefetchPage, as: "fetch", key: prefetchPage }))));
    };
    return SmartLink;
}(react_1.default.Component));
exports.SmartLink = SmartLink;
//# sourceMappingURL=SmartLink.js.map