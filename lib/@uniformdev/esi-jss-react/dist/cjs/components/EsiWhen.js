"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var sitecore_jss_react_1 = require("@sitecore-jss/sitecore-jss-react");
function EsiWhen(props) {
    var placeholder = react_1.default.createElement(sitecore_jss_react_1.Placeholder, { name: "esi-when", rendering: props.rendering, componentFactory: props.componentFactory });
    //const wrappedPlaceholder = React.createElement('esi:text', null, placeholder);
    var activities = getPersonalizationEsi(props);
    // NOTE: need to use `React.createElement` to create namespaced elements, e.g. `<esi.choose>`
    // JSX isn't really capable of handling namespaced elements. There are some hacks for SVG,
    // but it's easier to just use `createElement`.
    return react_1.default.createElement('esi:when', { test: props.params.test }, placeholder, activities);
}
exports.default = EsiWhen;
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
        return react_1.default.createElement("script", { dangerouslySetInnerHTML: { __html: SCRIPT_TEMPLATE.replace("RENDERING_UID", uid).replace("RULE_JSON", JSON.stringify(personalization))
            } });
    }
    return undefined;
}
//# sourceMappingURL=EsiWhen.js.map