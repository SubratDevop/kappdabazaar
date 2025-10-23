import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const BankAccountCard = ({ account, onEdit, onDelete }) => {
    return (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.header}>
                    <View style={styles.bankInfo}>
                        <MaterialIcons name="account-balance" size={24} color="#FF6B6B" />
                        <Text style={styles.bankName}>{account.bankName}</Text>
                    </View>
                    <View style={styles.actions}>
                        <IconButton
                            icon="pencil"
                            size={20}
                            onPress={onEdit}
                            style={styles.actionButton}
                        />
                        <IconButton
                            icon="delete"
                            size={20}
                            onPress={onDelete}
                            style={styles.actionButton}
                        />
                    </View>
                </View>

                <View style={styles.details}>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Account Holder</Text>
                        <Text style={styles.value}>{account.accountHolderName}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Account Number</Text>
                        <Text style={styles.value}>
                            {account.accountNumber.replace(/^(\d{4})(\d+)(\d{4})$/, '$1****$3')}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>IFSC Code</Text>
                        <Text style={styles.value}>{account.ifscCode}</Text>
                    </View>

                    {account.branchName && (
                        <View style={styles.detailRow}>
                            <Text style={styles.label}>Branch</Text>
                            <Text style={styles.value}>{account.branchName}</Text>
                        </View>
                    )}
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        elevation: 1,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    bankInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bankName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C2C2E',
        marginLeft: 8,
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        margin: 0,
    },
    details: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        color: '#8E8E93',
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2C2C2E',
    },
});

export default BankAccountCard; 