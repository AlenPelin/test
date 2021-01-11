import { ClientScripts } from '@uniformdev/common-client';
/**
 * Runs after the scripts are loaded.
 * @callback scriptsLoadedCallback
 */
/**
 * Loads a script and calls a callback when the script is finished loading.
 * @param {TrackerScripts} scripts - Urls for the scripts to load.
 * @param {scriptsLoadedCallback} callback - Function that is called after the scripts are loaded.
 */
export declare function useScripts(scripts: ClientScripts, callback: () => void): void;
//# sourceMappingURL=useScripts.d.ts.map