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
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import { throwException, trimStart, trimEnd, replace, tryFormatGuid } from '@uniformdev/common';
import { SmartLink } from '..';
export function createRenderingFromHtml(html, renderingContext, r, placeholderKey, index, components, config, logger) {
    logger.debug('Rendering component ' + r.componentName + ' from html');
    var transform = function (node, nodeIndex) {
        if (node.type === 'tag' && node.name === 'placeholder' && node.attribs) {
            var placeholderComponent = components.Placeholder;
            if (!placeholderComponent) {
                return;
            }
            if (!r.id) {
                throw new Error('no r.id');
            }
            var newPlaceholderKey = node.attribs['data-placeholder-key'] || throwException('No attribs.data-placeholder-key, attribs: ' + JSON.stringify(node.attribs));
            if (newPlaceholderKey.includes('$(Rendering.UniqueId)')) {
                var scIdformat = tryFormatGuid(r.id, 'B').toUpperCase();
                newPlaceholderKey = replace(newPlaceholderKey, '$(Rendering.UniqueId)', scIdformat);
            }
            newPlaceholderKey = trimEnd(placeholderKey, '/') + '/' + trimStart(newPlaceholderKey, '/');
            logger.debug('Constructing nested placeholder with key: ' + newPlaceholderKey);
            var placeholderProps = {
                key: r.id + index + newPlaceholderKey,
                index: nodeIndex,
                placeholderKey: newPlaceholderKey,
                renderingContext: __assign({}, renderingContext),
            };
            return React.createElement(placeholderComponent, placeholderProps);
        }
        else if (config.UNIFORM_OPTIONS_MVC_SPA_ENABLED && node.type === 'tag' && node.name === 'a' && node.attribs) {
            var href = node.attribs.href;
            if (href && href.startsWith('/')) {
                return React.createElement(SmartLink, { className: node.attribs['class'], key: href + nodeIndex, href: href, attribs: node.attribs }, node.children.map(function (child, childIndex) { return convertNodeToElement(child, childIndex, function (_a, _b) { }); }));
            }
        }
        else if (node.type === 'script' && node.name === 'script' && node.attribs) {
            var async = node.attribs.async !== undefined ? 'async' : '';
            var src = node.attribs.src;
            var type = node.attribs.type;
            if (src || node.children.length === 1) {
                logger.debug('Adding script ' + src + ' ' + async);
                if (src) {
                    var scriptProps = {
                        key: src,
                        src: src,
                        type: type
                    };
                    if (async) {
                        scriptProps.async = '';
                    }
                    return React.createElement('script', scriptProps);
                }
                else {
                    var scriptProps = {
                        key: 'nosrc' + nodeIndex,
                        index: nodeIndex,
                        type: type,
                        dangerouslySetInnerHTML: {
                            __html: node.children[0].data || ''
                        }
                    };
                    if (async) {
                        scriptProps.async = '';
                    }
                    return React.createElement('script', scriptProps);
                }
            }
        }
    };
    // TODO: contribute
    // @ts-ignore
    return ReactHtmlParser(html, {
        transform: transform
    });
}
//# sourceMappingURL=createRenderingFromHtml.js.map