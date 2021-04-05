"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Placeholder = void 0;
var react_1 = __importDefault(require("react"));
var common_client_1 = require("@uniformdev/common-client");
var contexts_1 = require("../contexts");
var processHtml_1 = require("../processHtml");
function Placeholder(_a) {
    var placeholderKey = _a.placeholderKey, renderingContext = _a.renderingContext;
    var logger = contexts_1.useUniformContext().logger;
    if (placeholderKey === undefined || placeholderKey === null) {
        throw new Error('The props.placeholderKey is not defined');
    }
    placeholderKey = common_client_1.parsePlaceholderKey(placeholderKey);
    var visibleRenderings = common_client_1.popVisibleRenderingsFromPlaceholdersMap(renderingContext.placeholders, placeholderKey, logger);
    return (react_1.default.createElement(react_1.default.Fragment, null, visibleRenderings.map(function (rendering, index) { return (react_1.default.createElement(processHtml_1.CreateRendering, { key: index, index: index, rendering: rendering, placeholderKey: placeholderKey, renderingContext: renderingContext })); })));
}
exports.Placeholder = Placeholder;
//# sourceMappingURL=Placeholder.js.map