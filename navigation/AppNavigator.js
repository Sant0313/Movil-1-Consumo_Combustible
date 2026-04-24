import React, { createContext, useContext, useEffect, useState } from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from "firebase/auth";

import { auth } from '../services/firebaseService';
import { useTheme } from '../src/context/ThemeContext';

import SplashScreen from '../src/components/screens/SplashScreen';
import RegisterScreen from '../src/components/screens/auth/RegisterScreen';
import LoginScreen from '../src/components/screens/auth/LoginScreen';
import HomeScreen from '../src/components/screens/HomeScreen';
import UserScreen from '../src/components/screens/UserScreen';
import SettingsScreen from '../src/components/screens/SettingsScreen';
import FeatureScreen from '../src/components/screens/FeatureScreen';
import DetailScreen from '../src/components/screens/DetailScreen';
import FuelScreen from '../src/components/screens/FuelScreen';
import RoutesScreen from '../src/components/screens/RoutesScreen';
import ReportsScreen from '../src/components/screens/ReportsScreen';
import ChangePasswordScreen from '../src/components/screens/ChangePasswordScreen';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ProfileStack = createNativeStackNavigator();

const TabNavigator = () => {
    const { user } = useAuth();
    const { colors } = useTheme();

    return(
        <Tab.Navigator 
            initialRouteName="Home" 
            screenOptions={({route})=>({
                tabBarIcon: ({color, size, focused})=>{
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if(route.name === "Settings"){
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else if(route.name === "User"){
                        if (user?.photoURL) {
                            return (
                                <Image
                                    source={{ uri: user.photoURL }}
                                    style={{
                                        width: size,
                                        height: size,
                                        borderRadius: size / 2,
                                        borderWidth: focused ? 2 : 0,
                                        borderColor: focused ? '#0077B6' : 'transparent',
                                    }}
                                />
                            );
                        }
                        // Si no tiene foto, mostrar el icono por defecto
                        return <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />;
                    } 
                    
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.variante1,
                tabBarInactiveTintColor: colors.delicate,
                tabBarStyle: {
                    backgroundColor: colors.principal,
                    borderTopColor: colors.fondoclaro,
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{tabBarLabel:'Home'}}/>
            <Tab.Screen name="User" component={UserScreen} options={{tabBarLabel:'Usuario'}}/>
            <Tab.Screen name="Settings" component={SettingsScreen} options={{tabBarLabel:'Ajustes'}}/>
        </Tab.Navigator>
    )
}   

const AppNavigator = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsuscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });
        return () => unsuscribe();
    },[]);

    const authContextValue = {
        user,
        setUser,
        isLoading,
        setIsLoading,
    };

    if(isLoading){
        return <SplashScreen/>;
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            <Stack.Navigator initialRouteName={user ? 'Main' : 'Login'}>
                {user ? (
                    <>
                        <Stack.Screen name="Main" component={TabNavigator} options={{headerShown: false}} />
                        <Stack.Screen name="Feature" component={FeatureScreen} options={{headerShown: false}} />
                        <Stack.Screen name="Detail" component={DetailScreen} options={{headerShown: false}} />
                        <Stack.Screen name="Fuel" component={FuelScreen} options={{headerShown: false}} />
                        <Stack.Screen name="Routes" component={RoutesScreen} options={{headerShown: false}} />
                        <Stack.Screen name="Reports" component={ReportsScreen} options={{headerShown: false}} />
                        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{headerShown: false}} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />
                    </>
                )}
            </Stack.Navigator>
        </AuthContext.Provider>   
    );
}

export default AppNavigator;