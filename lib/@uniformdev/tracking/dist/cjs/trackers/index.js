"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
var tracker_1 = require("./tracker");
__createBinding(exports, tracker_1, "UniformCookieNames");
var getTracker_1 = require("./getTracker");
__createBinding(exports, getTracker_1, "getDefaultTracker");
var nullTracker_1 = require("./nullTracker");
__createBinding(exports, nullTracker_1, "getNullTracker");
__exportStar(require("./handleDestinations"), exports);
__exportStar(require("./handleTrackerEvents"), exports);
__exportStar(require("./global"), exports);
__exportStar(require("./ga"), exports);
__exportStar(require("./oracleDmp"), exports);
__exportStar(require("./xdb"), exports);
//# sourceMappingURL=index.js.map