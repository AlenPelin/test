import { PersonalizationRule } from './ruleManagers';
import { Description } from '@uniformdev/common';
import { PersonalizationChanges } from '@uniformdev/tracking';
/**
 * Represents that a personalization rule matched,
 * resulting in the component changing.
 */
export interface ComponentChangedResult {
    activity?: any;
    changes?: PersonalizationChanges;
    component: Description;
    data?: any;
    fields: any;
    rule?: PersonalizationRule;
}
export * from './personalizationManagers/index';
export * from './testManagers/index';
export * from './ruleManagers/index';
export * from './listScoring';
//# sourceMappingURL=index.d.ts.map