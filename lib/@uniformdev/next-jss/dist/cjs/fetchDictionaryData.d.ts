import { DataFetcher } from './interfaces';
interface FetchDictionaryDataOptions {
    dataFetcher: DataFetcher;
    sitecoreApiHost: string;
    jssAppName: string;
    sitecoreApiKey: string;
    sitecoreSiteName: string;
}
export declare function fetchDictionaryData(language: string, { dataFetcher, sitecoreApiHost, jssAppName, sitecoreApiKey, sitecoreSiteName }: FetchDictionaryDataOptions): Promise<any>;
export {};
//# sourceMappingURL=fetchDictionaryData.d.ts.map