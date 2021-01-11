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
exports.createRenderingFromHtml = void 0;
var react_1 = __importDefault(require("react"));
var react_html_parser_1 = __importStar(require("react-html-parser"));
var common_1 = require("@uniformdev/common");
var __1 = require("..");
function createRenderingFromHtml(html, renderingContext, r, placeholderKey, index, components, config, logger) {
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
            var newPlaceholderKey = node.attribs['data-placeholder-key'] || common_1.throwException('No attribs.data-placeholder-key, attribs: ' + JSON.stringify(node.attribs));
            if (newPlaceholderKey.includes('$(Rendering.UniqueId)')) {
                var scIdformat = common_1.tryFormatGuid(r.id, 'B').toUpperCase();
                newPlaceholderKey = common_1.replace(newPlaceholderKey, '$(Rendering.UniqueId)', scIdformat);
            }
            newPlaceholderKey = common_1.trimEnd(placeholderKey, '/') + '/' + common_1.trimStart(newPlaceholderKey, '/');
            logger.debug('Constructing nested placeholder with key: ' + newPlaceholderKey);
            var placeholderProps = {
                key: r.id + index + newPlaceholderKey,
                index: nodeIndex,
                placeholderKey: newPlaceholderKey,
                renderingContext: __assign({}, renderingContext),
            };
            return react_1.default.createElement(placeholderComponent, placeholderProps);
        }
        else if (config.UNIFORM_OPTIONS_MVC_SPA_ENABLED && node.type === 'tag' && node.name === 'a' && node.attribs) {
            var href = node.attribs.href;
            if (href && href.startsWith('/')) {
                return react_1.default.createElement(__1.SmartLink, { className: node.attribs['class'], key: href + nodeIndex, href: href, attribs: node.attribs }, node.children.map(function (child, childIndex) { return react_html_parser_1.convertNodeToElement(child, childIndex, function (_a, _b) { }); }));
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
                    return react_1.default.createElement('script', scriptProps);
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
                    return react_1.default.createElement('script', scriptProps);
                }
            }
        }
    };
    // TODO: contribute
    // @ts-ignore
    return react_html_parser_1.default(html, {
        transform: transform
    });
}
exports.createRenderingFromHtml = createRenderingFromHtml;
//# sourceMappingURL=createRenderingFromHtml.js.map