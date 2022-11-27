import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from 'open-color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    height: 48,
    flexDirection: 'row',
  },
  left: {
    flex: 1,
    justifyContent: 'center',
  },
  center: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  backIcon: {
    fontSize: 20,
    color: Colors.white,
    marginLeft: 20,
  },
});

interface ScreenProp {
  children?: React.ReactNode;
  title?: string;
  headerVisible?: boolean;
  renderRightComponent?: () => JSX.Element;
}

const Screen = ({
  children,
  title,
  headerVisible = true,
  renderRightComponent,
}: ScreenProp) => {
  const { goBack, canGoBack } = useNavigation();
  const onPressBackButton = useCallback(() => {
    goBack();
  }, [goBack]);
  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'ios' ? (
        <StatusBar barStyle="light-content" />
      ) : (
        <StatusBar barStyle="dark-content" />
      )}
      {headerVisible && (
        <View style={styles.header}>
          <View style={styles.left}>
            {canGoBack() && (
              <TouchableOpacity onPress={onPressBackButton}>
                <Icon style={styles.backIcon} name="arrow-back" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.center}>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
          <View style={styles.right}>
            {renderRightComponent != null && renderRightComponent()}
          </View>
        </View>
      )}
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

export default Screen;
