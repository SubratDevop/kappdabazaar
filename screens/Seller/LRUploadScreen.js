import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Card, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import EmptyState from '../../components/EmptyState';
import { API_BASE } from '../../constants/exports';

const LRUploadScreen = ({ navigation, route }) => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [lrNumber, setLrNumber] = useState('');
    const [lrDocument, setLrDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { authInfo } = useAuthStore();

    useEffect(() => {
        fetchConfirmedOrders();
    }, []);

    const fetchConfirmedOrders = async () => {
        try {
            setLoading(true);
            const token = authInfo?.token;
            const response = await axios.get(`${API_BASE}/orders/seller/confirmed`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            Alert.alert('Error', 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                allowsMultipleSelection: false,
            });

            if (!result.canceled && result.assets[0]) {
                const file = result.assets[0];
                if (validateAndSetDocument(file)) {
                    Alert.alert('Success', 'Document selected successfully!');
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant camera permissions to take photos');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const file = result.assets[0];
                if (validateAndSetDocument(file)) {
                    Alert.alert('Success', 'Photo captured successfully!');
                }
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

    const showDocumentPicker = () => {
        Alert.alert(
            'Upload LR Document',
            'Choose how you want to upload the LR document. For PDF documents, please take a clear photo of the document.',
            [
                { 
                    text: 'Take Photo', 
                    onPress: takePhoto,
                    style: 'default'
                },
                { 
                    text: 'Choose from Gallery', 
                    onPress: pickImage,
                    style: 'default'
                },
                { 
                    text: 'Cancel', 
                    style: 'cancel' 
                }
            ],
            { cancelable: true }
        );
    };

    const validateAndSetDocument = (file) => {
        // Validate file size (5MB limit)
        if (file.fileSize && file.fileSize > 5 * 1024 * 1024) {
            Alert.alert('Error', 'File size should be less than 5MB');
            return false;
        }

        // Set the document
        setLrDocument({
            uri: file.uri,
            name: file.fileName || `lr_${Date.now()}.jpg`,
            type: file.type || 'image/jpeg',
            size: file.fileSize || 0
        });

        return true;
    };

    const uploadLR = async () => {
        if (!selectedOrder) {
            Alert.alert('Error', 'Please select an order');
            return;
        }

        if (!lrNumber.trim()) {
            Alert.alert('Error', 'Please enter LR number');
            return;
        }

        if (!lrDocument) {
            Alert.alert('Error', 'Please upload LR document');
            return;
        }

        try {
            setUploading(true);
            const token = authInfo?.token;
            
            const formData = new FormData();
            formData.append('lrNumber', lrNumber.trim());
            formData.append('lrDocument', {
                uri: lrDocument.uri,
                type: lrDocument.type || 'application/octet-stream',
                name: lrDocument.name || 'lr_document'
            });

            const response = await axios.post(
                `${API_BASE}/orders/${selectedOrder.id}/dispatch`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            Alert.alert(
                'Success',
                'LR uploaded successfully! Order has been marked as dispatched.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setSelectedOrder(null);
                            setLrNumber('');
                            setLrDocument(null);
                            fetchConfirmedOrders();
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Error uploading LR:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to upload LR');
        } finally {
            setUploading(false);
        }
    };

    const renderOrderCard = (order) => (
        <Card 
            key={order.id} 
            style={[
                styles.orderCard,
                selectedOrder?.id === order.id && styles.selectedOrderCard
            ]}
        >
            <TouchableOpacity onPress={() => setSelectedOrder(order)}>
                <Card.Content>
                    <View style={styles.orderHeader}>
                        <Text style={styles.orderId}>Order #{order.id}</Text>
                        <View style={styles.orderDate}>
                            <Text style={styles.dateText}>
                                {new Date(order.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={styles.orderDetails}>
                        <Text style={styles.productName} numberOfLines={2}>
                            {order.productName || 'Product Name'}
                        </Text>
                        <Text style={styles.customerName}>
                            Customer: {order.customerName || 'N/A'}
                        </Text>
                        <Text style={styles.orderAmount}>
                            Amount: ₹{order.totalAmount?.toFixed(2)}
                        </Text>
                        <Text style={styles.quantity}>
                            Quantity: {order.quantity} meters
                        </Text>
                    </View>

                    {selectedOrder?.id === order.id && (
                        <View style={styles.selectedIndicator}>
                            <MaterialIcons name="check-circle" size={20} color="#10B981" />
                            <Text style={styles.selectedText}>Selected for dispatch</Text>
                        </View>
                    )}
                </Card.Content>
            </TouchableOpacity>
        </Card>
    );

    const renderLRForm = () => {
        if (!selectedOrder) return null;

        return (
            <Card style={styles.formCard}>
                <Card.Content>
                    <Text style={styles.formTitle}>Upload LR for Order #{selectedOrder.id}</Text>
                    
                    <TextInput
                        label="LR Number *"
                        value={lrNumber}
                        onChangeText={setLrNumber}
                        mode="outlined"
                        style={styles.input}
                        placeholder="Enter Lorry Receipt Number"
                    />

                    <View style={styles.documentSection}>
                        <Text style={styles.documentLabel}>LR Document *</Text>
                        
                        {lrDocument ? (
                            <View style={styles.documentPreview}>
                                {lrDocument.type?.startsWith('image/') ? (
                                    <Image source={{ uri: lrDocument.uri }} style={styles.imagePreview} />
                                ) : (
                                    <View style={styles.filePreview}>
                                        <MaterialIcons name="description" size={40} color="#132f56" />
                                    </View>
                                )}
                                <View style={styles.documentInfo}>
                                    <Text style={styles.documentName} numberOfLines={1}>
                                        {lrDocument.name}
                                    </Text>
                                    <Text style={styles.documentSize}>
                                        {(lrDocument.size / 1024 / 1024).toFixed(2)} MB
                                    </Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.removeButton}
                                    onPress={() => setLrDocument(null)}
                                >
                                    <MaterialIcons name="close" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity 
                                style={styles.uploadButton}
                                onPress={showDocumentPicker}
                            >
                                <MaterialIcons name="cloud-upload" size={32} color="#132f56" />
                                <Text style={styles.uploadText}>Upload LR Document</Text>
                                <Text style={styles.uploadSubtext}>
                                    PDF, Image, or Word document (Max 5MB)
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.formActions}>
                        <Button
                            mode="outlined"
                            onPress={() => {
                                setSelectedOrder(null);
                                setLrNumber('');
                                setLrDocument(null);
                            }}
                            style={styles.cancelButton}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            onPress={uploadLR}
                            loading={uploading}
                            disabled={uploading || !lrNumber.trim() || !lrDocument}
                            style={styles.uploadLRButton}
                            buttonColor="#132f56"
                        >
                            {uploading ? 'Uploading...' : 'Dispatch Order'}
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchQuery) ||
        order.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} size="large" color="#132f56" />
                <Text style={styles.loadingText}>Loading confirmed orders...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#132f56" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Upload LR</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {orders.length === 0 ? (
                    <EmptyState
                        type="orders"
                        title="No Orders to Dispatch"
                        subtitle="You don't have any confirmed orders ready for dispatch"
                        actionText="View All Orders"
                        onActionPress={() => navigation.navigate('OrderManagementScreen')}
                    />
                ) : (
                    <>
                        <View style={styles.searchSection}>
                            <TextInput
                                label="Search Orders"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                mode="outlined"
                                style={styles.searchInput}
                                left={<TextInput.Icon icon="magnify" />}
                                placeholder="Search by order ID, product, or customer"
                            />
                        </View>

                        <Text style={styles.sectionTitle}>
                            Confirmed Orders ({filteredOrders.length})
                        </Text>
                        <Text style={styles.sectionSubtitle}>
                            Select an order to upload LR and dispatch
                        </Text>

                        {filteredOrders.map(renderOrderCard)}

                        {renderLRForm()}
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#132f56',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    searchSection: {
        marginBottom: 16,
    },
    searchInput: {
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    orderCard: {
        marginBottom: 12,
        elevation: 2,
    },
    selectedOrderCard: {
        borderWidth: 2,
        borderColor: '#10B981',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    orderDate: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    dateText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    orderDetails: {
        gap: 4,
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    customerName: {
        fontSize: 13,
        color: '#6B7280',
    },
    orderAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#132f56',
    },
    quantity: {
        fontSize: 13,
        color: '#6B7280',
    },
    selectedIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    selectedText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#10B981',
        fontWeight: '600',
    },
    formCard: {
        marginTop: 16,
        elevation: 3,
    },
    formTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 16,
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    documentSection: {
        marginBottom: 24,
    },
    documentLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 12,
    },
    uploadButton: {
        borderWidth: 2,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 24,
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    uploadText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#132f56',
        marginTop: 8,
    },
    uploadSubtext: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
        textAlign: 'center',
    },
    documentPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    imagePreview: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    filePreview: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    documentInfo: {
        flex: 1,
        marginLeft: 12,
    },
    documentName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    documentSize: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    removeButton: {
        padding: 8,
    },
    formActions: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
    },
    uploadLRButton: {
        flex: 2,
    },
});

export default LRUploadScreen; 