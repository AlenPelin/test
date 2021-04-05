import { Logger } from '@uniformdev/common';
import { UniformServerConfig } from '..';
export declare function attachStatusMiddleware(server: any, uniformConfig: UniformServerConfig, logger: Logger): void;
export declare function getStatusMiddleware(uniformConfig: UniformServerConfig, logger: Logger): (req: any, res: any) => Promise<void>;
export declare function tryGetAppInfo(logger: Logger): {
    version?: string;
    description?: string;
} | null;
//# sourceMappingURL=statusMiddleware.d.ts.map