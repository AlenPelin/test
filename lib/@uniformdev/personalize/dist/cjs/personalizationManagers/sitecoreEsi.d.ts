import { Logger } from '@uniformdev/common';
import { PersonalizationManager, SitecoreItem, RenderingDefinition, GetSitecorePersonalizationManagerArgs } from './index';
import { SitecoreContextDataSource } from './contextReaders';
export declare type GetSitecoreEsiPersonalizationManagerArgs = GetSitecorePersonalizationManagerArgs & {
    dataFetcher?: EsiJsonFetcher;
    dataFetcherReader?: EsiJsonReader;
    getDataFetcherUrl?: (item: string) => string;
    sitecoreApiKey: string;
    sitecoreSiteName: string;
};
export interface EsiHttpResponse {
    /** HTTP status code, i.e. 200, 404 */
    status: number;
    /** HTTP status text i.e. 'OK', 'Bad Request' */
    statusText: string;
    /** Parsed JSON response data from server */
    data: any;
}
/**
 * Interface to a HTTP fetcher that you want to use.
 * This interface conforms to Axios' public API, but should be adaptable
 * to other HTTP libraries or fetch polyfills. This HTTP implementation must:
 * - Support SSR
 * - Return non-HTTP 200 responses as status codes, not thrown exceptions (i.e. be a proper REST client)
 * - Parse response values as JSON and return them into <EsiHttpResponse>
 * - Send HTTP POST requests if `data` param is specified; GET is suggested but not required for data-less requests
 */
export declare type EsiJsonFetcher = (url: string, data?: {
    [key: string]: any;
}) => Promise<EsiHttpResponse>;
export declare type GetEsiJsonFetcherResultReader = (contextDataSource: SitecoreContextDataSource) => EsiJsonReader | undefined;
export interface SitecoreComponentData {
    uid: string;
    componentName: string;
    dataSource: string;
    params: {
        [key: string]: string;
    };
    fields: {
        [key: string]: any;
    };
}
export declare type SitecoreComponentEsiData = SitecoreComponentData & {
    fields: {
        __Esi?: SitecoreComponentData;
        __Personalization?: any;
    };
};
export declare type EsiJsonReader = (rendering: RenderingDefinition, data: any, logger?: Logger) => SitecoreComponentEsiData | undefined;
/**
 * Gets a Sitecore personalization manager.
 * @param args
 */
export declare function getSitecoreEsiPersonalizationManager(args: GetSitecoreEsiPersonalizationManagerArgs): PersonalizationManager<RenderingDefinition, SitecoreItem> | undefined;
//# sourceMappingURL=sitecoreEsi.d.ts.map