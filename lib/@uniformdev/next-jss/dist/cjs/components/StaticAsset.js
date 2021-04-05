"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var StaticAssetContext_1 = require("./StaticAssetContext");
function StaticAsset(_a) {
    var path = _a.path, children = _a.children;
    var assetPrefix = react_1.useContext(StaticAssetContext_1.StaticAssetContext).assetPrefix;
    var newProps = {
        path: "" + (assetPrefix ? assetPrefix : '') + path,
    };
    return children(newProps);
}
exports.default = StaticAsset;
//# sourceMappingURL=StaticAsset.js.map