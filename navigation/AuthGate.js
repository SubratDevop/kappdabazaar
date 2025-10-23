import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { STORAGE_KEYS } from '../store/useAuthStore'; // Make sure this path is correct

export default function AuthGate() {
    const navigation = useNavigation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const values = await AsyncStorage.multiGet([
                    STORAGE_KEYS.TOKEN,
                    STORAGE_KEYS.ROLE,
                    STORAGE_KEYS.SIGNED_IN,
                    STORAGE_KEYS.PROFILE_STATE,
                    STORAGE_KEYS.FULLY_AUTH,
                    STORAGE_KEYS.IS_AUTH
                ]);

                const store = Object.fromEntries(values.map(([k, v]) => [k, v]));
                const isSignIn = store[STORAGE_KEYS.SIGNED_IN] === 'true';
                const isAuth = store[STORAGE_KEYS.IS_AUTH] === 'true';
                const isProfileState = store[STORAGE_KEYS.PROFILE_STATE];
                const isFullyAuth = store[STORAGE_KEYS.FULLY_AUTH] === 'true';
                const role = store[STORAGE_KEYS.ROLE];


                if (isSignIn && role!=="superadmin") {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'OnboardingScreen' }],
                    });
                } else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'IntroAsk' }],
                    });
                }
            } catch (err) {
                console.error("AuthGate Error:", err);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'IntroAsk' }],
                });
            }
        };

        checkAuth();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#132f56" />
        </View>
    );
}
