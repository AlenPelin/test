import { SubscriptionManager, UniformEvent } from '@uniformdev/common';
import { PersonalizationRule } from '../ruleManagers/index';
import { PersonalizationChanges } from '@uniformdev/tracking';
import { TestManager } from '../testManagers';
export interface PageDescription {
    id?: string;
    name?: string;
}
export declare type PersonalizationManagerEventType = 'state-changed';
export interface PersonalizationTriggers {
    [componentId: string]: string[];
}
export interface PersonalizationManager<TComponent, TPage> {
    disabled: boolean;
    onTrigger(trigger: string, component: TComponent): Promise<void>;
    page: TPage | undefined;
    personalize(component: TComponent): Promise<void>;
    subscriptions: SubscriptionManager<PersonalizationManagerEvent>;
    testManager?: TestManager;
    triggers?: PersonalizationTriggers;
}
export interface PersonalizationManagerEvent extends UniformEvent {
    activity?: any;
    changes?: PersonalizationChanges;
    component?: string;
    data?: any;
    error?: any;
    includedInTest?: boolean;
    isLoading?: boolean;
    page?: PageDescription;
    personalizedData?: any;
    rule?: PersonalizationRule;
}
export * from './sitecore';
export * from './contextReaders';
export * from './sitecoreEsi';
//# sourceMappingURL=index.d.ts.map