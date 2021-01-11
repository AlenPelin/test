import { Logger } from '@uniformdev/common';
import { RenderingDefinition, SitecoreItem } from '@uniformdev/personalize';
import { PersonalizationChanges } from '@uniformdev/tracking';
/**
 * Parameters that can be passed to the hook function.
 */
export interface UseSitecorePersonalizationProps {
    fields: any;
    logger: Logger;
    rendering: RenderingDefinition;
    track?: boolean;
}
/**
 * Type returned by the hook function.
 */
export interface UseSitecorePersonalizationResult {
    changes?: PersonalizationChanges;
    error?: any;
    loading: boolean;
    personalizedProps?: PersonalizedProps;
    track?: boolean;
}
/**
 * Describes the rendering that has been personalized.
 */
export interface PersonalizedProps {
    datasource: string;
    fields: any;
    item: SitecoreItem;
    params: any;
    rendering: RenderingDefinition;
}
/**
 * Adds personalization to a Sitecore rendering.
 * @param props
 */
export declare function useSitecorePersonalization(props: UseSitecorePersonalizationProps): UseSitecorePersonalizationResult;
//# sourceMappingURL=useSitecorePersonalization.d.ts.map