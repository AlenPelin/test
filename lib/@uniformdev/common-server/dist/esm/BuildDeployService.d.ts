import { Logger } from '@uniformdev/common';
import { UniformServerConfig } from '.';
import { Status } from '.';
import { PublishProvider } from '.';
export interface BuildAndExportEngine {
    execute(outputDir: string, config: UniformServerConfig, logger: Logger): Promise<void>;
}
export declare class BuildDeployService {
    static reset(tempDir: string, logger: Logger): Promise<void>;
    static status(outputDir: string): Promise<Status | undefined>;
    static process(tmp: string, buildAndExport: BuildAndExportEngine, publishProvider: PublishProvider, outputDir: string, paths: string[], timer: any, config: UniformServerConfig, logger: Logger, timestamp: string): Promise<void>;
}
//# sourceMappingURL=BuildDeployService.d.ts.map