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
exports.CreateRendering = void 0;
var react_1 = __importDefault(require("react"));
var head_1 = __importDefault(require("next/head"));
var common_1 = require("@uniformdev/common");
var CreateRenderingFromHtml_1 = require("./CreateRenderingFromHtml");
var contexts_1 = require("../contexts");
var getHtmlOrJSONFromMap = function (htmlMap, rendering, datasourceId) {
    if (htmlMap) {
        var htmlsPerDatasources = htmlMap[rendering.renderingId || common_1.throwException('renderingId')] || {};
        return htmlsPerDatasources[common_1.tryParseGuid(datasourceId) + '|' + rendering.settings.Parameters];
    }
};
var isLayoutHtmlWithBody = function (html) {
    return typeof html === 'object' && html.hasOwnProperty('bodyHtml');
};
var isJSONRendering = function (html) {
    return typeof html === 'string' && (html.startsWith('"{') || html.endsWith('}"'));
};
var isJavaScriptRendering = function (html) {
    return typeof html === 'string' && html.startsWith('<javascript-rendering ');
};
var isValidHtmlRendering = function (html) {
    return typeof html === 'string' && !isJavaScriptRendering(html) && !isJSONRendering(html);
};
/**
 * This takes a rendering and decides how to convert
 * it into a React element. It will either match a
 * React component within the component map or we will
 * use the MVC rendered html and convert those tags to
 * React components.
 */
function CreateRendering(_a) {
    var _b, _c;
    var rendering = _a.rendering, placeholderKey = _a.placeholderKey, renderingContext = _a.renderingContext, index = _a.index;
    var uniformContext = contexts_1.useUniformContext();
    var logger = uniformContext.logger, componentFactory = uniformContext.componentFactory;
    if (!rendering)
        throw new Error('There is no rendering');
    var componentName = rendering.componentName || common_1.throwException('impossible');
    var innerRenderingContext = rendering.renderingContext;
    var datasourceId = rendering.datasource || '00000000000000000000000000000000';
    // We will look for a React component in the component map.
    var CustomReactComponent = componentFactory(componentName);
    // Look for Sitecore MVC html or JSON item data for the rendering
    var htmlOrJSON = getHtmlOrJSONFromMap(renderingContext.html, rendering, datasourceId);
    if (CustomReactComponent) {
        logger.debug("Found a React component for " + componentName);
        // We have a React component
        if (isJSONRendering(htmlOrJSON)) {
            innerRenderingContext.item = JSON.parse(htmlOrJSON);
        }
        var newProps = {
            key: rendering.id,
            index: index,
            renderingContext: innerRenderingContext,
        };
        logger.debug('Rendering component ' + rendering.componentName + ' (pure react)');
        return react_1.default.createElement(CustomReactComponent, newProps);
    }
    else if (isLayoutHtmlWithBody(htmlOrJSON)) {
        logger.debug('Layout with body', htmlOrJSON);
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(head_1.default, null,
                react_1.default.createElement(contexts_1.UniformContextProvider, __assign({}, uniformContext),
                    react_1.default.createElement(CreateRenderingFromHtml_1.CreateRenderingFromHtml, { html: htmlOrJSON.headHtml, renderingContext: innerRenderingContext, rendering: rendering, placeholderKey: placeholderKey, index: index, isHead: false }))),
            react_1.default.createElement(CreateRenderingFromHtml_1.CreateRenderingFromHtml, { html: htmlOrJSON.bodyHtml, renderingContext: innerRenderingContext, rendering: rendering, placeholderKey: placeholderKey, index: index })));
    }
    else if (isValidHtmlRendering(htmlOrJSON)) {
        return (react_1.default.createElement(CreateRenderingFromHtml_1.CreateRenderingFromHtml, { html: htmlOrJSON, renderingContext: innerRenderingContext, rendering: rendering, placeholderKey: placeholderKey, index: index }));
    }
    common_1.throwException("No r.componentName and no html available for rendering, r: " + rendering.renderingId + ", uid: " + rendering.id + ", ds: " + datasourceId + ", " + (((_b = rendering.renderingContext.item) === null || _b === void 0 ? void 0 : _b.id) + ', ' + common_1.parseGuid(((_c = rendering.renderingContext.item) === null || _c === void 0 ? void 0 : _c.id) || '')));
    return null;
}
exports.CreateRendering = CreateRendering;
//# sourceMappingURL=createRendering.js.map