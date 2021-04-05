"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertAttribs = void 0;
var attribMap = {
    onclick: function (attribValue) { return ['onClick', function () { return eval(attribValue); }]; },
    href: function (attribValue, node, logger) {
        if (/^javascript:/.test(attribValue)) {
            logger.warn("Changed javascript:void to # on node " + node.name);
            return ['href', '#'];
        }
        else {
            return ['href', attribValue];
        }
    },
};
/**
 * Convert the attributes on any node based on the
 * attribMap above.
 */
exports.convertAttribs = function (node, logger) {
    if (node.attribs) {
        for (var key in node.attribs) {
            try {
                var mapper = attribMap[key.toLowerCase()];
                if (mapper) {
                    var _a = __read(mapper(node.attribs[key], node, logger), 2), newAttrib = _a[0], value = _a[1];
                    delete node.attribs[key];
                    node.attribs[newAttrib] = value;
                }
                else {
                    node.attribs[key] = decodeURI(node.attribs[key]);
                }
            }
            catch (ex) {
                logger.debug('ERROR DECODING URI: ' + node.attribs[key]);
            }
        }
    }
};
//# sourceMappingURL=attribMap.js.map