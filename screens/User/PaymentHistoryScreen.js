import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { format } from "date-fns";

import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Card, Chip, TextInput } from 'react-native-paper';
import EmptyState from '../../components/EmptyState';
import { API_BASE } from '../../constants/exports';
import { useAuthStore } from '../../store/useAuthStore';

const PaymentHistoryScreen = ({ navigation }) => {
    const [payments, setPayments] = useState([]);
    const [allPayment, setallPayment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [paymentStats, setPaymentStats] = useState({
        totalPaid: 0,
        totalTransactions: 0,
        averageAmount: 0
    });

    const { authInfo } = useAuthStore();

    const filterOptions = [
        { key: 'all', label: 'All' },
        { key: 'success', label: 'Success' },
        { key: 'pending', label: 'Pending' },
        { key: 'failed', label: 'Failed' },
        { key: 'refunded', label: 'Refunded' }
    ];

    useEffect(() => {
        fetchPaymentHistory();
        fetchAllPaymnet();
    }, [selectedFilter]);
    const fetchPaymentHistory = async () => {
        try {
            setLoading(true);
            const token = authInfo?.token;
            const response = await axios.get(`${API_BASE}/ledger/user/${authInfo.user_id}/ledger`, {
                headers: { Authorization: `Bearer ${token}` },

            });
            setPayments(response.data.payments || []);
            setPaymentStats(response.data.stats || {});
        } catch (error) {
            console.error('Error fetching payment history:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const formatIndianCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const fetchAllPaymnet = async () => {
        try {
            setLoading(true);
            const token = authInfo?.token;
            const response = await axios.get(`${API_BASE}/users/${authInfo.user_id}/all-payment`, {
                headers: { Authorization: `Bearer ${token}` },

            });
            setallPayment(response.data);
        } catch (error) {
            console.error('Error fetching payment history:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchPaymentHistory();
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'success':
            case 'completed':
                return '#10B981';
            case 'pending':
                return '#F59E0B';
            case 'failed':
                return '#EF4444';
            case 'refunded':
                return '#8B5CF6';
            default:
                return '#6B7280';
        }
    };

    const getPaymentMethodIcon = (method) => {
        switch (method?.toLowerCase()) {
            case 'card':
            case 'credit_card':
            case 'debit_card':
                return 'credit-card';
            case 'upi':
                return 'account-balance';
            case 'netbanking':
                return 'account-balance-wallet';
            case 'wallet':
                return 'account-balance-wallet';
            case 'cod':
                return 'money';
            default:
                return 'payment';
        }
    };

    const renderPaymentCard = (payment) => (
        <Card key={payment.payment_id} style={styles.paymentCard}>
            <TouchableOpacity onPress={() => navigation.navigate('PaymentDetailsScreen', { paymentId: payment.id })}>
                <Card.Content>
                    <View style={styles.paymentHeader}>
                        <View style={styles.paymentInfo}>
                            <Text style={styles.transactionId}>{payment.transaction_id}</Text>
                            <Text style={styles.paymentDate}>
                            {format(new Date(payment.created_at), "dd-MMM-yyyy, h:mm a")};
                            </Text>
                        </View>
                        <View style={styles.paymentAmount}>
                            <Text style={styles.amountText}>{payment.amount}</Text>
                            <View style={[styles.statusChip, { backgroundColor: getStatusColor(payment.status) }]}>
                                <Text style={styles.statusText}>{payment.payment_status?.toUpperCase()}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.paymentDetails}>
                        <View style={styles.detailRow}>
                            <MaterialIcons
                                name={getPaymentMethodIcon(payment.payment_method)}
                                size={16}
                                color="#6B7280"
                            />
                            <Text style={styles.detailText}>
                                {payment.payment_method?.replace('_', ' ').toUpperCase()}
                            </Text>
                        </View>
                        {/* 
                        {payment.orderNumber && (
                            <View style={styles.detailRow}>
                                <MaterialIcons name="shopping-bag" size={16} color="#6B7280" />
                                <Text style={styles.detailText}>Order #{payment.orderNumber}</Text>
                            </View>
                        )}

                        {payment.description && (
                            <Text style={styles.description} numberOfLines={2}>
                                {payment.description}
                            </Text>
                        )} */}
                    </View>

                    {payment.gstAmount && (
                        <View style={styles.gstInfo}>
                            <Text style={styles.gstText}>
                                GST: ₹{payment.gstAmount?.toFixed(2)}
                            </Text>
                        </View>
                    )}
                </Card.Content>
            </TouchableOpacity>
        </Card>
    );

    const renderStatsCard = () => (
        <Card style={styles.statsCard}>
            <Card.Content>
                <Text style={styles.statsTitle}>Payment Summary</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <MaterialIcons name="currency-rupee" size={24} color="#132f56" />
                        <Text style={styles.statValue}>₹{formatIndianCurrency(allPayment.totalSpent) || '0'}</Text>
                        <Text style={styles.statLabel}>Total Paid</Text>
                    </View>
                    <View style={styles.statItem} allPayment>
                        <MaterialIcons name="receipt" size={24} color="#132f56" />
                        <Text style={styles.statValue}>{allPayment.totalPayments || 0}</Text>
                        <Text style={styles.statLabel}>Transactions</Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialIcons name="trending-up" size={24} color="#132f56" />
                        <Text style={styles.statValue}>₹{formatIndianCurrency(allPayment.avgPayment) || '0'}</Text>
                        <Text style={styles.statLabel}>Average</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
    const filteredPayments = (allPayment?.payments || []).filter(payment =>

        payment.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.payment_status?.toString().includes(searchQuery)
    );


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} size="large" color="#132f56" />
                <Text style={styles.loadingText}>Loading payment history...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#132f56" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment History</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Stats Card */}
                {renderStatsCard()}

                {/* Search */}
                <View style={styles.searchSection}>
                    <TextInput
                        label="Search Payments"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        mode="outlined"
                        style={styles.searchInput}
                        left={<TextInput.Icon icon="magnify" />}
                        placeholder="Search by transaction ID, order, or description"
                    />
                </View>

                {/* Filter Chips */}
                <View style={styles.filterSection}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {filterOptions.map((filter) => (
                            <Chip
                                key={filter.key}
                                selected={selectedFilter === filter.key}
                                onPress={() => setSelectedFilter(filter.key)}
                                style={[
                                    styles.filterChip,
                                    selectedFilter === filter.key && styles.selectedFilterChip
                                ]}
                                textStyle={[
                                    styles.filterChipText,
                                    selectedFilter === filter.key && styles.selectedFilterChipText
                                ]}
                            >
                                {filter.label}
                            </Chip>
                        ))}
                    </ScrollView>
                </View>

                {/* Payment List */}
                {allPayment.payments.length === 0 ? (
                    <EmptyState
                        type="payments"
                        title="No Payments Found"
                        subtitle={searchQuery ? "No payments match your search" : "You haven't made any payments yet"}
                        actionText={searchQuery ? "Clear Search" : "Start Shopping"}
                        onActionPress={() => {
                            if (searchQuery) {
                                setSearchQuery('');
                            } else {
                                navigation.navigate('HomeScreen');
                            }
                        }}
                    />
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>
                            Transactions ({filteredPayments.length})
                        </Text>
                        {filteredPayments.map(renderPaymentCard)}
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#132f56',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    statsCard: {
        marginBottom: 16,
        elevation: 2,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#132f56',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 4,
    },
    searchSection: {
        marginBottom: 16,
    },
    searchInput: {
        backgroundColor: '#fff',
    },
    filterSection: {
        marginBottom: 16,
    },
    filterChip: {
        marginRight: 8,
        backgroundColor: '#F3F4F6',
    },
    selectedFilterChip: {
        backgroundColor: '#132f56',
    },
    filterChipText: {
        color: '#6B7280',
        fontSize: 12,
    },
    selectedFilterChipText: {
        color: '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 16,
    },
    paymentCard: {
        marginBottom: 12,
        elevation: 2,
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    paymentInfo: {
        flex: 1,
    },
    transactionId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    paymentDate: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    paymentAmount: {
        alignItems: 'flex-end',
    },
    amountText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#132f56',
        marginBottom: 4,
    },
    statusChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
    },
    paymentDetails: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#6B7280',
    },
    description: {
        fontSize: 14,
        color: '#374151',
        marginTop: 4,
    },
    gstInfo: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    gstText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
});

export default PaymentHistoryScreen; 