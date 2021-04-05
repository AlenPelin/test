"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveExportOutDir = void 0;
var path_1 = require("path");
function resolveExportOutDir() {
    // Unfortunately there isn't a way to obtain the `outDir` value that NextJs uses for exporting at runtime.
    // So, we ask that if devs use a custom `--outdir` flag for `next export` that they also set an environment
    // variable that we can use when writing export data.
    // Next.js export defaults to the `/out` folder in the src root, so we use that as our default as well.
    var exportOutDir = process.env.EXPORT_OUT_DIR || path_1.resolve(process.cwd(), 'out');
    return exportOutDir;
}
exports.resolveExportOutDir = resolveExportOutDir;
//# sourceMappingURL=resolveExportOutDir.js.map