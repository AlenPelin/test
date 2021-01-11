import React from 'react';
import { Component } from './Component';
import { Logger } from '@uniformdev/common';
export declare class BasePlaceholder extends Component<{
    placeholderKey: string;
}> {
    private logger;
    placeholderKey: string;
    components: any;
    constructor(props: any, components: any, logger: Logger);
    render(): React.FunctionComponentElement<{}>;
}
//# sourceMappingURL=BasePlaceholder.d.ts.map