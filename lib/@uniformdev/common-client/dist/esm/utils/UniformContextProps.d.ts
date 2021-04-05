/// <reference types="react" />
import { Logger } from '@uniformdev/common';
export interface ComponentMap {
    [key: string]: React.ComponentType;
}
export interface UniformContextProps {
    componentMap: ComponentMap;
    logger: Logger;
}
//# sourceMappingURL=UniformContextProps.d.ts.map