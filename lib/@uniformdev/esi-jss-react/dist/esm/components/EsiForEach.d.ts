import React from 'react';
import { RenderingProps } from './RenderingProps';
export default function EsiForEach(props: RenderingProps): React.ReactElement<{
    item: any;
    collection: any;
}, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
//# sourceMappingURL=EsiForEach.d.ts.map