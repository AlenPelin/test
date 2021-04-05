/// <reference types="react" />
import { RenderingContext, RenderingNode } from '@uniformdev/common-client';
export interface CreateRenderingProps {
    rendering: RenderingNode;
    index: number;
    placeholderKey: string;
    renderingContext: RenderingContext;
}
/**
 * This takes a rendering and decides how to convert
 * it into a React element. It will either match a
 * React component within the component map or we will
 * use the MVC rendered html and convert those tags to
 * React components.
 */
export declare function CreateRendering({ rendering, placeholderKey, renderingContext, index, }: CreateRenderingProps): JSX.Element | null;
//# sourceMappingURL=createRendering.d.ts.map