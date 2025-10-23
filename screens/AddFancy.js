import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Button, Divider, Text, TextInput } from 'react-native-paper';
import { themeInput } from '../constants/exports';
import { STORAGE_KEYS } from '../store/useAuthStore';
import { useCompanyStore } from '../store/useCompanyStore';
import { useProductStore } from '../store/useProductStore';
import getAsyncStorageFn from '../utils/constants';


const keyAttributesList = ["Material", "Pattern", "Color", "Texture", "Usage", "GSM", "Width"];

const AddFancy = () => {

    const [data, setData] = useState(null);
    const [fabric, setFabric] = useState({
        name: '',
        description: '',
        tags: '',
        hsn_code: "",
        tax_info: "",
        unit: 'meter',
        category: "",
        price: "",
        sub_category: "",
        is_featured: false,
        outOfStock: false,
        status: true,
        key_attributes: {},
        moqs: [],
        product_images: []
    });

    const { fetchCompanyDetails, } = useCompanyStore();
    const { addProductFn } = useProductStore();

    useEffect(() => {
        async function fetchDetails() {
            const data = await getAsyncStorageFn();
            const res_data = await fetchCompanyDetails(data?.user_id);
            if (res_data?.companyInfo !== null) {
                setData(res_data?.companyInfo);
            }
        }
        fetchDetails();
    }, [])
    const handleChange = (key, value) => {
        setFabric(prev => ({ ...prev, [key]: value }));
    };

    const handleImagePick = async () => {
        if (fabric.product_images.length >= 3) {
            alert('You can upload up to 3 images only.');
            return;
        }

        const options = {
            mediaTypes: "images",
            allowsEditing: false,
            aspect: [16, 9],
            quality: 1,
        };

        let pickerResult = await ImagePicker.launchImageLibraryAsync(options);

        if (!pickerResult.canceled) {
            setFabric(prev => ({
                ...prev,
                product_images: [...prev.product_images, pickerResult.assets[0].uri].slice(0, 3)
            }));
            // ✅ Get file info (including size in bytes)
            const fileInfo = await FileSystem.getInfoAsync(pickerResult.assets[0].uri);

            // Convert to KB or MB for logging
            const sizeKB = (fileInfo.size / 1024).toFixed(2);
            const sizeMB = (fileInfo.size / (1024 * 1024)).toFixed(2);
        }
    };

    const handleCameraClick = async () => {
        if (fabric.product_images.length >= 3) {
            alert('You can upload up to 3 images only.');
            return;
        }

        const options = {
            mediaTypes: "images",
            allowsEditing: false,
            aspect: [16, 9],
            quality: 1,
        };

        let cameraResult = await ImagePicker.launchCameraAsync(options);

        if (!cameraResult.canceled) {
            setFabric(prev => ({
                ...prev,
                product_images: [...prev.product_images, cameraResult.assets[0].uri].slice(0, 3)
            }));
        }
    };

    const updateKeyAttribute = (key, value) => {
        setFabric(prev => ({ ...prev, key_attributes: { ...prev.key_attributes, [key]: value } }));
    };

    const addKeyAttribute = () => {
        const available = keyAttributesList.filter(attr => !Object.keys(fabric.key_attributes).includes(attr));
        if (available.length > 0) {
            updateKeyAttribute(available[0], '');
        }
    };

    const removeKeyAttribute = (key) => {
        const updatedAttributes = { ...fabric.key_attributes };
        delete updatedAttributes[key];
        setFabric(prev => ({ ...prev, key_attributes: updatedAttributes }));
    };

    const addMOQ = () => {
        setFabric(prev => ({ ...prev, moqs: [...prev.moqs, { quantity: '', price: '' }] }));
    };

    const updateMOQ = (index, field, value) => {
        const updatedMOQs = [...fabric.moqs];
        updatedMOQs[index][field] = value;
        setFabric(prev => ({ ...prev, moqs: updatedMOQs }));
    };

    const removeMOQ = (index) => {
        const updatedMOQs = fabric.moqs.filter((_, i) => i !== index);
        setFabric(prev => ({ ...prev, moqs: updatedMOQs }));
    };

    // const handleSubmit = async () => {
    //     const formData = new FormData();

    //     formData.append('product_name', fabric.name);
    //     formData.append('description', fabric.description);
    //     formData.append('category', fabric.category);
    //     formData.append('sub_category', fabric.sub_category);
    //     formData.append('unit', fabric.unit);
    //     formData.append('status', fabric.status);

    //     formData.append('tags', JSON.stringify(fabric.tags));           // Assuming it's an array
    //     formData.append('hsn_code', String(fabric.hsn_code));           // In case it's a number
    //     formData.append('tax_info', JSON.stringify(fabric.tax_info));   // Assuming it's an object
    //     formData.append('is_featured', String(fabric.is_featured));     // Boolean to string
    //     formData.append('outOfStock', String(fabric.outOfStock));       // Boolean to string


    //     // Append key_attributes as JSON string
    //     formData.append('key_attributes', JSON.stringify(fabric.key_attributes));

    //     // Append moqs as JSON string
    //     formData.append('moqs', JSON.stringify(fabric.moqs));

    //     formData.append('company_id', String(data?.id));

    //     for (let i = 0; i < fabric.product_images.length; i++) {
    //         const image = fabric.product_images[i];
    //         formData.append('product_images', {
    //             uri: image || image.uri, // handle both object and string URI cases
    //             type: 'image/jpeg', // or dynamic type if available
    //             name: `${fabric.name}_image_${i}.jpg` // give each image a unique name
    //         });
    //     }

    //     try {
    //         const res = await addProductFn(formData);
    //     } catch (error) {
    //         console.error('Upload error:', error);
    //     }
    // };

    const handleSubmit = async () => {
        const company_id = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
        const formData = new FormData();

        formData.append('name', fabric.name);
        formData.append('description', fabric.description);
        formData.append('category', fabric.category);
        formData.append('price', fabric.price);
        formData.append('sub_category', fabric.sub_category);
        formData.append('unit', fabric.unit);
        formData.append('color', fabric.color);
        formData.append('status', String(fabric.status));
        formData.append('tags', JSON.stringify(fabric.tags));
        formData.append('hsn_code', String(fabric.hsn_code));
        formData.append('tax_info', JSON.stringify(fabric.tax_info));
        formData.append('is_featured', String(fabric.is_featured));
        formData.append('outOfStock', String(fabric.outOfStock));
        formData.append('key_attributes', JSON.stringify(fabric.key_attributes));
        formData.append('moqs', JSON.stringify(fabric.moqs));
        formData.append('company_id', String(company_id));

        fabric.product_images.forEach((image, i) => {
            formData.append('product_images', {
                uri: image || image.uri,
                // type: 'image/jpeg',
                type: 'image/jpeg',
                name: `image_${i}.jpg`,
            });
        });
        formData._parts.forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
          });

        try {
            const res = await addProductFn(formData);
            console.log("NAME  ::::::::::", fabric.key_attributes);

            if (res?.res_code == 1) {
                setFabric({
                    name: '',
                    description: '',
                    tags: '',
                    hsn_code: "",
                    tax_info: "",
                    unit: 'meter',
                    category: "",
                    sub_category: "",
                    price: 0,
                    is_featured: false,
                    outOfStock: false,
                    status: true,
                    key_attributes: {},
                    moqs: [],
                    product_images: []
                });
            }
        } catch (error) {
            console.error('Upload error:', error);
        }


    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled keyboardVerticalOffset={100} style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 15, color: "#ff6347" }}>Enter Product Details</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={handleImagePick} style={[styles.imagePicker, { flex: 1, marginRight: 5 }]}>
                        {/* <ImageIcon color={"#000"} size={30} strokeWidth={1.3} style={{ marginBottom: 5 }} /> */}
                        <Feather name="image" size={30} color="#000" style={{ marginBottom: 5 }} />
                        <Text style={styles.imageText}>Pick from Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCameraClick} style={[styles.imagePicker, { flex: 1, marginLeft: 5 }]}>
                        {/* <CameraIcon color={"#000"} size={30} strokeWidth={1.3} /> */}
                        <Feather name="camera" size={30} color="#000" style={{ marginBottom: 5 }} />
                        <Text style={styles.imageText}>Click Photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Show Selected Images */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 15 }}>
                    {fabric.product_images.map((imgUri, index) => (
                        <View key={index} style={{ position: 'relative' }}>
                            <Image source={{ uri: imgUri }} style={{ width: 100, height: 100, borderRadius: 8 }} />
                            <TouchableOpacity
                                onPress={() => {
                                    setFabric(prev => ({
                                        ...prev,
                                        product_images: prev.product_images.filter((_, idx) => idx !== index)
                                    }));
                                }}
                                style={{
                                    position: 'absolute',
                                    top: -5,
                                    right: -5,
                                    backgroundColor: 'red',
                                    borderRadius: 10,
                                    width: 20,
                                    height: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{ color: 'white', fontSize: 12 }}>×</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <TextInput label="Name" mode="outlined" value={fabric.name} onChangeText={(text) => handleChange('name', text)} style={styles.input} theme={themeInput} />
                <TextInput label="Description" mode="outlined" value={fabric.description} onChangeText={(text) => handleChange('description', text)} style={styles.input} multiline theme={themeInput} />

                <TextInput label="Category" mode="outlined" value={fabric.category} onChangeText={(text) => handleChange('category', text)} style={styles.input} theme={themeInput} placeholder='Cotton,Silk etc' />

                <TextInput
                    label="Price (₹)"
                    mode="outlined"
                    value={fabric.price}
                    onChangeText={(text) => handleChange('price', text)}
                    style={styles.halfInput}
                    keyboardType="numeric"
                    theme={themeInput}
                />
                <Divider style={{ marginBottom: 5, marginTop: 10, backgroundColor: "#000" }} />
                <Text style={{ fontSize: 14, fontWeight: "600", marginVertical: 6 }}>Key Attributes</Text>
                {Object.entries(fabric.key_attributes).map(([key, value], index) => (
                    <View key={index} style={styles.attributeRow}>
                        <View>
                            <Text style={styles.attributeLabel}>{key}</Text>
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                            <TextInput
                                mode="outlined"
                                value={value}
                                onChangeText={(text) => updateKeyAttribute(key, text)}
                                style={styles.attributeInput}
                                theme={themeInput}
                            />
                            <TouchableOpacity onPress={() => removeKeyAttribute(key)} style={styles.removeButton}>
                                <Text style={styles.removeText}>✖</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <Dropdown
                    data={keyAttributesList.filter(attr => !Object.keys(fabric.key_attributes).includes(attr)).map(attr => ({ label: attr, value: attr }))}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Attribute"
                    onChange={(item) => updateKeyAttribute(item.value, '')}
                    style={styles.dropdown}
                    disable={Object.keys(fabric.key_attributes).length >= keyAttributesList.length}
                />

                <Button mode="contained" onPress={addKeyAttribute} style={styles.addButton}>+ Add Attribute</Button>

                <Divider style={{ marginVertical: 10, backgroundColor: "#000" }} />
                <Text style={styles.sectionTitle}>MOQs</Text>
                {fabric?.moqs.map((moq, index) => (
                    <View key={index} style={styles.row}>
                        <TouchableOpacity onPress={() => removeMOQ(index)} style={styles.removeButton}>
                            <Text style={styles.removeText}>✖</Text>
                        </TouchableOpacity>
                        <TextInput
                            label="Quantity"
                            mode="outlined"
                            value={moq.quantity}
                            onChangeText={(text) => updateMOQ(index, 'quantity', text)}
                            style={styles.halfInput}
                            keyboardType="numeric"
                            theme={themeInput}
                        />
                        <TextInput
                            label="Price (₹)"
                            mode="outlined"
                            value={moq.price}
                            onChangeText={(text) => updateMOQ(index, 'price', text)}
                            style={styles.halfInput}
                            keyboardType="numeric"
                            theme={themeInput}
                        />
                    </View>
                ))}
                <Button mode="contained" onPress={addMOQ} style={styles.addButton}>+ Add MOQ</Button>
                <Divider style={{ marginVertical: 10, backgroundColor: "#000" }} />
                <TextInput label="HSN Code" mode="outlined" value={fabric.hsn_code} onChangeText={(text) => handleChange('hsn_code', text)} style={styles.input} theme={themeInput} />

                <TextInput label="Tax Info (in %)" mode="outlined" value={fabric.tax_info} onChangeText={(text) => handleChange('tax_info', text)} style={styles.input} theme={themeInput} />


                <View style={styles.buttonContainer}>
                    <Button mode="outlined" onPress={() => console.log('Cancelled')} textColor="red" style={styles.fullButton}>
                        Cancel
                    </Button>
                    <Button mode="elevated"
                        onPress={handleSubmit}
                        style={[styles.fullButton, styles.button]} textColor="#fff">
                        Save
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, flexGrow: 1, backgroundColor: "#f8f9fa" },

    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: "center" },
    imagePicker: { backgroundColor: '#e0e0e0', height: 120, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginBottom: 5 },
    input: { marginBottom: 15, backgroundColor: "#fff", borderRadius: 8 },
    dropdown: { borderRadius: 6, backgroundColor: 'white', marginBottom: 15, height: 50, paddingHorizontal: 14, borderWidth: 1, borderColor: "#343131" },
    row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
    halfInput: { flex: 1, backgroundColor: "#fff", borderRadius: 8 },
    addButton: { marginTop: 5, borderRadius: 8 },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10,
        marginTop: 30,
    },
    fullButton: {
        flex: 1,
    },
    button: {
        backgroundColor: '#ff6347',
    },
    attributeRow: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 12,
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        padding: 10
    },
    attributeLabel: {
        // flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#DE4463'
    },
    attributeInput: {
        // flex: 1,
        marginVertical: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        width: "85%",
    },
    removeButton: {
        backgroundColor: '#ff4d4f',
        padding: 6,
        borderRadius: 6,
        width: "10%",
        height: "50%",
        alignItems: "center"
    },
    removeText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    }

});

export default AddFancy;
