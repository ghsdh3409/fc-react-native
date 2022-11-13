import { useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { requestNotifications, RESULTS } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import AuthContext from '../components/AuthContext';

const usePushNotification = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const { user, addFcmToken } = useContext(AuthContext);

  useEffect(() => {
    messaging()
      .getToken()
      .then(token => {
        setFcmToken(token);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(token => {
      setFcmToken(token);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user != null && fcmToken != null) {
      addFcmToken(fcmToken);
    }
  }, [addFcmToken, user, fcmToken]);

  const requestPermission = useCallback(async () => {
    const { status } = await requestNotifications([]);
    const enabled = status === RESULTS.GRANTED;
    console.log('enabled', enabled);

    if (!enabled) {
      Alert.alert('알림 권한을 허용해주세요.');
    }
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);
};

export default usePushNotification;
