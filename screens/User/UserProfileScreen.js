import { Feather, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Card, Divider } from 'react-native-paper';
import { API_BASE } from '../../constants/exports';
import { width } from '../../constants/helpers';
import { STORAGE_KEYS, useAuthStore } from '../../store/useAuthStore';
import getAsyncStorageFn from '../../utils/constants';

const UserProfileScreen = ({ navigation }) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [orders, setOrders] = useState("");
    const [orderAmount, setOrderAmount] = useState("");
    const [customerSupprtModalVisible, setcustomerSupprtModalVisible] = useState(false);

    const [userStats, setUserStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        savedItems: 0,
        recentOrders: []
    });
    const { clearStorage, authInfo } = useAuthStore();

    const handleLogout = () => {
        setIsModalVisible(false);
        clearStorage();
    };
    useEffect(() => {

        const fetchUserInfo = async () => {

            try {
                const userInfo = await getAsyncStorageFn();

                if (userInfo) {
                    setUserInfo(userInfo);
                    fetchUserStats();
                }
            } catch (error) {
                console.error("Error fetching company info:", error);
            }
        };
        const fetchOrders = async () => {
            try {
                const total = await AsyncStorage.getItem(STORAGE_KEYS.TOTAL_ORDERS);
                const amnt = await AsyncStorage.getItem(STORAGE_KEYS.TOTAL_SPENT);
                setOrders(total);
                setOrderAmount(amnt);
            } catch (error) {
                console.error("Error fetching order info :", error);
            }
        };
        fetchUserInfo();
        fetchOrders();
    }, []);


    const formatIndianCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };
    const fetchUserStats = async () => {
        try {
            const token = authInfo?.token;
            const response = await axios.get(`${API_BASE}/user/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserStats(response.data);
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
    };

    const menuItems = [
        {
            title: "My Orders",
            icon: <Feather name="package" size={28} color="#fff" />,
            path: "OrdersScreen",
            // subtitle: `${userStats.totalOrders} orders`
        },
        {
            title: "Saved Items",
            icon: <Feather name="bookmark" size={28} color="#fff" />,
            path: "SavedScreen",
            // subtitle: `${userStats.savedItems} items`
        },
        {
            title: "Payment History",
            icon: <MaterialIcons name="payment" size={28} color="#fff" />,
            path: "PaymentHistoryScreen",
            // subtitle: "View transactions"
        },
        // {
        //     title: "Order History",
        //     icon: <MaterialIcons name="history" size={28} color="#fff" />,
        //     path: "OrderHistoryScreen",
        //     // subtitle: "Past purchases"
        // },
        // { 
        //     title: "App Data", 
        //     icon: <MaterialIcons name="data-usage" size={28} color="#fff" />, 
        //     path: "AppDataScreen",
        //     subtitle: "Your app usage"
        // },
        {
            title: "Support123",
            icon: <MaterialIcons name="support-agent" size={28} color="#fff" />,
            path: "SupportScreen",
            // subtitle: "Get help"
        }
    ];
    // Function to open phone dialer
    const handleCall = () => {
        Linking.openURL("tel:+919930196361"); // replace with your number
    };

    // Function to open Gmail
    const handleMail = () => {
        Linking.openURL("mailto:kapdabazaar1989@gmail.com");
    };


    const renderUserStats = () => (
        <Card style={styles.statsCard}>
            <Card.Content>
                <Text style={styles.statsTitle}>Your Activity</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <MaterialIcons name="shopping-bag" size={24} color="#132f56" />
                        <Text style={styles.statValue}>{orders}</Text>
                        <Text style={styles.statLabel}>Total Orders</Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialIcons name="currency-rupee" size={24} color="#132f56" />
                        <Text style={styles.statValue}>₹{formatIndianCurrency(orderAmount) || '0'}</Text>
                        <Text style={styles.statLabel}>Total Spent</Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialIcons name="bookmark" size={24} color="#132f56" />
                        <Text style={styles.statValue}>{userStats.savedItems}</Text>
                        <Text style={styles.statLabel}>Saved Items</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    const renderRecentOrders = () => {
        if (!userStats.recentOrders || userStats.recentOrders.length === 0) return null;

        return (
            <Card style={styles.recentCard}>
                <Card.Content>
                    <View style={styles.recentHeader}>
                        <Text style={styles.recentTitle}>Recent Orders</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('OrdersScreen')}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    {userStats.recentOrders.slice(0, 3).map((order, index) => (
                        <View key={order.id} style={styles.orderItem}>
                            <View style={styles.orderInfo}>
                                <Text style={styles.orderNumber}>Order #{order.id}</Text>
                                <Text style={styles.orderDate}>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </Text>
                            </View>
                            <View style={styles.orderStatus}>
                                <Text style={[styles.statusText, {
                                    color: order.status === 'DELIVERED' ? '#10B981' :
                                        order.status === 'SHIPPED' ? '#3B82F6' : '#F59E0B'
                                }]}>
                                    {order.status}
                                </Text>
                                <Text style={styles.orderAmount}>₹{order.totalAmount}</Text>
                            </View>
                        </View>
                    ))}
                </Card.Content>
            </Card>
        );
    };



    return (
        <ScrollView style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 5 }}>
            {/* User Profile Header */}
            <View style={styles.profileHeader}>
                <Feather name="user" size={40} color="#969696" />
                <View style={{ paddingLeft: 15 }}>
                    <Text style={{ fontSize: 21, fontWeight: "500" }}>{userInfo?.name}</Text>
                    <View>
                        <Text style={{ fontSize: 12 }}>{userInfo?.phone_number}</Text>
                        <Text style={{ fontSize: 12 }}>{userInfo?.email}</Text>
                        <Text style={{ fontSize: 12, color: '#3B82F6', fontWeight: '500' }}>Customer Account</Text>
                    </View>
                </View>
            </View>

            {/* User Stats */}
            {renderUserStats()}

            {/* Recent Orders */}
            {renderRecentOrders()}

            {/* // render support modal */}
            <Modal
                transparent={true}
                visible={customerSupprtModalVisible}
                animationType="slide"
                onRequestClose={() => setcustomerSupprtModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setcustomerSupprtModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        {/* Prevent closing when tapping inside */}
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContainer}>
                                {/* Close "X" icon */}
                                <TouchableOpacity
                                    onPress={() => setcustomerSupprtModalVisible(false)}
                                    style={{ position: "absolute", top: 10, right: 10 }}
                                >
                                    <MaterialIcons name="close" size={28} color="red" />
                                </TouchableOpacity>

                                <Text style={styles.modalTitle}>Customer Support</Text>

                                <View style={styles.iconRow}>
                                    <TouchableOpacity onPress={handleCall} style={styles.iconButton}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <MaterialIcons name="call" size={25} color="green" />
                                            <Text style={{ marginLeft: 10 }}>+91 9930196361</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={handleMail} style={styles.iconButton}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <MaterialIcons name="email" size={25} color="red" />
                                            <Text style={{ marginLeft: 10 }}>kapdabazaar1989@gmail.com</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Menu Items */}
            <Text style={{ fontWeight: "500", marginVertical: 5, fontSize: 18 }}>Quick Access</Text>
            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <View style={styles.menuItemContainer} key={index}>
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => {
                                if (index === 0) {
                                    navigation.navigate(`${item.path}`);
                                }
                                if (index === 2) {
                                    navigation.navigate(`${item.path}`);
                                }
                                if (index === 3) {
                                    setcustomerSupprtModalVisible(true);
                                }   // navigation.navigate(`${item.path}`);
                            }}
                        >
                            {item.icon}
                        </TouchableOpacity>
                        <Text style={styles.menuTitle}>{item.title}</Text>
                        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                    </View>
                ))}
            </View>

            <Divider style={{ marginVertical: 10 }} />

            {/* Profile Information */}
            <Text style={{ fontWeight: "500", marginVertical: 5, fontSize: 18 }}>Profile Information</Text>

            <View style={styles.infoSection}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Name</Text>
                    <Text style={styles.infoValue}>{userInfo?.name}</Text>
                    <TouchableOpacity>
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.infoSection}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Phone number</Text>
                    <Text style={styles.infoValue}>{userInfo?.phone_number}</Text>
                    <TouchableOpacity>
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.infoSection}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{userInfo?.email}</Text>
                    <TouchableOpacity>
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Logout Section */}
            <View style={styles.logoutContainer}>
                <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.logoutButton}>
                    <View style={{ paddingLeft: 5 }}>
                        <Text style={styles.logoutText}>Log out</Text>
                    </View>
                    <View>
                        <MaterialIcons name="logout" size={22} color="#FF2626" />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{ marginVertical: 10 }} />

            {/* Logout Confirmation Modal */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Confirm Logout</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>
                        <View style={styles.modalButtons}>
                            <Button
                                mode='elevated'
                                onPress={() => setIsModalVisible(false)}
                                textColor="#000"
                            >Cancel</Button>
                            <Button
                                buttonColor="#EA4C4C"
                                textColor="#fff"
                                onPress={handleLogout}
                                mode='elevated'
                            >Confirm</Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )
}

export default UserProfileScreen

const styles = StyleSheet.create({
    profileHeader: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 3,
        marginVertical: 5
    },
    statsCard: {
        marginVertical: 10,
        elevation: 2,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#132f56',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 4,
    },
    recentCard: {
        marginVertical: 10,
        elevation: 2,
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    recentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    viewAllText: {
        fontSize: 12,
        color: '#132f56',
        fontWeight: '600',
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    orderInfo: {
        flex: 1,
    },
    orderNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    orderDate: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    orderStatus: {
        alignItems: 'flex-end',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    orderAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginTop: 2,
    },
    menuContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        // justifyContent: "space-between",
        backgroundColor: "#F8FAFC",
        padding: 10,
        borderRadius: 8,
    },
    menuItemContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 8,
        width: (width - 40) / 3, // 3 columns
    },
    menuButton: {
        width: 60,
        height: 60,
        backgroundColor: "#132f56",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 8,
    },
    menuTitle: {
        fontSize: 12,
        fontWeight: "600",
        textAlign: 'center',
        color: '#374151',
    },
    menuSubtitle: {
        fontSize: 10,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 2,
    },
    infoSection: {
        backgroundColor: "#fafafa",
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 3,
        marginVertical: 3,
    },
    infoItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    infoLabel: {
        fontWeight: "500",
        flex: 1,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: "400",
        paddingVertical: 5,
        flex: 2,
    },
    editText: {
        textDecorationLine: "underline",
        textDecorationColor: "blue",
        color: "blue",
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
        borderRadius: 5,
        marginTop: 10,
        borderWidth: 0.3,
        elevation: 0.2,
        borderColor: "#ccc"
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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
});