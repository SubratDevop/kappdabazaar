import { Feather } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import { SaveFormat, useImageManipulator } from "expo-image-manipulator";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useProductStore } from "../../store/useProductStore";

const SearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [originalImageUri, setOriginalImageUri] = useState(null);
    const [compressedUri, setCompressedUri] = useState(null);

    const { searchByImage, searchedProds, isLoading } = useProductStore();

    const resetSearchState = () => {
        setSearchQuery("");
        setOriginalImageUri(null);
        setCompressedUri(null);
    };

    const handleSearch = (text) => setSearchQuery(text);

    const handleImage = async (pickerFn) => {
        const result = await pickerFn();
        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setOriginalImageUri(uri);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.searchContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={22} color="#111" />
                </TouchableOpacity>
                <TextInput
                    placeholder="Search fabrics..."
                    placeholderTextColor="#888"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity onPress={() => navigation.navigate('AdvancedSearch')}>
                    <Feather name="sliders" size={20} color="#222" />
                </TouchableOpacity>
                <Feather name="search" size={20} color="#222" />
            </View>

            {/* Hide options if compressed image exists */}
            {/* {!compressedUri && (
                <View style={styles.middleContainer}>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => handleImage(ImagePicker.launchCameraAsync)}
                    >
                        <Feather name="camera" size={24} color="#111" />
                        <Text style={styles.optionText}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() =>
                            handleImage(() =>
                                ImagePicker.launchImageLibraryAsync({
                                    mediaTypes: 'Images',
                                    allowsEditing: true,
                                    aspect: [4, 3],
                                    quality: 1,
                                })
                            )
                        }
                    >
                        <Feather name="upload" size={24} color="#111" />
                        <Text style={styles.optionText}>Upload from Device</Text>
                    </TouchableOpacity>
                </View>
            )} */}

            {originalImageUri && (
                <ImageCompressor
                    uri={originalImageUri}
                    onCompressed={(uri) => setCompressedUri(uri)}
                    searchByImage={searchByImage}
                />
            )}

            {compressedUri && (
                <View style={{ marginTop: 5, alignItems: "center" }}>
                    <Text>Results:</Text>
                    <Image source={{ uri: compressedUri }} style={{ width: 200, height: 200, borderRadius: 10 }} />
                </View>
            )}

            {!isLoading && compressedUri && searchedProds.length > 0 && (
                <ScrollView style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>Similar Products:</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {searchedProds.map((product, index) => (
                            <View key={index} style={{ width: '48%', marginBottom: 10 }}>
                                <Image
                                    source={{ uri: product.product_images[0] }}
                                    style={{ width: '100%', height: 150, borderRadius: 8 }}
                                    resizeMode="cover"
                                />
                                <Text style={{ marginTop: 5, textAlign: "center" }}>
                                    {product.product_name || "N/A"}
                                </Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}

            {!isLoading && searchedProds.length === 0 && compressedUri && (
                <View style={{ marginTop: 30, alignItems: "center" }}>
                    <Text style={{ fontSize: 16, color: "#666", marginBottom: 15 }}>No similar products found.</Text>
                    <TouchableOpacity
                        onPress={resetSearchState}
                        style={{
                            backgroundColor: "#eee",
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 6,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <Feather name="refresh-ccw" size={18} color="#333" />
                        <Text style={{ fontSize: 15, color: "#333" }}>Try another image</Text>
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

const ImageCompressor = ({ uri, onCompressed, searchByImage }) => {
    const context = useImageManipulator(uri);

    React.useEffect(() => {
        const compress = async () => {
            try {
                const originalInfo = await FileSystem.getInfoAsync(uri);

                context.resize({ width: 800 });
                const manipulatedImage = await context.renderAsync();
                const result = await manipulatedImage.saveAsync({
                    format: SaveFormat.JPEG,
                    compress: 0.6,
                });

                const compressedInfo = await FileSystem.getInfoAsync(result.uri);

                onCompressed(result.uri);
                await searchByImage(result.uri);
            } catch (error) {
                console.error("Compression failed:", error);
            }
        };

        compress();
    }, [uri]);

    return null;
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
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
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
