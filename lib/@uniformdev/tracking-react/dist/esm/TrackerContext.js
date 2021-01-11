import { createContext } from 'react';
import { getSubscriptionManager } from '@uniformdev/common';
export const TrackerContext = createContext({
    subscriptions: getSubscriptionManager()
});
//# sourceMappingURL=TrackerContext.js.map