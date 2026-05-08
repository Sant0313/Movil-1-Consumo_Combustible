import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import AppProvider from './navigation/AppProvider';
import { ThemeProvider } from './src/context/ThemeContext';
import { initDb } from './services/databaseService';

export default function App() {
  useEffect(() => {
    initDb().catch(e => console.log('DB Init Error:', e));
  }, []);

  return (
    <ThemeProvider>
      <AppProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar />
        </NavigationContainer>
      </AppProvider>
    </ThemeProvider>
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
