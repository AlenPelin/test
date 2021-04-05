import React from 'react';
import { parsePlaceholderKey, popVisibleRenderingsFromPlaceholdersMap, } from '@uniformdev/common-client';
import { useUniformContext } from '../contexts';
import { CreateRendering } from '../processHtml';
export function Placeholder(_a) {
    var placeholderKey = _a.placeholderKey, renderingContext = _a.renderingContext;
    var logger = useUniformContext().logger;
    if (placeholderKey === undefined || placeholderKey === null) {
        throw new Error('The props.placeholderKey is not defined');
    }
    placeholderKey = parsePlaceholderKey(placeholderKey);
    var visibleRenderings = popVisibleRenderingsFromPlaceholdersMap(renderingContext.placeholders, placeholderKey, logger);
    return (React.createElement(React.Fragment, null, visibleRenderings.map(function (rendering, index) { return (React.createElement(CreateRendering, { key: index, index: index, rendering: rendering, placeholderKey: placeholderKey, renderingContext: renderingContext })); })));
}
//# sourceMappingURL=Placeholder.js.map