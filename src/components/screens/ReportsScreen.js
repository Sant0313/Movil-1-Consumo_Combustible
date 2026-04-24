import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';

const ReportsScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [refreshing, setRefreshing] = useState(false);
    const [metrics, setMetrics] = useState({
        totalFuelCost: 0,
        totalFuelVolume: 0,
        totalDistance: 0,
        totalTrips: 0
    });

    useEffect(() => {
        loadMetrics();
    }, []);

    const loadMetrics = async () => {
        try {
            const fuelData = await AsyncStorage.getItem('@fuel_history');
            const routesData = await AsyncStorage.getItem('@routes_history');

            let cost = 0;
            let volume = 0;
            let distance = 0;
            let trips = 0;

            if (fuelData) {
                const parsedFuel = JSON.parse(fuelData);
                parsedFuel.forEach(item => {
                    cost += parseFloat(item.valor) || 0;
                    volume += parseFloat(item.cantidad) || 0;
                });
            }

            if (routesData) {
                const parsedRoutes = JSON.parse(routesData);
                trips = parsedRoutes.length;
                parsedRoutes.forEach(item => {
                    distance += parseFloat(item.distancia) || 0;
                });
            }

            setMetrics({
                totalFuelCost: cost,
                totalFuelVolume: volume,
                totalDistance: distance,
                totalTrips: trips
            });

        } catch (error) {
            console.log("Error loading metrics", error);
        }
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await loadMetrics();
        setRefreshing(false);
    }, []);

    const handleClearData = () => {
        Alert.alert(
            "Limpiar Datos",
            "¿Estás seguro de que quieres borrar todos los registros de combustible y rutas?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Sí, borrar", 
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.removeItem('@fuel_history');
                        await AsyncStorage.removeItem('@routes_history');
                        loadMetrics();
                    }
                }
            ]
        );
    };

    const MetricCard = ({ title, value, icon, color, unit }) => (
        <View style={styles.metricCard}>
            <View style={[styles.iconWrapper, { backgroundColor: `${color}15` }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View style={styles.metricInfo}>
                <Text style={styles.metricTitle}>{title}</Text>
                <Text style={styles.metricValue}>
                    {value} <Text style={styles.metricUnit}>{unit}</Text>
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reportes Globales</Text>
                <TouchableOpacity onPress={handleClearData} style={styles.backButton}>
                    <Ionicons name="trash-outline" size={22} color={colors.alerta} />
                </TouchableOpacity>
            </View>

            <ScrollView 
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <Text style={styles.sectionTitle}>Resumen General</Text>
                
                <MetricCard 
                    title="Gasto Total en Combustible" 
                    value={`$${metrics.totalFuelCost.toLocaleString()}`} 
                    unit=""
                    icon="cash" 
                    color={colors.alerta} 
                />
                
                <MetricCard 
                    title="Combustible Consumido" 
                    value={metrics.totalFuelVolume.toFixed(2)} 
                    unit="L/Gal"
                    icon="water" 
                    color={colors.variante1} 
                />

                <MetricCard 
                    title="Distancia Recorrida (Rutas)" 
                    value={metrics.totalDistance.toFixed(2)} 
                    unit="km"
                    icon="map" 
                    color={colors.variante4} 
                />

                <MetricCard 
                    title="Total de Viajes Registrados" 
                    value={metrics.totalTrips} 
                    unit="viajes"
                    icon="car" 
                    color={colors.variante3} 
                />

                <View style={styles.infoBox}>
                    <Ionicons name="information-circle" size={24} color={colors.information} />
                    <Text style={styles.infoText}>
                        Desliza hacia abajo para actualizar los datos. Los cálculos se basan en la información registrada en las secciones de Combustible y Rutas.
                    </Text>
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 20,
    },
    metricCard: {
        flexDirection: 'row',
        backgroundColor: colors.principal,
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    iconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    metricInfo: {
        flex: 1,
    },
    metricTitle: {
        fontSize: 14,
        color: colors.delicate,
        marginBottom: 5,
    },
    metricValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.dark,
    },
    metricUnit: {
        fontSize: 14,
        fontWeight: 'normal',
        color: colors.delicate,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: `${colors.information}15`,
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 13,
        color: colors.dark,
        lineHeight: 18,
    }
});

import { Alert } from 'react-native';

export default ReportsScreen;
