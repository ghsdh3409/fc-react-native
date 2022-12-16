import { createContext } from 'react';

export interface SubscriptionContextProp {
  subscribed: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextProp>({
  subscribed: false,
});

export default SubscriptionContext;
