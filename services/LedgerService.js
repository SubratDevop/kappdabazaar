import axios from 'axios';
import { API_BASE } from '../constants/exports';

class LedgerService {
  static async getLedgerEntries(userId, startDate, endDate) {
    try {
      const response = await axios.get(`${API_BASE}/ledger/entries`, {
        params: { userId, startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ledger entries:', error);
      throw error;
    }
  }

  static async getLedgerSummary(userId) {
    try {
      const response = await axios.get(`${API_BASE}/ledger/summary/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ledger summary:', error);
      throw error;
    }
  }

  static async getPendingPayments(userId) {
    try {
      const response = await axios.get(`${API_BASE}/ledger/pending/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      throw error;
    }
  }

  static async getSettledPayments(userId) {
    try {
      const response = await axios.get(`${API_BASE}/ledger/settled/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching settled payments:', error);
      throw error;
    }
  }

  static async getPaymentDetails(paymentId) {
    try {
      const response = await axios.get(`${API_BASE}/ledger/payment/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw error;
    }
  }

  static async generateLedgerReport(userId, startDate, endDate) {
    try {
      const response = await axios.get(`${API_BASE}/ledger/report`, {
        params: { userId, startDate, endDate },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error generating ledger report:', error);
      throw error;
    }
  }

  static async getPaymentHistory(userId) {
    try {
      const response = await axios.get(`${API_BASE}/ledger/history/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }

  static async getSettlementSchedule(userId) {
    try {
      const response = await axios.get(`${API_BASE}/ledger/settlement-schedule/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching settlement schedule:', error);
      throw error;
    }
  }

  static async requestSettlement(userId, amount) {
    try {
      const response = await axios.post(`${API_BASE}/ledger/request-settlement`, {
        userId,
        amount,
      });
      return response.data;
    } catch (error) {
      console.error('Error requesting settlement:', error);
      throw error;
    }
  }

  static async getSettlementStatus(settlementId) {
    try {
      const response = await axios.get(`${API_BASE}/ledger/settlement/${settlementId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching settlement status:', error);
      throw error;
    }
  }

  static async getBankAccounts(userId) {
    try {
      const response = await axios.get(`${API_BASE}/ledger/bank-accounts/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      throw error;
    }
  }

  static async addBankAccount(userId, accountDetails) {
    try {
      const response = await axios.post(`${API_BASE}/ledger/bank-accounts`, {
        userId,
        ...accountDetails,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding bank account:', error);
      throw error;
    }
  }

  static async updateBankAccount(accountId, accountDetails) {
    try {
      const response = await axios.put(`${API_BASE}/ledger/bank-accounts/${accountId}`, accountDetails);
      return response.data;
    } catch (error) {
      console.error('Error updating bank account:', error);
      throw error;
    }
  }

  static async deleteBankAccount(accountId) {
    try {
      const response = await axios.delete(`${API_BASE}/ledger/bank-accounts/${accountId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting bank account:', error);
      throw error;
    }
  }

  static async getTransactionDetails(transactionId) {
    try {
      const response = await axios.get(`${API_BASE}/ledger/transaction/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      throw error;
    }
  }

  static async getTransactionHistory(userId, type) {
    try {
      const response = await axios.get(`${API_BASE}/ledger/transactions`, {
        params: { userId, type },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }
}

export default LedgerService; 