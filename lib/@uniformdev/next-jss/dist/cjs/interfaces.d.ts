import { RouteParams } from './routeUtils';
import { PipelineStep } from '@uniformdev/next';
import { RouteData } from '@sitecore-jss/sitecore-jss-react';
export interface SitecoreWebhookRequestData {
    renderPath: string;
    route: RouteData | null;
    viewBag: {
        language: string;
        dictionary: any;
        httpContext: {
            request: any;
        };
    } | null;
}
export interface UniformJssConfig {
    sitecoreApiKey: string;
    sitecoreApiHost: string;
    jssAppName: string;
    sitecoreSiteName: string;
    defaultLanguage: string;
    graphQLEndpointPath: string;
    appLanguages: string[];
    graphQLEndpoint: string;
}
export declare type DataFetcher = <R = unknown>(url: string, data?: any) => Promise<R>;
export interface UniformEnvironment {
    getCurrentLanguage?: () => string;
    dataFetcher?: DataFetcher;
}
export interface DictionaryDataPipelineOptions {
    env: UniformEnvironment;
    language: string;
}
export interface DictionaryDataPipelineContext extends DictionaryDataPipelineOptions {
    dictionary: any;
}
export interface LayoutDataPipelineOptions {
    env: UniformEnvironment;
    routeParams: RouteParams;
}
export interface LayoutDataPipelineContext extends LayoutDataPipelineOptions {
    layoutData: any;
}
export interface PagePropsFactoryOptions {
    previewData?: SitecoreWebhookRequestData;
    env: UniformEnvironment;
    routeParams: RouteParams;
}
export interface PagePropsPipelineContext extends PagePropsFactoryOptions {
    props: any;
}
export declare type PagePropsPipelineStep = PipelineStep<PagePropsPipelineContext>;
//# sourceMappingURL=interfaces.d.ts.map