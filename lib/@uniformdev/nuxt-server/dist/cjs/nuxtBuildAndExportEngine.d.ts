import { BuildAndExportEngine, UniformServerConfig } from '@uniformdev/common-server';
import { Logger } from '@uniformdev/common';
export declare class NuxtBuildAndExportEngine implements BuildAndExportEngine {
    execute(outputDir: string, config: UniformServerConfig, logger: Logger): Promise<void>;
}
