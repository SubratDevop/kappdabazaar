import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
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
import {
  ActivityIndicator,
  Card,
  SegmentedButtons,
} from "react-native-paper";
import { API_BASE, COLORS } from "../../constants/exports";
import { useAuthStore } from "../../store/useAuthStore";

const { width: screenWidth } = Dimensions.get("window");

const SellerEarningsScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("current_month");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { authInfo } = useAuthStore();

  const periodOptions = [
    { value: "current_month", label: "This Month" },
    { value: "last_month", label: "Last Month" },
    { value: "current_year", label: "This Year" },
  ];

  useEffect(() => {

    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {

    try {
      setLoading(true);

      const sellerId = authInfo.user_id;


      const response = await axios.get(
        `${API_BASE}/ledger/seller/${sellerId}/dashboard`,
        {
          headers: { Authorization: `Bearer ${authInfo?.token}` },
          params: { period: selectedPeriod },
        }
      );
      setDashboardData(response.data.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      Alert.alert("Error", "Failed to fetch earnings data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatNumber = (number) => {
    return parseInt(number || 0).toLocaleString('en-IN');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Earnings Dashboard</Text>
      <Text style={styles.headerSubtitle}>
        Track your income and commission breakdown
      </Text>
      
      <SegmentedButtons
        value={selectedPeriod}
        onValueChange={setSelectedPeriod}
        buttons={periodOptions}
        style={styles.segmentedButtons}
      />
    </View>
  );

  const renderKPICards = () => {
    if (!dashboardData?.summary) return null;

    const { summary } = dashboardData;
    
    const kpis = [
      {
        title: "Gross Sales",
        value: formatCurrency(summary.totalGrossSales),
        icon: "trending-up",
        color: "#10B981",
        subtitle: `${formatNumber(summary.totalTransactions)} transactions`,
      },
      {
        title: "Platform Commission",
        value: formatCurrency(summary.totalCommission),
        icon: "percentage",
        color: "#EF4444",
        subtitle: "1% commission rate",
      },
      {
        title: "GST Collected",
        value: formatCurrency(summary.totalGSTOnCommission),
        icon: "receipt",
        color: "#F59E0B",
        subtitle: "18% on commission",
      },
      {
        title: "Net Earnings",
        value: formatCurrency(summary.totalNetEarnings),
        icon: "account-balance-wallet",
        color: "#3B82F6",
        subtitle: "After all deductions",
      },
      {
        title: "TDS Deducted",
        value: formatCurrency(summary.totalTDS),
        icon: "gavel",
        color: "#8B5CF6",
        subtitle: "1% TDS rate",
      },
    ];

    return (
      <View style={styles.kpiContainer}>
        {kpis.map((kpi, index) => (
          <Card key={index} style={styles.kpiCard}>
            <Card.Content style={styles.kpiContent}>
              <View style={styles.kpiHeader}>
                <View style={[styles.kpiIcon, { backgroundColor: `${kpi.color}15` }]}>
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

  const renderEarningsBreakdown = () => {
    if (!dashboardData?.summary) return null;

    const { summary } = dashboardData;
    
    const pieData = [
      {
        value: parseFloat(summary.totalNetEarnings),
        color: '#10B981',
        text: 'Net Earnings',
      },
      {
        value: parseFloat(summary.totalCommission),
        color: '#EF4444',
        text: 'Platform Commission',
      },
      {
        value: parseFloat(summary.totalGSTOnCommission),
        color: '#F59E0B',
        text: 'GST on Commission',
      },
      {
        value: parseFloat(summary.totalTDS),
        color: '#8B5CF6',
        text: 'TDS Deducted',
      },
    ];

    return (
      <Card style={styles.chartCard}>
        <Card.Content>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Earnings Breakdown</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SellerLedgerScreen')}>
              <MaterialIcons name="receipt-long" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.pieChartContainer}>
            {/* <PieChart
              data={pieData}
              donut
              showGradient
              sectionAutoFocus
              radius={80}
              innerRadius={40}
              innerCircleColor={'#F9FAFB'}
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={styles.centerLabelAmount}>
                    {formatCurrency(summary.totalGrossSales)}
                  </Text>
                  <Text style={styles.centerLabelText}>Total Sales</Text>
                </View>
              )}
            /> */}
            
            <View style={styles.legendContainer}>
              {pieData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>{item.text}</Text>
                  <Text style={styles.legendValue}>{formatCurrency(item.value)}</Text>
                </View>
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderCommissionAnalysis = () => {
    if (!dashboardData?.summary) return null;

    const { summary } = dashboardData;
    const grossSales = parseFloat(summary.totalGrossSales);
    const commission = parseFloat(summary.totalCommission);
    const gst = parseFloat(summary.totalGSTOnCommission);
    const tds = parseFloat(summary.totalTDS);
    const net = parseFloat(summary.totalNetEarnings);

    const commissionPercentage = grossSales > 0 ? ((commission / grossSales) * 100).toFixed(2) : 0;
    const gstPercentage = commission > 0 ? ((gst / commission) * 100).toFixed(2) : 0;
    const tdsPercentage = grossSales > 0 ? ((tds / grossSales) * 100).toFixed(2) : 0;
    const netPercentage = grossSales > 0 ? ((net / grossSales) * 100).toFixed(2) : 0;

    return (
      <Card style={styles.analysisCard}>
        <Card.Content>
          <Text style={styles.chartTitle}>Commission Analysis</Text>
          <Text style={styles.analysisSubtitle}>
            Understanding your deductions and earnings
          </Text>

          <View style={styles.analysisContainer}>
            <View style={styles.analysisRow}>
              <View style={styles.analysisLabel}>
                <View style={[styles.analysisDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.analysisText}>You receive</Text>
              </View>
              <Text style={styles.analysisValue}>{netPercentage}%</Text>
              <Text style={styles.analysisAmount}>{formatCurrency(net)}</Text>
            </View>

            <View style={styles.analysisRow}>
              <View style={styles.analysisLabel}>
                <View style={[styles.analysisDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.analysisText}>Platform commission</Text>
              </View>
              <Text style={styles.analysisValue}>{commissionPercentage}%</Text>
              <Text style={styles.analysisAmount}>{formatCurrency(commission)}</Text>
            </View>

            <View style={styles.analysisRow}>
              <View style={styles.analysisLabel}>
                <View style={[styles.analysisDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.analysisText}>GST on commission</Text>
              </View>
              <Text style={styles.analysisValue}>{gstPercentage}% of commission</Text>
              <Text style={styles.analysisAmount}>{formatCurrency(gst)}</Text>
            </View>

            <View style={styles.analysisRow}>
              <View style={styles.analysisLabel}>
                <View style={[styles.analysisDot, { backgroundColor: '#8B5CF6' }]} />
                <Text style={styles.analysisText}>TDS deducted</Text>
              </View>
              <Text style={styles.analysisValue}>{tdsPercentage}%</Text>
              <Text style={styles.analysisAmount}>{formatCurrency(tds)}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderQuickActions = () => (
    <Card style={styles.actionsCard}>
      <Card.Content>
        <Text style={styles.chartTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('SellerSettlementsScreen')}
          >
            <FontAwesome5 name="calendar-check" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>Monthly Settlements</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('SellerLedgerScreen')}
          >
            <FontAwesome5 name="receipt" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>View Ledger</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('GSTReportsScreen')}
          >
            <FontAwesome5 name="file-invoice" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>Tax Reports</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading earnings data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderHeader()}
        {renderKPICards()}
        {renderEarningsBreakdown()}
        {renderCommissionAnalysis()}
        {renderQuickActions()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  segmentedButtons: {
    marginBottom: 10,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  kpiCard: {
    width: (screenWidth - 45) / 2,
    marginBottom: 15,
    elevation: 2,
  },
  kpiContent: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  kpiHeader: {
    marginBottom: 10,
  },
  kpiIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  kpiTitle: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 2,
  },
  kpiSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  chartCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  pieChartContainer: {
    alignItems: 'center',
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerLabelAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  centerLabelText: {
    fontSize: 12,
    color: '#6B7280',
  },
  legendContainer: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#374151',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  analysisCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  analysisSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  analysisContainer: {
    marginTop: 10,
  },
  analysisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  analysisLabel: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#374151',
  },
  analysisValue: {
    fontSize: 12,
    color: '#6B7280',
    marginHorizontal: 10,
  },
  analysisAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  actionsCard: {
    marginHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 80,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default SellerEarningsScreen; 