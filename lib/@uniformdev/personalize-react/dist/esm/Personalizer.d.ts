/// <reference types="react" />
import { Logger } from '@uniformdev/common';
import { RenderingDefinition } from '@uniformdev/personalize';
import { PersonalizationEventData } from '@uniformdev/tracking';
interface PersonalizationProps extends RenderingDefinition {
    rendering: RenderingDefinition;
    fields: any;
}
export interface GetPersonalizedProps {
    (data: any, logger: Logger): GetPersonalizedPropsResult;
}
export interface GetPersonalizedPropsResult {
    props?: any;
    event?: PersonalizationEventData;
}
interface GetPersonalizationArgs {
    /**
     * Collection of component names that support personalization.
     * If no values are specified, all components are supported.
     */
    allowed?: string[];
    components: Map<string, any>;
    getPersonalizedProps: GetPersonalizedProps;
}
export declare function getPersonalizer(args: GetPersonalizationArgs): (props: PersonalizationProps) => JSX.Element;
export {};
//# sourceMappingURL=Personalizer.d.ts.map