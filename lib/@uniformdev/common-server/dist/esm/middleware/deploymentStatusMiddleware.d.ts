import { UniformServerConfig } from '../UniformServerConfig';
import { Logger } from '@uniformdev/common';
export declare function attachDeploymentStatusMiddleware(server: any, tempDir: string, uniformConfig: UniformServerConfig, logger: Logger): void;
export declare function getDeploymentStatusMiddleware(tempDir: string, uniformConfig: UniformServerConfig, logger: Logger): (req: any, res: any) => Promise<void>;
//# sourceMappingURL=deploymentStatusMiddleware.d.ts.map