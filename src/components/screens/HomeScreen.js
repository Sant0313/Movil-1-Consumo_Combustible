import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import colors from "../constants/colors";

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.greeting}>Hola, Bienvenido 👋</Text>
                    <Text style={styles.subtitle}>Resumen de tu movilidad</Text>
                </View>
                <TouchableOpacity style={styles.profileBtn}>
                    <Ionicons name="notifications-outline" size={24} color={colors.dark} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Main Card */}
                <View style={styles.mainCard}>
                    <View style={styles.mainCardTop}>
                        <Ionicons name="car-sport" size={40} color={colors.variante1} />
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>Vehículo Principal</Text>
                            <Text style={styles.cardSub}>Activo y en regla</Text>
                        </View>
                    </View>
                    <View style={styles.mainCardBottom}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Rendimiento</Text>
                            <Text style={styles.statValue}>14.5<Text style={styles.statUnit}> km/L</Text></Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Gasto Mes</Text>
                            <Text style={styles.statValue}>$180<Text style={styles.statUnit}> mil</Text></Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions Grid */}
                <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
                <View style={styles.gridContainer}>
                    <TouchableOpacity style={styles.gridItem}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(135, 94, 248, 0.15)' }]}>
                            <Ionicons name="water" size={28} color={colors.variante1} />
                        </View>
                        <Text style={styles.gridText}>Combustible</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.gridItem}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(105, 204, 138, 0.15)' }]}>
                            <Ionicons name="map" size={28} color={colors.variante4} />
                        </View>
                        <Text style={styles.gridText}>Rutas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.gridItem}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(230, 94, 248, 0.15)' }]}>
                            <Ionicons name="document-text" size={28} color={colors.variante2} />
                        </View>
                        <Text style={styles.gridText}>Reportes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.gridItem}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(184, 181, 28, 0.15)' }]}>
                            <Ionicons name="build" size={28} color={colors.variante3} />
                        </View>
                        <Text style={styles.gridText}>Taller</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Activity */}
                <View style={styles.activityHeader}>
                    <Text style={styles.sectionTitle}>Actividad Reciente</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>Ver todo</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.activityCard}>
                    <View style={styles.activityIcon}>
                        <Ionicons name="water-outline" size={20} color={colors.variante1} />
                    </View>
                    <View style={styles.activityDetails}>
                        <Text style={styles.activityName}>Recarga Gasolina Extra</Text>
                        <Text style={styles.activityDate}>Hoy, 10:30 AM</Text>
                    </View>
                    <Text style={styles.activityAmount}>-$45,000</Text>
                </View>

                <View style={styles.activityCard}>
                    <View style={styles.activityIcon}>
                        <Ionicons name="navigate-outline" size={20} color={colors.variante4} />
                    </View>
                    <View style={styles.activityDetails}>
                        <Text style={styles.activityName}>Viaje: Oficina</Text>
                        <Text style={styles.activityDate}>Ayer, 6:00 PM</Text>
                    </View>
                    <Text style={[styles.activityAmount, { color: colors.delicate }]}>12 km</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.fondoclaro,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 20,
        paddingBottom: 20,
        backgroundColor: colors.principal,
    },
    greeting: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.dark,
    },
    subtitle: {
        fontSize: 14,
        color: colors.delicate,
        marginTop: 4,
    },
    profileBtn: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: colors.fondoclaro,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    mainCard: {
        backgroundColor: colors.principal,
        borderRadius: 20,
        padding: 20,
        shadowColor: colors.variante1,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 8,
        marginBottom: 30,
    },
    mainCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardInfo: {
        marginLeft: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
    },
    cardSub: {
        fontSize: 13,
        color: colors.variante4,
        fontWeight: '600',
        marginTop: 2,
    },
    mainCardBottom: {
        flexDirection: 'row',
        backgroundColor: colors.fondoclaro,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: '#ddd',
    },
    statLabel: {
        fontSize: 12,
        color: colors.delicate,
        marginBottom: 5,
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.dark,
    },
    statUnit: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.dark,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 15,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    gridItem: {
        width: (width - 60) / 4,
        alignItems: 'center',
        marginBottom: 15,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    gridText: {
        fontSize: 12,
        color: colors.dark,
        fontWeight: '500',
        textAlign: 'center',
    },
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    seeAllText: {
        fontSize: 14,
        color: colors.variante1,
        fontWeight: '600',
    },
    activityCard: {
        flexDirection: 'row',
        backgroundColor: colors.principal,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.fondoclaro,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityDetails: {
        flex: 1,
        marginLeft: 15,
    },
    activityName: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.dark,
    },
    activityDate: {
        fontSize: 12,
        color: colors.delicate,
        marginTop: 4,
    },
    activityAmount: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.variante1,
    }
});

export default HomeScreen;