import { ContextReader } from '../../contextReader';
import { Logger } from '@uniformdev/common';
export declare const CONTEXT_SOURCE_SITECORE = "sitecore";
export declare type SitecoreContextReaderType = 'cookie' | 'js' | 'jss' | 'uniform' | 'default';
export declare function getSitecoreContextReader(type: SitecoreContextReaderType, logger?: Logger): ContextReader;
/**
 * Used to implement the logic to update the profile score.
 */
export interface UpdateCurrentValue {
    (newValue: number, currentValue: number, updateCount: number): number;
}
//# sourceMappingURL=contextReaders.d.ts.map