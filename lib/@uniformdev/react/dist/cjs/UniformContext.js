"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniformContext = void 0;
var react_1 = require("react");
var common_1 = require("@uniformdev/common");
exports.UniformContext = react_1.createContext({
    subscriptions: common_1.getSubscriptionManager(),
    when: new Date()
});
//# sourceMappingURL=UniformContext.js.map