import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MoviesScreen from './src/screens/MoviesScreen/MoviesScreen';
import MovieScreen from './src/screens/MovieScreen/MovieScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Movies" component={MoviesScreen} />
          <Stack.Screen name="Movie" component={MovieScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
