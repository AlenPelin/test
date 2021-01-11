"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
function EsiVars(props) {
    return react_1.default.createElement('esi:vars', { value: props.params.value }, undefined);
}
exports.default = EsiVars;
//# sourceMappingURL=EsiVars.js.map