import { SitecoreItem } from './sitecore';
import { RuleBasedRenderingPersonalizationDefinition } from '../ruleManagers/sitecore';
/**
 * Provides the ability to read data from the context
 * that is passed to a personalization manager.
 */
export interface ContextDataReader<TPageDetails> {
    getDefinitions(contextData: any): RuleBasedRenderingPersonalizationDefinition | DependencyBasedRenderingPersonalizationDefinition | undefined;
    getPageDetails(contextData: any): TPageDetails;
}
/**
 * Personalization data is exposed from Sitecore through
 * a source. The source used by a Sitecore site depends
 * on the technology used to build the Sitecore site.
 * This type represents the options available for how
 * the personalization data is exposed.
 */
export declare type SitecoreContextDataSource = 'uniform' | 'jss' | 'jss-esi' | 'default';
/**
 * Gets a Sitecore context data reader based on the specified source.
 * @param source
 */
export declare function getSitecoreContextDataReader(source?: SitecoreContextDataSource): ContextDataReader<SitecoreItem> | undefined;
export interface DependencyBasedRenderingPersonalizationDefinition {
    [renderingUid: string]: {
        dependencies: Array<string>;
    };
}
//# sourceMappingURL=contextReaders.d.ts.map