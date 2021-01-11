"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var sitecore_jss_react_1 = require("@sitecore-jss/sitecore-jss-react");
function EsiForEach(props) {
    var placeholder = react_1.default.createElement(sitecore_jss_react_1.Placeholder, { name: "esi-for-each", rendering: props.rendering, componentFactory: props.componentFactory });
    // NOTE: need to use `React.createElement` to create namespaced elements, e.g. `<esi.choose>`
    // JSX isn't really capable of handling namespaced elements. There are some hacks for SVG,
    // but it's easier to just use `createElement`.
    return react_1.default.createElement('esi:foreach', { item: props.params.item, collection: props.params.collection }, placeholder);
}
exports.default = EsiForEach;
//# sourceMappingURL=EsiForEach.js.map