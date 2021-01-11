import { PublishProviderWithLocalJsonDatabase, PublishProviderOptions } from '@uniformdev/common-server';
export declare type AzureBlobSite = {
    url: string;
};
export declare class AzurePublishProvider extends PublishProviderWithLocalJsonDatabase<AzureBlobSite> {
    private readonly azureTargetUrlWithSAS;
    private readonly container;
    private readonly blobService;
    private readonly connectionString;
    private readonly accessKey;
    private readonly accountName;
    private readonly azcopyPath;
    private readonly azureFallbackEnabled;
    get behavior(): 'replace-on-deploy' | 'update-on-deploy';
    constructor({ config, logger }: PublishProviderOptions);
    private createBlobService;
    private enableWebSite;
    private createContainerIfNotExist;
    deploy(rootPath: string): Promise<void>;
    private createAuthenticatedContainerUrl;
    private deployUsingAzCopy;
    private deployUsingJavaScriptSDK;
}
//# sourceMappingURL=AzurePublishProvider.d.ts.map