import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from 'open-color';
import ScreenBannerAd from './ScreenBannerAd';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import SubscriptionContext from './SubscriptionContext';

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
  subscription: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: 10,
  },
  subscriptionText: {
    color: Colors.black,
  },
});

interface ScreenProp {
  children?: React.ReactNode;
  title?: string;
  headerVisible?: boolean;
  renderLeftComponent?: () => JSX.Element;
  renderRightComponent?: () => JSX.Element;
}

const Screen = ({
  children,
  title,
  headerVisible = true,
  renderLeftComponent,
  renderRightComponent,
}: ScreenProp) => {
  const colorScheme = useColorScheme();
  const { goBack, canGoBack, navigate } =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const onPressBackButton = useCallback(() => {
    goBack();
  }, [goBack]);
  const { subscribed } = useContext(SubscriptionContext);

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'ios' ? (
        <StatusBar barStyle="light-content" />
      ) : colorScheme === 'dark' ? (
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
            {renderLeftComponent != null && renderLeftComponent()}
          </View>
          <View style={styles.center}>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
          <View style={styles.right}>
            {renderRightComponent != null && renderRightComponent()}
          </View>
        </View>
      )}
      {!subscribed && (
        <>
          <TouchableOpacity
            style={styles.subscription}
            onPress={() => {
              navigate('Purchase');
            }}>
            <Text style={styles.subscriptionText}>
              구독하고 광고 없이 앱을 무제한으로 사용해보세요!
            </Text>
          </TouchableOpacity>
          <ScreenBannerAd />
        </>
      )}
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

export default Screen;
