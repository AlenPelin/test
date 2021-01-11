/// <reference types="react" />
import { Logger, SubscriptionManager, UniformEvent } from '@uniformdev/common';
export interface UniformContextValue {
    logger?: Logger;
    subscriptions?: SubscriptionManager<UniformEvent>;
    when: Date;
}
export declare const UniformContext: import("react").Context<UniformContextValue>;
//# sourceMappingURL=UniformContext.d.ts.map