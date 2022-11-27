import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Colors from 'open-color';

import Screen from '../../components/Screen';
import useReminder from '../../hooks/useReminder';
import moment from 'moment';

const styles = StyleSheet.create({
  reminderList: {
    padding: 20,
  },
  reminderItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    borderColor: Colors.gray[6],
  },
  titleText: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: 'bold',
  },
  bodyText: {
    marginTop: 2,
    fontSize: 14,
    color: Colors.white,
  },
  timestampText: {
    marginTop: 2,
    fontSize: 14,
    color: Colors.white,
  },
  separator: {
    height: 8,
  },
});

const RemindersScreen = () => {
  const { reminders } = useReminder();

  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.reminderList}
        data={reminders}
        renderItem={({ item: reminder }) => {
          return (
            <View style={styles.reminderItem}>
              <Text style={styles.titleText}>{reminder.notification.body}</Text>
              {'timestamp' in reminder.trigger && (
                <Text style={styles.timestampText}>
                  {moment(reminder.trigger.timestamp).format('LLL')}
                </Text>
              )}
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </Screen>
  );
};

export default RemindersScreen;
