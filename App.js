import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import AppProvider from './navigation/AppProvider';

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar />
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
