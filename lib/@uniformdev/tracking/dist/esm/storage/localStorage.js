var LocalStorageProvider = /** @class */ (function () {
    function LocalStorageProvider() {
    }
    LocalStorageProvider.prototype.read = function (visitorId, _logger) {
        if (visitorId) {
            var value = localStorage.getItem(visitorId);
            if (value) {
                return JSON.parse(value);
            }
        }
        return undefined;
    };
    LocalStorageProvider.prototype.write = function (visitor, _logger) {
        if (visitor && visitor.id) {
            localStorage.setItem(visitor.id, JSON.stringify(visitor));
        }
    };
    return LocalStorageProvider;
}());
export { LocalStorageProvider };
//# sourceMappingURL=localStorage.js.map