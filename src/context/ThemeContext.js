import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../components/constants/colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const dark = await AsyncStorage.getItem('@settings_dark_mode');
            if (dark !== null) {
                setIsDarkMode(dark === 'true');
            }
        } catch (error) {
            console.log("Error loading theme", error);
        }
    };

    const toggleTheme = async (value) => {
        setIsDarkMode(value);
        try {
            await AsyncStorage.setItem('@settings_dark_mode', value.toString());
        } catch (error) {
            console.log("Error saving theme", error);
        }
    };

    const colors = isDarkMode ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
