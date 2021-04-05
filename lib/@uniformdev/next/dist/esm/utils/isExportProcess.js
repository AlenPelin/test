/*
 * Next export workers/child processes set `__NEXT_DATA__.nextExport = true` when exporting.
 * We can use that to ensure our code is only being called when intended.
 */
export function isExportProcess() {
    return (process.env.UNIFORM_BUILD_MODE !== 'ssr' ||
        (typeof global !== 'undefined' &&
            global.__NEXT_DATA__ &&
            global.__NEXT_DATA__.nextExport));
}
//# sourceMappingURL=isExportProcess.js.map