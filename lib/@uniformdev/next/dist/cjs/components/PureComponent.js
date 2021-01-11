"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PureComponent = void 0;
var react_1 = __importDefault(require("react"));
var common_1 = require("@uniformdev/common");
var PureComponent = /** @class */ (function (_super) {
    __extends(PureComponent, _super);
    function PureComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(PureComponent.prototype, "item", {
        get: function () {
            return this.props.renderingContext.item || common_1.throwException('no item');
        },
        enumerable: false,
        configurable: true
    });
    return PureComponent;
}(react_1.default.PureComponent));
exports.PureComponent = PureComponent;
//# sourceMappingURL=PureComponent.js.map