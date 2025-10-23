import { Feather, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Animated,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";
import { ActivityIndicator, Card } from "react-native-paper";
import { API_BASE } from "../../constants/exports";
import { width } from "../../constants/helpers";
import { STORAGE_KEYS, useAuthStore } from "../../store/useAuthStore";
import getAsyncStorageFn from "../../utils/constants";
import { registerForPushNotificationsAsync } from "../../utils/notifications";
import ManufacturerList from "./ManufacturerList";



const SuperAdminHomeScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const { userRole, authInfo, registerPushTokenFn } = useAuthStore();

  const [index, setIndex] = useState(0);

  const tabs = ["Dashboard", "Manufacturers"];
  const tabIcons = {
    Dashboard: <MaterialIcons name="space-dashboard" size={20} color="white" />,
    Manufacturers: <MaterialIcons name="factory" size={20} color="white" />
  };
  const searchPhrases = [
    "Search fabrics...",
    "Find the best deals!",
    "Explore new arrivals!",
    "Discover premium fabrics!",
  ];


  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out and move up animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0, // Fade out
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: -10, // Move text up
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Change text
        setIndex((prevIndex) => (prevIndex + 1) % searchPhrases.length);

        // Reset animation values
        fadeAnim.setValue(0);
        translateYAnim.setValue(10);

        // Start fade in animation
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
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function initPushNotifications() {
      const token = await registerForPushNotificationsAsync();
      const user = await getAsyncStorageFn();

      if (token) {
        await registerPushTokenFn({
          role: "superadmin",
          user_id: user.admin_id,
          expo_push_token: token,
        });
      }
    }

    initPushNotifications();

    // Optional: Notification listeners (foreground or response)
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
      }
    );

    return () => subscription.remove(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (selectedTab === "Dashboard") {
      fetchDashboardData();
    }
  }, [selectedTab, selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);  //! tokenn fetched
      setLoading(true);
      
      const response = await axios.get(`${API_BASE}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { period: selectedPeriod },  
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (selectedTab === "Dashboard") {
      fetchDashboardData();
    }
  };

  const renderDashboard = () => {
    const menuItems = [
      {
        title: "Order Monitoring",
        subtitle: "Track all orders in real-time",
        icon: "monitor",
        color: "#3B82F6",
        onPress: () => navigation.navigate("OrderMonitoring"),
      },
      {
        title: "GST Reports",
        subtitle: "View tax reports and compliance",
        icon: "receipt-long",
        color: "#10B981",
        onPress: () => navigation.navigate("GSTReportsScreen"),
      },
      {
        title: "Platform Revenue",
        subtitle: "Monitor commission earnings",
        icon: "account-balance",
        color: "#3B82F6",
        onPress: () => navigation.navigate("PlatformRevenueScreen"),
      },
      {
        title: "Settlement Management",
        subtitle: "Process seller settlements",
        icon: "payment",
        color: "#F59E0B",
        onPress: () => navigation.navigate("SettlementManagementScreen"),
      },
    ];

    return (
      <ScrollView
        style={styles.dashboardContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Super Admin Dashboard</Text>
          <Text style={styles.welcomeSubtitle}>
            Manage your platform efficiently
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
              <MaterialIcons name="trending-up" size={24} color="#10B981" />
              <Text style={styles.statValue}>₹2.4L</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="shopping-bag" size={24} color="#3B82F6" />
              <Text style={styles.statValue}>1,234</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="business" size={24} color="#8B5CF6" />
              <Text style={styles.statValue}>89</Text>
              <Text style={styles.statLabel}>Sellers</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderKPICards = () => {
    // if (!dashboardData?.kpis) return null;

    const kpis = [
      {
        title: "Total Revenue",
        value: `₹${dashboardData?.kpis.totalRevenue?.toLocaleString() || "0"}`,
        icon: "currency-rupee",
        color: "#10B981",
        change: dashboardData?.kpis.revenueChange || 0,
      },
      {
        title: "Total Orders",
        value: dashboardData?.kpis.totalOrders?.toLocaleString() || "0",
        icon: "shopping-bag",
        color: "#3B82F6",
        change: dashboardData?.kpis.ordersChange || 0,
      },
      {
        title: "Active Sellers",
        value: dashboardData?.kpis.activeSellers?.toLocaleString() || "0",
        icon: "business",
        color: "#8B5CF6",
        change: dashboardData?.kpis.sellersChange || 0,
      },
      {
        title: "GST Collected",
        value: `₹${dashboardData?.kpis.gstCollected?.toLocaleString() || "0"}`,
        icon: "receipt-long",
        color: "#F59E0B",
        change: dashboardData?.kpis.gstChange || 0,
      },
    ];

    return (
      <View style={styles.kpiContainer}>
        {kpis.map((kpi, index) => (
          <Card key={index} style={styles.kpiCard}>
            <Card.Content style={styles.kpiContent}>
              <View style={styles.kpiHeader}>
                <MaterialIcons name={kpi.icon} size={24} color={kpi.color} />
                <View
                  style={[
                    styles.changeIndicator,
                    {
                      backgroundColor: kpi.change >= 0 ? "#10B981" : "#EF4444",
                    },
                  ]}
                >
                  <MaterialIcons
                    name={kpi.change >= 0 ? "trending-up" : "trending-down"}
                    size={12}
                    color="#fff"
                  />
                  <Text style={styles.changeText}>{Math.abs(kpi.change)}%</Text>
                </View>
              </View>
              <Text style={styles.kpiValue}>{kpi.value}</Text>
              <Text style={styles.kpiTitle}>{kpi.title}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    );
  };

  const renderRevenueChart = () => {
    if (!dashboardData?.revenueChart) return null;

    const chartData =
      dashboardData?.revenueChart.labels?.map((label, index) => ({
        value: dashboardData?.revenueChart.data[index] || 0,
        label: label,
        labelTextStyle: { color: "#374151", fontSize: 10 },
      })) || [];

    return (
      <Card style={styles.chartCard}>
        <Card.Content>
          <Text style={styles.chartTitle}>Revenue Trend</Text>
          <LineChart
            data={chartData}
            width={width - 80}
            height={200}
            color="#132f56"
            thickness={3}
            startFillColor="#132f56"
            endFillColor="#132f56"
            startOpacity={0.3}
            endOpacity={0.1}
            initialSpacing={0}
            noOfSections={4}
            yAxisColor="#E5E7EB"
            xAxisColor="#E5E7EB"
            yAxisTextStyle={{ color: "#6B7280", fontSize: 10 }}
            xAxisLabelTextStyle={{ color: "#6B7280", fontSize: 10 }}
            curved
            isAnimated
            animationDuration={1000}
            areaChart
            hideDataPoints={false}
            dataPointsColor="#132f56"
            dataPointsRadius={4}
            textShiftY={-8}
            textShiftX={-10}
            textColor="#374151"
            textFontSize={10}
          />
        </Card.Content>
      </Card>
    );
  };

  const renderOrderStatusChart = () => {
    if (!dashboardData?.orderStatus) return null;

    const pieData = dashboardData?.orderStatus.map((item, index) => ({
      value: item.count,
      color: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"][index % 5],
      text: `${item.status}\n${item.count}`,
      textColor: "#374151",
      textSize: 12,
      shiftTextX: 0,
      shiftTextY: 0,
    }));

    return (
      <Card style={styles.chartCard}>
        <Card.Content>
          <Text style={styles.chartTitle}>Order Status Distribution</Text>
          <View style={styles.pieChartContainer}>
            <PieChart
              data={pieData}
              radius={80}
              innerRadius={30}
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={styles.centerLabelText}>Orders</Text>
                  <Text style={styles.centerLabelValue}>
                    {dashboardData.orderStatus.reduce(
                      (sum, item) => sum + item.count,
                      0
                    )}
                  </Text>
                </View>
              )}
              showText
              textColor="#374151"
              textSize={10}
              showTextBackground
              textBackgroundColor="#fff"
              textBackgroundRadius={8}
              strokeColor="#fff"
              strokeWidth={2}
              isAnimated
              animationDuration={1000}
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderTopSellers = () => {
    // if (!dashboardData?.topSellers) return null;

    return (
      <Card style={styles.listCard}>
        <Card.Content>
          <Text style={styles.listTitle}>Top Performing Sellers</Text>
          {dashboardData?.topSellers.map((seller, index) => (
            <View key={seller.id} style={styles.sellerItem}>
              <View style={styles.sellerRank}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{seller.name}</Text>
                <Text style={styles.sellerRevenue}>
                  ₹{seller.revenue?.toLocaleString()}
                </Text>
              </View>
              <View style={styles.sellerStats}>
                <Text style={styles.sellerOrders}>{seller.orders} orders</Text>
                <Text style={styles.sellerRating}>⭐ {seller.rating}</Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Kapda Bazaar</Text>
          <Pressable
            style={styles.userIcon}
            onPress={() => navigation.push("UserProfile")}
          >
            {/* <UserIcon color={"white"} strokeWidth={2.8} /> */}
            <Feather name="user" size={22} color="white" />
          </Pressable>
        </View>

        {/* Search Box */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Search")}
          activeOpacity={0.8}
          style={styles.searchBox}
        >
          {/* <SearchIcon color="#000" size={20} /> */}
          <Feather name="search" size={20} color="#000" />
          <View style={{ overflow: "hidden", height: 20, marginLeft: 10 }}>
            <Animated.Text
              style={[
                styles.searchText,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: translateYAnim }],
                },
              ]}
            >
              {searchPhrases[index]}
            </Animated.Text>
          </View>
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedTab(tab)}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
            >
              <View style={styles.tabContent}>
                {/* Change icon color dynamically */}
                {React.cloneElement(tabIcons[tab], {
                  color: selectedTab === tab ? "#ff6347" : "white",
                })}
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tab Content */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {selectedTab === "Manufacturers" && (
            <>
              <ManufacturerList navigation={navigation} />
              <View style={{ marginTop: 5 }} />
            </>
          )}
          {selectedTab === "Dashboard" && (
            <>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#132f56" />
                  <Text style={styles.loadingText}>Loading dashboard...</Text>
                </View>
              ) : (
                renderDashboard()
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    alignItems: "center",
    width: width,
    backgroundColor: "#132f56",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C2C2E",
    marginBottom: 16,
  },
  dashboardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
    marginBottom: 2,
    flexWrap: "wrap",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 12,
    backgroundColor: "#132f56",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  userIcon: {
    backgroundColor: "#f28482",
    padding: 8,
    borderRadius: 50,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    width: "90%",
    height: 40,
    marginVertical: 8,
    marginBottom: 12,
  },
  searchText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#111",
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#132f56",
    paddingHorizontal: 5,
    marginTop: 8,
    marginBottom: 3,
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
    fontSize: 11,
  },
  activeTabText: {
    color: "#ff6347",
  },
  content: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
  },
  dashboardContent: {
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
    marginBottom: 24,
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
  kpiContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  kpiCard: {
    width: (width - 44) / 2,
    elevation: 2,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  kpiContent: {
    padding: 12,
  },
  kpiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 2,
  },
  kpiTitle: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  changeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
  },
  changeText: {
    fontSize: 9,
    color: "#fff",
    marginLeft: 2,
    fontWeight: "600",
  },
  chartCard: {
    margin: 16,
    elevation: 2,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  listCard: {
    margin: 16,
    elevation: 2,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  sellerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sellerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#132f56",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rankText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  sellerRevenue: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "500",
  },
  sellerStats: {
    alignItems: "flex-end",
  },
  sellerOrders: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  sellerRating: {
    fontSize: 12,
    color: "#F59E0B",
    fontWeight: "500",
  },
  actionsCard: {
    margin: 16,
    elevation: 2,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    width: (width - 60) / 2,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#132f56",
    marginTop: 10,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  periodChip: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginRight: 5,
  },
  selectedPeriodChip: {
    backgroundColor: "#ff6347",
  },
  periodChipText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#132f56",
  },
  selectedPeriodChipText: {
    color: "#fff",
  },
  pieChartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabel: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabelText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
  },
  centerLabelValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#132f56",
  },
});

export default SuperAdminHomeScreen;
