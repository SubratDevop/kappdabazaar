import { View, Text, ScrollView, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import WaitingApprovalScreen from "./WaitingApprovalScreen";
import { useAuthStore } from "../store/useAuthStore";
import { useIsFocused } from "@react-navigation/native";
import getAsyncStorageFn from "../utils/constants";
import useOrderStore from "../store/useOrderStore";
import { Feather } from "@expo/vector-icons";

const MyOrderScreen = ({ navigation }) => {
    const [selected, setSelected] = useState("All Orders");
    const { getApprovalStatus, userRole } = useAuthStore();
    const [show, setShow] = useState(null);
    const isFocused = useIsFocused();
    const { orders, fetchOrders, loading } = useOrderStore();

    const tabs = ["All Orders", "In Progress", "Delivered", "Cancelled"];

    useEffect(() => {
        async function fetchDetails() {
            const user = await getAsyncStorageFn();
            const res = await getApprovalStatus(user.user_id);
            setShow(res);
            if (!res) {
                await fetchOrders();
            }
        }
        if (isFocused) {
            fetchDetails();
        }
    }, [isFocused]);

    if (show === true && isFocused && userRole === "seller") {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <WaitingApprovalScreen />
        </View>
    }

    const filteredOrders = orders.filter(order => {
        if (selected === "All Orders") return true;
        if (selected === "In Progress") return ["pending", "processing", "dispatched"].includes(order.order_status);
        if (selected === "Delivered") return order.order_status === "delivered";
        if (selected === "Cancelled") return order.order_status === "cancelled";
        return true;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#FFA500';
            case 'processing': return '#1E90FF';
            case 'dispatched': return '#4CAF50';
            case 'delivered': return '#4CAF50';
            case 'cancelled': return '#FF0000';
            default: return '#666';
        }
    };

    const handleOrderPress = (order) => {
        navigation.navigate('OrderConfirmation', {
            orderId: order.id,
            product: order.product,
            selectedMoq: order.moq,
            quantity: order.quantity,
            selectedColor: order.color,
            orderNotes: order.notes,
            address: order.shipping_address,
            paymentMethod: order.payment_method,
            total: order.total_amount,
            payment: order.payment
        });
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Capsule Buttons */}
            <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, paddingHorizontal: 5 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {tabs.map((tab) => (
                        <Pressable
                            key={tab}
                            onPress={() => setSelected(tab)}
                            style={{
                                backgroundColor: selected === tab ? "#f28482" : "#f8f9fa",
                                paddingVertical: 8,
                                paddingHorizontal: 15,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: "#ddd",
                                marginHorizontal: 3,
                            }}
                        >
                            <Text style={{ color: selected === tab ? "#fff" : "#000", fontWeight: "600" }}>{tab}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Order Cards */}
            <ScrollView contentContainerStyle={[styles.orderList, { padding: 20 }]} showsVerticalScrollIndicator={false} alwaysBounceVertical>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text>Loading orders...</Text>
                    </View>
                ) : filteredOrders.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No orders found</Text>
                    </View>
                ) : (
                    filteredOrders.map((order) => (
                        <TouchableOpacity
                            key={order.id}
                            style={[
                                styles.orderCard,
                                { borderLeftColor: getStatusColor(order.order_status) }
                            ]}
                            onPress={() => handleOrderPress(order)}
                        >
                            <View style={styles.row}>
                                <Text style={styles.orderId}>Order #{order.id}</Text>
                                <Feather name="chevron-right" size={20} color="#132f56" />
                            </View>

                            <View style={styles.orderDetails}>
                                <Text style={styles.productName}>{order.product?.product_name}</Text>
                                <Text style={styles.quantity}>Quantity: {order.quantity} meters</Text>
                                <Text style={styles.price}>₹{order.total_amount}</Text>
                            </View>

                            <View style={styles.statusContainer}>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.order_status) }]}>
                                    <Text style={styles.statusText}>{order.order_status.toUpperCase()}</Text>
                                </View>
                                <Text style={styles.orderDate}>{new Date(order.created_at).toLocaleDateString()}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#132f56" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#132f56",
    },
    headerTitle: { color: "#fff", fontSize: 22, fontWeight: "700" },
    profileIcon: { width: 35, height: 35, borderRadius: 20, backgroundColor: "#fff" },

    orderList: { padding: 20 },
    orderCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    row: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 10,
    },
    orderId: { 
        fontSize: 16, 
        fontWeight: "700", 
        color: "#132f56" 
    },
    orderDetails: {
        marginBottom: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    quantity: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: "600",
        color: "#f28482",
    },
    statusContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    orderDate: {
        fontSize: 12,
        color: "#666",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
    },
});

export default MyOrderScreen;
