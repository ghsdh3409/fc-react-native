import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback, useContext } from 'react';
import Toast from 'react-native-toast-message';
import ChatScreen from './src/ChatScreen/ChatScreen';
import AuthContext from './src/components/AuthContext';
import AuthProvider from './src/components/AuthProvider';
import HomeScreen from './src/HomeScreen/HomeScreen';
import usePushNotification from './src/hooks/usePushNotification';
import LoadingScreen from './src/LoadingScreen/LoadingScreen';
import SigninScreen from './src/SigninScreen/SigninScreen';
import SignupScreen from './src/SignupScreen/SignupScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Screens = () => {
  const { user, processingSignin, processingSignup, initialized } =
    useContext(AuthContext);
  usePushNotification();

  const renderRootStack = useCallback(() => {
    if (!initialized) {
      return <Stack.Screen name="Loading" component={LoadingScreen} />;
    }
    if (user != null && !processingSignin && !processingSignup) {
      // login
      return (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </>
      );
    }
    // logout
    return (
      <>
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Signin" component={SigninScreen} />
      </>
    );
  }, [user, processingSignin, processingSignup, initialized]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {renderRootStack()}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Screens />
      <Toast />
    </AuthProvider>
  );
};

export default App;
