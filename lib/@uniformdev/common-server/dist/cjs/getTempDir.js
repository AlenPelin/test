"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTempDir = void 0;
var fs_1 = __importDefault(require("fs"));
function getTempDir(uniformConfig) {
    var tempDir = uniformConfig.UNIFORM_PUBLISH_TEMP_DIR;
    while (tempDir.endsWith('/') || tempDir.endsWith('\\')) {
        tempDir = tempDir.substr(0, tempDir.length - 1);
    }
    if (!fs_1.default.existsSync(tempDir)) {
        fs_1.default.mkdirSync(tempDir, { recursive: true });
    }
    return tempDir;
}
exports.getTempDir = getTempDir;
//# sourceMappingURL=getTempDir.js.map