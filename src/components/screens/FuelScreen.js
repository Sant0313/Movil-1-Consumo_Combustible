import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addFuelRecord, getFuelRecords } from '../../../services/databaseService';
import { useTheme } from '../../context/ThemeContext';
const FuelScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [kilometraje, setKilometraje] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [valor, setValor] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const data = await getFuelRecords();
            setHistory(data);
        } catch (error) {
            console.log("Error loading history", error);
        }
    };

    const handleSave = async () => {
        if (!kilometraje || !cantidad || !valor || !fecha) {
            Alert.alert('Error', 'Por favor llena todos los campos');
            return;
        }

        const newEntry = {
            id: Date.now().toString(),
            kilometraje,
            cantidad,
            valor,
            fecha
        };

        try {
            await addFuelRecord(newEntry);
            const data = await getFuelRecords();
            setHistory(data);
            setKilometraje('');
            setCantidad('');
            setValor('');
            Alert.alert('Éxito', 'Registro guardado correctamente');
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar el registro');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Registro de Combustible</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Nuevo Registro</Text>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kilometraje Actual (km)</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={kilometraje}
                            onChangeText={setKilometraje}
                            placeholder="Ej: 15000"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Cantidad (Litros/Galones)</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={cantidad}
                            onChangeText={setCantidad}
                            placeholder="Ej: 10"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Valor Total ($)</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={valor}
                            onChangeText={setValor}
                            placeholder="Ej: 50000"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Fecha (AAAA-MM-DD)</Text>
                        <TextInput
                            style={styles.input}
                            value={fecha}
                            onChangeText={setFecha}
                            placeholder="AAAA-MM-DD"
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Guardar Registro</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.historySection}>
                    <Text style={styles.sectionTitle}>Historial Reciente</Text>
                    {history.length === 0 ? (
                        <Text style={styles.emptyText}>No hay registros todavía.</Text>
                    ) : (
                        history.map((item) => (
                            <View key={item.id} style={styles.historyCard}>
                                <View style={styles.historyRow}>
                                    <View>
                                        <Text style={styles.historyDate}>{item.fecha}</Text>
                                        <Text style={styles.historyKm}>{item.kilometraje} km</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={styles.historyPrice}>${item.valor}</Text>
                                        <Text style={styles.historyVolume}>{item.cantidad} L/Gal</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
                </View>
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
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 15,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: colors.delicate,
        marginBottom: 5,
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
        backgroundColor: colors.variante1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: colors.principal,
        fontWeight: 'bold',
        fontSize: 16,
    },
    historySection: {
        marginTop: 10,
    },
    emptyText: {
        color: colors.delicate,
        textAlign: 'center',
        marginTop: 20,
    },
    historyCard: {
        backgroundColor: colors.principal,
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: colors.variante1,
    },
    historyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    historyDate: {
        fontSize: 14,
        color: colors.delicate,
        marginBottom: 4,
    },
    historyKm: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.dark,
    },
    historyPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.alerta,
    },
    historyVolume: {
        fontSize: 14,
        color: colors.delicate,
    }
});

export default FuelScreen;
