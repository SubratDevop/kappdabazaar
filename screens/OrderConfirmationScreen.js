import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import useOrderStore from '../store/useOrderStore';

const OrderConfirmationScreen = ({ navigation, route }) => {
    const { orderNumber, product, selectedMoq, quantity, selectedColor, orderNotes, address, paymentMethod, total, payment } = route.params;
    const [orderStatus, setOrderStatus] = useState('pending');
    const { getOrderDetails, loading, error } = useOrderStore();

    useEffect(() => {
        fetchOrderStatus();
        
    }, []);

    const fetchOrderStatus = async () => {
        try {
            const order = await getOrderDetails(orderNumber);
            if (order) {
                setOrderStatus(order.order_status);
            }
        } catch (error) {
            console.error('Error fetching order status:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#FFA500';
            case 'processing': return '#1E90FF';
            case 'dispatched': return '#4CAF50';
            case 'delivered': return '#4CAF50';
            case 'cancelled': return '#FF0000';
            default: return '#666';
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Success Message */}
                <View style={styles.successSection}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                    </View>
                    <Text style={styles.successTitle}>Order Placed Successfully!</Text>
                    <Text style={styles.orderNumber}>Order ID: {orderNumber}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(orderStatus) }]}>
                        <Text style={styles.statusText}>{orderStatus.toUpperCase()}</Text>
                    </View>
                </View>

                {/* Payment Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Details</Text>
                    <View style={styles.detailsCard}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Transaction ID</Text>
                            <Text style={styles.detailValue}>{payment?.transaction_id}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Payment Method</Text>
                            <Text style={styles.detailValue}>
                                {paymentMethod === 'phonepe' ? 'PhonePe' : 'Cash on Delivery'}
                            </Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Payment Status</Text>
                            <Text style={[styles.detailValue, { color: payment?.payment_status === 'completed' ? '#4CAF50' : '#FFA500' }]}>
                                {payment?.payment_status?.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Order Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Details</Text>
                    <View style={styles.detailsCard}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Product</Text>
                            <Text style={styles.detailValue}>{product.name}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Color</Text>
                            <Text style={styles.detailValue}>{selectedColor}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Quantity</Text>
                            <Text style={styles.detailValue}>{quantity}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Price per meter</Text>
                            <Text style={styles.detailValue}>₹{selectedMoq.price}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Total Amount</Text>
                            <Text style={styles.detailValue}>₹{total.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Delivery Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    <View style={styles.addressCard}>
                        <Text style={styles.addressName}>{address.fullName}</Text>
                        <Text style={styles.addressPhone}>{address.phone}</Text>
                        <Text style={styles.addressText}>{address.street}</Text>
                        <Text style={styles.addressText}>
                            {address.city}, {address.state} - {address.pincode}
                        </Text>
                    </View>
                </View>

                {/* Order Notes */}
                {orderNotes && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Order Notes</Text>
                        <View style={styles.notesCard}>
                            <Text style={styles.notesText}>{orderNotes}</Text>
                        </View>
                    </View>
                )}

                {/* Next Steps */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>What's Next?</Text>
                    <View style={styles.stepsCard}>
                        <View style={styles.step}>
                            <View style={styles.stepIcon}>
                                <Feather name="package" size={24} color="#ff6347" />
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Order Confirmation</Text>
                                <Text style={styles.stepDesc}>You will receive an order confirmation email shortly</Text>
                            </View>
                        </View>
                        <View style={styles.step}>
                            <View style={styles.stepIcon}>
                                <Feather name="truck" size={24} color="#ff6347" />
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Order Processing</Text>
                                <Text style={styles.stepDesc}>Your order will be processed and shipped within 2-3 business days</Text>
                            </View>
                        </View>
                        <View style={styles.step}>
                            <View style={styles.stepIcon}>
                                <Feather name="check-circle" size={24} color="#ff6347" />
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Delivery</Text>
                                <Text style={styles.stepDesc}>Estimated delivery: 5-7 business days</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                <Button
                    mode="outlined"
                    onPress={() => navigation.navigate('MyOrders')}
                    style={styles.button}
                >
                    View Orders
                </Button>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Home')}
                    style={[styles.button, styles.primaryButton]}
                    textColor="#fff"
                >
                    Continue Shopping
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    successSection: {
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#f8f9fd',
    },
    iconContainer: {
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    orderNumber: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    detailsCard: {
        backgroundColor: '#f8f9fd',
        padding: 16,
        borderRadius: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    detailLabel: {
        color: '#666',
    },
    detailValue: {
        fontWeight: '500',
        color: '#333',
    },
    addressCard: {
        backgroundColor: '#f8f9fd',
        padding: 16,
        borderRadius: 8,
    },
    addressName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    addressPhone: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    addressText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    notesCard: {
        backgroundColor: '#f8f9fd',
        padding: 16,
        borderRadius: 8,
    },
    notesText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    stepsCard: {
        backgroundColor: '#f8f9fd',
        padding: 16,
        borderRadius: 8,
    },
    step: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    stepIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    stepDesc: {
        fontSize: 14,
        color: '#666',
    },
    bottomBar: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
    },
    primaryButton: {
        backgroundColor: '#ff6347',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginTop: 8,
    },
    statusText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default OrderConfirmationScreen; 