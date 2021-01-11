import { Visitor } from '../models/visitor';
import { Logger } from '@uniformdev/common';
import { StorageProvider } from './provider';
export declare class LocalStorageProvider implements StorageProvider {
    read(visitorId: string, _logger?: Logger): Visitor | undefined;
    write(visitor: Visitor, _logger?: Logger): void;
}
//# sourceMappingURL=localStorage.d.ts.map