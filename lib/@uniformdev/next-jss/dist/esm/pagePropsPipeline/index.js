var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { resolveParams } from '../routeUtils';
import { pagePropsPipeline } from './pipeline';
import { getNextConfig } from '@uniformdev/next';
export { pagePropsPipeline } from './pipeline';
export function getPageProps(options) {
    var _a = resolveParams(options.routeParams, function () {
        return typeof options.env.getCurrentLanguage === 'function'
            ? options.env.getCurrentLanguage()
            : getNextConfig().defaultLanguage;
    }), resolvedRoute = _a.resolvedRoute, resolvedLanguage = _a.resolvedLanguage, queryStringParams = _a.queryStringParams;
    var context = __assign(__assign({ props: {} }, options), { routeParams: __assign({ sitecoreRoute: resolvedRoute, lang: resolvedLanguage }, queryStringParams) });
    return pagePropsPipeline.run(context).then(function (context) { return context.props; });
}
//# sourceMappingURL=index.js.map