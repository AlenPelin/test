import React, { createContext } from 'react';
export var StaticAssetContext = createContext({
    assetPrefix: '',
});
// This will act as our "store" for the asset prefix. We generally
// only receive an `assetPrefix` value from SSR hydration. However,
// on client-side route change, the `getInitialProps` method is executed and will
// pass an empty `assetPrefix` value into the app. We want to preserve the
// `assetPrefix` value between client-side route changes, so we store the
// initial value here and only change it if a _defined_ assetPrefix value is received.
var currentAssetPrefix = '';
export var StaticAssetContextProvider = function (_a) {
    var _b = _a.assetPrefix, assetPrefix = _b === void 0 ? '' : _b, children = _a.children;
    if (assetPrefix) {
        currentAssetPrefix = assetPrefix;
    }
    return (React.createElement(StaticAssetContext.Provider, { value: { assetPrefix: currentAssetPrefix } }, children));
};
//# sourceMappingURL=StaticAssetContext.js.map