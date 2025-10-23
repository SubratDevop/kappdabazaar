import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import PhonePeSDKService from '../services/PhonePeSDKService';
import { useAuthStore } from '../store/useAuthStore';
import { DEV_MODE } from '../constants/exports';

const PhonePePaymentScreen = () => {
    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = useAuthStore();

    const orderData = route.params?.orderData;

    useEffect(() => {
        initiatePayment();
    }, []);

    const initiatePayment = async () => {
        try {
            setLoading(true);
            const data = await PhonePeSDKService.initiatePayment({
                ...orderData,
                userId: user?.id,
                customerEmail: user?.email
            });
            setPaymentData(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to initiate payment. Please try again.');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        try {
            if (!paymentData?.instrumentResponse?.redirectInfo?.url) {
                throw new Error('Invalid payment URL');
            }

            if (DEV_MODE) {
                // In development mode, simulate payment success after 3 seconds
                setVerifying(true);
                setTimeout(() => {
                    handlePaymentSuccess({
                        status: 'SUCCESS',
                        transactionId: paymentData.merchantTransactionId,
                        amount: orderData.total,
                        paymentMethod: 'phonepe',
                        timestamp: new Date().toISOString()
                    });
                }, 3000);
                return;
            }

            // In production, open PhonePe app
            const opened = await PhonePeSDKService.openPhonePeApp(paymentData.instrumentResponse.redirectInfo.url);
            if (opened) {
                startPaymentVerification();
            } else {
                Alert.alert(
                    'PhonePe App Not Found',
                    'Please install PhonePe app to make the payment.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack()
                        }
                    ]
                );
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to process payment. Please try again.');
        }
    };

    const startPaymentVerification = () => {
        setVerifying(true);
        const checkInterval = setInterval(async () => {
            try {
                const status = await PhonePeSDKService.verifyPayment(paymentData.merchantTransactionId);
                if (status.status === 'SUCCESS') {
                    clearInterval(checkInterval);
                    handlePaymentSuccess(status);
                } else if (status.status === 'FAILED') {
                    clearInterval(checkInterval);
                    handlePaymentFailure(status);
                }
            } catch (error) {
                console.error('Payment verification error:', error);
            }
        }, 5000); // Check every 5 seconds

        // Stop checking after 5 minutes
        setTimeout(() => {
            clearInterval(checkInterval);
            if (verifying) {
                setVerifying(false);
                Alert.alert(
                    'Payment Status Unknown',
                    'We could not verify your payment status. Please check your order history or contact support.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('OrderConfirmation', {
                                ...orderData,
                                payment: {
                                    status: 'pending',
                                    transaction_id: paymentData.merchantTransactionId
                                }
                            })
                        }
                    ]
                );
            }
        }, 300000);
    };

    const handlePaymentSuccess = (status) => {
        setVerifying(false);
        Alert.alert(
            'Payment Successful',
            'Your payment has been processed successfully.',
            [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('OrderConfirmation', {
                        ...orderData,
                        payment: {
                            status: 'completed',
                            transaction_id: paymentData.merchantTransactionId,
                            payment_method: 'phonepe'
                        }
                    })
                }
            ]
        );
    };

    const handlePaymentFailure = (status) => {
        setVerifying(false);
        Alert.alert(
            'Payment Failed',
            'Your payment could not be processed. Please try again.',
            [
                {
                    text: 'Try Again',
                    onPress: () => navigation.goBack()
                },
                {
                    text: 'Cancel',
                    onPress: () => navigation.navigate('HomeScreen'),
                    style: 'cancel'
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#5f259f" />
                <Text style={styles.loadingText}>Preparing payment...</Text>
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
                    <MaterialIcons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>PhonePe Payment</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.amountCard}>
                    <Text style={styles.amountLabel}>Amount to Pay</Text>
                    <Text style={styles.amount}>₹{orderData.total.toFixed(2)}</Text>
                </View>

                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Order Details</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Order ID</Text>
                        <Text style={styles.detailValue}>{orderData.orderId}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Customer</Text>
                        <Text style={styles.detailValue}>{orderData.address.fullName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Phone</Text>
                        <Text style={styles.detailValue}>{orderData.address.phone}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.payButton, verifying && styles.disabledButton]}
                    onPress={handlePayment}
                    disabled={verifying}
                >
                    {verifying ? (
                        <>
                            <ActivityIndicator size="small" color="#fff" />
                            <Text style={styles.payButtonText}>Verifying Payment...</Text>
                        </>
                    ) : (
                        <>
                            <MaterialIcons name="phone-android" size={24} color="#fff" />
                            <Text style={styles.payButtonText}>
                                {DEV_MODE ? 'Test Payment' : 'Pay with PhonePe'}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                <Text style={styles.termsText}>
                    By proceeding, you agree to our Terms of Service and Privacy Policy
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    backButton: {
        marginRight: 16
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    content: {
        flex: 1,
        padding: 16
    },
    amountCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginBottom: 16,
        elevation: 2,
    },
    amountLabel: {
        fontSize: 16,
        color: "#666",
        marginBottom: 8,
    },
    amount: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#000",
    },
    detailsCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        elevation: 2,
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: "#666",
    },
    detailValue: {
        fontSize: 14,
        fontWeight: "500",
    },
    payButton: {
        backgroundColor: "#5f259f",
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    disabledButton: {
            backgroundColor: "#9e9e9e",
    },
    payButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
    termsText: {
        textAlign: "center",
        fontSize: 12,
        color: "#666",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
            color: "#666",
    },
  }
);

export default PhonePePaymentScreen;