import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, Switch, Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../../services/firebaseService';
import { useTheme } from '../../context/ThemeContext';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const { isDarkMode, toggleTheme, colors } = useTheme();
    const styles = getStyles(colors);

    // UI State for toggles
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [locationEnabled, setLocationEnabled] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const notif = await AsyncStorage.getItem('@settings_notifications');
                const dark = await AsyncStorage.getItem('@settings_dark_mode');
                const loc = await AsyncStorage.getItem('@settings_location');

                if (notif !== null) setNotificationsEnabled(notif === 'true');
                if (dark !== null) setDarkModeEnabled(dark === 'true');
                if (loc !== null) setLocationEnabled(loc === 'true');
            } catch (error) {
                console.log("Error loading settings:", error);
            }
        };
        loadSettings();
    }, []);

    const toggleNotifications = async (value) => {
        setNotificationsEnabled(value);
        try {
            await AsyncStorage.setItem('@settings_notifications', value.toString());
        } catch (e) { }
    };

    const toggleDarkMode = (value) => {
        setDarkModeEnabled(value);
        toggleTheme(value);
    };

    const toggleLocation = async (value) => {
        setLocationEnabled(value);
        try {
            await AsyncStorage.setItem('@settings_location', value.toString());
        } catch (e) { }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            await signOut(auth);
            Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.", [
                { text: "OK" }
            ]);
        } catch (error) {
            console.log("Error al cerrar sesión:", error);
            Alert.alert("Error 😒", "No se pudo cerrar sesión. Inténtalo de nuevo.");
            setLoading(false);
        }
    };

    const renderSettingRow = (icon, title, color, rightComponent) => (
        <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: `${color}15` }]}>
                    <Ionicons name={icon} size={22} color={color} />
                </View>
                <Text style={styles.settingText}>{title}</Text>
            </View>
            <View style={styles.settingRight}>
                {rightComponent}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Ajustes</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Preferencias */}
                <Text style={styles.sectionTitle}>Preferencias de la App</Text>
                <View style={styles.cardGroup}>
                    {renderSettingRow('notifications', 'Notificaciones Push', colors.variante1,
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={toggleNotifications}
                            trackColor={{ false: '#d1d1d1', true: colors.variante1 }}
                            thumbColor={"#fff"}
                        />
                    )}
                    <View style={styles.divider} />
                    {renderSettingRow('moon', 'Modo Oscuro', colors.variante4,
                        <Switch
                            value={darkModeEnabled}
                            onValueChange={toggleDarkMode}
                            trackColor={{ false: '#d1d1d1', true: colors.variante4 }}
                            thumbColor={"#fff"}
                        />
                    )}
                    <View style={styles.divider} />
                    <TouchableOpacity onPress={() => Alert.alert('Idioma', 'Esta aplicación solo está disponible en Español por el momento.')} style={styles.fullWidthButton}>
                        {renderSettingRow('language', 'Idioma', colors.variante2,
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.settingValueText}>Español</Text>
                                <Ionicons name="chevron-forward" size={20} color={colors.delicate} />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Privacidad y Rastreo */}
                <Text style={styles.sectionTitle}>Privacidad</Text>
                <View style={styles.cardGroup}>
                    {renderSettingRow('location', 'Servicios de Ubicación', colors.alerta,
                        <Switch
                            value={locationEnabled}
                            onValueChange={toggleLocation}
                            trackColor={{ false: '#d1d1d1', true: colors.alerta }}
                            thumbColor={"#fff"}
                        />
                    )}
                    <View style={styles.divider} />
                    <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')} style={styles.fullWidthButton}>
                        {renderSettingRow('lock-closed', 'Cambiar Contraseña', colors.dark,
                            <Ionicons name="chevron-forward" size={20} color={colors.delicate} />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={{ height: 30 }} />

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.alerta} />
                    ) : (
                        <>
                            <Ionicons name="log-out" size={22} color={colors.alerta} />
                            <Text style={styles.logoutText}>Cerrar sesión de forma segura</Text>
                        </>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const getStyles = (colors) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.fondoclaro,
    },
    header: {
        paddingTop: Platform.OS === 'android' ? 40 : 20,
        paddingBottom: 15,
        paddingHorizontal: 20,
        backgroundColor: colors.principal,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.dark,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.delicate,
        marginBottom: 10,
        marginLeft: 5,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardGroup: {
        backgroundColor: colors.principal,
        borderRadius: 20,
        padding: 5,
        marginBottom: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    settingText: {
        fontSize: 16,
        color: colors.dark,
        fontWeight: '500',
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValueText: {
        fontSize: 14,
        color: colors.delicate,
        marginRight: 5,
    },
    fullWidthButton: {
        width: '100%'
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginLeft: 65,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.principal,
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: `${colors.alerta}30`,
        shadowColor: colors.alerta,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    logoutText: {
        color: colors.alerta,
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    }
});

export default SettingsScreen;