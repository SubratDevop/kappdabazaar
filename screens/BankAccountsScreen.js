import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/useAuthStore';
import LedgerService from '../services/LedgerService';

const BankAccountsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
  });

  useEffect(() => {
    loadBankAccounts();
  }, []);

  const loadBankAccounts = async () => {
    try {
      setLoading(true);
      const accounts = await LedgerService.getBankAccounts(user.id);
      setBankAccounts(accounts);
    } catch (error) {
      console.error('Error loading bank accounts:', error);
      Alert.alert('Error', 'Failed to load bank accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.accountName.trim()) {
      Alert.alert('Error', 'Please enter account holder name');
      return false;
    }
    if (!formData.accountNumber.trim() || formData.accountNumber.length < 9) {
      Alert.alert('Error', 'Please enter a valid account number');
      return false;
    }
    if (!formData.bankName.trim()) {
      Alert.alert('Error', 'Please enter bank name');
      return false;
    }
    if (!formData.ifscCode.trim() || formData.ifscCode.length !== 11) {
      Alert.alert('Error', 'Please enter a valid IFSC code');
      return false;
    }
    return true;
  };

  const handleAddAccount = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await LedgerService.addBankAccount(user.id, formData);
      setShowAddForm(false);
      setFormData({
        accountName: '',
        accountNumber: '',
        bankName: '',
        ifscCode: '',
      });
      await loadBankAccounts();
      Alert.alert('Success', 'Bank account added successfully');
    } catch (error) {
      console.error('Error adding bank account:', error);
      Alert.alert('Error', 'Failed to add bank account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this bank account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await LedgerService.deleteBankAccount(accountId);
              await loadBankAccounts();
              Alert.alert('Success', 'Bank account deleted successfully');
            } catch (error) {
              console.error("Error deleting bank account:", error);
              Alert.alert(
                "Error",
                "Failed to delete bank account. Please try again."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bank Accounts</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Ionicons
            name={showAddForm ? "close" : "add"}
            size={24}
            color="#0000ff"
          />
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Account Holder Name"
            value={formData.accountName}
              onChangeText={(value) => handleInputChange("accountName", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Account Number"
            value={formData.accountNumber}
            onChangeText={(value) => handleInputChange("accountNumber", value)}
            keyboardType="numeric"
            maxLength={18}
          />
          <TextInput
            style={styles.input}
            placeholder="Bank Name"
            value={formData.bankName}
            onChangeText={(value) => handleInputChange("bankName", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="IFSC Code"
            value={formData.ifscCode}
            onChangeText={(value) =>
              handleInputChange("ifscCode", value.toUpperCase())
            }
            autoCapitalize="characters"
            maxLength={11}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddAccount}
          >
            <Text style={styles.submitButtonText}>Add Account</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.accountList}>
        {bankAccounts.map((account) => (
          <View key={account.id} style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{account.accountName}</Text>
              <Text style={styles.accountNumber}>
                {account.accountNumber.slice(-4)}
              </Text>
              <Text style={styles.bankName}>{account.bankName}</Text>
              <Text style={styles.ifscCode}>{account.ifscCode}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteAccount(account.id)}
            >
              <Ionicons name="trash-outline" size={24} color="#ff0000" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    padding: 8,
  },
  formContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#0000ff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  accountList: {
    flex: 1,
  },
  accountCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  bankName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  ifscCode: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    padding: 8,
  },
});

export default BankAccountsScreen; 