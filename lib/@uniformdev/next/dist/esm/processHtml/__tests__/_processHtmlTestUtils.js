import React from 'react';
import { createConsoleLogger } from '../../utils';
import { UniformContextProvider } from '../../contexts';
import { CreateRenderingFromHtml } from '../CreateRenderingFromHtml';
// @ts-ignore
import { create } from 'react-test-renderer';
var testLogger = createConsoleLogger();
var GlobalTestRender = function (_a) {
    var children = _a.children;
    return (React.createElement(UniformContextProvider, { componentMap: {}, logger: testLogger }, children));
};
export var renderContainerToJSON = function (html) {
    var result = create(React.createElement(GlobalTestRender, null,
        React.createElement(CreateRenderingFromHtml, { html: html, renderingContext: {}, rendering: {}, placeholderKey: 'abcd', index: 0 })));
    return result.toJSON();
};
//# sourceMappingURL=_processHtmlTestUtils.js.map