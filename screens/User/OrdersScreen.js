import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { format } from "date-fns";
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip } from 'react-native-paper';
import EmptyState from '../../components/EmptyState';
import { API_BASE } from '../../constants/exports';
import { STORAGE_KEYS } from '../../store/useAuthStore';


const OrdersScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('ALL');

    const orderFilters = [
        { key: 'ALL', label: 'All Orders' },
        { key: 'PENDING', label: 'Pending' },
        { key: 'CONFIRMED', label: 'Confirmed' },
        { key: 'SHIPPED', label: 'Shipped' },
        { key: 'DELIVERED', label: 'Delivered' },
        { key: 'CANCELLED', label: 'Cancelled' }
    ];

    useEffect(() => {
        fetchOrders();
    }, [selectedFilter]);

    const fetchOrders = async () => {
        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
            const user_id = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);

            setLoading(true);
            const params = selectedFilter !== 'ALL' ? { status: selectedFilter } : {};
            const response = await axios.get(`${API_BASE}/orders/user/${user_id}`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setOrders(response.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            Alert.alert('Error', 'Failed to fetch orders');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return '#F59E0B';
            case 'CONFIRMED': return '#3B82F6';
            case 'SHIPPED': return '#8B5CF6';
            case 'DELIVERED': return '#10B981';
            case 'CANCELLED': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return 'pending';
            case 'CONFIRMED': return 'check-circle';
            case 'SHIPPED': return 'local-shipping';
            case 'DELIVERED': return 'done-all';
            case 'CANCELLED': return 'cancel';
            default: return 'info';
        }
    };

    const renderOrderItem = ({ item }) => (
        <Card style={styles.orderCard}>
            <Card.Content>
                <View style={styles.orderHeader}>
                    <View style={styles.orderInfo}>
                        <Text style={styles.orderId}>Order No : {item.orderNumber}</Text>
                        <Text style={styles.orderDate}>

                             {format(new Date(item.createdAt), "dd-MMM-yyyy, hh:mm a")}
                        </Text>
                    </View>
                    <View style={styles.statusContainer}>
                        <MaterialIcons
                            name={getStatusIcon(item.orderStatus)}
                            size={16}
                            color={getStatusColor(item.orderStatus)}
                        />
                        <Text style={[styles.statusText, { color: getStatusColor(item.orderStatus) }]}>
                            {item.orderStatus}
                        </Text>
                    </View>
                </View>

                <View style={styles.orderDetails}>
                    <Text style={styles.productName} numberOfLines={2}>
                        {item.product.name || 'Product Name'}
                    </Text>
                    <Text style={styles.orderQuantity}>
                        Quantity: {item.quantity}
                    </Text>
                    <Text style={styles.orderAmount}>
                        Total: ₹{item.finalAmount}
                    </Text>
                </View>

                <View style={styles.orderActions}>
                    {/* <Button
                        mode="outlined"
                        onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
                        style={styles.actionButton}
                    >
                        View Details
                    </Button> */}
                    {item.orderStatus === 'DELIVERED' && (
                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate('ReviewProduct', { orderId: item.id })}
                            style={styles.actionButton}
                            buttonColor="#132f56"
                        >
                            Review
                        </Button>
                    )}
                    {(item.orderStatus === 'CONFIRMED') && (
                        <Button
                            mode="outlined"
                            onPress={() => handleCancelOrder(item.id)}
                            style={[styles.actionButton, { borderColor: '#EF4444' }]}
                            textColor="#EF4444"
                        >
                            Cancel
                        </Button>
                    )}
                </View>
            </Card.Content>
        </Card>
    );

    const handleCancelOrder = (orderId) => {
        Alert.alert(
            'Cancel Order',
            'Are you sure you want to cancel this order?',
            [
                { text: 'No', style: 'cancel' },
                { text: 'Yes', onPress: () => cancelOrder(orderId) }
            ]
        );
    };

    const cancelOrder = async (orderId) => {
        try {
            const token =  await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
       
            await axios.put(`${API_BASE}/orders/update/${orderId}`, {status:"CANCELLED"}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchOrders(); // Refresh the list
            Alert.alert('Success', 'Order cancelled successfully');
        } catch (error) {
            console.error('Error cancelling order:', error);
            Alert.alert('Error', 'Failed to cancel order');
        }
    };

    const filteredOrders = orders.filter(order =>
        selectedFilter === 'ALL' || order.orderStatus === selectedFilter
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} size="large" color="#132f56" />
                <Text style={styles.loadingText}>Loading your orders...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Orders</Text>
                <Text style={styles.headerSubtitle}>
                    {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
                </Text>
            </View>

            {/* Filter Chips */}
            <View style={styles.filterContainer}>
                <FlatList
                    data={orderFilters}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) => (
                        <Chip
                            selected={selectedFilter === item.key}
                            onPress={() => setSelectedFilter(item.key)}
                            style={[
                                styles.filterChip,
                                selectedFilter === item.key && styles.selectedFilterChip
                            ]}
                            textStyle={[
                                styles.filterChipText,
                                selectedFilter === item.key && styles.selectedFilterChipText
                            ]}
                        >
                            {item.label}
                        </Chip>
                    )}
                />
            </View>

            {filteredOrders.length === 0 ? (
                <EmptyState
                    type="orders"
                    title={selectedFilter === 'ALL' ? 'No Orders Yet' : `No ${selectedFilter.toLowerCase()} Orders`}
                    subtitle={selectedFilter === 'ALL'
                        ? 'Start shopping for premium fabrics to see your orders here'
                        : `You don't have any ${selectedFilter.toLowerCase()} orders at the moment`
                    }
                    actionText="Browse Fabrics"
                    onActionPress={() => navigation.navigate('HomeScreen')}
                />
            ) : (
                <FlatList
                    data={filteredOrders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#132f56']}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>








    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#132f56',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    filterContainer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
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
    listContainer: {
        padding: 16,
    },
    orderCard: {
        marginBottom: 16,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    orderInfo: {
        flex: 1,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    orderDate: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    orderDetails: {
        marginBottom: 16,
    },
    productName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    orderQuantity: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    orderAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#132f56',
    },
    orderActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
    },
});

export default OrdersScreen; 