import React from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddFancy from "./AddFancy";
import EventsScreen from "./EventsScreen";
import IntroAsk from "./Login/IntroAsk";
import PersonalChat from "./PersonalChat";
import ProductDetailsScreen from "./ProductDetailsScreen";
import ProductReviewScreen from "./ProductReviewScreen";
import ProductScreen from "./ProductScreen";
import ProfileScreen from "./ProfileScreen";
import QuantitySelectionScreen from "./QuantitySelectionScreen";
import SearchScreen from "./SearchScreen";
import AnalyticsDashboard from "./Seller/AnalyticsDashboard";
import CustomerSupport from "./Seller/CustomerSupport";
import OrderManagementScreen from "./Seller/OrderManagementScreen";
import SellerChat from "./SellerChat";
import AdvancedSearchScreen from "./User/AdvancedSearchScreen";

export function ProductScreenWrapper({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ProductScreen navigation={navigation} />
        </SafeAreaView>
    );
}

export function ProductDetailsScreenWrapper({ navigation, route }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ProductDetailsScreen navigation={navigation} route={route} />
        </SafeAreaView>
    );
}

export function SearchScreenWrapper({ navigation }) {

    const insets = useSafeAreaInsets();
    return (
        <SafeAreaView style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <SearchScreen navigation={navigation} />
        </SafeAreaView>
    );
}

export function MyOrderScreenWrapper({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <OrderManagementScreen navigation={navigation} />
        </SafeAreaView>
    );
}

export function ProfileScreenWrapper({ route, navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <ProfileScreen route={route} navigation={navigation} />
        </SafeAreaView>
    );
}

export function AddFancyWrapper() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AddFancy />
        </SafeAreaView>
    );
}

export function PersonalChatWrapper({ route, navigation }) {
    const insets = useSafeAreaInsets(); // Get Safe Area Insets for proper handling
    return (
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }}>
            <StatusBar barStyle="light-content" backgroundColor="#fff" />
            <PersonalChat route={route} navigation={navigation} />
        </View>
    );
}
export function SellerChatWrapper({ route, navigation }) {
    const insets = useSafeAreaInsets(); // Get Safe Area Insets for proper handling
    return (
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }}>
            <StatusBar barStyle="light-content" backgroundColor="#fff" />
            <SellerChat route={route} navigation={navigation} />
        </View>
    );
}
export function CustomerSupportWrapper({ route, navigation }) {
    const insets = useSafeAreaInsets(); // Get Safe Area Insets for proper handling
    return (
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }}>
            <StatusBar barStyle="light-content" backgroundColor="#fff" />
            <CustomerSupport route={route} navigation={navigation} />
        </View>
    );
}

export function EventsWrapper({ route, navigation }) {
    const insets = useSafeAreaInsets(); // Get Safe Area Insets for proper handling

    return (
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }}>
            <StatusBar barStyle="light-content" backgroundColor="#fff" />
            <EventsScreen route={route} navigation={navigation} />
        </View>
    );
}

export function IntroAskWrapper({ route, navigation }) {
    const insets = useSafeAreaInsets(); // Get Safe Area Insets for proper handling

    return (
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }}>
            <StatusBar barStyle="light-content" backgroundColor="#fff" />
            <IntroAsk route={route} navigation={navigation} />
        </View>
    );
}

export function QuantitySelectionScreenWrapper({ route, navigation }) {
    const insets = useSafeAreaInsets(); // Get Safe Area Insets for proper handling

    return (
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }}>
            <StatusBar barStyle="light-content" backgroundColor="#fff" />
            <QuantitySelectionScreen route={route} navigation={navigation} />
        </View>
    );
}

export function AdvancedSearchScreenWrapper({ route, navigation }) {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdvancedSearchScreen route={route} navigation={navigation} />
        </View>
    );
}

export function ProductReviewScreenWrapper({ route, navigation }) {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ProductReviewScreen route={route} navigation={navigation} />
        </View>
    );
}

export function AnalyticsDashboardWrapper({ route, navigation }) {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AnalyticsDashboard route={route} navigation={navigation} />
        </View>
    );
}

export function OrderManagementScreenWrapper({ route, navigation }) {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }}>
            <StatusBar barStyle="light-content" backgroundColor="#132f56" />
            <OrderManagementScreen route={route} navigation={navigation} />
        </View>
    );
}
