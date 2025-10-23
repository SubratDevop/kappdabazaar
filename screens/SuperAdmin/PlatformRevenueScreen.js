import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ActivityIndicator, Card, SegmentedButtons } from "react-native-paper";
import { API_BASE, COLORS } from "../../constants/exports";
import { STORAGE_KEYS, useAuthStore } from "../../store/useAuthStore";





const { width: screenWidth } = Dimensions.get("window");

const PlatformRevenueScreen = ({ navigation }) => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("current_month");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState("start");
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(new Date());
  const { authInfo } = useAuthStore();

  const periodOptions = [
    { value: "current_month", label: "This Month" },
    { value: "last_month", label: "Last Month" },
    { value: "current_year", label: "This Year" },
    { value: "custom", label: "Custom" },
  ];

  useEffect(() => {
    fetchRevenueData();
  }, [selectedPeriod, startDate, endDate]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);

      let params;
      if (selectedPeriod === "custom") {
        params = {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        };
      } else {
        const now = new Date();
        let start, end;

        switch (selectedPeriod) {
          case "current_month":
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            break;
          case "last_month":
            start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            end = new Date(now.getFullYear(), now.getMonth(), 0);
            break;
          case "current_year":
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear(), 11, 31);
            break;
        }

        params = {
          startDate: start.toISOString().split("T")[0],
          endDate: end.toISOString().split("T")[0],
        };
      }
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);  //! tokenn fetched

      const response = await axios.get(`${API_BASE}/ledger/platform/revenue`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setRevenueData(response.data.data.data);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      Alert.alert("Error", "Failed to fetch platform revenue data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRevenueData();
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatNumber = (number) => {
    return parseInt(number || 0).toLocaleString("en-IN");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderDatePicker = () => {
    if (!showDatePicker) return null;
    return (
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        date={datePickerType === "start" ? startDate : endDate}
        onConfirm={(selectedDate) => {
          setShowDatePicker(false);
          if (selectedDate) {
            if (datePickerType === "start") {
              setStartDate(selectedDate);
            } else {
              setEndDate(selectedDate);
            }
          }
        }}
        onCancel={() => setShowDatePicker(false)}
      />
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Platform Revenue</Text>
      <Text style={styles.headerSubtitle}>
        Monitor platform performance and commission earnings
      </Text>

      <SegmentedButtons
        value={selectedPeriod}
        onValueChange={setSelectedPeriod}
        buttons={periodOptions}
        style={styles.segmentedButtons}
      />

      {selectedPeriod === "custom" && (
        <View style={styles.dateFilterContainer}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setDatePickerType("start");
              setShowDatePicker(true);
            }}
          >
            <MaterialIcons
              name="calendar-today"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.dateButtonText}>
              From: {formatDate(startDate)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setDatePickerType("end");
              setShowDatePicker(true);
            }}
          >
            <MaterialIcons
              name="calendar-today"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.dateButtonText}>To: {formatDate(endDate)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderKPICards = () => {
    if (!revenueData) return null;

    const kpis = [
      {
        title: "Total GMV",
        value: formatCurrency(revenueData.totalGMV),
        icon: "trending-up",
        color: "#10B981",
        subtitle: `${formatNumber(revenueData.totalTransactions)} transactions`,
      },
      {
        title: "Platform Revenue",
        value: formatCurrency(revenueData.totalPlatformRevenue),
        icon: "account-balance",
        color: "#3B82F6",
        subtitle: "Commission + GST",
      },
      {
        title: "Commission Earned",
        value: formatCurrency(revenueData.totalCommission),
        icon: "percent",
        color: "#F59E0B",
        subtitle: `${revenueData.commissionRate}% rate`,
      },
      {
        title: "GST Collected",
        value: formatCurrency(revenueData.totalGSTCollected),
        icon: "receipt",
        color: "#EF4444",
        subtitle: "18% on commission",
      },
      {
        title: "TDS Collected",
        value: formatCurrency(revenueData.totalTDSCollected),
        icon: "gavel",
        color: "#8B5CF6",
        subtitle: "1% on sales",
      },
    ];

    return (
      <View style={styles.kpiContainer}>
        {kpis.map((kpi, index) => (
          <Card key={index} style={styles.kpiCard}>
            <Card.Content style={styles.kpiContent}>
              <View style={styles.kpiHeader}>
                <View
                  style={[
                    styles.kpiIcon,
                    { backgroundColor: `${kpi.color}15` },
                  ]}
                >
                  <MaterialIcons name={kpi.icon} size={24} color={kpi.color} />
                </View>
              </View>
              <Text style={styles.kpiValue}>{kpi.value}</Text>
              <Text style={styles.kpiTitle}>{kpi.title}</Text>
              <Text style={styles.kpiSubtitle}>{kpi.subtitle}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    );
  };

  const renderRevenueBreakdown = () => {
    if (!revenueData) return null;

    const pieData = [
      {
        value: parseFloat(revenueData.totalCommission),
        color: "#3B82F6",
        text: "Platform Commission",
      },
      {
        value: parseFloat(revenueData.totalGSTCollected),
        color: "#EF4444",
        text: "GST Collected",
      },
    ];

    const sellerEarnings =
      parseFloat(revenueData.totalGMV) -
      parseFloat(revenueData.totalPlatformRevenue) -
      parseFloat(revenueData.totalTDSCollected);

    const fullPieData = [
      ...pieData,
      {
        value: sellerEarnings,
        color: "#10B981",
        text: "Seller Earnings",
      },
      {
        value: parseFloat(revenueData.totalTDSCollected),
        color: "#8B5CF6",
        text: "TDS (Government)",
      },
    ];

    return (
      <Card style={styles.chartCard}>
        <Card.Content>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Revenue Breakdown</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SettlementManagementScreen")}
            >
              <MaterialIcons name="settings" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.pieChartContainer}>
            <PieChart
              data={fullPieData}
              donut
              showGradient
              sectionAutoFocus
              radius={90}
              innerRadius={50}
              innerCircleColor={"#F9FAFB"}
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={styles.centerLabelAmount}>
                    {formatCurrency(revenueData.totalGMV)}
                  </Text>
                  <Text style={styles.centerLabelText}>Total GMV</Text>
                </View>
              )}
            />

            <View style={styles.legendContainer}>
              {fullPieData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text style={styles.legendText}>{item.text}</Text>
                  <Text style={styles.legendValue}>
                    {formatCurrency(item.value)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderCommissionAnalysis = () => {
    if (!revenueData) return null;

    const commissionRate = (
      (parseFloat(revenueData.totalCommission) /
        parseFloat(revenueData.totalGMV)) *
      100
    ).toFixed(2);
    const gstRate = (
      (parseFloat(revenueData.totalGSTCollected) /
        parseFloat(revenueData.totalCommission)) *
      100
    ).toFixed(2);
    const tdsRate = (
      (parseFloat(revenueData.totalTDSCollected) /
        parseFloat(revenueData.totalGMV)) *
      100
    ).toFixed(2);
    const platformShare = (
      (parseFloat(revenueData.totalPlatformRevenue) /
        parseFloat(revenueData.totalGMV)) *
      100
    ).toFixed(2);

    return (
      <Card style={styles.analysisCard}>
        <Card.Content>
          <Text style={styles.chartTitle}>Commission Analysis</Text>
          <Text style={styles.analysisSubtitle}>
            Platform commission structure and earnings breakdown
          </Text>

          <View style={styles.analysisContainer}>
            <View style={styles.analysisRow}>
              <View style={styles.analysisLabel}>
                <View
                  style={[styles.analysisDot, { backgroundColor: "#3B82F6" }]}
                />
                <Text style={styles.analysisText}>Platform Share</Text>
              </View>
              <Text style={styles.analysisValue}>{platformShare}%</Text>
              <Text style={styles.analysisAmount}>
                {formatCurrency(revenueData.totalPlatformRevenue)}
              </Text>
            </View>

            <View style={styles.analysisRow}>
              <View style={styles.analysisLabel}>
                <View
                  style={[styles.analysisDot, { backgroundColor: "#F59E0B" }]}
                />
                <Text style={styles.analysisText}>Commission Rate</Text>
              </View>
              <Text style={styles.analysisValue}>{commissionRate}%</Text>
              <Text style={styles.analysisAmount}>
                {formatCurrency(revenueData.totalCommission)}
              </Text>
            </View>

            <View style={styles.analysisRow}>
              <View style={styles.analysisLabel}>
                <View
                  style={[styles.analysisDot, { backgroundColor: "#EF4444" }]}
                />
                <Text style={styles.analysisText}>GST Rate</Text>
              </View>
              <Text style={styles.analysisValue}>{gstRate}% of commission</Text>
              <Text style={styles.analysisAmount}>
                {formatCurrency(revenueData.totalGSTCollected)}
              </Text>
            </View>

            <View style={styles.analysisRow}>
              <View style={styles.analysisLabel}>
                <View
                  style={[styles.analysisDot, { backgroundColor: "#8B5CF6" }]}
                />
                <Text style={styles.analysisText}>TDS Rate</Text>
              </View>
              <Text style={styles.analysisValue}>{tdsRate}%</Text>
              <Text style={styles.analysisAmount}>
                {formatCurrency(revenueData.totalTDSCollected)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderQuickActions = () => (
    <Card style={styles.actionsCard}>
      <Card.Content>
        <Text style={styles.chartTitle}>Platform Management</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("SettlementManagementScreen")}
          >
            <FontAwesome5 name="cog" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>Manage Settlements</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("GSTReportsScreen")}
          >
            <FontAwesome5
              name="file-invoice"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.actionText}>Tax Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("OrderMonitoring")}
          >
            <FontAwesome5 name="chart-line" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>Order Analytics</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const renderPlatformInsights = () => {
    if (!revenueData) return null;

    const avgTransactionValue =
      parseFloat(revenueData.totalGMV) /
      parseFloat(revenueData.totalTransactions);
    const avgCommissionPerTransaction =
      parseFloat(revenueData.totalCommission) /
      parseFloat(revenueData.totalTransactions);

    return (
      <Card style={styles.insightsCard}>
        <Card.Content>
          <Text style={styles.chartTitle}>Platform Insights</Text>

          <View style={styles.insightRow}>
            <FontAwesome5 name="calculator" size={16} color="#6B7280" />
            <Text style={styles.insightLabel}>Average Transaction Value:</Text>
            <Text style={styles.insightValue}>
              {formatCurrency(avgTransactionValue)}
            </Text>
          </View>

          <View style={styles.insightRow}>
            <FontAwesome5 name="money-bill-wave" size={16} color="#6B7280" />
            <Text style={styles.insightLabel}>
              Avg Commission per Transaction:
            </Text>
            <Text style={styles.insightValue}>
              {formatCurrency(avgCommissionPerTransaction)}
            </Text>
          </View>

          <View style={styles.insightRow}>
            <FontAwesome5 name="percent" size={16} color="#6B7280" />
            <Text style={styles.insightLabel}>Platform Revenue Margin:</Text>
            <Text style={styles.insightValue}>
              {(
                (parseFloat(revenueData.totalPlatformRevenue) /
                  parseFloat(revenueData.totalGMV)) *
                100
              ).toFixed(2)}
              %
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading platform revenue data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderDatePicker()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderHeader()}
        {renderKPICards()}
        {renderRevenueBreakdown()}
        {renderCommissionAnalysis()}
        {renderPlatformInsights()}
        {renderQuickActions()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.primary,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  segmentedButtons: {
    marginBottom: 10,
  },
  dateFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
  },
  dateButtonText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontSize: 14,
  },
  kpiContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  kpiCard: {
    width: (screenWidth - 45) / 2,
    marginBottom: 15,
    elevation: 2,
  },
  kpiContent: {
    alignItems: "center",
    paddingVertical: 15,
  },
  kpiHeader: {
    marginBottom: 10,
  },
  kpiIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
    textAlign: "center",
  },
  kpiTitle: {
    fontSize: 12,
    color: "#374151",
    textAlign: "center",
    marginBottom: 2,
  },
  kpiSubtitle: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
  },
  chartCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  pieChartContainer: {
    alignItems: "center",
  },
  centerLabel: {
    alignItems: "center",
  },
  centerLabelAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  centerLabelText: {
    fontSize: 12,
    color: "#6B7280",
  },
  legendContainer: {
    marginTop: 20,
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
  },
  legendValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  analysisCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  analysisSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  analysisContainer: {
    marginTop: 10,
  },
  analysisRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  analysisLabel: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  analysisDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  analysisText: {
    fontSize: 14,
    color: "#374151",
  },
  analysisValue: {
    fontSize: 12,
    color: "#6B7280",
    marginHorizontal: 10,
  },
  analysisAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  insightsCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  insightRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  insightLabel: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    marginLeft: 10,
  },
  insightValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  actionsCard: {
    marginHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  actionButton: {
    alignItems: "center",
    padding: 15,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    minWidth: 80,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 8,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default PlatformRevenueScreen;
