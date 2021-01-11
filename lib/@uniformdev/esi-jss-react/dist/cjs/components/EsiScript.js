"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
function EsiScript(props) {
    return react_1.default.createElement("script", { dangerouslySetInnerHTML: { __html: props.params.script } });
    //return React.createElement('esi:text', { value: props.params.script }, undefined);
}
exports.default = EsiScript;
//# sourceMappingURL=EsiScript.js.map