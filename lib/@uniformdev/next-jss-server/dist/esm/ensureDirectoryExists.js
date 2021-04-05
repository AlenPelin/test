import { mkdir, existsSync } from 'fs';
export function ensureDirectoryExists(dirPath) {
    return new Promise(function (resolve, reject) {
        if (existsSync(dirPath)) {
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
        mkdir(dirPath, { recursive: true }, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
//# sourceMappingURL=ensureDirectoryExists.js.map