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
import Head from 'next/head';
import { parseGuid, throwException, tryParseGuid } from '@uniformdev/common';
import { CreateRenderingFromHtml } from './CreateRenderingFromHtml';
import { UniformContextProvider, useUniformContext } from '../contexts';
var getHtmlOrJSONFromMap = function (htmlMap, rendering, datasourceId) {
    if (htmlMap) {
        var htmlsPerDatasources = htmlMap[rendering.renderingId || throwException('renderingId')] || {};
        return htmlsPerDatasources[tryParseGuid(datasourceId) + '|' + rendering.settings.Parameters];
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
export function CreateRendering(_a) {
    var _b, _c;
    var rendering = _a.rendering, placeholderKey = _a.placeholderKey, renderingContext = _a.renderingContext, index = _a.index;
    var uniformContext = useUniformContext();
    var logger = uniformContext.logger, componentFactory = uniformContext.componentFactory;
    if (!rendering)
        throw new Error('There is no rendering');
    var componentName = rendering.componentName || throwException('impossible');
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
        return React.createElement(CustomReactComponent, newProps);
    }
    else if (isLayoutHtmlWithBody(htmlOrJSON)) {
        logger.debug('Layout with body', htmlOrJSON);
        return (React.createElement(React.Fragment, null,
            React.createElement(Head, null,
                React.createElement(UniformContextProvider, __assign({}, uniformContext),
                    React.createElement(CreateRenderingFromHtml, { html: htmlOrJSON.headHtml, renderingContext: innerRenderingContext, rendering: rendering, placeholderKey: placeholderKey, index: index, isHead: false }))),
            React.createElement(CreateRenderingFromHtml, { html: htmlOrJSON.bodyHtml, renderingContext: innerRenderingContext, rendering: rendering, placeholderKey: placeholderKey, index: index })));
    }
    else if (isValidHtmlRendering(htmlOrJSON)) {
        return (React.createElement(CreateRenderingFromHtml, { html: htmlOrJSON, renderingContext: innerRenderingContext, rendering: rendering, placeholderKey: placeholderKey, index: index }));
    }
    throwException("No r.componentName and no html available for rendering, r: " + rendering.renderingId + ", uid: " + rendering.id + ", ds: " + datasourceId + ", " + (((_b = rendering.renderingContext.item) === null || _b === void 0 ? void 0 : _b.id) + ', ' + parseGuid(((_c = rendering.renderingContext.item) === null || _c === void 0 ? void 0 : _c.id) || '')));
    return null;
}
//# sourceMappingURL=createRendering.js.map