import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import FabricCard from "../components/FabricCard";
import { useAuthStore } from "../store/useAuthStore";
import { useCompanyStore } from "../store/useCompanyStore";
import { useProductStore } from "../store/useProductStore";
import getAsyncStorageFn from "../utils/constants";
import { registerForPushNotificationsAsync } from "../utils/notifications";
import WaitingApprovalScreen from "./WaitingApprovalScreen";

import axios from "axios";
import EmptyState from "../components/EmptyState";
import { API_BASE } from "../constants/exports";

// Modern Tab Component
const ModernTab = ({ title, isSelected, onPress, iconName }) => (
  <TouchableOpacity
    style={[styles.modernTab, isSelected && styles.selectedModernTab]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {isSelected && (
      <View style={styles.tabGradient} />
    )}
    <View style={styles.tabContent}>
      <MaterialIcons
        name={iconName}
        size={20}
        color={isSelected ? "#FFFFFF" : "#8E8E93"}
      />
      <Text style={[styles.tabText, isSelected && styles.selectedTabText]}>
        {title}
      </Text>
    </View>
  </TouchableOpacity>
);

// Modern Metric Card Component
const MetricCard = ({ title, value, icon, color, change, onPress }) => (
  <TouchableOpacity
    style={styles.modernMetricCard}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.metricGradient}>
      <View style={styles.metricHeader}>
        <View
          style={[
            styles.metricIconContainer,
            { backgroundColor: `${color}20` },
          ]}
        >
          <MaterialIcons name={icon} size={20} color={color} />
        </View>
        {change !== undefined && (
          <View
            style={[
              styles.changeChip,
              change >= 0 ? styles.positiveChange : styles.negativeChange,
            ]}
          >
            <MaterialIcons
              name={change >= 0 ? "trending-up" : "trending-down"}
              size={12}
              color={change >= 0 ? "#34C759" : "#FF3B30"}
            />
            <Text
              style={[
                styles.changeValue,
                change >= 0 ? styles.positiveText : styles.negativeText,
              ]}
            >
              {Math.abs(change)}%
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
  </TouchableOpacity>
);

// Modern Quick Action Component
const QuickAction = ({ title, description, icon, color, onPress }) => (
  <TouchableOpacity
    style={styles.quickActionCard}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.quickActionIcon, { backgroundColor: `${color}15` }]}>
      <MaterialIcons name={icon} size={24} color={color} />
    </View>
    <View style={styles.quickActionContent}>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionDesc}>{description}</Text>
    </View>
    <MaterialIcons name="chevron-right" size={20} color="#C7C7CC" />
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const [show, setShow] = useState(null);
  const [company, setCompany] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [customerSupprtModalVisible, setcustomerSupprtModalVisible] = useState(false);

  // Dashboard specific state
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const { products, fetchAllProducts } = useProductStore();
  const {
    getApprovalStatus,
    isLoading: isAuthLoading,
    userRole,
    authInfo,
    registerPushTokenFn,
  } = useAuthStore();
  const { fetchCompanyDetails } = useCompanyStore();

  const isFocused = useIsFocused();

  const tabs = ["Dashboard", "Products"];
  const tabIcons = {
    Dashboard: "dashboard",
    Products: "inventory",
  };

  const periods = [
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "quarter", label: "This Quarter" },
    { key: "year", label: "This Year" },
  ];

  const searchPhrases = [
    "Search fabrics...",
    "Find the best deals!",
    "Explore new arrivals!",
    "Discover premium fabrics!",
  ];
  const [index, setIndex] = useState(0);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: -10,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIndex((prevIndex) => (prevIndex + 1) % searchPhrases.length);
        fadeAnim.setValue(0);
        translateYAnim.setValue(10);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function initPushNotifications() {
      const token = await registerForPushNotificationsAsync();
      const user = await getAsyncStorageFn();
      if (token) {
        await registerPushTokenFn({
          role: "seller",
          user_id: user.user_id,
          expo_push_token: token,
        });
      }
    }
    initPushNotifications();
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
      }
    );
    return () => subscription.remove();
  }, []);

  async function fetchCompanyDetailsAsync() {
    try {
      const user = await getAsyncStorageFn();
      const res_company = await fetchCompanyDetails(user.user_id);
      fetchAllProducts(user.user_id);
      setCompany(res_company);
    } catch (error) {
      console.error("Error fetching company details:", error);
      return null;
    }
  }
  // Function to open phone dialer
  const handleCall = () => {
    Linking.openURL("tel:+919930196361"); // replace with your number
  };

  // Function to open Gmail
  const handleMail = () => {
    Linking.openURL("mailto:kapdabazaar1989@gmail.com");
  };

  useEffect(() => {
    async function fetchDetails() {
      try {
        const user = await getAsyncStorageFn();
        const res = await getApprovalStatus(user.user_id);
        setShow(res);
      } catch (error) {
        console.error("Error in fetchDetails:", error);
      }
    }
    if (isFocused) {
      setIsLoading(true);
      if (selectedTab === "Products") {
        fetchCompanyDetailsAsync();
      }
      if (selectedTab === "Dashboard") {
        fetchDashboardData();
      }
      fetchDetails();
      setIsLoading(false);
    }
  }, [selectedTab, selectedPeriod]);

  // Dashboard data fetching
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = authInfo?.token;
      const response = await axios.get(`${API_BASE}/seller/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { period: selectedPeriod },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (selectedTab === "Dashboard") {
      fetchDashboardData();
    } else if (selectedTab === "Products") {
      fetchCompanyDetailsAsync();
    }
  };

  //* Dashboard rendering method
  const renderDashboard = () => {
    const menuItems = [
      // {
      //   title: "Analytics Dashboard",
      //   subtitle: "View detailed business insights",
      //   icon: "analytics",
      //   color: "#007AFF",
      //   onPress: () => navigation.navigate("AnalyticsDashboard"),
      // },
      {
        title: "Add New Product",
        subtitle: "List a new fabric product",
        icon: "add-box",
        color: "#34C759",
        // onPress: () => navigation.navigate("AddProduct"),
        onPress: () => navigation.navigate("AddFancy"),
      },
      {
        title: "Manage Orders",
        subtitle: "Track and update orders",
        icon: "assignment",
        color: "#FF9500",
        // onPress: () => navigation.navigate("MyOrders"),
        onPress: () => navigation.navigate("OrderManagement"),
      },
      {
        title: "Customer Support",
        subtitle: "Chat with customers",
        icon: "support-agent",
        color: "#FF6B6B",
        // onPress: () => navigation.navigate("Chat"),
        onPress: () => setcustomerSupprtModalVisible(true),
      },
      {
        title: "Profile Settings",
        subtitle: "Manage your account",
        icon: "account-circle",
        color: "#8B5CF6",
        // onPress: () => navigation.navigate("Profile"),
        onPress: () => navigation.navigate("SellerProfile"),
      },
      {
        title: "Notifications",
        subtitle: "View all notifications",
        icon: "notifications",
        color: "#6366F1",
        // onPress: () => navigation.navigate("Notifications"),
        onPress: () => navigation.navigate("NotificationScreen"),
      },
      {
        title: "Earnings Dashboard",
        subtitle: "Track your income & commission",
        icon: "account-balance-wallet",
        color: "#10B981",
        onPress: () => navigation.navigate("SellerEarningsScreen"),
      },
      {
        title: "Transaction Ledger",
        subtitle: "View detailed transaction history",
        icon: "receipt-long",
        color: "#3B82F6",
        onPress: () => navigation.navigate("SellerLedgerScreen"),
      },
      {
        title: "Monthly Settlements",
        subtitle: "Track monthly payments",
        icon: "calendar-month",
        color: "#F59E0B",
        onPress: () => navigation.navigate("SellerSettlementsScreen"),
      },
    ];

    return (
      <ScrollView
        style={styles.dashboardContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF6B6B"]}
          />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Seller Dashboard</Text>
          <Text style={styles.welcomeSubtitle}>
            {company?.companyInfo?.company_name ||
              "Manage your business efficiently"}
          </Text>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: `${item.color}15` },
                ]}
              >
                <MaterialIcons name={item.icon} size={28} color={item.color} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStatsSection}>
          <Text style={styles.sectionTitle}>Quick Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialIcons name="trending-up" size={24} color="#34C759" />
              <Text style={styles.statValue}>₹1.2L</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="shopping-bag" size={24} color="#FF6B6B" />
              <Text style={styles.statValue}>456</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="star" size={24} color="#FF9500" />
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View
                style={[styles.activityIcon, { backgroundColor: "#34C75915" }]}
              >
                <MaterialIcons name="shopping-bag" size={16} color="#34C759" />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>New order received</Text>
                <Text style={styles.activityTime}>2 minutes ago</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View
                style={[styles.activityIcon, { backgroundColor: "#FF6B6B15" }]}
              >
                <MaterialIcons name="star" size={16} color="#FF6B6B" />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>New product review</Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewAllActivity}
              onPress={() => navigation.navigate("ActivityLog")}
            >
              <Text style={styles.viewAllText}>View all activity</Text>
              <MaterialIcons name="chevron-right" size={16} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>







    );
  };

  const renderProducts = () => (
    <View style={styles.productsContainer}>
      {/* Search Header */}
      {/* <TouchableOpacity
        style={styles.searchContainer}
        onPress={() => navigation.navigate("Search")}
        activeOpacity={0.8}
      >
        <MaterialIcons name="search" size={20} color="#8E8E93" />
        <Animated.Text
          style={[
            styles.searchPlaceholder,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }],
            },
          ]}
        >
          {searchPhrases[index]}
        </Animated.Text>
      </TouchableOpacity> */}

      {/* Products List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : products && products.length > 0 ? (
        <FlatList
          data={products}
          keyExtractor={(item) =>
            item.id?.toString() || Math.random().toString()
          }
          renderItem={({ item }) => (
            <FabricCard
              fabric={item}
              navigation={navigation}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#FF6B6B"]}
            />
          }
        />
      ) : (
        <EmptyState
          title="No Products Found"
          description="Start by adding your first fabric product to showcase your inventory."
          actionText="Add Product"
          onAction={() => navigation.navigate("AddProduct")}
        />
      )}
    </View>
  );

  if (show === true) {   //* false
    return <WaitingApprovalScreen />;
  }

  if (isAuthLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />

      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.headerTitle}>Kapda Bazaar Seller</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            // onPress={() => navigation.navigate("Profile")}
            // onPress={() => navigation.navigate("CompanyProfile")}
            onPress={() => navigation.navigate("SellerProfile")}
          >
            <MaterialIcons name="account-circle" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Modern Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <ModernTab
              key={tab}
              title={tab}
              isSelected={selectedTab === tab}
              onPress={() => setSelectedTab(tab)}
              iconName={tabIcons[tab]}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {selectedTab === "Dashboard" ? renderDashboard() : renderProducts()}
      </View>

            {/* // render support modal */}
            <Modal
                transparent={true}
                visible={customerSupprtModalVisible}
                animationType="slide"
                onRequestClose={() => setcustomerSupprtModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
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
                </View>

            </Modal>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#132f56",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: "#FFFFFF80",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
  },
  modernTab: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "gray",
    marginHorizontal: 2,
  },
  selectedModernTab: {
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 0,
  },
  tabGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#132f56",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginLeft: 6,
  },
  selectedTabText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  dashboardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  welcomeSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C2C2E",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  menuItem: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  card: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: "column",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,

  },
  iconButton: {
    alignItems: "left",
    fontSize : 20
  },
  closeButton: {
    backgroundColor: "#FF6B6B",
    padding: 10,
    borderRadius: 8,
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C2C2E",
    textAlign: "center",
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 11,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 14,
  },
  quickStatsSection: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C2C2E",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  recentActivityContainer: {
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    padding: 16,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  activityIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2C2C2E",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    color: "#8E8E93",
  },
  viewAllActivity: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#E8E8E8",
    gap: 4,
  },
  viewAllText: {
    fontSize: 12,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  productsContainer: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 14,
    color: "#8E8E93",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#8E8E93",
  },
  productRow: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  productsList: {
    paddingBottom: 20,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C2C2E",
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  metricGradient: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
});

export default HomeScreen;
