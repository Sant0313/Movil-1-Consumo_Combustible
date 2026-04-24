import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image, Platform, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { auth } from '../../../services/firebaseService';

const UserScreen = () => {
    const navigation = useNavigation();
    const currentUser = auth?.currentUser;
    const [photo, setPhoto] = useState(currentUser?.photoURL || null);
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const handleImagePick = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Se requiere permiso para acceder a la galería.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'], // Updated from ImagePicker.MediaTypeOptions.Images based on Expo 50+
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                const newPhotoUrl = result.assets[0].uri;
                setPhoto(newPhotoUrl);
                
                if (currentUser) {
                    await updateProfile(currentUser, { photoURL: newPhotoUrl });
                    Alert.alert('Éxito', 'Foto de perfil actualizada correctamente.');
                }
            }
        } catch (error) {
            console.log("Error al actualizar la foto:", error);
            Alert.alert('Error', 'No se pudo actualizar la foto de perfil.');
        }
    };

    const menuItems = [
        { id: 1, icon: 'person-outline', title: 'Mis Datos', color: colors.variante1 },
        { id: 2, icon: 'car-outline', title: 'Mis Vehículos', color: colors.variante4 },
        { id: 3, icon: 'shield-checkmark-outline', title: 'Seguridad y Privacidad', color: colors.variante2 },
        { id: 4, icon: 'help-circle-outline', title: 'Ayuda y Soporte', color: colors.variante3 },
        { id: 5, icon: 'document-text-outline', title: 'Términos y Condiciones', color: colors.dark }
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        {photo ? (
                            <Image source={{ uri: photo }} style={styles.avatar} />
                        ) : (
                            <Ionicons name="person" size={50} color={colors.defecto} />
                        )}
                        <TouchableOpacity style={styles.editBadge} onPress={handleImagePick}>
                            <Ionicons name="camera" size={14} color={colors.defecto} />
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.userName}>{currentUser?.displayName || 'Usuario Conductór'}</Text>
                    <Text style={styles.userEmail}>{currentUser?.email || 'mi-correo@ejemplo.com'}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>Camioneta</Text>
                            <Text style={styles.statLabel}>Vehículo Principal</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>1 Años</Text>
                            <Text style={styles.statLabel}>Miembro desde</Text>
                        </View>
                    </View>
                </View>

                {/* Settings Menu */}
                <View style={styles.menuContainer}>
                    <Text style={styles.sectionTitle}>Configuración</Text>
                    
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => navigation.navigate('Detail', { title: item.title, icon: item.icon, color: item.color })}>
                            <View style={styles.menuItemLeft}>
                                <View style={[styles.iconWrapper, { backgroundColor: `${item.color}20` }]}>
                                    <Ionicons name={item.icon} size={22} color={item.color} />
                                </View>
                                <Text style={styles.menuItemText}>{item.title}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.delicate} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={() => auth.signOut()}>
                    <Ionicons name="log-out-outline" size={22} color={colors.alerta} />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>

                <Text style={styles.appVersion}>App Movilidad v1.0.0</Text>
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
    profileCard: {
        backgroundColor: colors.principal,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 25,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.variante1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.variante4,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.principal,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.dark,
    },
    userEmail: {
        fontSize: 14,
        color: colors.delicate,
        marginTop: 4,
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 15,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: '#f0f0f0',
    },
    statNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.dark,
    },
    statLabel: {
        fontSize: 12,
        color: colors.delicate,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 15,
        marginLeft: 5,
    },
    menuContainer: {
        marginBottom: 30,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.principal,
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 1,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.dark,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${colors.alerta}15`,
        padding: 15,
        borderRadius: 15,
        marginBottom: 20,
    },
    logoutText: {
        color: colors.alerta,
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
    appVersion: {
        textAlign: 'center',
        color: colors.delicate,
        fontSize: 12,
        marginTop: 10,
    }
});

export default UserScreen;