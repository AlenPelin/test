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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLinkTag = void 0;
var react_1 = __importDefault(require("react"));
// normalize link tags
function buildLinkTag(_logger) {
    return {
        replaceChildren: false,
        shouldProcessNode: function (node) {
            return node.name === 'link';
        },
        processNode: function (node, _children) {
            var linkProps = __assign({}, node.attribs);
            var rel = linkProps.rel, href = linkProps.href;
            if (href && href.indexOf('.css') > 0 && rel !== 'stylesheet') {
                rel = 'stylesheet';
            }
            var innerData = node.children && node.children.length > 0 ? node.children[0].data : '';
            if (href || node.children.length === 1) {
                if (href) {
                    return react_1.default.createElement('link', linkProps);
                }
                else {
                    if (!innerData) {
                        return react_1.default.createElement(react_1.default.Fragment, undefined);
                    }
                    var innerLinkProps = __assign({}, linkProps);
                    innerLinkProps.dangerouslySetInnerHTML = {
                        __html: innerData,
                    };
                    return react_1.default.createElement('link', innerLinkProps);
                }
            }
            return react_1.default.createElement(react_1.default.Fragment, linkProps);
        },
    };
}
exports.buildLinkTag = buildLinkTag;
//# sourceMappingURL=buildLinkTag.js.map