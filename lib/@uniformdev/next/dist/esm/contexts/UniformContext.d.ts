import React, { ComponentType, ReactNode } from 'react';
import { ComponentMap, UniformContextProps } from '@uniformdev/common-client';
import { Logger } from '@uniformdev/common';
import { HtmlProcessingInstruction, HtmlPreProcessingInstruction } from '../processHtml';
interface UniformContextProviderProps {
    componentMap: ComponentMap;
    logger: Logger;
    htmlProcessingInstructions?: HtmlProcessingInstruction[];
    htmlPreProcessingInstructions?: HtmlPreProcessingInstruction[];
    children?: ReactNode;
}
interface UniformContextHookValue extends UniformContextProps {
    htmlProcessingInstructions: HtmlProcessingInstruction[];
    htmlPreProcessingInstructions: HtmlPreProcessingInstruction[];
    setComponentMap: (componentMap: ComponentMap) => void;
    componentFactory: (componentName: string) => ComponentType | null;
}
export declare const UniformContext: React.Context<UniformContextHookValue>;
export declare const useUniformContext: () => UniformContextHookValue;
export declare function UniformContextProvider({ children, logger, componentMap, htmlProcessingInstructions, htmlPreProcessingInstructions, }: UniformContextProviderProps): JSX.Element;
export {};
//# sourceMappingURL=UniformContext.d.ts.map