import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";

const SearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const inputRef = useRef(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    }, []);

    useEffect(() => {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: isFocused ? "none" : "flex" } });
    }, [isFocused]);

    const handleSearch = (text) => {
        setSearchQuery(text);
        // Add search logic here
    };

    const openCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            // mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
            presentationStyle: "fullScreen", //
        });


        if (!result.canceled) {
        }
    };

    const pickImageFromGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    {/* <ArrowLeft color="#111" size={22} /> */}
                    <Feather name="arrow-left" size={22} color="#111" />
                </TouchableOpacity>
                <TextInput
                    ref={inputRef}
                    placeholder="Search fabrics..."
                    placeholderTextColor="#888"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                {/* <SearchIcon color="#222" size={20} /> */}
                <Feather name="search" size={20} color="#222" />
            </View>

            {/* Middle Section - Take Photo & Upload */}
            <View style={styles.middleContainer}>
                <TouchableOpacity style={styles.optionButton} onPress={openCamera}>
                    {/* <CameraIcon color="#111" size={24} /> */}
                    <Feather name="camera" size={24} color="#111" />
                    <Text style={styles.optionText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={pickImageFromGallery}>
                    {/* <UploadIcon color="#111" size={24} /> */}
                    <Feather name="upload" size={24} color="#111" />
                    <Text style={styles.optionText}>Upload from Device</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = {
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f1f1f1",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        height: 40,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: "#111",
    },
    middleContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 40,
        gap: 15,
    },
    optionButton: {
        backgroundColor: "#EFEFEF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        flexDirection: "column",
        gap: 10,
    },
    optionText: {
        color: "#111",
        fontSize: 16,
        fontWeight: "500",
    },
};

export default SearchScreen;
