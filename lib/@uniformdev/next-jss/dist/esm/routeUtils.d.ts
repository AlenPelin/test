export declare function formatRoute(route: string): string;
export declare function ensureLeadingSlash(route: string): string;
export declare function removeQueryStringFromRoute(route: string): string;
export interface RouteParams {
    sitecoreRoute: string;
    lang: string;
}
export declare function resolveParams(routeParams: Partial<RouteParams>, getCurrentLanguage: () => string): {
    resolvedRoute: string;
    resolvedLanguage: string;
    queryStringParams: {};
};
//# sourceMappingURL=routeUtils.d.ts.map