import { Logger } from '@uniformdev/common';
import { StorageProvider, StorageProviderType } from './provider';
export default function getStorageProvider(storage: StorageProviderType, getCustomProvider: ((() => StorageProvider) | undefined), logger: Logger): StorageProvider | undefined;
//# sourceMappingURL=getStorageProvider.d.ts.map