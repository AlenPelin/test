"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var sitecore_jss_react_1 = require("@sitecore-jss/sitecore-jss-react");
function EsiNoOutput(props) {
    return react_1.default.createElement(sitecore_jss_react_1.Placeholder, { name: "esi-no-output", rendering: props.rendering, componentFactory: props.componentFactory });
}
exports.default = EsiNoOutput;
//# sourceMappingURL=EsiNoOutput.js.map