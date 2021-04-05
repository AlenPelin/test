import { CustomizeContextFunction, CustomizeRenderFunction } from '@sitecore-jss/sitecore-jss-dev-tools';
import { UniformJssConfig } from '@uniformdev/next-jss';
import { DisconnectedServerOptions } from '@sitecore-jss/sitecore-jss-dev-tools/types/disconnected-server/create-default-disconnected-server';
export interface PackageJsonConfig {
    appName: string;
    language: string;
}
export declare const getDisconnectedServerOptions: (server: any, config: UniformJssConfig | PackageJsonConfig) => DisconnectedServerOptions;
export declare function attachDisconnectedServices(server: any, config: UniformJssConfig | PackageJsonConfig): Promise<void>;
export declare const customizeContext: CustomizeContextFunction;
export declare const customizeRendering: CustomizeRenderFunction;
//# sourceMappingURL=disconnectedModeMiddleware.d.ts.map