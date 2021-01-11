import { Logger } from '@uniformdev/common';
import { PublishProvider } from './PublishProvider';
export declare abstract class PublishProviderWithLocalJsonDatabase<T extends object> implements PublishProvider {
    private dbPath;
    private readonly db;
    protected readonly logger: Logger;
    constructor(dbPath: string, logger: Logger);
    protected get site(): T;
    protected set site(value: T);
    /**
     * Deploys files from given path, and returns live site URL
     * @param path to the directory to deploy to CDN
     */
    abstract deploy(path: string): Promise<void>;
    abstract behavior: 'replace-on-deploy' | 'update-on-deploy';
}
//# sourceMappingURL=PublishProviderWithLocalJsonDatabase.d.ts.map