import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Card,
  Chip,
  SegmentedButtons
} from "react-native-paper";
import { API_BASE } from "../../constants/exports";
import { useAuthStore } from "../../store/useAuthStore";

const { width: screenWidth } = Dimensions.get("window");

const AnalyticsDashboard = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { authInfo } = useAuthStore();

  const periodOptions = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "3 Months" },
    { value: "1y", label: "1 Year" },
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE}/analytics/seller?period=${selectedPeriod}`,
        {
          headers: { Authorization: `Bearer ${authInfo?.token}` },
        }
      );
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  const renderKPICards = () => {
    if (!analyticsData?.kpis) return null;

    const kpis = [
      {
        title: "Total Revenue",
        value: `₹${analyticsData.kpis.totalRevenue?.toLocaleString() || "0"}`,
        change: analyticsData.kpis.revenueChange,
        icon: "trending-up",
        color: "#10B981",
      },
      {
        title: "Total Orders",
        value: analyticsData.kpis.totalOrders?.toString() || "0",
        change: analyticsData.kpis.ordersChange,
        icon: "shopping-bag",
        color: "#3B82F6",
      },
      {
        title: "Avg Order Value",
        value: `₹${analyticsData.kpis.avgOrderValue?.toFixed(0) || "0"}`,
        change: analyticsData.kpis.aovChange,
        icon: "receipt",
        color: "#8B5CF6",
      },
      {
        title: "Customer Rating",
        value: `${analyticsData.kpis.avgRating?.toFixed(1) || "0.0"} ⭐`,
        change: analyticsData.kpis.ratingChange,
        icon: "star",
        color: "#F59E0B",
      },
    ];

    return (
      <View style={styles.kpiContainer}>
        {kpis.map((kpi, index) => (
          <Card key={index} style={styles.kpiCard}>
            <Card.Content style={styles.kpiContent}>
              <View style={styles.kpiHeader}>
                <MaterialIcons name={kpi.icon} size={24} color={kpi.color} />
                <View style={styles.kpiChange}>
                  <MaterialIcons
                    name={kpi.change >= 0 ? "trending-up" : "trending-down"}
                    size={16}
                    color={kpi.change >= 0 ? "#10B981" : "#EF4444"}
                  />
                  <Text
                    style={[
                      styles.changeText,
                      { color: kpi.change >= 0 ? "#10B981" : "#EF4444" },
                    ]}
                  >
                    {Math.abs(kpi.change)}%
                  </Text>
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
    if (!analyticsData?.revenueChart) return null;

    const chartData = {
      labels: analyticsData.revenueChart.labels,
      datasets: [
        {
          data: analyticsData.revenueChart.data,
          color: (opacity = 1) => `rgba(19, 47, 86, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    };

    return (
      <Card style={styles.chartCard}>
        <Card.Content>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Revenue Trend</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("DetailedAnalytics", { type: "revenue" })
              }
            >
              <MaterialIcons name="fullscreen" size={24} color="#132f56" />
            </TouchableOpacity>
          </View>
          {/* <LineChart
            data={chartData}
            width={width - 80}
            height={180}
            color="#132f56"
            thickness={2}
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
            dataPointsRadius={3}
            textShiftY={-8}
            textShiftX={-10}
            textColor="#374151"
            textFontSize={9}
          /> */}
        </Card.Content>
      </Card>
    );
  };

  const renderOrderStatusChart = () => {
    if (!analyticsData?.orderStatus) return null;

    const pieData = analyticsData.orderStatus.map((item, index) => ({
      name: item.status,
      population: item.count,
      color: ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#3B82F6"][index % 5],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    }));

    return (
      <Card style={styles.chartCard}>
        <Card.Content>
          <Text style={styles.chartTitle}>Order Status Distribution</Text>
          {/* <PieChart
            data={pieData}
            radius={80}
            innerRadius={30}
            centerLabelComponent={() => (
              <View style={styles.centerLabel}>
                <Text style={styles.centerLabelText}>Orders</Text>
                <Text style={styles.centerLabelValue}>
                  {analyticsData.orderStatus.reduce(
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
          /> */}
        </Card.Content>
      </Card>
    );
  };

  const renderTopProducts = () => {
    if (!analyticsData?.topProducts) return null;

    return (
      <Card style={styles.chartCard}>
        <Card.Content>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Top Selling Products</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProductAnalytics")}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {analyticsData.topProducts.map((product, index) => (
            <View key={index} style={styles.productItem}>
              <View style={styles.productRank}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productStats}>
                  {product.orders} orders • ₹{product.revenue?.toLocaleString()}
                </Text>
              </View>
              <View style={styles.productMetrics}>
                <Chip mode="outlined" compact style={styles.metricChip}>
                  {product.rating}⭐
                </Chip>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderCustomerAnalytics = () => {
    if (!analyticsData?.customerAnalytics) return null;

    const { newCustomers, returningCustomers, customerGrowth } =
      analyticsData.customerAnalytics;

    return (
      <Card style={styles.chartCard}>
        <Card.Content>
          <Text style={styles.chartTitle}>Customer Analytics</Text>
          <View style={styles.customerMetrics}>
            <View style={styles.customerMetric}>
              <Text style={styles.metricValue}>{newCustomers}</Text>
              <Text style={styles.metricLabel}>New Customers</Text>
            </View>
            <View style={styles.customerMetric}>
              <Text style={styles.metricValue}>{returningCustomers}</Text>
              <Text style={styles.metricLabel}>Returning Customers</Text>
            </View>
            <View style={styles.customerMetric}>
              <Text
                style={[
                  styles.metricValue,
                  { color: customerGrowth >= 0 ? "#10B981" : "#EF4444" },
                ]}
              >
                {customerGrowth >= 0 ? "+" : ""}
                {customerGrowth}%
              </Text>
              <Text style={styles.metricLabel}>Growth Rate</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderQuickActions = () => (
    <Card style={styles.chartCard}>
      <Card.Content>
        <Text style={styles.chartTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("GSTReports")}
          >
            <MaterialIcons name="receipt-long" size={32} color="#132f56" />
            <Text style={styles.actionText}>GST Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("InventoryManagement")}
          >
            <MaterialIcons name="inventory" size={32} color="#132f56" />
            <Text style={styles.actionText}>Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("CustomerFeedback")}
          >
            <MaterialIcons name="feedback" size={32} color="#132f56" />
            <Text style={styles.actionText}>Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("MarketingInsights")}
          >
            <MaterialIcons name="insights" size={32} color="#132f56" />
            <Text style={styles.actionText}>Insights</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading && !analyticsData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#132f56" />
        <Text style={styles.loadingText}>Loading Analytics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#132f56" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ExportReports")}>
          <MaterialIcons name="file-download" size={24} color="#132f56" />
        </TouchableOpacity>
      </View>

      <View style={styles.periodSelector}>
        <SegmentedButtons
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
          buttons={periodOptions}
          style={styles.segmentedButtons}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderKPICards()}
        {renderRevenueChart()}
        {renderOrderStatusChart()}
        {renderTopProducts()}
        {renderCustomerAnalytics()}
        {renderQuickActions()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#132f56",
  },
  periodSelector: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  segmentedButtons: {
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  kpiContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    minWidth: "45%",
    elevation: 2,
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
  kpiChange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#132f56",
    marginBottom: 4,
  },
  kpiTitle: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  chartCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#132f56",
  },
  viewAllText: {
    fontSize: 14,
    color: "#132f56",
    fontWeight: "500",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  productRank: {
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
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  productStats: {
    fontSize: 12,
    color: "#6B7280",
  },
  productMetrics: {
    alignItems: "flex-end",
  },
  metricChip: {
    backgroundColor: "#F0F9FF",
    borderColor: "#132f56",
  },
  customerMetrics: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  customerMetric: {
    alignItems: "center",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#132f56",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    minWidth: "40%",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "500",
    color: "#132f56",
    textAlign: "center",
  },
});

export default AnalyticsDashboard;
