import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { create } from 'zustand';
import { API_BASE } from '../constants/exports';
import { STORAGE_KEYS } from '../store/useAuthStore';



export const useCompanyStore = create((set) => ({


    allCompanies: [],
    isLoading: false,
    error: null,
    company: {},

    fetchCompanyDetails: async (data) => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

        set({ isLoading: true, error: null });
        const parsed_data = parseInt(data);
        try {
            const response = await axios.get(`${API_BASE}/users/company/${parsed_data}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });


            set({ company: response.data || {}, isLoading: false });

            return response.data;
        } catch (error) {
            console.error("Failed to fetch company details", error);
            set({ error: error.message, isLoading: false });
        }
    },
    fetchAllCompanies: async () => {

        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

        set({ isLoading: true, error: null });
        try {
            const resp = await axios.get(`${API_BASE}/users/get-all/company`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            set({ allCompanies: resp.data.companies || [] });
        } catch (error) {
            console.error("Failed to fetch companies", error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false })
        }
    },
    approvalToAppFn: async (payload, status) => {
        set({ isLoading: true });
        const data = parseInt(payload);
        try {
            const res = await axios.post(`${API_BASE}/auth/admin/approve-seller`, { "user_id": data, status });
            Toast.show({
                type: 'success',
                text1: `${status} success`,
                text2: `Company ${status} for access.`,
                swipeable: true,
                position: 'top'
            });
        } catch (err) {
            Toast.show({
                type: "error",
                text1: 'Something went wrong!!',
                text2: `Company not ${status} for access.Please try again.`,
                swipeable: true,
                position: 'top'
            });
            console.error('Error approving seller:', err.response?.data || err.message);
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },
}));
