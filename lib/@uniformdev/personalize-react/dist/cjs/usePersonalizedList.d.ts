import { RenderingDefinition, SitecoreRoute } from '@uniformdev/personalize';
/**
 * Parameters that can be passed to the hook function.
 */
export interface UsePersonalizedListProps {
    conditions: any;
    list: any;
    rendering: RenderingDefinition;
    route: SitecoreRoute;
}
export declare const usePersonalizedList: (props: UsePersonalizedListProps) => {
    personalizedList: any;
    wasPersonalized: boolean | null;
    refreshTracking: () => void;
};
//# sourceMappingURL=usePersonalizedList.d.ts.map