import { PublishProviderOptions } from '.';
import { PublishProvider } from '.';
export declare class CustomPublishProvider implements PublishProvider {
    private command;
    private readonly logger;
    constructor({ config, logger }: PublishProviderOptions);
    behavior: 'replace-on-deploy' | 'update-on-deploy';
    deploy(path: string): Promise<void>;
}
//# sourceMappingURL=CustomPublishProvider.d.ts.map