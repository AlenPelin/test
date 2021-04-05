"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRenderingFromHtml = void 0;
var react_1 = __importStar(require("react"));
var buildPlaceholder_1 = require("./elements/buildPlaceholder");
var cleanHtml_1 = require("./cleanHtml");
var contexts_1 = require("../contexts");
var Placeholder_1 = require("../components/Placeholder");
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
function CreateRenderingFromHtml(_a) {
    var html = _a.html, renderingContext = _a.renderingContext, rendering = _a.rendering, placeholderKey = _a.placeholderKey, index = _a.index, _b = _a.Wrapper, Wrapper = _b === void 0 ? react_1.default.Fragment : _b, isHead = _a.isHead;
    var _c = contexts_1.useUniformContext(), logger = _c.logger, htmlProcessingInstructions = _c.htmlProcessingInstructions, htmlPreProcessingInstructions = _c.htmlPreProcessingInstructions;
    var rendered = react_1.useMemo(function () {
        if (!html)
            return null;
        logger.debug("Rendering component " + rendering.componentName + " from html in " + placeholderKey + " placeholder");
        // The order below can make a difference
        var processingInstructions = __spread([
            isHead
                ? buildPlaceholder_1.buildRemovePlaceholder()
                : buildPlaceholder_1.buildPlaceholder(Placeholder_1.Placeholder, rendering, index, placeholderKey, renderingContext, logger)
        ], htmlProcessingInstructions).filter(Boolean);
        return new Parser().parseWithInstructions(cleanHtml_1.cleanHtml(html), function () { return true; }, processingInstructions, htmlPreProcessingInstructions);
    }, [html]);
    logger.debug('Rendering component ' + rendering.componentName + ' from html');
    return rendered ? react_1.default.createElement(Wrapper, null, rendered) : null;
}
exports.CreateRenderingFromHtml = CreateRenderingFromHtml;
//# sourceMappingURL=CreateRenderingFromHtml.js.map