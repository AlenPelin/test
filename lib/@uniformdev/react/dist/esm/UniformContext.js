import { createContext } from 'react';
import { getSubscriptionManager } from '@uniformdev/common';
export var UniformContext = createContext({
    subscriptions: getSubscriptionManager(),
    when: new Date()
});
//# sourceMappingURL=UniformContext.js.map