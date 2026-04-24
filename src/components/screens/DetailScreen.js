import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { auth } from '../../../services/firebaseService';

const DetailScreen = ({ route, navigation }) => {
    const { colors } = useTheme();
    const { title, icon, color } = route.params || { title: 'Detalle', icon: 'document-text', color: colors.dark };
    const currentUser = auth?.currentUser;
    const styles = getStyles(colors);

    const renderMisDatos = () => {
        const isSantiago = currentUser?.email === 'santiago.gomezmu@amigo.edu.co';
        
        const nombre = isSantiago ? 'Santiago' : (currentUser?.displayName?.split(' ')[0] || 'Usuario');
        const apellido = isSantiago ? 'Gómez' : (currentUser?.displayName?.split(' ')[1] || 'Conductor');
        const correo = currentUser?.email || 'No registrado';
        const contrasena = '#########';
        const vehiculo = isSantiago ? 'Ford RAPTOR' : 'No registrado';

        return (
            <View style={[styles.card, { padding: 0, overflow: 'hidden' }]}>
                <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Nombre</Text>
                    <Text style={styles.dataValue}>{nombre}</Text>
                </View>
                <View style={styles.dataDivider} />
                <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Apellido</Text>
                    <Text style={styles.dataValue}>{apellido}</Text>
                </View>
                <View style={styles.dataDivider} />
                <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Correo</Text>
                    <Text style={styles.dataValue}>{correo}</Text>
                </View>
                <View style={styles.dataDivider} />
                <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Contraseña</Text>
                    <Text style={styles.dataValue}>{contrasena}</Text>
                </View>
                <View style={styles.dataDivider} />
                <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Vehículo</Text>
                    <Text style={styles.dataValue}>{vehiculo}</Text>
                </View>
            </View>
        );
    };

    const renderMisVehiculos = () => {
        const isSantiago = currentUser?.email === 'santiago.gomezmu@amigo.edu.co';
        
        const vehiculo = isSantiago ? 'Ford RAPTOR' : 'No registrado';
        const tipoVehiculo = isSantiago ? 'Camioneta' : 'N/A';
        const ano = isSantiago ? '2024' : 'N/A';
        const tipoCombustible = isSantiago ? 'Gasolina / Extra' : 'N/A';
        const placa = isSantiago ? 'RAP-123' : 'N/A';
        const kilometraje = isSantiago ? '15,000 km' : '0 km';

        return (
            <View style={[styles.card, { padding: 0, overflow: 'hidden' }]}>
                <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Vehículo</Text>
                    <Text style={styles.dataValue}>{vehiculo}</Text>
                </View>
                <View style={styles.dataDivider} />
                <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Tipo</Text>
                    <Text style={styles.dataValue}>{tipoVehiculo}</Text>
                </View>
                <View style={styles.dataDivider} />
                <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Año</Text>
                    <Text style={styles.dataValue}>{ano}</Text>
                </View>
                <View style={styles.dataDivider} />
                <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Combustible</Text>
                    <Text style={styles.dataValue}>{tipoCombustible}</Text>
                </View>
                <View style={styles.dataDivider} />
                <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Placa</Text>
                    <Text style={styles.dataValue}>{placa}</Text>
                </View>
                <View style={styles.dataDivider} />
                <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Kilometraje</Text>
                    <Text style={styles.dataValue}>{kilometraje}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
                <View style={{ width: 40 }} />
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.iconWrapper, { backgroundColor: `${color}15` }]}>
                    <Ionicons name={icon} size={60} color={color} />
                </View>
                <Text style={styles.title}>{title}</Text>
                
                {title === 'Mis Datos' ? (
                    <>
                        {renderMisDatos()}
                        <TouchableOpacity style={[styles.button, { backgroundColor: color, marginTop: 25, width: '100%' }]} onPress={() => navigation.goBack()}>
                            <Text style={styles.buttonText}>Volver</Text>
                        </TouchableOpacity>
                    </>
                ) : title === 'Mis Vehículos' ? (
                    <>
                        {renderMisVehiculos()}
                        <TouchableOpacity style={[styles.button, { backgroundColor: color, marginTop: 25, width: '100%' }]} onPress={() => navigation.goBack()}>
                            <Text style={styles.buttonText}>Volver</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.card}>
                        <Text style={styles.text}>
                            Actualmente no hay información configurada para la sección de {title.toLowerCase()}.
                        </Text>
                        <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={() => navigation.goBack()}>
                            <Text style={styles.buttonText}>Volver</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
        alignItems: 'center',
    },
    iconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 30,
        textAlign: 'center',
    },
    card: {
        backgroundColor: colors.principal,
        borderRadius: 15,
        padding: 25,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    text: {
        fontSize: 15,
        color: colors.delicate,
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 25,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: colors.principal,
        fontWeight: 'bold',
        fontSize: 16,
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    dataLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.delicate,
    },
    dataValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.dark,
    },
    dataDivider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 20,
    }
});

export default DetailScreen;
