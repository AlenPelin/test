import { Logger } from '..';
declare type _fetch = typeof fetch;
export declare function fetchWithRetry(fetch: _fetch, logger: Logger, url: string, maxRetries?: number, timeout?: number): Promise<Response>;
export {};
//# sourceMappingURL=fetchWithRetry.d.ts.map