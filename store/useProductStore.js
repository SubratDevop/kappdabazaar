import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { create } from 'zustand';
import { API_BASE } from '../constants/exports';
import { STORAGE_KEYS } from '../store/useAuthStore';


export const useProductStore = create((set) => ({
    products: [],
    allProducts: [],
    isLoading: false,
    error: null,
    item: {},
    searchedProds: [],
    totalMatched: 0,


    addProductFn: async (payload) => {

        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

            const response = await axios.post(`${API_BASE}/fancy/products`, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            Toast.show({
                type: 'success',
                text1: 'Product added successfully!',
                text2: 'Product added successfully.Please check the product list.',
                swipeable: true,
                position: 'top'
            });
            return response.data;
        } catch (error) {
            Toast.show({
                type: "error",
                text1: 'Something went wrong!!',
                text2: 'Cannot add the product. Please try again.',
                swipeable: true,
                position: 'top'
            });
            console.error("Product upload failed:", error?.response?.data || error.message);
            throw error;
        }
    },
    getAllProducts: async () => {

        set({ isLoading: true, error: null });
        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

            const response = await axios.get(`${API_BASE}/fancy/products`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            set({ allProducts: response.data.products || [], isLoading: false });
        } catch (error) {
            console.error("Failed to fetch products", error);
            set({ error: error.message, isLoading: false });
        }
    },
    fetchAllProducts: async (company_id) => {

        const id = parseInt(company_id);
        set({ isLoading: true, error: null });
        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

            const response = await axios.get(`${API_BASE}/fancy/products/company/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            set({ products: response.data || [], isLoading: false });
        } catch (error) {
            console.error("Failed to fetch products", error);
            set({ error: error.message, isLoading: false });
        }
    },
    fetchProduct: async (prod_id) => {


        set({ isLoading: true, error: null });
        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

            const response = await axios.get(`${API_BASE}/fancy/products/full-details/${prod_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            set({ item: response.data.products[0] || [], isLoading: false });
        } catch (error) {
            console.error("Failed to fetch products", error);
            set({ error: error.message, isLoading: false });
        }
    },
    searchByImage: async (imageUri) => {

        set({ isLoading: true, error: null });
        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

            const formData = new FormData();
            formData.append("image", {
                uri: imageUri,
                name: "search.jpg",
                type: "image/jpeg",
            });

            const response = await axios.post(`${API_BASE}/fancy/products/search-by-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
                transformRequest: (data, headers) => {
                    // Let axios handle the FormData boundary
                    return data;
                },
            });

            if (response.data && Array.isArray(response.data.matched_products)) {
                set({
                    searchedProds: response.data.matched_products,
                    totalMatched: response.data.total_matched,
                    isLoading: false
                });
            } else {
                set({ error: "No similar products found", isLoading: false });
            }
        } catch (error) {
            console.error("Image search failed", error);
            set({ error: error.message || "Failed to search by image", isLoading: false });
        }
    },
    getAllSaveProductFn: async (user_id) => {

        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

            const response = await axios.get(`${API_BASE}/users/${user_id}/saved-products`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            );

            return response.data
        } catch (error) {
            console.error("Failed to toggle bookmark", error);
        }
    },
    saveProductFn: async (productId, user_id) => {
        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

            const response = await axios.post(`${API_BASE}/users/${user_id}/saved-products`, {
                product_id: productId,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return response.data
        } catch (error) {
            console.error("Failed to toggle bookmark", error);
        }
    },
    checkSavedProductFn: async (productId, user_id) => {
        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

            const response = await axios.get(`${API_BASE}/users/${user_id}/saved-products/${productId}/check`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            // Optionally update the item or global product state here
            return response.data;
        } catch (error) {
            console.error("Failed to toggle bookmark", error);
        }
    },
    removeSavedProductFn: async (productId, user_id) => {

        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

            const response = await axios.delete(`${API_BASE}/users/${user_id}/remove-saved-products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error("Failed to toggle bookmark", error);
        }
    },

}));
