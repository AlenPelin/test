import { PublishProvider, PublishProviderOptions } from '.';
export declare class FakePublishProvider implements PublishProvider {
    private readonly logger;
    constructor({ logger }: PublishProviderOptions);
    get behavior(): 'replace-on-deploy' | 'update-on-deploy';
    deploy(path: string): Promise<void>;
}
//# sourceMappingURL=FakePublishProvider.d.ts.map