import React, { useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EventsScreen from "../EventsScreen";
import GSTReportsScreen from "../GSTReportsScreen";
import MyOrderScreen from "../MyOrderScreen";
import ProductScreen from "../ProductScreen";
import AdminPaymentScreen from "../SuperAdmin/AdminPaymentScreen";
import UserSearchScreen from "../User/UserSearchScreen";
import ManufacturerDetails from "./ManufacturerDetails";
import OrderMonitoringScreen from "./OrderMonitoringScreen";
import SuperAdminProfileScreen from "./SuperAdminProfileScreen";

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

export function AdminPaymentScreenWrapper({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <AdminPaymentScreen navigation={navigation} />
        </SafeAreaView>
    );
}

export function MyOrderScreenWrapper({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <MyOrderScreen navigation={navigation} />
        </SafeAreaView>
    );
}

export function SuperAdminProfileScreenWrapper({ route, navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <SuperAdminProfileScreen route={route} navigation={navigation} />
        </SafeAreaView>
    );
}

export function ManufacturerDetailsWrapper({ route, navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <ManufacturerDetails route={route} navigation={navigation} />
        </SafeAreaView>
    );
}

export function OrderMonitoringScreenWrapper({ route, navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <OrderMonitoringScreen route={route} navigation={navigation} />
        </SafeAreaView>
    );
}

export function AdminEventsScreenWrapper({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <EventsScreen navigation={navigation} />
        </SafeAreaView>
    );
}

export function GSTReportsScreenWrapper({ route, navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <GSTReportsScreen route={route} navigation={navigation} />
        </SafeAreaView>
    );
}

export function PlatformRevenueScreenWrapper({ route, navigation }) {
    const PlatformRevenueScreen = require('./PlatformRevenueScreen').default;
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <PlatformRevenueScreen route={route} navigation={navigation} />
        </SafeAreaView>
    );
}

export function SettlementManagementScreenWrapper({ route, navigation }) {
    const SettlementManagementScreen = require('./SettlementManagementScreen').default;
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <SettlementManagementScreen route={route} navigation={navigation} />
        </SafeAreaView>
    );
}
