import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignInScreen from '../screens/SignInScreen';
import OtpScreen from '../screens/Login/OtpScreen';
import OnboardingScreen from '../screens/Login/OnboardingScreen';
import { IntroAskWrapper } from '../screens/StackIndex';
import AuthGate from './AuthGate';

const Stack = createStackNavigator();

export default function LoginStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AuthGate" component={AuthGate} />
            <Stack.Screen name="IntroAsk" component={IntroAskWrapper} />
            <Stack.Screen name="SignIn" component={SignInScreen} options={{
                headerShown: true,
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#132f56" },
                headerTitleStyle: { fontSize: 24 },
                headerShadowVisible: true,
                animation: "slide_from_right",
                headerTintColor: "#fff",
                headerTitle: "Kapda Bazaar",
                headerLeft: () => null,
            }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{
                headerShown: true,
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#132f56" },
                headerTitleStyle: { fontSize: 24 },
                headerShadowVisible: true,
                animation: "slide_from_right",
                headerTintColor: "#fff",
                headerTitle: "Kapda Bazaar",
                headerLeft: () => null,
            }} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} />
            <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{
                headerShown: true,
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#132f56" },
                headerTitleStyle: { fontSize: 24 },
                headerShadowVisible: true,
                animation: "slide_from_right",
                headerTintColor: "#fff",
                headerTitle: "Kapda Bazaar",
                headerLeft: () => null,
            }} />
        </Stack.Navigator>
    );
}
