import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Toast } from "toastify-react-native"; // Optional, for showing success/error messages
import { STORAGE_KEYS, useAuthStore } from "../../store/useAuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OtpScreen = ({ route }) => {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false); // To manage loading state
    const navigation = useNavigation();
    const { role, confirmation, phoneNumber } = route.params; // confirmation is passed from previous screen

    const { setAuth } = useAuthStore(); // For updating auth state in your store

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            Toast.error("Please enter a valid 6-digit OTP.");
            return;
        }

        setIsLoading(true);

        try {
            // Firebase OTP verification
            await confirmation.confirm(otp); // `confirmation` object confirms the OTP

            // Set authentication state in AsyncStorage and your auth store
            await AsyncStorage.multiSet([
                [STORAGE_KEYS.TOKEN, "this_is_token"], // Replace with real token
                [STORAGE_KEYS.ROLE, role],
                [STORAGE_KEYS.SIGNED_IN, "true"],
                [STORAGE_KEYS.FULLY_AUTH, "true"],
                [STORAGE_KEYS.IS_AUTH, "true"],
            ]);

            // Update auth state in the global store
            setAuth(true);

            // Navigate based on the role (e.g., Seller or User)
            if (role === "seller") {
                navigation.replace("OnboardingScreen"); // Replace with your seller dashboard screen
            } else {
                navigation.replace("UserBottomTabs"); // Replace with your user dashboard screen
            }

            Toast.success("OTP verified successfully!");

        } catch (error) {
            setIsLoading(false);
            Toast.error("OTP verification failed! Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.text}>We sent an OTP to {phoneNumber}</Text>

            <TextInput
                style={styles.input}
                placeholder="6-digit OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleVerifyOtp}
                disabled={isLoading} // Disable the button during loading
            >
                <Text style={styles.buttonText}>{isLoading ? "Verifying..." : "Verify"}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    text: { fontSize: 16, marginBottom: 20 },
    input: { borderBottomWidth: 1, width: 200, textAlign: "center", fontSize: 20, marginBottom: 20 },
    button: { backgroundColor: "black", padding: 15, borderRadius: 25, marginTop: 20, width: 200, alignItems: "center" },
    buttonText: { color: "white", fontSize: 16 },
});

export default OtpScreen;
