import axios from 'axios';
import { API_BASE } from '../constants/exports';

class TestPaymentService {
    static async initiatePayment(orderData) {
        try {
            // const token = await getToken();
            const response = await axios.post(`${API_BASE}/api/payments/test/initiate`, {
                ...orderData
            });

            if (response.status !== 200) {
                throw new Error('Failed to initiate payment');
            }

            return {
                merchantTransactionId: response.data.transactionId,
                instrumentResponse: {
                    redirectInfo: {
                        url: `phonepe://pay?merchantTransactionId=${response.data.transactionId}`
                    }
                }
            };
        } catch (error) {
            console.error('Payment initiation error:', error);
            throw error;
        }
    }

    static async verifyPayment(merchantTransactionId) {
        try {
            // const token = await getToken();
            const response = await axios.get(`${API_BASE}/api/payments/test/verify/${merchantTransactionId}`, {
                // headers: {
                //     // 'Authorization': `Bearer ${token}`
                // }
            });

            if (response.status !== 200) {
                throw new Error('Failed to verify payment');
            }

            return {
                status: response.data.status,
                transactionId: response.data.transactionId,
                amount: response.data.amount,
                paymentMethod: response.data.paymentMethod,
                timestamp: response.data.timestamp
            };
        } catch (error) {
            console.error('Payment verification error:', error);
            throw error;
        }
    }

    static async handleCallback(callbackData) {
        try {
            // const token = await getToken();
            const response = await axios.post(`${API_BASE}/api/payments/test/callback`, {
                callbackData
            });

            if (response.status !== 200) {
                throw new Error('Failed to process payment callback');
            }

            return response.data;
        } catch (error) {
            console.error('Payment callback error:', error);
            throw error;
        }
    }
}

export default TestPaymentService; 