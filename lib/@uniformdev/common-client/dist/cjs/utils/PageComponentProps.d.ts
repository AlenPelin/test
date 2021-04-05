import { PageProps } from '..';
import { UniformContextProps } from '..';
import { RenderingContext } from '..';
export interface PageComponentProps<T> extends PageProps {
    children: (renderingContext: RenderingContext) => T;
    uniformContext?: UniformContextProps;
}
//# sourceMappingURL=PageComponentProps.d.ts.map