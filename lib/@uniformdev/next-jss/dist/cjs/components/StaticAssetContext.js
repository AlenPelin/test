"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticAssetContextProvider = exports.StaticAssetContext = void 0;
var react_1 = __importStar(require("react"));
exports.StaticAssetContext = react_1.createContext({
    assetPrefix: '',
});
// This will act as our "store" for the asset prefix. We generally
// only receive an `assetPrefix` value from SSR hydration. However,
// on client-side route change, the `getInitialProps` method is executed and will
// pass an empty `assetPrefix` value into the app. We want to preserve the
// `assetPrefix` value between client-side route changes, so we store the
// initial value here and only change it if a _defined_ assetPrefix value is received.
var currentAssetPrefix = '';
exports.StaticAssetContextProvider = function (_a) {
    var _b = _a.assetPrefix, assetPrefix = _b === void 0 ? '' : _b, children = _a.children;
    if (assetPrefix) {
        currentAssetPrefix = assetPrefix;
    }
    return (react_1.default.createElement(exports.StaticAssetContext.Provider, { value: { assetPrefix: currentAssetPrefix } }, children));
};
//# sourceMappingURL=StaticAssetContext.js.map