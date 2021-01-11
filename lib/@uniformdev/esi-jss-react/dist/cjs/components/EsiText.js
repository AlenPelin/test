"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
function EsiText(props) {
    //return React.createElement('esi:text', { value: props.params.value }, undefined);
    if (!props.params.value) {
        return;
    }
    return react_1.default.createElement("span", { dangerouslySetInnerHTML: {
            __html: props.params.value
        } });
}
exports.default = EsiText;
//# sourceMappingURL=EsiText.js.map