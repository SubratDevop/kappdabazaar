import { Platform, Linking } from 'react-native';
import { API_BASE } from '../constants/exports';
import axios from 'axios';

class PhonePeSDKService {
    static async initiatePayment(orderData) {
        try {
            // const token = await getToken();
            const response = await axios.post(`${API_BASE}/api/payments/phonepe/initiate`, {
                ...orderData
            });
            if (response.status !== 200) {
                throw new Error('Failed to initiate payment');
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async openPhonePeApp(paymentUrl) {
        try {
            // For Android
            if (Platform.OS === 'android') {
                const canOpen = await Linking.canOpenURL(paymentUrl);
                if (canOpen) {
                    await Linking.openURL(paymentUrl);
                    return true;
                }
                // If PhonePe app is not installed, open Play Store
                await Linking.openURL('market://details?id=net.one97.paytm');
                return false;
            }
            // For iOS
            else if (Platform.OS === 'ios') {
                const canOpen = await Linking.canOpenURL(paymentUrl);
                if (canOpen) {
                    await Linking.openURL(paymentUrl);
                    return true;
                }
                // If PhonePe app is not installed, open App Store
                await Linking.openURL('itms-apps://itunes.apple.com/app/phonepe/id1170055821');
                return false;
            }
        } catch (error) {
            console.error('Error opening PhonePe app:', error);
            throw error;
        }
    }

    static async verifyPayment(merchantTransactionId) {
        try {
            // const token = await getToken();
            const response = await axios.get(`${API_BASE}/api/payments/phonepe/status/${merchantTransactionId}`, {
                headers: {
                    // 'Authorization': `Bearer ${token}`
                }
            });

            if (response.status !== 200) {
                throw new Error('Failed to verify payment');
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async handleCallback(callbackData) {
        try {
            // const token = await getToken();
            const response = await axios.post(`${API_BASE}/api/payments/phonepe/callback`, {
                callbackData
            });

            if (response.status !== 200) {
                throw new Error('Failed to process payment callback');
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default PhonePeSDKService; 