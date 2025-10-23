import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Chip, IconButton, Menu, Searchbar, TextInput } from 'react-native-paper';
import { useAuthStore } from '../../store/useAuthStore';
import useOrderStore from '../../store/useOrderStore';

const OrderManagementScreen = ({ navigation }) => {
    const { user } = useAuthStore();
    const { orders, fetchOrders, updateOrderStatus, loading, error } = useOrderStore();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [lrNumber, setLrNumber] = useState('');
    const [vehicleDetails, setVehicleDetails] = useState('');
    const [PROCESSINGNotes, setProcessingNotes] = useState('');
    const [estimatedCompletionDate, setEstimatedCompletionDate] = useState('');
    const [dispatchModalVisible, setDispatchModalVisible] = useState(false);
    const [PROCESSINGModalVisible, setProcessingModalVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState({});
    const [uploadedFile, setUploadedFile] = useState(null);

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Dummy data for testing
    // const dummyOrders = [
    //     {
    //         id: 'ORD001',
    //         orderStatus: 'PENDING',
    //         product: {
    //             product_name: 'Cotton Fabric - Blue Denim'
    //         },
    //         quantity: 50,
    //         total_amount: 2500,
    //         lr_number: null
    //     },
    // ];

    useEffect(() => {
        // Use dummy data instead of fetching from store for testing

        fetchOrders();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {

            await updateOrderStatus(orderId, status, status === 'DISPATCHED' ? lrNumber : null, uploadedFile);


            Alert.alert('Success', 'Order status updated successfully',
                [
                    {
                        text: "OK",
                        onPress: () => {
                            fetchOrders(); // 'Refresh orders
                            setProcessingNotes('');
                            setEstimatedCompletionDate('');
                            setSelectedOrder(null);
                            setLrNumber('');
                            setVehicleDetails('');
                            setUploadedFile(null);
                            setProcessingModalVisible(false);
                            setDispatchModalVisible(false);
                        },
                    },
                ],
                { cancelable: false }
            );

        } catch (error) {
            console.error('Error updating order status:', error);
            Alert.alert('Error', 'Failed to update order status');
        }
    };

    const handleDispatchOrder = (order) => {
        setLrNumber('');
        setVehicleDetails('');
        setUploadedFile(null);
        setSelectedOrder(order);
        setDispatchModalVisible(true);
    };

    const handleProcessOrder = (order) => {
        setProcessingNotes('');
        setEstimatedCompletionDate('');
        setSelectedOrder(order);
        setProcessingModalVisible(true);
    };

    const handleConfirmDispatch = () => {
        if (!lrNumber.trim()) {
            Alert.alert('Error', 'Please enter LR Number');
            return;
        }
        if (!vehicleDetails.trim()) {
            Alert.alert('Error', 'Please enter Vehicle Details');
            return;
        }
        handleUpdateStatus(selectedOrder.id, 'DISPATCHED', uploadedFile);
    };

    const handleConfirmProcessing = () => {
        if (!PROCESSINGNotes.trim()) {
            Alert.alert('Error', 'Please enter PROCESSING notes');
            return;
        }
        if (!estimatedCompletionDate.trim()) {
            Alert.alert('Error', 'Please enter estimated completion date');
            return;
        }
        handleUpdateStatus(selectedOrder.id, 'PROCESSING'); //! 20
    };

    const handleFileUpload = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            if (result.type === 'success') {
                setUploadedFile(result.assets[0].uri);
                Alert.alert('Success', 'File uploaded successfully');
            }
        } catch (error) {
            console.error('Error picking document:', error);
            Alert.alert('Error', 'Failed to upload file');
        }
    };

    const handleCancelOrder = (orderId) => {
        Alert.alert(
            'Cancel Order',
            'Are you sure you want to cancel this order?',
            [
                { text: 'No', style: 'cancel' },
                { text: 'Yes', onPress: () => handleUpdateStatus(orderId, 'CANCELLED') }
            ]
        );
    };

    const handleViewOrderDetails = (order) => {
        // Navigate to order details screen
        navigation.navigate('OrderDetails', { order });
    };

    const handleContactCustomer = (order) => {
        // Navigate to chat or contact screen
        navigation.navigate('Chat', { orderId: order.id });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return '#F4C430';
            case 'PROCESSING': return '#1E90FF';
            case 'DISPATCHED': return '#FF7F50';
            case 'DELIVERED': return '#2ECC71';
            case 'CANCELLED': return '#DC143C';
            default: return '#666';
        }
    };

    // Filter orders based on search and status
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = selectedStatus === 'all' || order.orderStatus === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const renderOrderCard = (order) => (
        <Card key={order.id} style={styles.orderCard}>
            <Card.Content>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>{order.orderNumber}</Text>
                    <View style={styles.headerActions}>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.orderStatus) }]}>
                            <Text style={styles.statusText}>{order.orderStatus.toUpperCase()}</Text>
                        </View>
                        <Menu
                            visible={menuVisible[order.id] || false}
                            onDismiss={() => setMenuVisible({ ...menuVisible, [order.id]: false })}
                            anchor={
                                <IconButton
                                    icon="dots-vertical"
                                    onPress={() => setMenuVisible({ ...menuVisible, [order.id]: true })}
                                />
                            }
                        >
                            <Menu.Item
                                onPress={() => {
                                    setMenuVisible({ ...menuVisible, [order.id]: false });
                                    handleViewOrderDetails(order);
                                }}
                                title="View Details"
                                leadingIcon="eye"
                            />
                            <Menu.Item
                                onPress={() => {
                                    setMenuVisible({ ...menuVisible, [order.id]: false });
                                    handleContactCustomer(order);
                                }}
                                title="Contact Customer"
                                leadingIcon="message"
                            />
                            {order.orderStatus === 'PENDING' && (
                                <Menu.Item
                                    onPress={() => {
                                        setMenuVisible({ ...menuVisible, [order.id]: false });
                                        handleCancelOrder(order.id);
                                    }}
                                    title="Cancel Order"
                                    leadingIcon="close"
                                />
                            )}
                        </Menu>
                    </View>
                </View>

                <View style={styles.orderDetails}>
                    <Text style={styles.productName}>{order.product.name}</Text>
                    <Text style={styles.quantity}>Quantity: {order.quantity} meters</Text>
                    <Text style={styles.amount}>Buyer: {order.user.name}</Text>
                    <Text style={styles.amount}>Total: ₹{order.finalAmount}</Text>
                </View>

                {order.orderStatus === 'PENDING' && (
                    <View style={styles.actionButtons}>
                        {/* <Button
                            mode="contained"
                            onPress={() => handleCancelOrder(order.id)}
                            style={[styles.cancelOrderButton, styles.modalButton]}
                        >
                            Cancel
                        </Button> */}
                        <Button
                            mode="contained"
                            onPress={() => handleProcessOrder(order)}
                            style={[styles.actionButton, styles.modalButton]}
                        >
                            Process Order
                        </Button>
                    </View>
                )}

                {order.orderStatus === 'PROCESSING' && (
                    <View style={[styles.procesButtons]}>
                        <Button
                            mode="contained"
                            onPress={() => handleDispatchOrder(order)}
                            style={styles.actionButton}
                        >
                            Dispatch Order
                        </Button>
                    </View>
                )}

                {order.lr_number && (
                    <View style={styles.lrInfo}>
                        <Text style={styles.lrLabel}>LR Number:</Text>
                        <Text style={styles.lrValue}>{order.lr_number}</Text>
                    </View>
                )}
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            {/* Search and Filter Section */}
            <View style={styles.searchFilterSection}>
                <Searchbar
                    placeholder="Search orders by product name or order ID"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    iconColor="#666"
                    inputStyle={{ fontSize: 15 }}
                />

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScrollView}
                    contentContainerStyle={styles.filterContainer}
                >
                    <Chip
                        selected={selectedStatus === 'all'}
                        onPress={() => setSelectedStatus('all')}
                        style={styles.filterChip}
                        textStyle={styles.filterChipText}
                    >
                        All Orders
                    </Chip>
                    <Chip
                        selected={selectedStatus === 'PENDING'}
                        onPress={() => setSelectedStatus('PENDING')}
                        style={[styles.filterChip, { backgroundColor: selectedStatus === 'PENDING' ? '#F4C430' : '#f0f0f0' }]}
                        textStyle={[styles.filterChipText, { color: selectedStatus === 'PENDING' ? '#fff' : '#333' }]}
                    >
                        Pending
                    </Chip>
                    <Chip
                        selected={selectedStatus === 'PROCESSING'}
                        onPress={() => setSelectedStatus('PROCESSING')}
                        style={[styles.filterChip, { backgroundColor: selectedStatus === 'PROCESSING' ? '#1E90FF' : '#f0f0f0' }]}
                        textStyle={[styles.filterChipText, { color: selectedStatus === 'PROCESSING' ? '#fff' : '#333' }]}
                    >
                        Processing
                    </Chip>
                    <Chip
                        selected={selectedStatus === 'DISPATCHED'}
                        onPress={() => setSelectedStatus('DISPATCHED')}
                        style={[styles.filterChip, { backgroundColor: selectedStatus === 'DISPATCHED' ? '#FF7F50' : '#f0f0f0' }]}
                        textStyle={[styles.filterChipText, { color: selectedStatus === 'DISPATCHED' ? '#fff' : '#333' }]}
                    >
                        Dispatched
                    </Chip>
                    <Chip
                        selected={selectedStatus === 'DELIVERED'}
                        onPress={() => setSelectedStatus('DELIVERED')}
                        style={[styles.filterChip, { backgroundColor: selectedStatus === 'DELIVERED' ? '#2ECC71' : '#f0f0f0' }]}
                        textStyle={[styles.filterChipText, { color: selectedStatus === 'DELIVERED' ? '#fff' : '#333' }]}
                    >
                        Delivered
                    </Chip>
                    <Chip
                        selected={selectedStatus === 'CANCELLED'}
                        onPress={() => setSelectedStatus('CANCELLED')}
                        style={[styles.filterChip, { backgroundColor: selectedStatus === 'CANCELLED' ? '#DC143C' : '#f0f0f0' }]}
                        textStyle={[styles.filterChipText, { color: selectedStatus === 'CANCELLED' ? '#fff' : '#333' }]}
                    >
                        Cancelled
                    </Chip>
                </ScrollView>
           
            </View>

            <ScrollView style={styles.scrollView}>
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(renderOrderCard)
                ) : (
                    <View style={styles.noOrdersContainer}>
                        <Text style={styles.noOrdersText}>No orders found</Text>
                        <Text style={styles.noOrdersSubtext}>
                            Try adjusting your search or filter criteria
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Dispatch Modal */}
            <Modal
                visible={dispatchModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setDispatchModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Dispatch Order</Text>
                            <IconButton
                                icon="close"
                                onPress={() => setDispatchModalVisible(false)}
                            />
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <TextInput
                                label="LR Number *"
                                value={lrNumber}
                                onChangeText={setLrNumber}
                                style={styles.modalInput}
                                mode="outlined"
                            />

                            <TextInput
                                label="Vehicle Details *"
                                value={vehicleDetails}
                                onChangeText={setVehicleDetails}
                                style={styles.modalInput}
                                mode="outlined"
                                placeholder="e.g., Truck No. MH12AB1234, Driver: John Doe"
                            />

                            <View style={styles.fileUploadSection}>
                                <Text style={styles.fileUploadLabel}>Upload LR Document</Text>
                                <Button
                                    mode="outlined"
                                    onPress={handleFileUpload}
                                    icon="upload"
                                    style={styles.uploadButton}
                                >
                                    Choose File
                                </Button>
                                {uploadedFile && (
                                    <Text style={styles.fileName}>
                                        ✓ {uploadedFile.name}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.modalActions}>
                                <Button
                                    mode="outlined"
                                    onPress={() => setDispatchModalVisible(false)}
                                    style={[styles.modalButton, styles.cancelButton]}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    mode="contained"
                                    onPress={handleConfirmDispatch}
                                    style={[styles.modalButton, styles.confirmButton]}
                                    disabled={!lrNumber.trim() || !vehicleDetails.trim()}
                                >
                                    Confirm Dispatch
                                </Button>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Processing Modal */}
            <Modal
                visible={PROCESSINGModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setProcessingModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Process Order</Text>
                            <IconButton
                                icon="close"
                                onPress={() => setProcessingModalVisible(false)}
                            />
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <TextInput
                                label="Processing Notes *"
                                value={PROCESSINGNotes}
                                onChangeText={setProcessingNotes}
                                style={styles.modalInput}
                                mode="outlined"
                                multiline
                                numberOfLines={3}
                                placeholder="Enter details about the PROCESSING steps, quality checks, etc."
                            />

                            <TextInput
                                label="Estimated Completion Date *"
                                value={estimatedCompletionDate}
                                onChangeText={setEstimatedCompletionDate}
                                style={styles.modalInput}
                                mode="outlined"
                                placeholder="e.g., 15 Dec 2024"
                            />

                            <View style={styles.modalActions}>
                                <Button
                                    mode="outlined"
                                    onPress={() => setProcessingModalVisible(false)}
                                    style={[styles.modalButton, styles.cancelButton]}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    mode="contained"
                                    onPress={handleConfirmProcessing}
                                    style={[styles.modalButton, styles.confirmButton]}
                                    disabled={!PROCESSINGNotes.trim() || !estimatedCompletionDate.trim()}
                                >
                                    Start Processing
                                </Button>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchFilterSection: {
        paddingHorizontal: 10,
        // paddingTop: 5,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    searchBar: {
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    filterScrollView: {
        flexGrow: 0,
        paddingVertical: 10,
    },
    filterContainer: {
        paddingRight: 16,
    },
    filterChip: {
        marginRight: 8,
        borderRadius: 20,
    },
    filterChipText: {
        fontSize: 12,
        fontWeight: '500',
    },
    scrollView: {
        padding: 10,
    },
    noOrdersContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    noOrdersText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    noOrdersSubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    orderCard: {
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 0.5,
        backgroundColor: '#fff',
        borderColor: '#e0e0e0',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginBottom: 5,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#fff',
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
    },
    statusText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    orderDetails: {
        // marginBottom: 5,
    },
    productName: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    quantity: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    amount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 5,
        backgroundColor: '#fff',
    },
    procesButtons: {

        // gap: 12,
        marginTop: 5,
        backgroundColor: '#fff',
    },
    actionButton: {
        marginTop: 8,
    },
    lrInfo: {
        marginTop: 5,
        padding: 8,
        backgroundColor: '#f8f9fd',
        borderRadius: 8,
    },
    lrLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    lrValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: '90%',
        maxHeight: '80%',
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    modalBody: {
        padding: 16,
    },
    modalInput: {
        marginBottom: 16,
    },
    fileUploadSection: {
        marginBottom: 24,
    },
    fileUploadLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    uploadButton: {
        marginBottom: 8,
    },
    fileName: {
        fontSize: 14,
        color: '#4CAF50',
        fontStyle: 'italic',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        marginTop: 8
    },
    cancelOrderButton: {
        borderColor: '#666',
        marginTop: 8,
        backgroundColor: '#DC143C',
    },
    cancelButton: {
        borderColor: '#666',
        marginTop: 8,
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
    },
});

export default OrderManagementScreen; 