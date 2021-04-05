export interface StaticExportPath {
    params: {
        slug?: string[];
    };
}
export interface PathMap {
    [route: string]: {
        page: string;
    };
}
export declare const getStaticPaths: (pathMap?: PathMap | undefined) => Promise<StaticExportPath[]>;
//# sourceMappingURL=staticPaths.d.ts.map