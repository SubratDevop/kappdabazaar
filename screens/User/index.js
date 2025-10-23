import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PhonePePaymentScreen from "../PhonePePaymentScreen";
import {
  AddFancyWrapper,
  PersonalChatWrapper,
  ProductDetailsScreenWrapper,
  ProductScreenWrapper,
  QuantitySelectionScreenWrapper,
} from "../StackIndex";
import ChatListScreen from "./ChatListScreen";
import PaymentHistoryScreen from "./PaymentHistoryScreen";
import UserHomeScreen from "./UserHomeScreen";
import {
  CheckoutScreenWrapper,
  MyEventsScreenWrapper,
  MyOrderScreenWrapper,
  OrderConfirmationScreenWrapper,
  SearchScreenWrapper,
  UserProfileScreenWrapper,
  ViewStoreScreenWrapper
} from "./UserStackIndex";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // ✅ Must be defined

export default function UserStack() {
  return (
    <>
      {/* Consistent StatusBar across all screens */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="UserBottomTabs"
          component={UserBottomTabNavigator}
        />
        <Stack.Screen
          name="Products"
          component={ProductScreenWrapper}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreenWrapper}
          options={({ route }) => ({
            // title: route.params?.product?.name || "Product Details",
            // headerShown: true,
            headerShadowVisible: false,
            headerTintColor: "#333",
          })}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreenWrapper}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QuantitySelection"
          component={QuantitySelectionScreenWrapper}
        // options={{
        //   headerShown: true,
        //   title: "Select Quantity123",
        //   headerStyle: {
        //     backgroundColor: "#fff",
        //   },
        //   headerShadowVisible: false,
        //   headerTintColor: "#333",
        // }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreenWrapper}
          options={{
            headerShown: true,
            title: "Checkout",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerShadowVisible: false,
            headerTintColor: "#333",
          }}
        />
        <Stack.Screen
          name="OrderConfirmation"
          component={OrderConfirmationScreenWrapper}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="OrdersScreen"
          component={MyOrderScreenWrapper}
          options={{
            // headerShown: true,
            // headerStyle: {
            //     backgroundColor: "#132f56",
            // },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            animation: "slide_from_right",
            headerTitle: "My Orders",
          }}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfileScreenWrapper}
          options={{
            headerShown: true,
            headerShadowVisible: true,
            headerTitleAlign: "center",
            headerTintColor: "#000",
            animation: "slide_from_right",
            headerTitle: "Profile",
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
          name="PaymentHistoryScreen"
          component={PaymentHistoryScreen}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#132f56",
            },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            headerTitle: "Payment History",
          }}
        />
        <Stack.Screen
          name="AdvancedSearch"
          component={require("./AdvancedSearchScreen").default}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerShadowVisible: false,
            headerTintColor: "#333",
            headerTitle: "Advanced Search",
          }}
        />
        <Stack.Screen
          name="ProductReviews"
          component={require("../ProductReviewScreen").default}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerShadowVisible: false,
            headerTintColor: "#333",
            headerTitle: "Product Reviews",
          }}
        />
        <Stack.Screen
          name="CompanyProfile"
          component={require("../ProfileScreen").default}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerShadowVisible: false,
            headerTintColor: "#333",
            headerTitle: "Company Profile",
          }}
        />
        <Stack.Screen
          name="ViewStoreScreen"
          component={ViewStoreScreenWrapper}
          options={({ route }) => ({
            title: "Store View",
            headerShown: true,
            headerTitleAlign: "center",
          })}
        />
        <Stack.Screen
          name="PhonePePayment"
          component={PhonePePaymentScreen}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerShadowVisible: false,
            headerTintColor: "#333",
            headerTitle: "Payment",
          }}
        />
        <Stack.Screen
          name="ChatList"
          component={ChatListScreen}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#132f56",
            },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            headerTitle: "Messages",
          }}
        />
      </Stack.Navigator>
    </>
  );
}

export function UserBottomTabNavigator() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => {
            let IconComponent;
            if (route.name === "Home") IconComponent = "home";
            else if (route.name === "Search") IconComponent = "search";
            else if (route.name === "Chat") IconComponent = "message-square";
            else if (route.name === "Events") IconComponent = "calendar";
            else if (route.name === "Orders") IconComponent = "package";
            return (
              <View>
                {/* <IconComponent color={color} size={focused ? 27 : 24} /> */}
                <Feather
                  name={IconComponent}
                  size={focused ? 27 : 24}
                  color={color}
                />
              </View>
            );
          },
          tabBarActiveTintColor: "#f28482",
          tabBarInactiveTintColor: "#525252",
          headerShown: false,
          headerStatusBarHeight: 0,
        })}
      >
        <Tab.Screen
          name="Home"
          component={UserHomeScreen}
          options={{
            tabBarLabel: "Dashboard",
            headerShown: false,
            headerStatusBarHeight: 0,
            headerStyle: {
              backgroundColor: "#132f56",
            },
          }}
        />
        {/* <Tab.Screen
          name="Search"
          component={SearchScreenWrapper}
          options={{
            tabBarLabel: "Search",
            tabBarHideOnKeyboard: true,
            headerStatusBarHeight: 0,
            headerShown: false,
          }}
        /> */}
        {/* <Tab.Screen
          name="Chat"
          component={PersonalChatWrapper}
          options={{ tabBarLabel: "Chat", tabBarHideOnKeyboard: true }}
        /> */}
        <Tab.Screen
          name="Events"
          component={MyEventsScreenWrapper}
          options={{
            tabBarLabel: "Events",
            tabBarHideOnKeyboard: true,
            headerStatusBarHeight: 0,
            headerShown: true,
            headerTitle: "Saved Products",
            headerStyle: {
              backgroundColor: "#132f56",
            },
            headerShadowVisible: false,
            headerTintColor: "#fff",
          }}
        />
        <Tab.Screen
          name="Orders"
          component={MyOrderScreenWrapper}
          options={{
            tabBarLabel: "My Orders",
            // headerShown: true,
            headerStatusBarHeight: 0,
            headerStyle: {
              backgroundColor: "#132f56",
            },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            headerTitle: "My Orders",
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
