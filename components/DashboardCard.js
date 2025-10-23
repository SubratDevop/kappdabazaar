import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/exports';

const DashboardCard = ({ label, value, bg, full = false }) => (
    <View style={[styles.card, { backgroundColor: bg, flex: full ? 1 : 0.48 }]}>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardLabel}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    card: {
        padding: 10,
        borderRadius: 6,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        borderWidth: 0.1,
    },
    cardLabel: {
        fontSize: 13,
        color: COLORS.text,
        marginTop: 5,
        textAlign: 'center',
    },
    cardValue: {
        fontSize: 25,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});

export default DashboardCard;