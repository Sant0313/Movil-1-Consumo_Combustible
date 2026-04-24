import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updatePassword } from 'firebase/auth';
import { auth } from '../../../services/firebaseService';
import { useTheme } from '../../context/ThemeContext';

const ChangePasswordScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert('Error', 'Por favor llena todos los campos.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Error', 'No hay sesión iniciada.');
            return;
        }

        setLoading(true);
        try {
            await updatePassword(user, newPassword);
            Alert.alert('Éxito', 'Tu contraseña ha sido actualizada correctamente.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.log("Error al actualizar la contraseña:", error);
            
            // Firebase errors usually happen if the user's session is too old.
            if (error.code === 'auth/requires-recent-login') {
                Alert.alert('Error', 'Por razones de seguridad, debes volver a iniciar sesión para cambiar tu contraseña.');
            } else {
                Alert.alert('Error', 'No se pudo actualizar la contraseña. Verifica tu conexión.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cambiar Contraseña</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="lock-closed" size={50} color={colors.variante1} />
                    </View>
                    <Text style={styles.instructions}>
                        Ingresa tu nueva contraseña a continuación. Te recomendamos usar una combinación de letras, números y símbolos.
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nueva Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="Mínimo 6 caracteres"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirmar Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Vuelve a escribir la contraseña"
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
                        onPress={handleUpdatePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.principal} />
                        ) : (
                            <Text style={styles.saveButtonText}>Actualizar Contraseña</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const getStyles = (colors) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.fondoclaro,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: colors.principal,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
    },
    content: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: colors.principal,
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    instructions: {
        textAlign: 'center',
        color: colors.delicate,
        marginBottom: 25,
        fontSize: 14,
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: colors.dark,
        backgroundColor: colors.fondoclaro,
    },
    saveButton: {
        backgroundColor: colors.dark,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonDisabled: {
        backgroundColor: colors.delicate,
    },
    saveButtonText: {
        color: colors.principal,
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default ChangePasswordScreen;
