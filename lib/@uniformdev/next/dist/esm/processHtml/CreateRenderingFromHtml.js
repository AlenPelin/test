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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import React, { useMemo } from 'react';
import { buildPlaceholder, buildRemovePlaceholder } from './elements/buildPlaceholder';
import { cleanHtml } from './cleanHtml';
import { useUniformContext } from '../contexts';
import { Placeholder } from '../components/Placeholder';
var Parser = require('html-to-react').Parser;
/**
 * This will take HTML to convert into React elements.
 *
 * It memoizes the output based on the html string so
 * it only does the expensive work of converting when
 * that changes.
 *
 * It doesn't support having placeholders in the Head
 * because we lose the UniformContext when inside for
 * some reason.
 */
export function CreateRenderingFromHtml(_a) {
    var html = _a.html, renderingContext = _a.renderingContext, rendering = _a.rendering, placeholderKey = _a.placeholderKey, index = _a.index, _b = _a.Wrapper, Wrapper = _b === void 0 ? React.Fragment : _b, isHead = _a.isHead;
    var _c = useUniformContext(), logger = _c.logger, htmlProcessingInstructions = _c.htmlProcessingInstructions, htmlPreProcessingInstructions = _c.htmlPreProcessingInstructions;
    var rendered = useMemo(function () {
        if (!html)
            return null;
        logger.debug("Rendering component " + rendering.componentName + " from html in " + placeholderKey + " placeholder");
        // The order below can make a difference
        var processingInstructions = __spread([
            isHead
                ? buildRemovePlaceholder()
                : buildPlaceholder(Placeholder, rendering, index, placeholderKey, renderingContext, logger)
        ], htmlProcessingInstructions).filter(Boolean);
        return new Parser().parseWithInstructions(cleanHtml(html), function () { return true; }, processingInstructions, htmlPreProcessingInstructions);
    }, [html]);
    logger.debug('Rendering component ' + rendering.componentName + ' from html');
    return rendered ? React.createElement(Wrapper, null, rendered) : null;
}
//# sourceMappingURL=CreateRenderingFromHtml.js.map