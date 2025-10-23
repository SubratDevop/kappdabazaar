import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-paper';
import { width } from '../constants/helpers';
import { STORAGE_KEYS, useAuthStore } from '../store/useAuthStore';
import { useCompanyStore } from '../store/useCompanyStore';

const IMG = require("../assets/company.jpg");

const ProfileScreen = ({ route, navigation }) => {

    const [selectedTab, setSelectedTab] = useState("Profile");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [data, setData] = useState({
        company_name: '',
        pan_number: '',
        gst_number: '',
        gst_certificate_url: '',
    });

    const [person, setPerson] = useState({
        name: "",
        phone_number: "",
        email: "",
    });
    const { isFocused } = useIsFocused();

    const { fetchCompanyDetails, } = useCompanyStore();
    const { saveCompanyInfoFn, clearStorage } = useAuthStore();

    useEffect(() => {
        async function fetchDetails() {
            const res = await AsyncStorage.getItem(STORAGE_KEYS.USER);
            const data = JSON.parse(res);
            const res_data = await fetchCompanyDetails(data?.user_id);
            setIsEditing(res_data?.companyInfo === null)
            setPerson((prev) => ({
                ...prev,
                name: res_data?.name,
                phone_number: res_data?.phone_number,
                email: res_data?.email
            }))
            if (res_data?.companyInfo !== null) {
                setData(res_data?.companyInfo);
            }
        }
        fetchDetails();
    }, [])

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.7,
        });
        if (!result.canceled) {
            setData({ ...data, gst_certificate_url: result.assets[0].uri });
        }
    };

    const tabs = ["Profile", "Products", "Orders", "Payments"];

    const handleLogout = () => {
        setIsModalVisible(false);
        clearStorage();
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.tabContainer}>
                {tabs.map((tab, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedTab(tab)}
                        style={[styles.tab, selectedTab === tab && styles.activeTab]}>
                        <View style={styles.tabContent}>
                            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                                {tab}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
                {selectedTab === "Profile" && (
                    <View style={{ padding: 10 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontSize: 22, fontWeight: "600" }}>Profile</Text>
                            <TouchableOpacity
                                disabled={data?.company_name?.length === 0}
                                onPress={async () => {
                                    if (isEditing) {
                                        const res = await AsyncStorage.getItem(STORAGE_KEYS.USER);
                                        const userData = JSON.parse(res);

                                        await saveCompanyInfoFn({
                                            userId: parseInt(userData?.user_id),
                                            ...data
                                        });
                                        const res_data = await fetchCompanyDetails(userData?.user_id);
                                        setData(res_data?.companyInfo);
                                        setPerson((prev) => ({
                                            ...prev,
                                            name: res_data?.name,
                                            phone_number: res_data?.phone_number,
                                            email: res_data?.email
                                        }))
                                    }
                                    setIsEditing(!isEditing);
                                }}>
                                {isEditing ? <Text style={{ fontSize: 15, fontWeight: "500", color: "#ff6347", backgroundColor: "#fff", paddingVertical: 4, paddingHorizontal: 5, borderRadius: 5 }}>Save</Text> :
                                    <Text style={{ fontSize: 15, fontWeight: "400", color: "#fff", backgroundColor: "#ff6347", paddingVertical: 4, paddingHorizontal: 15, borderRadius: 5 }}>Edit</Text>
                                }
                            </TouchableOpacity>
                        </View>

                        <Image
                            source={IMG}
                            style={[{ width: '100%', height: 200, borderRadius: 8, marginVertical: 10 }]}
                        />

                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Name</Text>
                            <TextInput
                                value={person.name}
                                // editable={isEditing}
                                // onChangeText={(text) => setData(prev => ({ ...prev, gst_number: text }))}
                                style={[styles.textInput, styles.disabledInput]}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Phone No</Text>
                            <TextInput
                                value={person.phone_number}
                                // editable={isEditing}
                                // onChangeText={(text) => setData(prev => ({ ...prev, gst_number: text }))}
                                style={[styles.textInput, styles.disabledInput]}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                value={person.email}
                                // editable={isEditing}
                                // onChangeText={(text) => setData(prev => ({ ...prev, gst_number: text }))}
                                style={[styles.textInput, styles.disabledInput]}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Company Name</Text>
                            <TextInput
                                value={data.company_name}
                                editable={isEditing}
                                onChangeText={(text) => setData(prev => ({ ...prev, company_name: text }))}
                                style={[styles.textInput, !isEditing && styles.disabledInput]}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>PAN Number</Text>
                            <TextInput
                                value={data.pan_number}
                                editable={isEditing}
                                onChangeText={(text) => setData(prev => ({ ...prev, pan_number: text }))}
                                style={[styles.textInput, !isEditing && styles.disabledInput]}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>GST Number</Text>
                            <TextInput
                                value={data.gst_number}
                                editable={isEditing}
                                onChangeText={(text) => setData(prev => ({ ...prev, gst_number: text }))}
                                style={[styles.textInput, !isEditing && styles.disabledInput]}
                            />
                        </View>

                        {/* GST Certificate Upload */}
                        <TouchableOpacity
                            onPress={pickImage}
                            disabled={!isEditing}
                            style={[styles.uploadButton, !isEditing && { opacity: 0.5 }]}
                        >
                            <Text style={styles.uploadText}>
                                {data.gst_certificate_url ? "Change GST Certificate" : "Upload GST Certificate"}
                            </Text>
                        </TouchableOpacity>

                        {/* Uploaded Image Preview */}
                        {data.gst_certificate_url && (
                            <Image
                                source={{ uri: data.gst_certificate_url }}
                                style={{ width: '100%', height: 200, marginTop: 10, borderRadius: 10 }}
                                resizeMode="contain"
                            />
                        )}

                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", backgroundColor: "#F8FAFC", paddingHorizontal: 8, paddingVertical: 10, borderRadius: 5, marginTop: 10, borderWidth: 0.3, elevation: 0.2, borderColor: "#ccc" }}>
                            <TouchableOpacity onPress={() => setIsModalVisible(true)}
                                style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                <View style={{ paddingLeft: 5 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "500", color: "#FF2626", paddingVertical: 5 }}>Log out</Text>
                                </View>
                                <View>
                                    <MaterialIcons name="logout" size={22} color="#FF2626" />
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>

                )}
            </ScrollView>
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)} // Close the modal on back press
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Confirm Logout</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>
                        <View style={styles.modalButtons}>
                            <Button
                                mode='elevated'
                                onPress={() => setIsModalVisible(false)}
                                // buttonColor="#A5BDFD" // Background color for Cancel button
                                textColor="#000" // Text color for Cancel button 
                            >Cancel</Button>
                            <Button
                                buttonColor="#EA4C4C" // Background color for Confirm button
                                textColor="#fff" // Text color for Confirm button 
                                onPress={handleLogout}
                                mode='elevated'
                            >Confirm</Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default ProfileScreen;

const styles = StyleSheet.create({
    formGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#444",
        marginBottom: 6,
    },
    textInput: {
        borderWidth: 0.5,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        fontSize: 15,
        backgroundColor: "#F8FAFC",
    },
    disabledInput: {
        backgroundColor: "#FBFBFB",
        color: "#999",
    },
    uploadBtn: {
        backgroundColor: "#ff6347",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    disabledUpload: {
        opacity: 0.5,
    },
    tableContainer: {
        marginTop: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        elevation: 2,
    },
    tableHeader: {
        fontSize: 18,
        fontWeight: "500",
        padding: 10,
        backgroundColor: "#DFDFDF",
        color: "#000",
        textAlign: "center",
    },
    tableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },
    evenRow: {
        backgroundColor: "#F8FAFC",
    },
    oddRow: {
        backgroundColor: "#F2F9FF",
    },
    tableLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },
    tableValue: {
        fontSize: 14,
        fontWeight: "400",
        color: "#555",
        textAlign: "left",
        alignItems: "flex-start"
    },
    buttonContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    fullButton: {
        flex: 1,
        marginHorizontal: 5,
    },
    button: {
        backgroundColor: '#ff6347',
    },
    tabContainer: {
        flexDirection: "row",
        alignItems: "center",
        color: "#fff",
        backgroundColor: "#132f56",
        // borderBottomWidth: 0.5,
        // borderBottomColor: "#ff6347",
        paddingHorizontal: 5,
        // marginTop: 8,
        marginBottom: 1,
        height: 50,
    },
    tab: {
        flex: 1, // Each tab takes equal space
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 13,
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    activeTab: {
        borderBottomColor: "#ff6347",
    },
    tabContent: {
        alignItems: "center",
        justifyContent: "center",
        gap: 4, // Adds space between icon and text
    },
    tabText: {
        color: "#fff",
        fontWeight: "600",
        marginTop: 2,
        fontSize: 13,
    },
    activeTabText: {
        color: "#ff6347",
    },
    content: {
        flex: 1,
        alignItems: "flex-start",
        width: width,
        backgroundColor: "#fff",
        padding: 10,
    },
    editSection: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        elevation: 2,
    },
    editHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    uploadButton: {
        backgroundColor: '#ff6347',
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    uploadText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    logoutContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#F8FAFC",
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRadius: 2,
    },
    logoutButton: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    logoutText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#FF2626",
        paddingVertical: 5,
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
        // alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 14,
        // textAlign: "center",
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
        marginTop: 15,
        justifyContent: "space-between",
        width: "100%",
        // backgroundColor: "#000",
    },
});
