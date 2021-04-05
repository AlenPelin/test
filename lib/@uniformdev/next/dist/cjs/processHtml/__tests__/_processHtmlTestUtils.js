"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderContainerToJSON = void 0;
var react_1 = __importDefault(require("react"));
var utils_1 = require("../../utils");
var contexts_1 = require("../../contexts");
var CreateRenderingFromHtml_1 = require("../CreateRenderingFromHtml");
// @ts-ignore
var react_test_renderer_1 = require("react-test-renderer");
var testLogger = utils_1.createConsoleLogger();
var GlobalTestRender = function (_a) {
    var children = _a.children;
    return (react_1.default.createElement(contexts_1.UniformContextProvider, { componentMap: {}, logger: testLogger }, children));
};
exports.renderContainerToJSON = function (html) {
    var result = react_test_renderer_1.create(react_1.default.createElement(GlobalTestRender, null,
        react_1.default.createElement(CreateRenderingFromHtml_1.CreateRenderingFromHtml, { html: html, renderingContext: {}, rendering: {}, placeholderKey: 'abcd', index: 0 })));
    return result.toJSON();
};
//# sourceMappingURL=_processHtmlTestUtils.js.map