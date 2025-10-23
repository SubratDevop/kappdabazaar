import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";

import { STORAGE_KEYS } from '../store/useAuthStore';
import { useCompanyStore } from "../store/useCompanyStore";


export default async function getAsyncStorageFn() {
    const res_user = await AsyncStorage.getItem(STORAGE_KEYS.USER);

    const data_user = JSON.parse(res_user);
    return data_user;

}

//! revised code
// export default {
//     "user_id": 18,
//     "name": "Prana M Maru",
//     "email": "pranavmaru22@gmail.com",
//     "phone_number": "8369055039",
//     "password_hash": "$2b$10$Jy07Qu48Bibt1sExzzTH7unYMxQFcoJCwTNSYuf9NMcPc9k.XT74G",
//     "profile_state": 2,
//     "otp_verified": true,
//     "role": "seller",
//     "expo_push_token": "ExponentPushToken[wK4pUEOiynO_yTC7l2a_-s]",
//     "status": "approved",
//     "rejection_reason": null,
//     "is_online": false,
//     "last_seen_at": null
// };


export async function getAsyncCompanyFn() {

    const { fetchCompanyDetails } = useCompanyStore();
    const data = await getAsyncStorageFn();
    const res_data = await fetchCompanyDetails(data?.user_id);
    if (res_data?.companyInfo !== null) {
        return res_data?.companyInfo;
    }
    return null;
}

export function formatCurrency(amount) {
    return `₹${amount.toFixed(2)}`;
}

export function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function formatTime(date) {

    return moment.utc(date).utcOffset("+05:30").format("HH:mm");
}