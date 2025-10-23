import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { View, Pressable } from "react-native";
import SavedScreen from "../screens/SavedScreen";
import AboutUsScreen from "../screens/AboutUsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LogoutScreen from "../screens/LogoutScreen";
import { BottomTabNavigator } from "../App";
import { width } from "../constants/helpers";
import FancyItemScreen from "../screens/FancyItemScreen";
import { Feather, FontAwesome } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

// Custom Header with User Icon to Open Drawer
const CustomHeader = () => {
    const navigation = useNavigation();

    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                width: width / 4,
                padding: 10,
            }}
        >
            <Pressable
                style={{ backgroundColor: "#f28482", padding: 8, borderRadius: 50 }}
                onPress={() => navigation.openDrawer()}
            >
                <Feather name="user" size={22} color={"white"} />
            </Pressable>
        </View>
    );
};

// Drawer Navigator
const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            // drw
            screenOptions={{
                drawerPosition: "right",
                drawerStyle: { backgroundColor: "#222831", width: width / 1.2 }, // Adjust width
                drawerActiveBackgroundColor: "#f28482",
                drawerActiveTintColor: "#fff", // Active text color
                drawerInactiveTintColor: "#ddd", // Inactive text color
                drawerType: "front",
                drawerLabelStyle: {
                    fontSize: 16
                },
            }}>
            <Drawer.Screen
                name="Home"
                component={BottomTabNavigator}
                options={{
                    headerShown: false,
                    headerStatusBarHeight: 0,
                    drawerIcon: ({ color, size, focused }) => <Feather name="home" color={focused ? "white" : "#ddd"} size={20} />,
                }}
            />
            <Drawer.Screen
                name="Fancy Items"
                component={FancyItemScreen}
                options={{
                    drawerIcon: ({ color, size, focused }) => <Feather name="command" size={20} color={focused ? "white" : "#ddd"} />,
                }}
            />
            <Drawer.Screen name="Saved"
                component={SavedScreen}
                options={{
                    drawerIcon: ({ color, size, focused }) => <Feather name="bookmark" size={20} color={focused ? "white" : "#ddd"} />
                }} />
            <Drawer.Screen name="About Us" component={AboutUsScreen} options={{
                drawerIcon: ({ color, size, focused }) => <FontAwesome name="building-o" size={20} color={focused ? "white" : "#ddd"} />
            }} />
            <Drawer.Screen name="Profile" component={ProfileScreen} options={{
                drawerIcon: ({ color, size, focused }) => <Feather name="user" size={20} color={focused ? "white" : "#ddd"} />
            }} />
            <Drawer.Screen name="Logout" component={LogoutScreen}
                options={{
                    drawerLabelStyle: {
                        color: "red",
                    },
                    drawerIcon: ({ color, size, focused }) => <MaterialIcons name="logout" size={20} color={focused ? "white" : "red"} />
                }} />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;