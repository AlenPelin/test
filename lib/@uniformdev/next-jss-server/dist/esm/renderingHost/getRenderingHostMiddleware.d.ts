export interface RouteInfo {
    pathname: string;
    params: any;
}
export interface JssRenderingHostMiddlewareOptions {
    routeResolver?: (routeInfo: RouteInfo) => RouteInfo;
}
export declare function getJssRenderingHostMiddleware(app: any, { routeResolver }?: JssRenderingHostMiddlewareOptions): (req: any, res: any) => Promise<void>;
//# sourceMappingURL=getRenderingHostMiddleware.d.ts.map