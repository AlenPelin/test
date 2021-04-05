import { Logger } from '@uniformdev/common';
export interface ClientScript {
    id: string;
    url: string;
    notAsync?: boolean;
}
export interface ClientScripts {
    [scriptId: string]: string;
}
export interface LoadClientScriptsArgs {
    callback?: () => void;
    cachedScripts?: ClientScripts;
    logger?: Logger;
}
export interface ClientScriptLoader {
    load: (scripts: ClientScripts, args: LoadClientScriptsArgs) => Promise<boolean>;
    type: string;
}
export declare function getClientScriptLoader(): ClientScriptLoader;
//# sourceMappingURL=scriptLoader.d.ts.map