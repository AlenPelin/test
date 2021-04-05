export interface PathMap {
    [route: string]: {
        page: string;
    };
}
export interface DisconnectedExportPathMapConfig {
    rootPath?: string;
}
export declare const getDisconnectedExportPathMap: ({ rootPath, }: DisconnectedExportPathMapConfig) => (defaultPathMap: PathMap) => Promise<PathMap>;
//# sourceMappingURL=exportPathMap.d.ts.map