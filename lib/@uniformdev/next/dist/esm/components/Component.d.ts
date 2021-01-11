import React from 'react';
import { RenderingContext, PageItem, DataItem, DataSourceItem } from '@uniformdev/common-client';
export declare class Component<T = void, TS = any> extends React.Component<T & {
    renderingContext: RenderingContext;
}, TS> {
    /**
     *
     */
    constructor(props: T & {
        renderingContext: RenderingContext;
    });
    get renderingContext(): RenderingContext;
    get item(): DataSourceItem | PageItem | undefined;
    get page(): PageItem | undefined;
    get home(): DataSourceItem | PageItem | undefined;
    get children(): DataSourceItem[] | DataItem[] | undefined;
}
//# sourceMappingURL=Component.d.ts.map