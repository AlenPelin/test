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
import { processDefaultNode } from './buildDefaultNodeProcessor';
export var buildButtonTag = function () { return ({
    replaceChildren: false,
    shouldProcessNode: function (node) {
        return node.name === 'button';
    },
    processNode: function (node, children, index) {
        var _a = node.attribs, onclick = _a.onclick, props = __rest(_a, ["onclick"]);
        // moving class -> className
        props.className = node.attribs['class'];
        delete props.class;
        props.onClick = function () { return eval(onclick); };
        node.attribs = props;
        return processDefaultNode(node, children, index);
        // React.createElement(node.name, props, children);
    },
}); };
//# sourceMappingURL=buildButtonTag.js.map