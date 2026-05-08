import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image, Platform, Alert, Modal, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { auth, db } from '../../../services/firebaseService';

const UserScreen = () => {
    const navigation = useNavigation();
    const currentUser = auth?.currentUser;
    const [photo, setPhoto] = useState(currentUser?.photoURL || null);
    const [mainVehicle, setMainVehicle] = useState('Camioneta');
    const [isEditingVehicle, setIsEditingVehicle] = useState(false);
    const [newVehicleName, setNewVehicleName] = useState('');
    const { colors } = useTheme();
    const styles = getStyles(colors);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        if (!currentUser) return;
        try {
            const docRef = doc(db, 'users', currentUser.uid, 'profile', 'info');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.mainVehicle) {
                    setMainVehicle(data.mainVehicle);
                }
            }
        } catch (error) {
            console.log("Error loading profile:", error);
        }
    };

    const handleSaveVehicle = async () => {
        if (!currentUser) return;
        try {
            const docRef = doc(db, 'users', currentUser.uid, 'profile', 'info');
            await setDoc(docRef, { mainVehicle: newVehicleName }, { merge: true });
            setMainVehicle(newVehicleName);
            setIsEditingVehicle(false);
            Alert.alert('Éxito', 'Vehículo actualizado correctamente.');
        } catch (error) {
            console.log("Error saving profile:", error);
            Alert.alert('Error', 'No se pudo actualizar el vehículo.');
        }
    };

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
                        <TouchableOpacity style={styles.statItem} onPress={() => { setNewVehicleName(mainVehicle); setIsEditingVehicle(true); }}>
                            <Text style={styles.statNumber}>{mainVehicle}</Text>
                            <Text style={styles.statLabel}>Vehículo Principal</Text>
                            <Ionicons name="pencil" size={12} color={colors.delicate} style={{marginTop: 2}} />
                        </TouchableOpacity>
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

            <Modal visible={isEditingVehicle} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Vehículo Principal</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={newVehicleName}
                            onChangeText={setNewVehicleName}
                            placeholder="Ej: Moto, Auto, Camioneta"
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setIsEditingVehicle(false)}>
                                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButtonSave} onPress={handleSaveVehicle}>
                                <Text style={styles.modalButtonTextSave}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: colors.principal,
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 15,
    },
    modalInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: colors.thin,
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: colors.dark,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButtonCancel: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        backgroundColor: colors.fondoclaro,
        borderRadius: 10,
        marginRight: 10,
    },
    modalButtonSave: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        backgroundColor: colors.variante1,
        borderRadius: 10,
    },
    modalButtonTextCancel: {
        color: colors.dark,
        fontWeight: 'bold',
    },
    modalButtonTextSave: {
        color: colors.principal,
        fontWeight: 'bold',
    }
});

export default UserScreen;