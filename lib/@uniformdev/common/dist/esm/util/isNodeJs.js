export function isNodeJs() {
    return !!(typeof process !== 'undefined' && process.env && process.env['PATH']);
}
//# sourceMappingURL=isNodeJs.js.map