import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BankAccountsScreen from '../screens/seller/BankAccountsScreen';
import BankVerificationScreen from '../screens/superadmin/BankVerificationScreen';
import { useAuth } from '../contexts/AuthContext';

const Stack = createStackNavigator();

const BankDetailsNavigation = () => {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'SUPERADMIN';

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            {isSuperAdmin ? (
                <Stack.Screen
                    name="BankVerification"
                    component={BankVerificationScreen}
                />
            ) : (
                <Stack.Screen
                    name="BankAccounts"
                    component={BankAccountsScreen}
                />
            )}
        </Stack.Navigator>
    );
};

export default BankDetailsNavigation; 