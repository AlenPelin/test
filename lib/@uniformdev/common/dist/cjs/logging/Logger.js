"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNullLogger = exports.NullLogger = void 0;
exports.NullLogger = {
    debug: function () { },
    error: function () { },
    info: function () { },
    trace: function () { },
    warn: function () { },
};
function getNullLogger() {
    return exports.NullLogger;
}
exports.getNullLogger = getNullLogger;
//# sourceMappingURL=Logger.js.map