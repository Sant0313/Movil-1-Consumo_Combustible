import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addRouteRecord, getRoutesRecords } from '../../../services/databaseService';
import { useTheme } from '../../context/ThemeContext';
const RoutesScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [origen, setOrigen] = useState('');
    const [destino, setDestino] = useState('');
    const [distancia, setDistancia] = useState('');
    const [motivo, setMotivo] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const data = await getRoutesRecords();
            setHistory(data);
        } catch (error) {
            console.log("Error loading routes history", error);
        }
    };

    const handleSave = async () => {
        if (!origen || !destino || !distancia || !fecha) {
            Alert.alert('Error', 'Por favor llena al menos origen, destino, distancia y fecha.');
            return;
        }

        const newEntry = {
            id: Date.now().toString(),
            origen,
            destino,
            distancia,
            motivo: motivo || 'No especificado',
            fecha
        };

        try {
            await addRouteRecord(newEntry);
            const data = await getRoutesRecords();
            setHistory(data);
            setOrigen('');
            setDestino('');
            setDistancia('');
            setMotivo('');
            Alert.alert('Éxito', 'Ruta guardada correctamente');
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar la ruta');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Registro de Rutas</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Nueva Ruta</Text>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Origen</Text>
                        <TextInput
                            style={styles.input}
                            value={origen}
                            onChangeText={setOrigen}
                            placeholder="Ej: Casa"
                            placeholderTextColor={colors.delicate}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Destino</Text>
                        <TextInput
                            style={styles.input}
                            value={destino}
                            onChangeText={setDestino}
                            placeholder="Ej: Trabajo"
                            placeholderTextColor={colors.delicate}
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                            <Text style={styles.label}>Distancia (km)</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={distancia}
                                onChangeText={setDistancia}
                                placeholder="Ej: 15"
                                placeholderTextColor={colors.delicate}
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Fecha</Text>
                            <TextInput
                                style={styles.input}
                                value={fecha}
                                onChangeText={setFecha}
                                placeholder="AAAA-MM-DD"
                                placeholderTextColor={colors.delicate}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Motivo (Opcional)</Text>
                        <TextInput
                            style={styles.input}
                            value={motivo}
                            onChangeText={setMotivo}
                            placeholder="Ej: Reunión, Viaje familiar..."
                            placeholderTextColor={colors.delicate}
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Guardar Ruta</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.historySection}>
                    <Text style={styles.sectionTitle}>Historial de Viajes</Text>
                    {history.length === 0 ? (
                        <Text style={styles.emptyText}>No has registrado rutas todavía.</Text>
                    ) : (
                        history.map((item) => (
                            <View key={item.id} style={styles.historyCard}>
                                <View style={styles.historyHeader}>
                                    <View style={styles.routeContainer}>
                                        <Text style={styles.routeText}>{item.origen}</Text>
                                        <Ionicons name="arrow-forward" size={16} color={colors.variante4} style={{ marginHorizontal: 5 }} />
                                        <Text style={styles.routeText}>{item.destino}</Text>
                                    </View>
                                    <Text style={styles.historyDate}>{item.fecha}</Text>
                                </View>
                                <View style={styles.historyFooter}>
                                    <Text style={styles.historyDistance}>{item.distancia} km</Text>
                                    <Text style={styles.historyReason}>{item.motivo}</Text>
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
        borderBottomColor: colors.thin,
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
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 14,
        color: colors.delicate,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.thin,
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: colors.dark,
        backgroundColor: colors.fondoclaro,
    },
    saveButton: {
        backgroundColor: colors.variante4,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#fff',
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
        borderLeftColor: colors.variante4,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    routeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingRight: 10,
    },
    routeText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.dark,
    },
    historyDate: {
        fontSize: 12,
        color: colors.delicate,
    },
    historyFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    historyDistance: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.variante4,
    },
    historyReason: {
        fontSize: 13,
        color: colors.delicate,
        fontStyle: 'italic',
    }
});

export default RoutesScreen;
