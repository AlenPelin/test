import { Logger } from '@uniformdev/common';
import { CreatePublishProviderFunc } from '@uniformdev/common-server';
export interface ServerOptions {
    logger: Logger;
    extensionFilter: Array<string>;
    pathFilter: Array<string>;
    /**
     * Specifies publish provider's factory.
     *
     * @return {string} Publish provider.
     */
    createPublishProvider?: CreatePublishProviderFunc;
}
//# sourceMappingURL=ServerOptions.d.ts.map