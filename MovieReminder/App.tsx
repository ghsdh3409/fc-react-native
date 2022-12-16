import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CodePush from 'react-native-code-push';
import MoviesScreen from './src/screens/MoviesScreen/MoviesScreen';
import MovieScreen from './src/screens/MovieScreen/MovieScreen';
import { RootStackParamList } from './src/types';
import RemindersScreen from './src/screens/RemindersScreen/RemindersScreen';
import PurchaseScreen from './src/screens/PurchaseScreen/PurchaseScreen';
import LoadingScreen from './src/screens/LoadingScreen/LoadingScreen';
import SubscriptionProvider from './src/components/SubscriptionProvider';
import useCodePush from './src/hooks/useCodePush';

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

const App = () => {
  const { updating, progress } = useCodePush();

  return (
    <SubscriptionProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {updating ? (
              <Stack.Screen name="Loading">
                {props => (
                  <LoadingScreen
                    {...props}
                    progress={
                      progress != null
                        ? {
                            total: progress.totalBytes,
                            now: progress.receivedBytes,
                          }
                        : undefined
                    }
                  />
                )}
              </Stack.Screen>
            ) : (
              <>
                <Stack.Screen name="Movies" component={MoviesScreen} />
                <Stack.Screen name="Movie" component={MovieScreen} />
                <Stack.Screen name="Reminders" component={RemindersScreen} />
                <Stack.Screen name="Purchase" component={PurchaseScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </SubscriptionProvider>
  );
};

const codePushOptions = { checkFrequency: CodePush.CheckFrequency.MANUAL };
export default CodePush(codePushOptions)(App);
