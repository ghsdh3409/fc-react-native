import { NativeModules } from 'react-native';
const { CalendarModule } = NativeModules;

interface CalendarModuleInterface {
  createCalendarEvent: (timestampInSec: number, title: string) => Promise<void>;
}

export default CalendarModule as CalendarModuleInterface;
