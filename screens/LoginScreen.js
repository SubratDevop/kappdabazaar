import { Feather, Fontisto } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, TextInput } from "react-native-paper";
import { colors } from "../constants/exports";
import { useAuthStore } from "../store/useAuthStore";

const LoginScreen = ({ route }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();

    const { role } = route.params;


    const { login, loginSellerAndUser } = useAuthStore();

    const handleLogin = async () => {
        if (!username || !password) return;

        const payload = {
            emailOrPhone: username,
            password: password
        };

        try {
            if (role === "superadmin") {
                await login(payload);
            } else {
                const data = { ...payload, role };

                await loginSellerAndUser(data)
            }
        } catch (err) {
            alert("Invalid credentials or login error");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >

            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 5 }} // 👈 makes it adapt to content height
                enableOnAndroid={true}
                keyboardShouldPersistTaps="handled"
            >


                <View style={styles.container}>
                    <StatusBar barStyle="dark-content" />
                    <Text style={styles.title}>Welcome Back!</Text>
                    <Text style={styles.subHeading}>You are logging in as : {role.charAt(0).toUpperCase() + role.slice(1)}</Text>

                    {/* Email Field */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.passwordContainer}>
                            <View style={styles.icon}>
                                {/* <MailPlusIcon size={24}  color={colors.navyBlue} /> */}
                                <Fontisto name="email" size={24}  color={colors.navyBlue} />
                            </View>
                            <TextInput
                                mode="flat"
                                placeholder="Enter your phone or email"
                                value={username}
                                onChangeText={setUsername}
                                style={styles.input}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Password Field */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
                                {showPassword ? <Feather name="eye" size={24}  color={colors.navyBlue} /> : <Feather name="eye-off" size={24}  color={colors.navyBlue} />}
                            </TouchableOpacity>
                            <TextInput
                                mode="flat"
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                style={[styles.input]}
                            />
                        </View>
                    </View>

                    {/* Register Button Link */}
                    {role !== "superadmin" && (
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                            <Text>Don't have an account? </Text>
                            <Text
                                onPress={() => navigation.replace("SignIn", { role: role })}
                                style={{ color: "#003285", fontWeight: "500", textDecorationLine: "underline" }}
                            >
                                Sign Up
                            </Text>
                        </View>
                    )}
                    {/* Login Button */}
                    <Button
                        mode="elevated"
                        onPress={handleLogin}
                        style={styles.button}
                        textColor="#fff"
                        disabled={!username || !password}
                    >
                        LOGIN
                    </Button>
                </View>

            </KeyboardAwareScrollView>
        </KeyboardAvoidingView>

    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "#fff",
        width: "100%",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#132f56",
        marginBottom: 10,
        textAlign: "center",
    },
    inputWrapper: {
        width: "100%",
        marginBottom: 20,
    },
    subHeading: {
        fontSize: 16,
        fontWeight: "700",
        color: "#132f56",
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#132f56",
        marginBottom: 5,
    },
    input: {
        backgroundColor: "transparent",
        fontSize: 16,
        borderBottomColor: colors.lightGray,
        width: "90%",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        // borderBottomWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 5,
        paddingRight: 10,
    },
    icon: {
        padding: 10,
    },
    button: {
        // backgroundColor: "#ff4b2b",
        backgroundColor: colors.navyBlue,
        paddingVertical: 4,
        width: "100%",
        borderRadius: 8,
        marginTop: 20,
    },
});
