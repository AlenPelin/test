import React from 'react';
import { Placeholder } from '@sitecore-jss/sitecore-jss-react';
export default function EsiInclude(props) {
    var placeholder = (React.createElement(Placeholder, { name: "esi-include", rendering: props.rendering, componentFactory: props.componentFactory, missingComponentComponent: props.missingComponentComponent, errorComponent: props.errorComponent }));
    // NOTE: need to use `React.createElement` to create namespaced elements, e.g. `<esi.choose>`
    // JSX isn't really capable of handling namespaced elements. There are some hacks for SVG,
    // but it's easier to just use `createElement`.
    return React.createElement('esi:include', {}, placeholder);
}
//# sourceMappingURL=EsiInclude.js.map