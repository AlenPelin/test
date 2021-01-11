import { PersonalizationManagerEvent } from '../personalizationManagers/index';
import { PersonalizationRuleManager, PersonalizationRule } from './index';
import { Logger, SubscriptionManager } from '@uniformdev/common';
import { SitecoreItem } from '../personalizationManagers/sitecore';
/**
 * Settings that describe the personalization rules
 * and data that is used when a rule matches. This
 * object is read from either the JSS Layout Service
 * or the Uniform Page Service.
 */
export interface RuleBasedRenderingPersonalizationDefinition {
    rules: {
        [renderingUid: string]: Array<PersonalizationRule>;
    };
    data: {
        [dataId: string]: any;
    };
    sources: {
        [dataId: string]: any;
    };
    components: {
        [componentId: string]: any;
    };
}
/**
 * Represents information used when retrieving and
 * executing personalization rules.
 */
export interface RenderingPersonalizationContext {
    uid: string;
    dataSource?: string;
    componentName: string;
    defaultDataSource?: string;
}
/**
 * Settings used to initialize a personalization rule manager.
 */
export interface GetSitecorePersonalizationRuleManagerArgs {
    definitions: RuleBasedRenderingPersonalizationDefinition | undefined | null;
    item?: SitecoreItem;
    logger?: Logger;
    subscriptions?: SubscriptionManager<PersonalizationManagerEvent>;
}
/**
 * Gets a new manager using the specified settings.
 * @param args
 */
export declare function getSitecorePersonalizationRuleManager(args: GetSitecorePersonalizationRuleManagerArgs): PersonalizationRuleManager<RenderingPersonalizationContext>;
//# sourceMappingURL=sitecore.d.ts.map