import React from 'react';
import { RenderingDefinition, SitecoreItem, SitecoreContextDataSource } from '@uniformdev/personalize';
import { TestSettings } from '@uniformdev/personalize';
import { PersonalizationManager, PersonalizationManagerEvent } from '@uniformdev/personalize';
import { Logger, UniformCallback, UniformUnsubscribe } from '@uniformdev/common';
export interface SitecorePersonalizationContextValue {
    item?: SitecoreItem;
    logger?: Logger;
    personalizationManager?: PersonalizationManager<RenderingDefinition, SitecoreItem>;
    timestamp: number;
}
export declare type PersonalizationMode = 'jss-esi' | 'default';
export declare const SitecorePersonalizationContext: React.Context<SitecorePersonalizationContextValue>;
export interface SitecorePersonalizationContextProviderProps {
    contextData: any;
    contextDataSource?: SitecoreContextDataSource;
    disabled?: boolean;
    logger?: Logger;
    personalizationMode?: PersonalizationMode;
    sitecoreApiKey?: string;
    sitecoreSiteName?: string;
    subscriptions?: (subscribe: (type: string | undefined, callback: UniformCallback<PersonalizationManagerEvent>) => UniformUnsubscribe) => void;
    testSettings?: TestSettings[];
}
export declare const SitecorePersonalizationContextProvider: React.FC<SitecorePersonalizationContextProviderProps>;
//# sourceMappingURL=SitecorePersonalizationContext.d.ts.map