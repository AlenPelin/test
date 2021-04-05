export interface InvokeService {
    middleware(req: any, res: any): void;
}
export declare function invokeMockDisconnectedService(service: InvokeService, requestOptions: any): Promise<string>;
export declare function fetchMockLayoutServiceData(layoutService: any, route: string, language: string, options?: any): Promise<any>;
export declare function fetchMockDictionaryData(dictionaryService: any, language: string, options?: any): Promise<any>;
//# sourceMappingURL=disconnected.d.ts.map