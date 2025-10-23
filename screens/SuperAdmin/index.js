import { Feather, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GSTReportsScreen from "../GSTReportsScreen";
import {
  AddFancyWrapper,
  PersonalChatWrapper,
  ProductDetailsScreenWrapper,
  ProductScreenWrapper,
  ProfileScreenWrapper,
  SearchScreenWrapper,
} from "../StackIndex";
import BankVerificationScreen from "./BankVerificationScreen";
import ChatListScreen from "./ChatListScreen";
import SuperAdminHomeScreen from "./SuperAdminHomeScreen";
import {
  AdminEventsScreenWrapper,
  AdminPaymentScreenWrapper,
  ManufacturerDetailsWrapper,
  OrderMonitoringScreenWrapper,
  SuperAdminProfileScreenWrapper,
} from "./SuperAdminStackIndex";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Superadmin screens for the display
export default function SuperAdminStack() {
  return (
    <>
      {/* Consistent StatusBar across all screens */}
      <StatusBar barStyle="dark-content" backgroundColor="#132f56" />

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // ...TransitionPresets.SlideFromRightIOS, // Smooth sliding animation
          // gestureEnabled: true, // Enable swipe-back gestures
          gestureDirection: "horizontal",
        }}
      >
        <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
        <Stack.Screen
          name="Products"
          component={ProductScreenWrapper}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreenWrapper}
          options={({ route }) => ({
            title: route.params?.product?.name || "Product Details",
            headerShown: true,
          })}
        />
        <Stack.Screen
          name="UserProfile"
          component={SuperAdminProfileScreenWrapper}
          options={({ route }) => ({
            title: "User Profile",
            headerShown: true,
            headerTitleAlign: "center",
          })}
        />
        <Stack.Screen
          name="ManufacturerDetails"
          component={ManufacturerDetailsWrapper}
          options={({ route }) => ({
            title: "Company Details",
            headerShown: true,
            headerTitleAlign: "center",
          })}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreenWrapper}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderMonitoring"
          component={OrderMonitoringScreenWrapper}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#132f56" },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            // animation: "slide_from_right",
            headerTitle: "Order Monitoring",
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreenWrapper}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#132f56",
            },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            animation: "slide_from_right",
            headerTitle: "Company Profile",
          }}
        />
        <Stack.Screen
          name="AddFancy"
          component={AddFancyWrapper}
          options={{ headerShown: true, headerTitle: "Create New Fancy" }}
        />
        <Stack.Screen
          name="PersonalChat"
          component={PersonalChatWrapper}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GSTReportsScreen"
          component={GSTReportsScreen}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#132f56" },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            headerTitle: "GST Reports",
          }}
        />
        <Stack.Screen
          name="PlatformRevenueScreen"
          component={require('./SuperAdminStackIndex').PlatformRevenueScreenWrapper}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#132f56" },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            headerTitle: "Platform Revenue",
          }}
        />
        <Stack.Screen
          name="SettlementManagementScreen"
          component={require('./SuperAdminStackIndex').SettlementManagementScreenWrapper}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#132f56" },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            headerTitle: "Settlement Management",
          }}
        />
        <Stack.Screen
          name="BankVerification"
          component={BankVerificationScreen}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#132f56" },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            headerTitle: "Bank Account Verification",
          }}
        />
        <Stack.Screen
          name="ChatList"
          component={ChatListScreen}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#132f56" },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            headerTitle: "Messages",
          }}
        />
        {/* <Stack.Screen 
                    name="SellerManagementScreen" 
                    component={SellerManagementScreen} 
                    options={{
                        headerShown: true,
                        headerStyle: { backgroundColor: "#132f56" },
                        headerShadowVisible: false,
                        headerTintColor: "#fff",
                        headerTitle: "Seller Management",
                    }} 
                /> */}
        {/* <Stack.Screen 
                    name="AnalyticsScreen" 
                    component={AnalyticsScreen} 
                    options={{
                        headerShown: true,
                        headerStyle: { backgroundColor: "#132f56" },
                        headerShadowVisible: false,
                        headerTintColor: "#fff",
                        headerTitle: "Analytics Dashboard",
                    }} 
                /> */}
      </Stack.Navigator>
    </>
  );
}

export function BottomTabNavigator() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => {
            let IconComponent;
            if (route.name === "Home") IconComponent = "home";
            else if (route.name === "Chat") IconComponent = "message-square";
            else if (route.name === "Orders") IconComponent = "package";
            else if (route.name === "Events")
              IconComponent = "calendar-outline";
            else if (route.name === "Payments")
              IconComponent = "receipt-outline";

            if (
              route.name === "Orders" ||
              route.name === "Chat" ||
              route.name === "Home"
            ) {
              return (
                <View>
                  <Feather
                    name={IconComponent}
                    size={focused ? 27 : 24}
                    color={color}
                  />
                </View>
              );
            } else {
              return (
                <View>
                  <Ionicons
                    name={IconComponent}
                    size={focused ? 27 : 24}
                    color={color}
                  />
                </View>
              );
            }
          },
          tabBarActiveTintColor: "#f28482",
          tabBarInactiveTintColor: "#525252",
          headerShown: false,
          headerStatusBarHeight: 0,
          animation: "shift",
          // ...TransitionPresets.FadeFromBottomAndroid, // Smooth fade-in transition
        })}
        initialRouteName="Home"
      >
        <Tab.Screen
          name="Home"
          component={SuperAdminHomeScreen}
          options={{
            tabBarLabel: "Home",
            headerShown: false,
            headerStatusBarHeight: 0,
          }}
        />
        {/* <Tab.Screen
          name="Chat"
          component={PersonalChatWrapper}
          options={{ tabBarLabel: "Chat", tabBarHideOnKeyboard: true }}
        /> */}
        <Tab.Screen
          name="Orders"
          component={OrderMonitoringScreenWrapper}
          options={{
            tabBarLabel: "Orders",
            headerShown: true,
            headerStatusBarHeight: 0,
            headerStyle: { backgroundColor: "#132f56" },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            // headerTitle: "Order Monitoring",
          }}
        />
        <Tab.Screen
          name="Events"
          component={AdminEventsScreenWrapper}
          options={{
            tabBarLabel: "Events",
            headerShown: true,
            headerStatusBarHeight: 0,
            headerStyle: { backgroundColor: "#132f56" },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            tabBarHideOnKeyboard: true,
          }}
        />
        <Tab.Screen
          name="Payments"
          component={AdminPaymentScreenWrapper}
          options={{
            tabBarLabel: "Payments",
            headerShown: true,
            headerTitle: "My Payments",
            headerStatusBarHeight: 0,
            headerStyle: {
              backgroundColor: "#132f56",
            },
            headerShadowVisible: false,
            headerTintColor: "#fff",
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2C2C2E",
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: "#8E8E93",
  },
});
