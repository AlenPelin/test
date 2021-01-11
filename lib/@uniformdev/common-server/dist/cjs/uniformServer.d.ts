import { Application } from 'express';
import { Logger } from '@uniformdev/common';
import { UniformServerConfig, CreatePublishProviderFunc } from '.';
import { BuildAndExportEngine } from '.';
export declare function createUniformServer(buildAndExportEngine: BuildAndExportEngine, logger: Logger, options?: {
    uniformServerConfig?: UniformServerConfig;
    createPublishProvider?: CreatePublishProviderFunc;
}): Promise<Application>;
export declare function attachUniformServicesToServer(server: any, buildAndExportEngine: BuildAndExportEngine, logger: Logger, options?: {
    uniformServerConfig?: UniformServerConfig;
    createPublishProvider?: CreatePublishProviderFunc;
}): void;
export declare function startUniformServer(server: Application, uniformServerConfig: UniformServerConfig, logger: Logger): void;
//# sourceMappingURL=uniformServer.d.ts.map