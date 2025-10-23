import { API_BASE } from "../constants/exports";
import axios from "axios";

class PhonePeService {
  static async initiatePayment(orderData) {
    try {
      // const token = await getToken();
      const response = await axios.post(
        `${API_BASE}/api/payments/phonepe/initiate`,
        {
          ...orderData,
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to initiate payment");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async verifyPayment(merchantTransactionId) {
    try {
      // const token = await getToken();
      const response = await axios.get(
        `${API_BASE}/api/payments/phonepe/status/${merchantTransactionId}`,
        {
          // headers: {
          //   // 'Authorization': `Bearer ${token}`
          // },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to verify payment");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async handleCallback(callbackData) {
    try {
      // const token = await getToken();
      const response = await axios.post(
        `${API_BASE}/api/payments/phonepe/callback`,
        {
          callbackData,
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to process payment callback");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default PhonePeService;
