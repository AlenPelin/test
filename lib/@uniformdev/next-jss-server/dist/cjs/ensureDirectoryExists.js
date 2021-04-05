"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDirectoryExists = void 0;
var fs_1 = require("fs");
function ensureDirectoryExists(dirPath) {
    return new Promise(function (resolve, reject) {
        if (fs_1.existsSync(dirPath)) {
            resolve();
            return;
        }
        // The `recursive` option ensures that nested paths are fully created.
        // For example, `/out/data/boutiques-restaurants/agatha` would create
        // the following folder structure:
        // out
        //   data
        //     boutiques-restaurants
        //       agatha
        fs_1.mkdir(dirPath, { recursive: true }, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
exports.ensureDirectoryExists = ensureDirectoryExists;
//# sourceMappingURL=ensureDirectoryExists.js.map