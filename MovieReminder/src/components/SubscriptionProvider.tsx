import React from 'react';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import SubscriptionContext from './SubscriptionContext';

const REVENUECAT_API_KEY =
  Platform.OS === 'ios'
    ? 'appl_dArDTFpynvvyFZTTcxDTRwUrYKi'
    : 'goog_UwjEryxvTjelJTDQedFqcnDOtxe';

const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      await Purchases.setDebugLogsEnabled(__DEV__);
      await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
      setInitialized(true);
    })();
  }, []);

  useEffect(() => {
    if (initialized) {
      Purchases.addCustomerInfoUpdateListener(customerInfo => {
        setSubscribed(customerInfo.entitlements.active.Premium != null);
      });
    }
  }, [initialized]);

  useEffect(() => {
    if (initialized) {
      (async () => {
        const customerInfo = await Purchases.getCustomerInfo();
        setSubscribed(customerInfo.entitlements.active.Premium != null);
      })();
    }
  }, [initialized]);

  return (
    <SubscriptionContext.Provider value={{ subscribed }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;
