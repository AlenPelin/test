import { Visitor } from '../models/visitor';
import { Logger } from '@uniformdev/common';
export declare type StorageProviderType = 'local' | 'custom' | 'default';
export declare function getStorageProvider(storage: StorageProviderType, getCustomProvider: ((() => StorageProvider) | undefined), logger: Logger): StorageProvider | undefined;
export interface StorageProvider {
    read: (visitorId: string, logger?: Logger) => Visitor | undefined;
    write: (visitor: Visitor, logger?: Logger) => void;
}
//# sourceMappingURL=provider.d.ts.map