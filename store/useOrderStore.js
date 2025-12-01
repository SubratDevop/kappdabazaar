import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { create } from 'zustand';
import { API_BASE } from '../constants/exports';
import { STORAGE_KEYS } from '../store/useAuthStore';

const useOrderStore = create((set, get) => ({
    orders: [],
    loading: false,
    error: null,

    // Fetch orders based on user role  
    fetchOrders: async () => {

        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

            set({ loading: true, error: null });

            const response = await axios.get(`${API_BASE}/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const fetchedOrders = response.data?.data?.orders || [];
            set({ orders: fetchedOrders, loading: false });
            return fetchedOrders;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Place new order
    placeOrder: async (orderData) => {
        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

            // set({ loading: true, error: null });
            const response = await axios.post(`${API_BASE}/orders`, orderData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // set({ loading: false });
            return response.data;
        } catch (error) {
            // set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Update order status
    // Update order status - PDF ONLY
    updateOrderStatus: async (orderId, status, lrNumber, lrFile, vehicleDetails) => {
        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
            let payload = new FormData();

            set({ loading: true, error: null });

            payload.append("status", status);
            payload.append("lr_number", lrNumber);
            payload.append("vehicleNumber", vehicleDetails);
            // ✅ STRICT PDF VALIDATION
            if (lrFile?.uri) {

                const isPdf =
                    lrFile.type === "application/pdf" ||
                    lrFile.name?.toLowerCase().endsWith(".pdf");

                if (!isPdf) {
                    set({ loading: false });
                    throw new Error("Only PDF files are allowed for LR upload");
                }

                payload.append("lr_file", {
                    uri: lrFile.uri,
                    name: lrFile.name || `lr_${Date.now()}.pdf`,
                    type: "application/pdf",
                });
            }
            console.log(" PAYLOAD :::::", payload);


            const response = await axios.post(
                `${API_BASE}/orders/update/${orderId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 30000,
                }
            );
            console.log(" PAYLOAD 222:::::", payload);

            set({ loading: false });
            return response.data;

        } catch (error) {
            console.error("Backend Response:", error?.response?.data);
            console.error("Status Code:", error?.response?.status);

            set({ error: error.message, loading: false });
            throw error;
        }
    },


    // Get single order details
    getOrderDetails: async (orderId) => {
        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

            set({ loading: true, error: null });
            const response = await axios.get(`${API_BASE}/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            set({ loading: false });
            return response.data.order;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Clear error
    clearError: () => set({ error: null }),
}));

export default useOrderStore; 