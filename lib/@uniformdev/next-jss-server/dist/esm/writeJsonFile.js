import fs from 'fs';
export function writeJsonFile(filePath, data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), { encoding: 'utf-8' }, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
//# sourceMappingURL=writeJsonFile.js.map