import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";

import {
    Alert,
    Animated,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { colors, themeInput } from "../../constants/exports";
import { width } from "../../constants/helpers";
import { useAuthStore } from "../../store/useAuthStore";

const OnboardingScreen = ({ route} ) => {
    const navigation = useNavigation();
    const { role } = route.params; // user or seller

    const {
        utilsFn,
        setAuthInfo,
        saveCompanyInfoFn,
    } = useAuthStore();

    const [fadeAnim] = useState(new Animated.Value(1));
    const [uploadedImage, setUploadedImage] = useState(null);

    const [companyDetails, setCompanyDetails] = useState({
        company_name: "",
        gst_number: "",
        pan_number: "",
        gst_certificate_url: "",
    });

    const isValidPAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
    const isValidGST = (gst) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
    const isValidCompanyName = (name) => name.trim().length > 2;

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission Denied", "You need to allow access to photos.");
            }
        })();
    }, []);

    const handleImageUpload = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: false,
                aspect: [16, 9],
                quality: 1,
            });
            if (!result.canceled) {
                const uri = result.assets[0].uri;
                setUploadedImage(uri);
                setCompanyDetails((prev) => ({ ...prev, gst_certificate_url: uri }));
            }
        } catch (error) {
            console.error("Image upload error:", error);
        }
    };

    const handleSubmit = async () => {

        const { company_name, gst_number, pan_number } = companyDetails;

        if (!isValidCompanyName(company_name)) {
            return Alert.alert("Validation Error", "Please enter a valid company name.");
        }

        if (!isValidGST(gst_number)) {
            return Alert.alert("Validation Error", "Invalid GST number format.");
        }

        if (!isValidPAN(pan_number)) {
            return Alert.alert("Validation Error", "Invalid PAN number format.");
        }



        try {
            const ans = await utilsFn();
            const parsed_user_id = JSON.parse(ans?.user);
            const user_id = parsed_user_id?.user_id;


            if (user_id) {
                await saveCompanyInfoFn({
                    userId: parseInt(user_id),
                    company_name,
                    gst_number,
                    pan_number,
                    gst_certificate_url: companyDetails.gst_certificate_url,
                });
                const updatedAuthInfo = await utilsFn();
                setAuthInfo(updatedAuthInfo);
                navigation.replace("Login", { role });

            }
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Something went wrong while saving details.");
        }
    };

    const handleChange = (key, value) => {
        setCompanyDetails((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Animated.View style={[styles.onboardingContainer, { opacity: fadeAnim }]}>
                        <View style={styles.stepContainer}>
                            <Text style={styles.stepTitle}>Company Details</Text>

                            {["company_name", "gst_number", "pan_number"].map((field, index) => (
                                <View style={styles.inputWrapper} key={index}>
                                    <TextInput
                                        label={field.replace("_", " ").toUpperCase()}
                                        mode="flat"
                                        value={companyDetails[field]}
                                        onChangeText={(text) => handleChange(field, text)}
                                        style={styles.input}
                                        theme={themeInput}
                                        autoCapitalize="characters"
                                    />
                                </View>
                            ))}

                            <Button onPress={handleImageUpload} mode="outlined" style={{ marginTop: 10 }}>
                                Upload GST Certificate
                            </Button>

                            {uploadedImage && (
                                <Image
                                    source={{ uri: uploadedImage }}
                                    style={{
                                        width: 250, height: 260,
                                        marginTop: 15, alignSelf: "center"
                                    }}
                                />
                            )}

                            <Button
                                mode="elevated"
                                textColor="#fff"
                                onPress={handleSubmit}
                                style={{
                                    marginTop: 30,
                                    backgroundColor: "#ff4b2b",
                                    width: "100%",
                                    borderRadius: 50,
                                    fontSize: 18,
                                    paddingVertical: 2,
                                }}>
                                Finish
                            </Button>
                        </View>
                    </Animated.View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", width: width, alignItems: "center" },
    scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 20, width: width },
    onboardingContainer: { alignItems: "center", justifyContent: "center", padding: 10, width: width - 10 },
    stepContainer: { width: "100%", paddingVertical: 10 },
    stepTitle: { fontSize: 26, fontWeight: "bold", textAlign: "start", marginBottom: 20 },
    inputWrapper: { width: "100%", marginBottom: 20 },
    input: { backgroundColor: "transparent", fontSize: 16, borderBottomColor: colors.lightGray, width: "100%" },
});
