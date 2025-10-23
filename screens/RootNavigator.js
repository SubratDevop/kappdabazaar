import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';
import SplashScreenComponent from '../components/SplashScreen';
import { toastConfig } from '../constants/exports';
import LoginStack from '../navigation/LoginStack';
import SellerStack from '../navigation/SellerStack';
import { useAuthStore } from '../store/useAuthStore';
import SuperAdminStack from './SuperAdmin/index';
import UserStack from './User';

const Stack = createStackNavigator();

export default function RootNavigator() {

    const {
        utilsFn,
        userRole,
        setUserRole,
        setAuthInfo,
        authInfo,
        // clearStorage,
    } = useAuthStore();

    const triggerAppInit = useAuthStore((state) => state.triggerAppInit);

    const [loading, setLoading] = useState(true); // just one loading flag
    const [appIsReady, setAppIsReady] = useState(false); // Flag for assets and fonts

    const [authInfoState, setAuthInfoState] = useState(null);
    useEffect(() => {
        // Prevent the splash screen from hiding automatically
        SplashScreen.preventAutoHideAsync();

        const prepareApp = async () => {
            try {
                // Load fonts
                await Font.loadAsync({
                    'Roboto-Regular': require('../assets/fonts/roboto-3/Roboto-Regular.ttf'), // Replace with your font
                    'Roboto-Bold': require('../assets/fonts/roboto-3/Roboto-Bold.ttf'), // Replace with your font
                });

                // Load other assets if needed (e.g., images)
            } catch (error) {
                console.error('Error loading assets:', error);
            } finally {
                // setAppIsReady(true);
            }
        };

        // prepareApp();
    }, []);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                const result = await utilsFn();

                // Validate the result
                if (!result?.token || result?.isAuth !== "true") {
                    console.warn("Invalid or missing auth token. Setting authInfo to null.");
                    setAuthInfo(null);
                    setAuthInfoState(null);
                } else {
                    setAuthInfo(result);
                    setAuthInfoState(result);
                    setUserRole(result?.userRole);
                }
            } catch (err) {
                console.error("Initialization Error:", err);
                setAuthInfo(null);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(() => {
            console.warn("Initialization timeout reached");
            setLoading(false);
        }, 2000);

        initializeApp();
        // clearStorage();

        return () => clearTimeout(timeout);
    }, [triggerAppInit]);

    useEffect(() => {
        if (appIsReady && !loading) {
            SplashScreen.hideAsync(); // Hide the splash screen when everything is ready
        }
    }, [appIsReady, loading]);

    if (!appIsReady || loading) {
        return <SplashScreenComponent onAnimationComplete={() => setAppIsReady(true)} />;
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    // if (!authInfo) {
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //             <Text style={{ color: 'red', fontSize: 16 }}>Failed to load user information. Please restart the app or check your setup.</Text>
    //         </View>
    //     );
    // }

    const isAuth = authInfoState?.isAuth === "true";

    const isFullyAuth = authInfoState?.isFullyAuthenticated === "true";


    const renderStack = () => {

        if (isAuth == false) {
            // if ( 1 == false) {
            return <Stack.Screen name="LoginScreen" component={LoginStack} />;
        }


        switch (userRole) {
            case 'user':
                return <Stack.Screen name="UserStack" component={UserStack} />;
            case 'seller':
                return isFullyAuth
                    ? <Stack.Screen name="SellerStack" component={SellerStack} />
                    : <Stack.Screen name="LoginScreen" component={LoginStack} />;
            case 'superadmin':
                return <Stack.Screen name="SuperAdminStack" component={SuperAdminStack} />;
            default:
                console.warn("Invalid userRole detected. Redirecting to LoginScreen.");
                return <Stack.Screen name="LoginScreen" component={LoginStack} />;
        }
    };

    return (
        // <SocketProvider>
        <>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {renderStack()}
                </Stack.Navigator>
                <StatusBar style="auto" />
            </NavigationContainer>
            <Toast config={toastConfig} />
        </>
        // </SocketProvider>
    );
}
