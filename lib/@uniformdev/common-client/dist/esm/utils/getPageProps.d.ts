import { Logger, UniformConfig } from '@uniformdev/common';
import { DataItem, PageItem } from '..';
declare type _fetch = typeof fetch;
export declare function getPageItem(fetch: _fetch, path: string, logger: Logger, config: UniformConfig): Promise<PageItem>;
export declare function getDataItem(fetch: _fetch, path: string, type: string, logger: Logger, config: UniformConfig): Promise<DataItem>;
export declare function getDatasources(page: PageItem): Promise<any>;
export declare function getHtml(page: PageItem): Promise<any>;
export interface PageProps {
    item?: PageItem;
    page?: PageItem;
    home?: DataItem;
    datasources: any;
    html: any;
    path?: string;
}
export declare function getPageProps(fetch: _fetch, asPath: string, config: UniformConfig, logger?: Logger): Promise<PageProps>;
export {};
//# sourceMappingURL=getPageProps.d.ts.map