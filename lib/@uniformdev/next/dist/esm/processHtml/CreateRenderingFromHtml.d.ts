import { ComponentType } from 'react';
import { RenderingContext, RenderingNode } from '@uniformdev/common-client';
interface CreateRenderingFromHtmlProps {
    html?: string;
    renderingContext: RenderingContext;
    rendering: RenderingNode;
    placeholderKey: string;
    index: number;
    isHead?: boolean;
    Wrapper?: ComponentType;
}
/**
 * This will take HTML to convert into React elements.
 *
 * It memoizes the output based on the html string so
 * it only does the expensive work of converting when
 * that changes.
 *
 * It doesn't support having placeholders in the Head
 * because we lose the UniformContext when inside for
 * some reason.
 */
export declare function CreateRenderingFromHtml({ html, renderingContext, rendering, placeholderKey, index, Wrapper, isHead, }: CreateRenderingFromHtmlProps): JSX.Element | null;
export {};
//# sourceMappingURL=CreateRenderingFromHtml.d.ts.map