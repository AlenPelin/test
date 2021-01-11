import { ComponentChangedResult, PersonalizationTriggers } from '../index';
/**
 * Represents a condition that, when true, results
 * in the data provided to a component changing.
 */
export interface PersonalizationRule {
    id: string | null | undefined;
    name: string;
    condition: string;
    dependencies?: string[];
    data: string;
    component?: string;
}
/**
 * Evaluates rule conditions and runs rule actions.
 */
export interface PersonalizationRuleManager<TContext> {
    getFirstMatchingRule: (context: TContext, triggers?: string[]) => Promise<PersonalizationRule | null>;
    getRulesForRendering: (context: TContext) => Array<PersonalizationRule> | null;
    renderingHasPersonalizationRules: (context: TContext) => boolean;
    runRuleActions: (rule: PersonalizationRule, context: TContext) => Promise<ComponentChangedResult>;
    triggers?: PersonalizationTriggers;
}
/**
 * Gets a manager that doesn't actually personalize.
 */
export declare function getDisabledPersonalizationRuleManager<TContext>(): PersonalizationRuleManager<TContext>;
export * from './sitecore';
//# sourceMappingURL=index.d.ts.map