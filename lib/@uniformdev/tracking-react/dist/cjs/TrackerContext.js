"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackerContext = void 0;
const react_1 = require("react");
const common_1 = require("@uniformdev/common");
exports.TrackerContext = react_1.createContext({
    subscriptions: common_1.getSubscriptionManager()
});
//# sourceMappingURL=TrackerContext.js.map