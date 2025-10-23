import React, { useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CheckoutScreen from '../CheckoutScreen';
import OrderConfirmationScreen from '../OrderConfirmationScreen';
import ProductScreen from "../ProductScreen";
import EventsScreen from "./EventsScreen";
import OrdersScreen from "./OrdersScreen";
import SavedScreen from "./SavedScreen";
import UserProfileScreen from "./UserProfileScreen";
import UserSearchScreen from "./UserSearchScreen";
import ViewStoreScreen from "./ViewStoreScreen";

export function ProductScreenWrapper({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ProductScreen navigation={navigation} />
        </SafeAreaView>
    );
}

export function SearchScreenWrapper({ navigation }) {

    const insets = useSafeAreaInsets();
    useEffect(() => {
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <UserSearchScreen navigation={navigation} />
        </SafeAreaView>
    );
}

export function MyOrderScreenWrapper({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <OrdersScreen navigation={navigation} />
        </SafeAreaView>
    );
}


export function ViewStoreScreenWrapper({ route, navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <ViewStoreScreen route={route} navigation={navigation} />
        </SafeAreaView>
    );
}

export function MyEventsScreenWrapper({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <EventsScreen navigation={navigation} />
        </SafeAreaView>
    );
}

export function UserProfileScreenWrapper({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <UserProfileScreen navigation={navigation} />
        </SafeAreaView>
    );
}

export function SavedScreenWrapper({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <SavedScreen navigation={navigation} />
        </SafeAreaView>
    );
}

export function CheckoutScreenWrapper({ navigation, route }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <CheckoutScreen route={route} navigation={navigation} />
        </SafeAreaView>
    );
}

export function OrderConfirmationScreenWrapper({ navigation, route }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <OrderConfirmationScreen route={route} navigation={navigation} />
        </SafeAreaView>
    );
}

