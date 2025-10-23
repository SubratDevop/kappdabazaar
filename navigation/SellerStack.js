import { Feather, Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, commonHeaderOptions, commonTabOptions } from '../constants/exports';
import GSTReportsScreen from '../screens/GSTReportsScreen';
import HomeScreen from '../screens/HomeScreen';
import PhonePePaymentScreen from '../screens/PhonePePaymentScreen';
import BankAccountsScreen from '../screens/Seller/BankAccountsScreen';
import ChatListScreen from '../screens/Seller/ChatListScreen';
import LRUploadScreen from '../screens/Seller/LRUploadScreen';
import {
    AddFancyWrapper,
    CustomerSupportWrapper,
    EventsWrapper,
    OrderManagementScreenWrapper,
    PersonalChatWrapper,
    ProductDetailsScreenWrapper,
    ProductScreenWrapper,
    ProfileScreenWrapper,
    SearchScreenWrapper,
    SellerChatWrapper
} from '../screens/StackIndex';
import PaymentHistoryScreen from '../screens/User/PaymentHistoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const getTabIcon = (routeName, color, size, focused) => {
    const icons = {
        Home: "home",
        Chat: "message-square",
        Events: "calendar",
        Orders: "shopping-bag",
    };
    const IconComponent = icons[routeName];

    if (routeName === "Home" || routeName === "Chat" || routeName === "Orders") {
        return <View>
            <Feather name={IconComponent} color={color} size={focused ? 27 : 24} />
        </View>
    } else {
        return <View>
            <Ionicons name={IconComponent} color={color} size={focused ? 27 : 24} />
        </View>
    }
};

export default function SellerStack() {
    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
                <Stack.Screen name="Products" component={ProductScreenWrapper} options={{ headerShown: true }} />
                <Stack.Screen
                    name="ProductDetails"
                    component={ProductDetailsScreenWrapper}
                    options={({ route }) => ({
                        title: route.params?.product?.name || "Product Details",
                        headerShown: true,
                    })}
                />
                <Stack.Screen name="Search" component={SearchScreenWrapper} />
                <Stack.Screen
                    name="OrderManagement"
                    component={OrderManagementScreenWrapper}
                    options={{
                        headerShown: true,
                        ...commonHeaderOptions,
                        headerTitle: "Order Management",
                    }}
                />
                <Stack.Screen
                    name="CompanyProfile"
                    component={ProfileScreenWrapper}
                    options={{
                        headerShown: true,
                        ...commonHeaderOptions,
                        headerTitle: "Company Profile",
                    }}
                />
                <Stack.Screen name="AddFancy" component={AddFancyWrapper} options={{ headerShown: true, headerTitle: "Add New Product" }} />
                <Stack.Screen
                    name="PersonalChat"
                    component={PersonalChatWrapper}
                    options={{
                        headerShown: false,
                        headerTitle: "Chat",
                    }}
                />
                <Stack.Screen
                    name="SellerChat"
                    component={SellerChatWrapper}
                    options={{
                        headerShown: false,
                        headerTitle: "Chat",
                    }}
                />
                <Stack.Screen
                    name="CustomerSupport"
                    component={CustomerSupportWrapper}
                    options={{
                        headerShown: false,
                        headerTitle: "Chat",
                    }}
                />
                <Stack.Screen
                    name="ChatList"
                    component={ChatListScreen}
                    options={{
                        headerShown: true,
                        ...commonHeaderOptions,
                        headerTitle: "Messages",
                    }}
                />
                <Stack.Screen
                    name="LRUploadScreen"
                    component={LRUploadScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="GSTReportsScreen"
                    component={GSTReportsScreen}
                    options={{
                        headerShown: true,
                        ...commonHeaderOptions,
                        headerTitle: "GST Reports",
                    }}
                />
                <Stack.Screen
                    name="PaymentHistoryScreen"
                    component={PaymentHistoryScreen}
                    options={{
                        headerShown: true,
                        ...commonHeaderOptions,
                        headerTitle: "Payment History",
                    }}
                />
                <Stack.Screen
                    name="AnalyticsDashboard"
                    component={require('../screens/Seller/AnalyticsDashboard').default}
                    options={{
                        headerShown: true,
                        ...commonHeaderOptions,
                        headerTitle: "Analytics Dashboard",
                    }}
                />
                <Stack.Screen
                    name="AdvancedSearch"
                    component={require('../screens/User/AdvancedSearchScreen').default}
                    options={{
                        headerShown: true,
                        ...commonHeaderOptions,
                        headerTitle: "Advanced Search",
                    }}
                />
                <Stack.Screen
                    name="ProductReviews"
                    component={require('../screens/ProductReviewScreen').default}
                    options={{
                        headerShown: true,
                        ...commonHeaderOptions,
                        headerTitle: "Product Reviews",
                    }}
                />
                <Stack.Screen
                    name="SellerLedgerScreen"
                    component={require('../screens/Seller/SellerLedgerScreen').default}
                    options={{
                        headerShown: true,
                        ...commonHeaderOptions,
                        headerTitle: "Transaction Ledger",
                    }}
                />
                <Stack.Screen
                    name="SellerEarningsScreen"
                    component={require('../screens/Seller/SellerEarningsScreen').default}
                    options={{
                        headerShown: true,
                        ...commonHeaderOptions,
                        headerTitle: "Earnings Dashboard",
                    }}
                />
                <Stack.Screen
                    name="SellerSettlementsScreen"
                    component={require('../screens/Seller/SellerSettlementsScreen').default}
                    options={{
                        headerShown: true,
                        ...commonHeaderOptions,
                        headerTitle: "Monthly Settlements",
                    }}
                />
                <Stack.Screen
                    name="BankAccounts"
                    component={BankAccountsScreen}
                    options={{
                        headerShown: true,
                        ...commonHeaderOptions,
                        headerTitle: "Bank Accounts",
                    }}
                />
                <Stack.Screen
                    name="PhonePePayment"
                    component={PhonePePaymentScreen}
                    options={{
                        headerShown: true,
                        ...commonHeaderOptions,
                        headerTitle: "Payment",
                    }}
                />
                <Stack.Screen
                    name="SellerProfile"
                    component={require('../screens/Seller/SellerProfileScreen').default}
                    options={{
                        headerShown: true,
                        ...commonHeaderOptions,
                        headerTitle: "SellerProfile",
                    }}
                />
                <Stack.Screen
                    name="NotificationScreen"
                    component={require('../utils/notifications').default}
                    options={{
                        headerShown: true,
                        ...commonHeaderOptions,
                        headerTitle: "Notification",
                    }}
                />
            </Stack.Navigator>
        </>
    );
}

export function BottomTabNavigator() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Tab.Navigator
                initialRouteName='Home'
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size, focused }) => getTabIcon(route.name, color, size, focused),
                    tabBarActiveTintColor: COLORS.secondary,
                    tabBarInactiveTintColor: COLORS.inactive,
                    ...commonTabOptions,
                    animation: "fade"
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ tabBarLabel: "Home", ...commonTabOptions }}
                />
                <Tab.Screen
                    name="Chat"
                    component={SellerChatWrapper}
                    options={{ tabBarLabel: "Chat", tabBarHideOnKeyboard: true }}
                />
                <Tab.Screen
                    name="Events"
                    component={EventsWrapper}
                    options={{ tabBarLabel: "Events", tabBarHideOnKeyboard: true }}
                />
                <Tab.Screen
                    name="Orders"
                    component={OrderManagementScreenWrapper}
                    options={{
                        ...commonTabOptions,
                        headerShown: true,
                        headerStyle: { backgroundColor: COLORS.primary },
                        headerTintColor: "#fff",
                        headerTitle: "Orders",
                    }}
                />
            </Tab.Navigator>
        </SafeAreaView>
    );
}