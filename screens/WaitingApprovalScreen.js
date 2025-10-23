import {
    MaterialIcons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from "react-native-paper";
import { useAuthStore } from "../store/useAuthStore";



const WaitingApprovalScreen = () => {
    const { clearStorage } = useAuthStore();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleLogout = () => {
        setIsModalVisible(false);
        clearStorage();
    };
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/in_verification.jpg')} // replace with your image path
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.title}>Approval Pending</Text>
            <Text style={styles.description}>
                You will be allowed to access all features once your company registration is approved.
            </Text>
            <Text style={styles.note}>
                You will be notified via email or in-app notification when your account is approved.
            </Text>
            <View style={{ marginVertical: 20 }} />

            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    // width: "100%",
                    backgroundColor: "#F8FAFC",
                    paddingHorizontal: 8,
                    paddingVertical: 10,
                    borderRadius: 2,
                }}
            >
                <TouchableOpacity
                    onPress={() => setIsModalVisible(true)}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <View style={{ paddingLeft: 5 }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "500",
                                color: "#FF2626",
                                paddingVertical: 5,
                            }}
                        >
                            Log out
                        </Text>
                    </View>
                    <View>
                        <MaterialIcons name="logout" size={22} color="#FF2626" />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 3 }} />

            <View style={{ marginVertical: 10 }} />
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)} // Close the modal on back press
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Confirm Logout</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to log out?
                        </Text>
                        <View style={styles.modalButtons}>
                            <Button
                                mode="elevated"
                                onPress={() => setIsModalVisible(false)}
                                textColor="#000" // Text color for Cancel button
                            >
                                Cancel
                            </Button>
                            <Button
                                buttonColor="#EA4C4C" // Background color for Confirm button
                                textColor="#fff" // Text color for Confirm button
                                onPress={handleLogout}
                                mode="elevated"
                            >
                                Confirm
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
        textAlign: "center",
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
        color: "#666",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    image: {
        width: 350,
        height: 220,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#132f56',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#444',
        marginBottom: 10,
    },
    note: {
        fontSize: 14,
        textAlign: 'center',
        color: '#777',
        marginTop: 10,
    },
});

export default WaitingApprovalScreen;
