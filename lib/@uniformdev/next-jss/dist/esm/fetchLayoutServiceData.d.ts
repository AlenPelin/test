import { UniformEnvironment } from './interfaces';
export interface FetchLayoutServiceDataOptions {
    env: UniformEnvironment;
    layoutServiceConfig: any;
    queryStringParams: any;
}
export declare function fetchLayoutServiceData(route: string, language: string, { env, layoutServiceConfig, queryStringParams, ...options }: FetchLayoutServiceDataOptions): Promise<any>;
//# sourceMappingURL=fetchLayoutServiceData.d.ts.map