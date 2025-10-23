import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/useAuthStore';
import LedgerService from '../services/LedgerService';
import { formatCurrency } from '../utils/constants';

const RequestSettlementScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ledgerSummary, setLedgerSummary] = useState(null);
  const [amount, setAmount] = useState('');
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [summary, accounts] = await Promise.all([
        LedgerService.getLedgerSummary(user.id),
        LedgerService.getBankAccounts(user.id),
      ]);
      setLedgerSummary(summary);
      setBankAccounts(accounts);
      if (accounts.length > 0) {
        setSelectedAccount(accounts[0]);
      }
    } catch (error) {
      console.error('Error loading settlement data:', error);
      Alert.alert('Error', 'Failed to load settlement data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!selectedAccount) {
      Alert.alert('Error', 'Please select a bank account');
      return;
    }

    const settlementAmount = parseFloat(amount);
    if (settlementAmount > ledgerSummary.pendingAmount) {
      Alert.alert('Error', 'Settlement amount cannot exceed pending amount');
      return;
    }

    try {
      setSubmitting(true);
      await LedgerService.requestSettlement(user.id, settlementAmount);
      Alert.alert(
        'Success',
        'Settlement request submitted successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error requesting settlement:', error);
      Alert.alert('Error', 'Failed to submit settlement request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Request Settlement</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>
            {formatCurrency(ledgerSummary?.pendingAmount || 0)}
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Bank Account</Text>
          <ScrollView style={styles.accountList}>
            {bankAccounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountCard,
                  selectedAccount?.id === account.id && styles.selectedAccount,
                ]}
                onPress={() => setSelectedAccount(account)}
              >
                <Text style={styles.accountName}>{account.accountName}</Text>
                <Text style={styles.accountNumber}>
                  {account.accountNumber.slice(-4)}
                </Text>
                <Text style={styles.bankName}>{account.bankName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submittingButton]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Request Settlement</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  accountList: {
    maxHeight: 200,
  },
  accountCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  selectedAccount: {
    borderColor: '#0000ff',
    backgroundColor: '#f0f8ff',
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bankName: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#0000ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submittingButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RequestSettlementScreen; 