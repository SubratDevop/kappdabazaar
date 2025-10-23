import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/useAuthStore';
import LedgerService from '../services/LedgerService';
import { formatCurrency, formatDate } from '../utils/constants';

const LedgerScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ledgerSummary, setLedgerSummary] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [settledPayments, setSettledPayments] = useState([]);
  const [selectedTab, setSelectedTab] = useState('summary');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [summary, pending, settled] = await Promise.all([
        LedgerService.getLedgerSummary(user.id),
        LedgerService.getPendingPayments(user.id),
        LedgerService.getSettledPayments(user.id),
      ]);
      setLedgerSummary(summary);
      setPendingPayments(pending);
      setSettledPayments(settled);
    } catch (error) {
      console.error('Error loading ledger data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderSummary = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Balance</Text>
        <Text style={styles.summaryValue}>{formatCurrency(ledgerSummary?.totalBalance || 0)}</Text>
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Pending Amount</Text>
        <Text style={styles.summaryValue}>{formatCurrency(ledgerSummary?.pendingAmount || 0)}</Text>
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Settled Amount</Text>
        <Text style={styles.summaryValue}>{formatCurrency(ledgerSummary?.settledAmount || 0)}</Text>
      </View>
      <TouchableOpacity
        style={styles.requestSettlementButton}
        onPress={() => navigation.navigate('RequestSettlement')}
      >
        <Text style={styles.requestSettlementText}>Request Settlement</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPaymentList = (payments) => (
    <View style={styles.paymentList}>
      {payments.map((payment) => (
        <TouchableOpacity
          key={payment.id}
          style={styles.paymentCard}
          onPress={() => navigation.navigate('PaymentDetails', { paymentId: payment.id })}
        >
          <View style={styles.paymentHeader}>
            <Text style={styles.paymentId}>#{payment.id}</Text>
            <Text style={styles.paymentDate}>{formatDate(payment.date)}</Text>
          </View>
          <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
          <Text style={styles.paymentStatus}>{payment.status}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

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
        <Text style={styles.title}>Ledger</Text>
        <TouchableOpacity onPress={() => navigation.navigate('BankAccounts')}>
          <Ionicons name="card-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'summary' && styles.selectedTab]}
          onPress={() => setSelectedTab('summary')}
        >
          <Text style={[styles.tabText, selectedTab === 'summary' && styles.selectedTabText]}>
            Summary
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'pending' && styles.selectedTab]}
          onPress={() => setSelectedTab('pending')}
        >
          <Text style={[styles.tabText, selectedTab === 'pending' && styles.selectedTabText]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'settled' && styles.selectedTab]}
          onPress={() => setSelectedTab('settled')}
        >
          <Text style={[styles.tabText, selectedTab === 'settled' && styles.selectedTabText]}>
            Settled
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {selectedTab === 'summary' && renderSummary()}
        {selectedTab === 'pending' && renderPaymentList(pendingPayments)}
        {selectedTab === 'settled' && renderPaymentList(settledPayments)}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0000ff',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  selectedTabText: {
    color: '#0000ff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  requestSettlementButton: {
    backgroundColor: '#0000ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  requestSettlementText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentList: {
    padding: 16,
  },
  paymentCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentId: {
    fontSize: 14,
    color: '#666',
  },
  paymentDate: {
    fontSize: 14,
    color: '#666',
  },
  paymentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paymentStatus: {
    fontSize: 14,
    color: '#666',
  },
});

export default LedgerScreen; 