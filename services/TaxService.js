import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE } from '../constants/exports';
import { STORAGE_KEYS } from '../store/useAuthStore';


class TaxService {
  static async calculateGST(amount, buyerState, sellerState, hsnCode, sellerId, productCategory,order) {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.post(`${API_BASE}/tax/calculate`, {
        amount,
        buyerState,
        sellerState,
        hsnCode,
        sellerId,
        productCategory,
        order
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating GST:', error);
      throw error;
    }
  }

  static async getGSTRates() {
    try {
      const response = await axios.get(`${API_BASE}/tax/rates`);
      return response.data;
    } catch (error) {
      console.error('Error fetching GST rates:', error);
      throw error;
    }
  }

  static async getHSNCodes() {
    try {
      const response = await axios.get(`${API_BASE}/tax/hsn-codes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching HSN codes:', error);
      throw error;
    }
  }

  static async validateGSTIN(gstin) {
    try {
      const response = await axios.post(`${API_BASE}/tax/validate-gstin`, { gstin });
      return response.data;
    } catch (error) {
      console.error('Error validating GSTIN:', error);
      throw error;
    }
  }

  static async getStateGSTInfo(state) {
    try {
      const response = await axios.get(`${API_BASE}/tax/state-info/${state}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching state GST info:', error);
      throw error;
    }
  }

  static async generateTaxInvoice(orderData) {
    try {
      const response = await axios.post(`${API_BASE}/tax/generate-invoice`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error generating tax invoice:', error);
      throw error;
    }
  }

  static async getTaxSummary(orderId) {
    try {
      const response = await axios.get(`${API_BASE}/tax/summary/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tax summary:', error);
      throw error;
    }
  }

  static async getTaxReports(startDate, endDate) {
    try {
      const response = await axios.get(`${API_BASE}/tax/reports`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tax reports:', error);
      throw error;
    }
  }

  static async downloadTaxInvoice(invoiceId) {
    try {
      const response = await axios.get(`${API_BASE}/tax/invoice/${invoiceId}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading tax invoice:', error);
      throw error;
    }
  }

  static async getTaxNotifications() {
    try {
      const response = await axios.get(`${API_BASE}/tax/notifications`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tax notifications:', error);
      throw error;
    }
  }

  static async markNotificationAsRead(notificationId) {
    try {
      const response = await axios.put(`${API_BASE}/tax/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
}

export default TaxService; 