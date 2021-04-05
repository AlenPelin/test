import { getEnv } from '@uniformdev/common';
import { AzurePublishProvider } from '@uniformdev/publishing-azureblobstorage';
import { FakePublishProvider, CustomPublishProvider } from '@uniformdev/common-server';
export function createPublishProvider(options) {
    var config = options.config;
    var provider = getEnv(config.env, 'UNIFORM_PUBLISH_TARGET');
    switch (provider.toLowerCase()) {
        case 'none':
        case 'fake':
            return new FakePublishProvider(options);
        case 'custom':
            return new CustomPublishProvider(options);
        case 'azureblob':
            return new AzurePublishProvider(options);
    }
    throw new Error('Publish provider is not supported: ' + provider);
}
//# sourceMappingURL=createPublishProvider.js.map