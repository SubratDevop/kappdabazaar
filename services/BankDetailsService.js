import { API_BASE } from "../constants/exports";
import axios from "axios";

class BankDetailsService {
  static async getBankAccounts() {
    try {
      // const token = await useAuthStore.getState().getToken();
      const response = await axios.get(`${API_BASE}/api/bank-details`, {
        headers: {
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bank accounts");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  static async addBankAccount(accountData) {
    try {
      // const token = await getToken();
      const response = await axios.post(`${API_BASE}/api/bank-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(accountData),
      });

      if (!response.ok) {
        throw new Error("Failed to add bank account");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  static async updateBankAccount(accountId, accountData) {
    try {
      // const token = await getToken();
      const response = await axios.put(
        `${API_BASE}/api/bank-details/${accountId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(accountData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update bank account");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  static async deleteBankAccount(accountId) {
    try {
      // const token = await getToken();
      const response = await axios.delete(
        `${API_BASE}/api/bank-details/${accountId}`,
        {
          method: "DELETE",
          headers: {
            // 'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete bank account");
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async setDefaultBankAccount(accountId) {
    try {
      // const token = await getToken();
      const response = await axios.post(
        `${API_BASE}/api/bank-details/${accountId}/default`,
        {
          method: "POST",
          headers: {
            // 'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to set default bank account");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Superadmin methods
  static async getPendingBankAccounts() {
    try {
      // const token = await getToken();
      const response = await axios.get(`${API_BASE}/api/bank-details/pending`, {
        headers: {
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pending bank accounts");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  static async verifyBankAccount(accountId, status) {
    try {
      // const token = await getToken();
      const response = await axios.post(
        `${API_BASE}/api/bank-details/${accountId}/verify`,
        { status }
      );

      if (!response.ok) {
        throw new Error("Failed to verify bank account");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export default BankDetailsService;
