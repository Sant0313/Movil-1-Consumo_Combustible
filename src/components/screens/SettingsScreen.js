import colors from "../constants/colors";
import { View, Text, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../../services/firebaseService';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {

        try {
            setLoading(true);
            await signOut(auth);
            Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.", [
                {text: "OK", onPress:() => navigation.reset({index: 0, routes: [{ name: 'Login' }]})}
            ]);
            
        } catch (error) {
            console.log("Error al cerrar sesión:", error);
            Alert.alert("Error 😒", "No se pudo cerrar sesión. Inténtalo de nuevo.");
            
        } finally {
            setLoading(false);
        }
    };
    return (
        <View style={styles.container}>
            <Text>Ajustes</Text>
            <TouchableOpacity onPress={handleLogout} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="#0000ff" />
                ) : (
                    <Text>Cerrar sesión</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.principal,
    }
};

export default SettingsScreen;