import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import BankAccountForm from '../../components/seller/BankAccountForm';
import BankAccountCard from '../../components/seller/BankAccountCard';
import { Card, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import BankDetailsService from '../../services/BankDetailsService';

const BankAccountsScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuthStore();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    useEffect(() => {
        fetchBankAccounts();
    }, []);

    const fetchBankAccounts = async () => {
        try {
            setLoading(true);
            const response = await BankDetailsService.getBankAccounts(user.id);
            setAccounts(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch bank accounts');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAccount = async (accountData) => {
        try {
            setLoading(true);
            await BankDetailsService.addBankAccount({
                ...accountData,
                userId: user.id,
            });
            await fetchBankAccounts();
            setShowForm(false);
            Alert.alert('Success', 'Bank account added successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to add bank account');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAccount = async (accountData) => {
        try {
            setLoading(true);
            await BankDetailsService.updateBankAccount(selectedAccount.id, accountData);
            await fetchBankAccounts();
            setShowForm(false);
            setSelectedAccount(null);
            Alert.alert('Success', 'Bank account updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update bank account');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async (accountId) => {
        try {
            setLoading(true);
            await BankDetailsService.deleteBankAccount(accountId);
            await fetchBankAccounts();
            Alert.alert('Success', 'Bank account deleted successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to delete bank account');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !accounts.length) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Bank Accounts</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Bank Accounts</Text>
                    <Button
                        mode="contained"
                        onPress={() => setShowForm(true)}
                        style={styles.addButton}
                        labelStyle={styles.addButtonLabel}
                    >
                        Add Account
                    </Button>
                </View>

                {accounts.map((account) => (
                    <BankAccountCard
                        key={account.id}
                        account={account}
                        onEdit={() => {
                            setSelectedAccount(account);
                            setShowForm(true);
                        }}
                        onDelete={() => handleDeleteAccount(account.id)}
                    />
                ))}

                {!accounts.length && !showForm && (
                    <Card style={styles.emptyCard}>
                        <Card.Content style={styles.emptyContent}>
                            <MaterialIcons name="account-balance" size={48} color="#8E8E93" />
                            <Text style={styles.emptyText}>No bank accounts added yet</Text>
                            <Text style={styles.emptySubtext}>
                                Add your bank account to receive payments
                            </Text>
                        </Card.Content>
                    </Card>
                )}
            </ScrollView>

            {showForm && (
                <BankAccountForm
                    visible={showForm}
                    onDismiss={() => {
                        setShowForm(false);
                        setSelectedAccount(null);
                    }}
                    onSubmit={selectedAccount ? handleUpdateAccount : handleAddAccount}
                    initialData={selectedAccount}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAFAFA",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: "#2C2C2E",
    },
    addButton: {
        backgroundColor: "#FF6B6B",
    },
    addButtonLabel: {
        fontSize: 14,
        fontWeight: "500",
    },
    emptyCard: {
        marginTop: 32,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        elevation: 1,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    emptyContent: {
        alignItems: "center",
        padding: 32,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2C2C2E",
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#8E8E93",
        marginTop: 8,
        textAlign: "center",
    },
    backButton: {
        marginRight: 16
    },
    content: {
        flex: 1,
        padding: 16
    }
});

export default BankAccountsScreen; 