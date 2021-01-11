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
import { throwException, parseGuid, tryParseGuid, } from '@uniformdev/common';
import { parseUniformConfig, } from '@uniformdev/common';
import { createRenderingFromHtml } from './createRenderingFromHtml';
import { GLOBAL_LOADER, COMPONENT_LOADER_SUFFIX } from '..';
import { getNextConfig, } from '..';
export function createRendering(r, placeholderKey, index, components, props, logger) {
    if (!r)
        throw new Error('no r');
    var componentName = r.componentName || throwException('impossible');
    var config = parseUniformConfig(getNextConfig());
    // it's NOT okay even if magic button is used there must be at least Placeholder component
    if (!components)
        throw new Error('no components');
    var isNodeJs = typeof process !== 'undefined' && process.env && process.env['PATH'] || false;
    if (r.settings.Rules && (props.loading || isNodeJs)) {
        var componentLoaderName = r.componentName + COMPONENT_LOADER_SUFFIX;
        if (components[componentLoaderName]) {
            if (!componentName.endsWith(COMPONENT_LOADER_SUFFIX)) {
                // if component has personalization, replace component with its own component-specific loader 
                // to only show personalized version rendered in browser
                logger.debug('Inserting component loader ' + componentLoaderName + ' instead of rendering ' + r.id);
                return createRendering(__assign(__assign({}, r), { componentName: componentLoaderName }), placeholderKey, index, components, props, logger);
            }
        }
        else if (components[GLOBAL_LOADER]) {
            if (r.componentName !== GLOBAL_LOADER && !componentName.endsWith(COMPONENT_LOADER_SUFFIX)) {
                // if component has personalization, replace component with global loader (if there's no own component-sepcific loader) 
                // to only show personalized version rendered in browser
                logger.debug('Inserting global loader instead of rendering ' + r.id);
                return createRendering(__assign(__assign({}, r), { componentName: GLOBAL_LOADER }), placeholderKey, index, components, props, logger);
            }
        }
    }
    var renderingContext = __assign({}, r.renderingContext);
    var ds = r.datasource || '00000000000000000000000000000000';
    {
        var htmlMap = props.renderingContext.html;
        if (htmlMap && componentName !== GLOBAL_LOADER && !componentName.endsWith(COMPONENT_LOADER_SUFFIX)) {
            var htmlsPerDatasources = htmlMap[r.renderingId || throwException('renderingId')] || {};
            var html = htmlsPerDatasources[tryParseGuid(ds) + '|' + r.settings.Parameters];
            if (html !== null) {
                if (typeof html === 'string' && !html.startsWith('<javascript-rendering ')) {
                    if (html === undefined) {
                        html = "";
                        logger.warn('No r.componentName and no html available for rendering, r: ' + r.renderingId + ', uid: ' + r.id + ', ds: ' + ds + ', ' + (r.renderingContext.item ? (r.renderingContext.item.id + ', ' + parseGuid(r.renderingContext.item.id || '')) : ''));
                    }
                    if (!html.startsWith('"{') || !html.endsWith('}"')) {
                        return createRenderingFromHtml(html, renderingContext, r, placeholderKey, index, components, config, logger);
                    }
                    renderingContext.item = JSON.parse(html);
                }
                else {
                    if (html && html.headHtml !== undefined && html.bodyHtml !== undefined) {
                        return (React.createElement(React.Fragment, null,
                            React.createElement(Head, null, createRenderingFromHtml(html.headHtml, renderingContext, r, placeholderKey, index, components, config, logger)),
                            createRenderingFromHtml(html.bodyHtml, renderingContext, r, placeholderKey, index, components, config, logger)));
                    }
                }
            }
        }
    }
    var component = components[componentName] || throwException("Cannot find component " + componentName);
    var newProps = {
        key: r.id,
        index: index,
        renderingContext: renderingContext,
    };
    // TODO: important - have to have the "placeholderKey" element in the filter prop list - otherwise Stack Overflow :)
    var filterPropList = ['placeholderKey'].concat(Object.keys(newProps));
    var originalProps = {};
    var anyProps = props;
    Object.keys(props).forEach(function (key) {
        if (!filterPropList.includes(key)) {
            originalProps[key] = anyProps[key];
        }
    });
    logger.debug('Rendering component ' + r.componentName + ' (pure react)');
    return React.createElement(component, Object.assign({}, newProps, originalProps));
}
//# sourceMappingURL=createRendering.js.map