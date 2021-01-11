export function appendObject(source, target) {
    if (!source) {
        return;
    }
    Object.keys(source).forEach(function (id) {
        target[id] = source[id];
    });
}
//# sourceMappingURL=objects.js.map