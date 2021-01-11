export function getSubscriptionManager(isGlobal) {
    return new DefaultSubscriptionManager(isGlobal);
}
var DefaultSubscriptionManager = /** @class */ (function () {
    function DefaultSubscriptionManager(isGlobal) {
        if (isGlobal === void 0) { isGlobal = false; }
        this.allEvents = [];
        this.isGlobal = isGlobal;
        this.map = new Map();
        this.publish = this.publish.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.getSubscribers = this.getSubscribers.bind(this);
    }
    DefaultSubscriptionManager.prototype.subscribe = function (type, callback) {
        var callbacks = this.map.get(type);
        if (!callbacks) {
            callbacks = [];
            this.map.set(type, callbacks);
        }
        if (callbacks.indexOf(callback) == -1) {
            callbacks.push(callback);
            this.map.set(type, callbacks);
        }
        return function () {
            var position = callbacks.indexOf(callback);
            if (position == -1) {
                return false;
            }
            callbacks.splice(position, 1);
            return true;
        };
    };
    DefaultSubscriptionManager.prototype.publish = function (data) {
        var _a;
        if (data.silent === true) {
            return;
        }
        var callbacks = this.map.get(data.type);
        if (callbacks) {
            callbacks.forEach(function (callback) { return callback(data); });
        }
        var callbacks2 = this.map.get(undefined);
        if (callbacks2) {
            callbacks2.forEach(function (callback) { return callback(data); });
        }
        if (this.isGlobal != true) {
            if ((_a = window.uniform) === null || _a === void 0 ? void 0 : _a.subscriptions) {
                window.uniform.subscriptions.publish(data);
            }
        }
    };
    DefaultSubscriptionManager.prototype.getSubscribers = function (type) {
        var _a;
        return (_a = this.map.get(type)) !== null && _a !== void 0 ? _a : [];
    };
    return DefaultSubscriptionManager;
}());
//# sourceMappingURL=subscriptions.js.map