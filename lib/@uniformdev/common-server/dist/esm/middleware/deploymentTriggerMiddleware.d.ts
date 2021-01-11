import { BuildAndExportEngine } from '../BuildDeployService';
import { Logger } from '@uniformdev/common';
import { UniformServerConfig } from '../UniformServerConfig';
import { CreatePublishProviderFunc } from '..';
export declare function attachDeploymentTriggerMiddleware(server: any, buildAndExportEngine: BuildAndExportEngine, createPublishProvider: CreatePublishProviderFunc, tempDir: string, uniformConfig: UniformServerConfig, logger: Logger): void;
export declare function attachTicketDeploymentTriggerMiddleware(server: any, buildAndExportEngine: BuildAndExportEngine, createPublishProvider: CreatePublishProviderFunc, tempDir: string, uniformConfig: UniformServerConfig, logger: Logger): void;
export declare function attachTicketlessDeploymentTriggerMiddleware(server: any, buildAndExportEngine: BuildAndExportEngine, createPublishProvider: CreatePublishProviderFunc, tempDir: string, uniformConfig: UniformServerConfig, logger: Logger): void;
export declare function getTicketDeploymentTriggerMiddleware(buildAndExportEngine: BuildAndExportEngine, createPublishProvider: CreatePublishProviderFunc, tempDir: string, uniformConfig: UniformServerConfig, logger: Logger): (req: any, res: any) => void;
export declare function getTicketlessDeploymentTriggerMiddleware(buildAndExportEngine: BuildAndExportEngine, createPublishProvider: CreatePublishProviderFunc, tempDir: string, uniformConfig: UniformServerConfig, logger: Logger): (req: any, res: any) => void;
//# sourceMappingURL=deploymentTriggerMiddleware.d.ts.map