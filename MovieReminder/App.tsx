import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MoviesScreen from './src/screens/MoviesScreen/MoviesScreen';
import MovieScreen from './src/screens/MovieScreen/MovieScreen';
import { RootStackParamList } from './src/types';
import RemindersScreen from './src/screens/RemindersScreen/RemindersScreen';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import PurchaseScreen from './src/screens/PurchaseScreen/PurchaseScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

const REVENUECAT_API_KEY =
  Platform.OS === 'ios'
    ? 'appl_dArDTFpynvvyFZTTcxDTRwUrYKi'
    : 'goog_UwjEryxvTjelJTDQedFqcnDOtxe';

const App = () => {
  useEffect(() => {
    (async () => {
      await Purchases.setDebugLogsEnabled(__DEV__);
      await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    })();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Movies" component={MoviesScreen} />
          <Stack.Screen name="Movie" component={MovieScreen} />
          <Stack.Screen name="Reminders" component={RemindersScreen} />
          <Stack.Screen name="Purchase" component={PurchaseScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
