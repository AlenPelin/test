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
// normalize link tags
export function buildLinkTag(_logger) {
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
                    return React.createElement('link', linkProps);
                }
                else {
                    if (!innerData) {
                        return React.createElement(React.Fragment, undefined);
                    }
                    var innerLinkProps = __assign({}, linkProps);
                    innerLinkProps.dangerouslySetInnerHTML = {
                        __html: innerData,
                    };
                    return React.createElement('link', innerLinkProps);
                }
            }
            return React.createElement(React.Fragment, linkProps);
        },
    };
}
//# sourceMappingURL=buildLinkTag.js.map