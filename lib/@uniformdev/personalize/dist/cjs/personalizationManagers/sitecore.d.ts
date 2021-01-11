import { Logger } from '@uniformdev/common';
import { PageDescription, PersonalizationManager } from './index';
import { SitecoreContextDataSource } from './contextReaders';
import { TestManager } from '../testManagers';
export interface SitecoreRoute {
    name: string;
    itemId: string;
}
/**
 * Represents a Sitecore component that can be personalized.
 * As a result of personalization rules matching, the
 * data source on the definition may change.
 */
export interface RenderingDefinition {
    uid: string;
    fields?: any;
    componentName: string;
    dataSource?: string;
    params?: any;
}
/**
 * Settings used to get a Sitecore personalization manager.
 */
export interface GetSitecorePersonalizationManagerArgs {
    /**
     * Context data read from JSS Layout Service, Uniform Page Service, etc.
     */
    contextData: any;
    /**
     * Specifies how to read personalization settings from the context data.
     */
    contextDataSource?: SitecoreContextDataSource;
    disabled?: boolean;
    logger?: Logger;
    testManager?: TestManager;
}
export interface SitecoreItem extends PageDescription {
}
/**
 * Gets a Sitecore personalization manager.
 * @param args
 */
export declare function getSitecorePersonalizationManager(args: GetSitecorePersonalizationManagerArgs): PersonalizationManager<RenderingDefinition, SitecoreItem> | undefined;
//# sourceMappingURL=sitecore.d.ts.map