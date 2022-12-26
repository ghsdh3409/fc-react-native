import { renderHook, act } from '@testing-library/react-hooks';
import useReminder from '../src/hooks/useReminder';
import notifee from '@notifee/react-native';

jest.mock('@notifee/react-native', () => ({
  getTriggerNotifications: () => Promise.resolve([]),
}));

describe('useReminder', () => {
  describe('canAddReminder', () => {
    it('returns true if the number of scheduled reminders is less than 2', async () => {
      const { result } = renderHook(() => useReminder());
      const spyGetTriggerNotifications = jest
        .spyOn(notifee, 'getTriggerNotifications')
        .mockResolvedValue([]);
      await act(async () => {
        expect(await result.current.canAddReminder()).toBe(true);
      });
      spyGetTriggerNotifications.mockRestore();
    });

    it('returns true if the number of scheduled reminders is equal or more than 2', async () => {
      const { result } = renderHook(() => useReminder());
      const spyGetTriggerNotifications = jest
        .spyOn(notifee, 'getTriggerNotifications')
        .mockResolvedValue([{} as any, {}, {}]);
      await act(async () => {
        expect(await result.current.canAddReminder()).toBe(false);
      });
      spyGetTriggerNotifications.mockRestore();
    });
  });
});
