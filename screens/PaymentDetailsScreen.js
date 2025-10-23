import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import LedgerService from '../services/LedgerService';
import { formatCurrency, formatDate } from '../utils/constants';

const PaymentDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { paymentId } = route.params;
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    loadPaymentDetails();
  }, []);

  const loadPaymentDetails = async () => {
    try {
      setLoading(true);
      const details = await LedgerService.getPaymentDetails(paymentId);
      setPayment(details);
    } catch (error) {
      console.error('Error loading payment details:', error);
      Alert.alert('Error', 'Failed to load payment details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      setLoading(true);
      const invoiceBlob = await LedgerService.downloadTaxInvoice(payment.invoiceId);
      // Handle the blob data (e.g., save to file or open in viewer)
      // This will depend on your app's requirements and available libraries
    } catch (error) {
      console.error('Error downloading invoice:', error);
      Alert.alert('Error', 'Failed to download invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!payment) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Payment details not found</Text>
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
        <Text style={styles.title}>Payment Details</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Payment ID</Text>
            <Text style={styles.value}>#{payment.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>{formatCurrency(payment.amount)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Status</Text>
            <Text
              style={[
                styles.value,
                styles.status,
                { color: payment.status === 'completed' ? '#00c853' : '#ff9800' },
              ]}
            >
              {payment.status}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{formatDate(payment.date)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Transaction ID</Text>
            <Text style={styles.value}>{payment.transactionId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>{payment.paymentMethod}</Text>
          </View>
          {payment.bankDetails && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Bank Name</Text>
                <Text style={styles.value}>{payment.bankDetails.bankName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Account Number</Text>
                <Text style={styles.value}>
                  {payment.bankDetails.accountNumber.slice(-4)}
                </Text>
              </View>
            </>
          )}
        </View>

        {payment.invoiceId && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Invoice</Text>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownloadInvoice}
            >
              <Ionicons name="download-outline" size={24} color="#0000ff" />
              <Text style={styles.downloadButtonText}>Download Invoice</Text>
            </TouchableOpacity>
          </View>
        )}

        {payment.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notes}>{payment.notes}</Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  status: {
    textTransform: 'capitalize',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#0000ff',
    borderRadius: 8,
  },
  downloadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#0000ff',
    fontWeight: '500',
  },
  notes: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default PaymentDetailsScreen; 