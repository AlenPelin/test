import React from 'react';
import { Placeholder } from '@sitecore-jss/sitecore-jss-react';
export default function EsiWhen(props) {
    var placeholder = React.createElement(Placeholder, { name: "esi-when", rendering: props.rendering, componentFactory: props.componentFactory });
    //const wrappedPlaceholder = React.createElement('esi:text', null, placeholder);
    var activities = getPersonalizationEsi(props);
    // NOTE: need to use `React.createElement` to create namespaced elements, e.g. `<esi.choose>`
    // JSX isn't really capable of handling namespaced elements. There are some hacks for SVG,
    // but it's easier to just use `createElement`.
    return React.createElement('esi:when', { test: props.params.test }, placeholder, activities);
}
var SCRIPT_TEMPLATE = "if (window) { if (!window.uniform) window.uniform = {}; if (!window.uniform.tracking) window.uniform.tracking = {}; if (!window.uniform.tracking.personalization) window.uniform.tracking.personalization = {}; window.uniform.tracking.personalization['RENDERING_UID'] = RULE_JSON;}";
/**
 * If personalization details are assigned to the rendering, it
 * means the rendering was personalized. The details of the
 * personalization are written to a global js object so the
 * tracker can translate them into activities on the client.
 *
 * Similar logic is also implemented for non-SSR rendering.
 * See AddPersonalizationDataToWhenNode.
 * @param props
 */
function getPersonalizationEsi(props) {
    var _a;
    var personalization = props.rendering.personalization;
    var uid = props.rendering.uid;
    if ((_a = personalization === null || personalization === void 0 ? void 0 : personalization.rule) === null || _a === void 0 ? void 0 : _a.id) {
        return React.createElement("script", { dangerouslySetInnerHTML: { __html: SCRIPT_TEMPLATE.replace("RENDERING_UID", uid).replace("RULE_JSON", JSON.stringify(personalization))
            } });
    }
    return undefined;
}
//# sourceMappingURL=EsiWhen.js.map