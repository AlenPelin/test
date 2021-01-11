"use strict";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRendering = void 0;
var common_1 = require("@uniformdev/common");
function createRendering(r, _placeholderKey, index, componentMap, props, createElement) {
    // TODO: ensure that consumers are catching these exceptions instead of letting them break the rendering process.
    if (!r) {
        common_1.throwException('no r');
    }
    if (!componentMap || typeof componentMap !== 'function') {
        common_1.throwException('Component map is not defined');
    }
    var tagName = r.componentName || common_1.throwException('No componentName');
    var component = componentMap(tagName) || common_1.throwException('Cannot find component: ' + tagName);
    var key = r.id;
    var newProps = {
        index: index,
        renderingContext: r.renderingContext,
    };
    // TODO: important - must exclude the "placeholderKey" element from final props - otherwise Stack Overflow :)
    var placeholderKey = props.placeholderKey, originalProps = __rest(props, ["placeholderKey"]);
    var finalProps = __assign(__assign({}, originalProps), newProps);
    return createElement(component, { props: finalProps, key: key });
}
exports.createRendering = createRendering;
