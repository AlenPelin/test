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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import React from 'react';
import { throwException, trimStart, trimEnd, replace, tryFormatGuid } from '@uniformdev/common';
export function buildRemovePlaceholder() {
    return {
        shouldProcessNode: function (node) { return node.name === 'placeholder'; },
        processNode: function () { return null; },
    };
}
export function buildPlaceholder(placeholderComponent, r, renderingIndex, placeholderKey, renderingContext, logger) {
    return {
        // this is important to keep to `false` otherwise script tags will be wrapped in placeholder tags
        replaceChildren: false,
        shouldProcessNode: function (node) {
            return node.type === 'comment' && /uniform_frontend_placeholder/.test(node.data || '');
            // return node.name === 'placeholder';
        },
        processNode: function (node, _children, index) {
            if (!r.id) {
                throw new Error('no r.id');
            }
            var _a = __read(/uniform_frontend_placeholder:(\S*)/.exec(node.data), 2), matchedKey = _a[1];
            var newPlaceholderKey = (matchedKey === null || matchedKey === void 0 ? void 0 : matchedKey.trim()) ||
                throwException('No attribs.data-placeholder-key, attribs: ' + JSON.stringify(node.attribs));
            if (newPlaceholderKey.includes('$(Rendering.UniqueId)')) {
                var scIdformat = tryFormatGuid(r.id, 'B').toUpperCase();
                newPlaceholderKey = replace(newPlaceholderKey, '$(Rendering.UniqueId)', scIdformat);
            }
            newPlaceholderKey = trimEnd(placeholderKey, '/') + '/' + trimStart(newPlaceholderKey, '/');
            logger.debug('Constructing nested placeholder with key: ' + newPlaceholderKey);
            var placeholderProps = {
                key: r.id + renderingIndex + newPlaceholderKey,
                index: index,
                placeholderKey: newPlaceholderKey,
                renderingContext: __assign({}, renderingContext),
            };
            return React.createElement(placeholderComponent, placeholderProps);
        },
    };
}
//# sourceMappingURL=buildPlaceholder.js.map