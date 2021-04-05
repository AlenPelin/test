"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJsonFile = void 0;
var fs_1 = __importDefault(require("fs"));
function writeJsonFile(filePath, data) {
    return new Promise(function (resolve, reject) {
        fs_1.default.writeFile(filePath, JSON.stringify(data, null, 2), { encoding: 'utf-8' }, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
exports.writeJsonFile = writeJsonFile;
//# sourceMappingURL=writeJsonFile.js.map