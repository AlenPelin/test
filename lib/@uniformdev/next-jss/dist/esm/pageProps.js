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
// Merge any page props with it's defaults
// This is a shallow merge for all props apart from jssConfig
export function mergeProps(props, defaultProps) {
    var mergedProps = __assign(__assign({}, defaultProps), props);
    // If props contains a jssConfig object, we want to merge it with defaultProps jssConfig, not replace.
    if (props.jssConfig) {
        mergedProps.jssConfig = __assign(__assign({}, defaultProps.jssConfig), props.jssConfig);
    }
    return mergedProps;
}
//# sourceMappingURL=pageProps.js.map