"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyByPath = void 0;
// Inspired by: https://stackoverflow.com/a/22129960/9324
/**
 * Examples:
 * {
 *   prop1: {
 *     prop2: {
 *       prop3: 'deep',
 *       prop4: [
 *         { prop5: 'deeper' }
 *       ]
 *     }
 *   }
 * }
 * 'prop1.prop2.prop3' == 'deep'
 * 'prop1.prop2.prop4.0.prop5' == 'deeper'
 */
function getPropertyByPath(obj, propPath, defaultValue) {
    return propPath.split('.').reduce(function (o, p) { return (o && o[p]) || defaultValue; }, obj);
}
exports.getPropertyByPath = getPropertyByPath;
//# sourceMappingURL=getPropertyByPath.js.map