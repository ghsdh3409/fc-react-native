import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MoviesScreen from './src/screens/MoviesScreen/MoviesScreen';
import MovieScreen from './src/screens/MovieScreen/MovieScreen';
import { RootStackParamList } from './src/types';
import RemindersScreen from './src/screens/RemindersScreen/RemindersScreen';
import PurchaseScreen from './src/screens/PurchaseScreen/PurchaseScreen';
import LoadingScreen from './src/screens/LoadingScreen/LoadingScreen';
import SubscriptionProvider from './src/components/SubscriptionProvider';

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

const App = () => {
  const updating = false;
  const progress = {
    total: 100,
    now: 50,
  };

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
                    progress={progress != null ? progress : undefined}
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

export default App;
