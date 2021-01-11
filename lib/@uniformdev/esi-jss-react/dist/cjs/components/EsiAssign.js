"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
function EsiAssign(props) {
    return react_1.default.createElement('esi:assign', { name: props.params.name, value: props.params.value }, undefined);
}
exports.default = EsiAssign;
//# sourceMappingURL=EsiAssign.js.map