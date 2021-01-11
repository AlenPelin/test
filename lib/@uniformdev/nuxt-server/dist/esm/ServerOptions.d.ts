import { Logger } from '@uniformdev/common';
import { CreatePublishProviderFunc } from '@uniformdev/common-server';
export interface ServerOptions {
    config: any;
    logger: Logger;
    /**
     * Specifies publish provider's factory.
     *
     * @return {string} Publish provider.
     */
    createPublishProvider?: CreatePublishProviderFunc;
}
