import { useContext } from 'react';
import { StaticAssetContext } from './StaticAssetContext';
export default function StaticAsset(_a) {
    var path = _a.path, children = _a.children;
    var assetPrefix = useContext(StaticAssetContext).assetPrefix;
    var newProps = {
        path: "" + (assetPrefix ? assetPrefix : '') + path,
    };
    return children(newProps);
}
//# sourceMappingURL=StaticAsset.js.map