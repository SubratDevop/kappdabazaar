import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Assuming Axios is used for API calls
import Toast from 'react-native-toast-message';
import { create } from 'zustand';
import { API_BASE } from '../constants/exports';

export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER_ID: "user_id",
    ROLE: 'userRole',
    SIGNED_IN: 'isSignIn',
    PROFILE_STATE: 'profile_state',
    IS_AUTH: 'isAuth',
    FULLY_AUTH: 'isFullyAuthenticated',
    COMPANY_ID: 'company_id',
    USER: 'user',
    TOTAL_ORDERS: 'totalorders',
    TOTAL_SPENT: 'totalspent',
};

export const useAuthStore = create((set) => ({
    isAuthenticated: false,
    userRole: null,
    token: null,
    isLoading: false,
    profile_state: '',
    isFullyAuthenticated: false,
    authInfo: null,
    totalOrders: 0.0,
    totalspent: 0.0,
    triggerAppInit: 0,
    user: null,

    setTriggerAppInit: () => set((state) => ({ triggerAppInit: state.triggerAppInit + 1 })),
    setAuth: (authStatus) => set({ isAuthenticated: authStatus }),
    setUserRole: (role) => set({ userRole: role }),
    setLoading: (isLoading) => set({ isLoading }),
    setAuthInfo: (data) => set({ authInfo: data }),
    setUser: (user) => set({ user }),


    //! --------------------- LOGIN ----------------------
    login: async (payload) => {
        set({ isLoading: true });
        try {
            const { data } = await axios.post(`${API_BASE}/auth/login/superadmin`, payload);
            const { token, role, admin, admin_id } = data;

            const parsed_admin = JSON.stringify(admin);

            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
            await AsyncStorage.setItem(STORAGE_KEYS.ROLE, role);
            await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, admin_id.toString());
            await AsyncStorage.setItem(STORAGE_KEYS.SIGNED_IN, "true");
            await AsyncStorage.setItem(STORAGE_KEYS.IS_AUTH, "true");
            await AsyncStorage.setItem(STORAGE_KEYS.FULLY_AUTH, "true");
            await AsyncStorage.setItem(STORAGE_KEYS.USER, parsed_admin);

            useAuthStore.getState().setTriggerAppInit();
            Toast.show({
                type: 'success',
                text1: 'Success!',
                text2: 'Login success!',
                swipeable: true,
                position: 'top'
            });
            set({
                token,
                userRole: role,
                isAuthenticated: true,
                isFullyAuthenticated: true,
                user:admin
            });
        } catch (err) {
            Toast.show({
                type: "error",
                text1: 'Something went wrong!!',
                text2: 'Login failed!',
                swipeable: true,
                position: 'top'
            });
            console.error('Login failed:', err.response?.data || err.message);
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    loginSellerAndUser: async (payload) => {
        set({ isLoading: true });
        try {
            const { data } = await axios.post(`${API_BASE}/auth/login/seller-and-user`, payload);
            const { token, role, user, user_id , totalOrders , totalSpent } = data;
 
            const parsed_user = JSON.stringify(user);

            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
            await AsyncStorage.setItem(STORAGE_KEYS.ROLE, role);
            await AsyncStorage.setItem(STORAGE_KEYS.TOTAL_ORDERS, totalOrders.toString());
            await AsyncStorage.setItem(STORAGE_KEYS.TOTAL_SPENT, totalSpent.toString());
            await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, user_id.toString());
            await AsyncStorage.setItem(STORAGE_KEYS.SIGNED_IN, "true");
            await AsyncStorage.setItem(STORAGE_KEYS.IS_AUTH, "true");
            await AsyncStorage.setItem(STORAGE_KEYS.FULLY_AUTH, "true");
            await AsyncStorage.setItem(STORAGE_KEYS.USER, parsed_user);


            useAuthStore.getState().setTriggerAppInit();

            Toast.show({
                type: 'success',
                text1: 'Login success!',
                text2: 'User logged in successfully!',
                swipeable: true,
                position: "top"
            });
            set({
                token,
                userRole: role,
                isAuthenticated: true,
                isFullyAuthenticated: true,
                user:user
            });
        } catch (err) {
            Toast.show({
                type: "error",
                text1: 'Something went wrong!!',
                text2: 'Cannot login at this moment!',
                swipeable: true,
                position: 'top'
            });
            console.error('Login failed:', err.response?.data || err.message);
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        await AsyncStorage.clear();
        set({
            isAuthenticated: false,
            userRole: null,
            token: null,
            profile_state: '',
            isFullyAuthenticated: false,
        });
    },

    // --------------------- USER REGISTRATION ----------------------
    registerUserFn: async (payload) => {
        set({ isLoading: true });
        try {
            const { data } = await axios.post(`${API_BASE}/auth/register/user`, payload);
            await AsyncStorage.multiSet([
                [STORAGE_KEYS.ROLE, 'user'],
                [STORAGE_KEYS.IS_AUTH, 'true'],
                [STORAGE_KEYS.FULLY_AUTH, 'true'],
            ]);

            Toast.show({
                type: 'success',
                text1: 'User Registration successful ',
                text2: 'You have been registrated  ',
                swipeable: true,
                position: 'top'
            });

            set({
                isAuthenticated: true,
                userRole: 'user',
                isFullyAuthenticated: true,
            });
        } catch (err) {
            Toast.show({
                type: "error",
                text1: 'Something went wrong!!',
                text2: 'Cannot login at this moment!',
                swipeable: true,
                position: 'top'
            });
            console.error('User Registration failed:', err.response?.data || err.message);
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    // --------------------- SELLER REGISTRATION STEP 1 ----------------------
    registerSellerFn: async (payload) => {
        set({ isLoading: true });
        try {
            const { data } = await axios.post(`${API_BASE}/auth/register/seller`, payload);
            const { token, role, seller } = data;
            const user_obj = JSON.stringify(seller);

            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
            await AsyncStorage.setItem(STORAGE_KEYS.ROLE, role);
            await AsyncStorage.setItem(STORAGE_KEYS.SIGNED_IN, "true");
            await AsyncStorage.setItem(STORAGE_KEYS.PROFILE_STATE, "1");
            await AsyncStorage.setItem(STORAGE_KEYS.USER, user_obj);

            Toast.show({
                type: 'success',
                text1: 'Success!!',
                text2: 'Registration success!',
                swipeable: true,
                position: 'top'
            });

            set({
                token,
                userRole: role,
                isAuthenticated: true,
                profile_state: '1',  // Indicates that seller registration step 1 is done
                isFullyAuthenticated: false, // GST step still pending
            });
        } catch (err) {
            Toast.show({
                type: "error",
                text1: 'Something went wrong!!',
                text2: 'Cannot register at this moment. Please try again!',
                swipeable: true,
                position: 'top'
            });
            console.error('Seller Registration failed:', err.response?.data || err.message);
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },
    registerPushTokenFn: async (payload) => {
        set({ isLoading: true });
        try {
            const resp = await axios.put(`${API_BASE}/auth/register/push-token`, payload);

        } catch (err) {
            console.error('Device Push token failed:', err.response?.data || err.message);
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    // --------------------- PROFILE STATE ----------------------
    getProfileState: async (comp_user_id) => {
        set({ isLoading: true });
        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
            const { data } = await axios.get(`${API_BASE}/auth/profile-state/${comp_user_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const profile = String(data.profile_state);
            await AsyncStorage.setItem(STORAGE_KEYS.PROFILE_STATE, profile);
            set({ profile_state: profile });

            return profile;
        } catch (err) {
            console.error('Fetching profile state failed:', err.response?.data || err.message);
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    // --------------------- APPROVAL STATUS ----------------------
    saveCompanyInfoFn: async (payload) => {
        set({ isLoading: true });

        try {
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
            const formData = new FormData();

            formData.append("userId", payload.userId);
            formData.append("company_name", payload.company_name);
            formData.append("pan_number", payload.pan_number);
            formData.append("gst_number", payload.gst_number);

            if (payload.gst_certificate_url && payload.gst_certificate_url.startsWith("file")) {
                const filename = payload.gst_certificate_url.split("/").pop();
                const match = /\.(\w+)$/.exec(filename ?? '');
                const ext = match ? match[1] : "jpg";

                formData.append("gst_cert", {
                    uri: payload.gst_certificate_url,
                    name: filename,
                    type: `image/${ext}`,
                });
            }

            const res = await axios.put(`${API_BASE}/auth/company/update`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            const { company_id, user } = res.data;

            await AsyncStorage.setItem(STORAGE_KEYS.PROFILE_STATE, "2");
            await AsyncStorage.setItem(STORAGE_KEYS.IS_AUTH, "true");
            await AsyncStorage.setItem(STORAGE_KEYS.FULLY_AUTH, "true");
            await AsyncStorage.setItem(STORAGE_KEYS.COMPANY_ID, JSON.stringify(company_id));
            await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
            await AsyncStorage.setItem(STORAGE_KEYS.ROLE, "seller");

            Toast.show({
                type: 'success',
                text1: 'Success!!',
                text2: 'Company details submitted successfully!',
                swipeable: true,
                position: 'top'
            });

            set({
                profile_state: "2",
                isAuthenticated: true,
                isFullyAuthenticated: true,
                userRole: "seller"
            });
        } catch (err) {
            Toast.show({
                type: "error",
                text1: 'Something went wrong!!',
                text2: 'Company details submitted successfully!',
                swipeable: true,
                position: 'top'
            });
            console.error("Saving GST details failed:", err.response?.data || err.message);
            throw err;

        } finally {
            set({ isLoading: false });
        }
    },

    getApprovalStatus: async (comp_user_id) => {

        set({ isLoading: true });
        try {
            const { data } = await axios.get(`${API_BASE}/auth/admin/is-pending/${comp_user_id}`);
            const profile = data.pending;
            return profile;
        } catch (err) {
            console.error('Fetching profile state failed:', err.response?.data || err.message);
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    // Improved utilsFn
    utilsFn: async () => {
        try {
            const keys = Object.values(STORAGE_KEYS);
            const values = await AsyncStorage.multiGet(keys);

            // Convert the array of key-value pairs into an object
            const store = Object.fromEntries(values.map(([key, value]) => [key, value]));

            return store;
        } catch (error) {
            console.error('Error fetching auth status from AsyncStorage:', error);
            throw error;
        }
    },

    clearStorage: async () => {
        await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
        const keys = Object.values(STORAGE_KEYS);
        const values = await AsyncStorage.multiGet(keys);

        useAuthStore.getState().setTriggerAppInit();

        // Convert the array of key-value pairs into an object
        const store = Object.fromEntries(values.map(([key, value]) => [key, value]));
        set({
            isAuthenticated: false,
            userRole: null,
            token: null,
            profile_state: '',
            isFullyAuthenticated: false,
        });
    },
}));

