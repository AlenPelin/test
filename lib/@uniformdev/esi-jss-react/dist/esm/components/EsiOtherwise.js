import React from 'react';
import { Placeholder } from '@sitecore-jss/sitecore-jss-react';
export default function EsiOtherwise(props) {
    var placeholder = React.createElement(Placeholder, { name: "esi-otherwise", rendering: props.rendering, componentFactory: props.componentFactory });
    // NOTE: need to use `React.createElement` to create namespaced elements, e.g. `<esi.choose>`
    // JSX isn't really capable of handling namespaced elements. There are some hacks for SVG,
    // but it's easier to just use `createElement`.
    return React.createElement('esi:otherwise', {}, placeholder);
}
//# sourceMappingURL=EsiOtherwise.js.map