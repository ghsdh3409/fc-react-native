import { useCallback, useContext, useEffect, useState } from 'react';
import notifee, {
  AndroidImportance,
  AndroidNotificationSetting,
  AuthorizationStatus,
  TimestampTrigger,
  TriggerNotification,
  TriggerType,
} from '@notifee/react-native';
import { Platform } from 'react-native';
import moment from 'moment';
import SubscriptionContext from '../components/SubscriptionContext';

const MAX_REMINDER_NUM_FOR_FREE = 2;

const useReminder = () => {
  const [channelId, setChannelId] = useState<string | null>(null);
  const { subscribed } = useContext(SubscriptionContext);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const id = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });
        setChannelId(id);
      } else {
        setChannelId('ios-fake-channel-id');
      }
    })();
  }, []);

  const [reminders, setReminders] = useState<TriggerNotification[]>([]);
  const loadReminders = useCallback(async () => {
    const notifications = await notifee.getTriggerNotifications();
    setReminders(notifications);
  }, []);

  const canAddReminder = useCallback(async () => {
    const triggeredNotifications = await notifee.getTriggerNotifications();
    return (
      subscribed || triggeredNotifications.length < MAX_REMINDER_NUM_FOR_FREE
    );
  }, [subscribed]);

  const addReminder = useCallback(
    async (movieId: number, releaseDate: string, title: string) => {
      const settings = await notifee.requestPermission();

      if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
        throw new Error('Permission is denied');
      }

      if (Platform.OS === 'android') {
        if (settings.android.alarm !== AndroidNotificationSetting.ENABLED) {
          throw new Error(
            'Please allow setting alarms and reminder on settings',
          );
        }
      }

      if (channelId == null) {
        throw new Error('Channel is not created');
      }

      // Create a time-based trigger
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: moment(releaseDate).valueOf(),
      };

      // Create a trigger notification
      await notifee.createTriggerNotification(
        {
          id: `${movieId}`,
          title: '영화 개봉일 알림',
          body: title,
          android: {
            channelId: channelId,
          },
        },
        trigger,
      );

      await loadReminders();
    },
    [channelId, loadReminders],
  );

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const removeReminder = useCallback(
    async (id: string) => {
      await notifee.cancelTriggerNotification(id);
      await loadReminders();
    },
    [loadReminders],
  );

  const hasReminder = useCallback(
    (id: string) => {
      const reminder = reminders.find(r => r.notification.id === id);
      return reminder != null;
    },
    [reminders],
  );

  return {
    addReminder,
    removeReminder,
    reminders,
    hasReminder,
    canAddReminder,
  };
};

export default useReminder;
