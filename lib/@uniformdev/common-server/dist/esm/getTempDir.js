import fs from 'fs';
export function getTempDir(uniformConfig) {
    var tempDir = uniformConfig.UNIFORM_PUBLISH_TEMP_DIR;
    while (tempDir.endsWith('/') || tempDir.endsWith('\\')) {
        tempDir = tempDir.substr(0, tempDir.length - 1);
    }
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    return tempDir;
}
//# sourceMappingURL=getTempDir.js.map