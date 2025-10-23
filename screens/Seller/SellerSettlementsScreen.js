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
  Divider,
  SegmentedButtons,
} from "react-native-paper";
import { API_BASE, COLORS } from "../../constants/exports";
import { useAuthStore } from "../../store/useAuthStore";

const { width: screenWidth } = Dimensions.get("window");

const SellerSettlementsScreen = ({ navigation }) => {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const { authInfo } = useAuthStore();

  const statusOptions = [
    { value: "ALL", label: "All" },
    { value: "DRAFT", label: "Draft" },
    { value: "READY", label: "Ready" },
    { value: "COMPLETED", label: "Completed" },
  ];

  const yearOptions = [
    { value: 2025, label: "2025" },
    { value: 2024, label: "2024" },
    { value: 2023, label: "2023" },
    { value: 2022, label: "2022" },
  ];

  useEffect(() => {
    fetchSettlements();
  }, [selectedYear, filterStatus]);

  const fetchSettlements = async (page = 1, reset = true) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
      }

      const sellerId = authInfo.user_id;

      const params = {
        year: selectedYear,
        page,
        limit: 20,
      };

      if (filterStatus !== "ALL") {
        params.status = filterStatus;
      }

      const response = await axios.get(
        `${API_BASE}/ledger/seller/${sellerId}/settlements`,
        {
          headers: { Authorization: `Bearer ${authInfo?.token}` },
          params,
        }
      );

      if (reset) {
        setSettlements(response.data.data.data.settlements);
      } else {
        setSettlements((prev) => [...prev, ...response.data.data.settlements]);
      }

      setHasNextPage(response.data.data.data.pagination.hasNextPage);
      setCurrentPage(response.data.data.data.pagination.currentPage);
    } catch (error) {
      console.error("Error fetching settlements:", error);
      Alert.alert("Error", "Failed to fetch settlements data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSettlements();
  };

  const loadMoreData = () => {
    if (hasNextPage && !loading) {
      fetchSettlements(currentPage + 1, false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "#10B981";
      case "READY":
        return "#3B82F6";
      case "PROCESSING":
        return "#F59E0B";
      case "DRAFT":
        return "#6B7280";
      case "FAILED":
        return "#EF4444";
      case "DISPUTED":
        return "#8B5CF6";
      default:
        return "#6B7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return "check-circle";
      case "READY":
        return "radio-button-checked";
      case "PROCESSING":
        return "refresh";
      case "DRAFT":
        return "edit";
      case "FAILED":
        return "error";
      case "DISPUTED":
        return "report-problem";
      default:
        return "help";
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case "COMPLETED":
        return "Payment completed successfully";
      case "READY":
        return "Ready for processing";
      case "PROCESSING":
        return "Payment in progress";
      case "DRAFT":
        return "Under review";
      case "FAILED":
        return "Payment failed";
      case "DISPUTED":
        return "Under dispute";
      default:
        return "Status unknown";
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Monthly Settlements</Text>
      <Text style={styles.headerSubtitle}>
        Track your monthly payment settlements
      </Text>

      {/* Year Filter */}
      <View style={styles.yearFilterContainer}>
        <Text style={styles.filterLabel}>Year:</Text>
        <View style={styles.yearButtons}>
          {yearOptions.map((year) => (
            <TouchableOpacity
              key={year.value}
              style={[
                styles.yearButton,
                selectedYear === year.value && styles.yearButtonActive,
              ]}
              onPress={() => setSelectedYear(year.value)}
            >
              <Text
                style={[
                  styles.yearButtonText,
                  selectedYear === year.value && styles.yearButtonTextActive,
                ]}
              >
                {year.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Status Filter */}
      <SegmentedButtons
        value={filterStatus}
        onValueChange={setFilterStatus}
        buttons={statusOptions}
        style={styles.segmentedButtons}
      />
    </View>
  );

  const renderSettlementSummary = () => {
    const completedSettlements = settlements.filter(
      (s) => s.settlementStatus === "COMPLETED"
    );
    const totalCompleted = completedSettlements.reduce(
      (sum, s) => sum + parseFloat(s.totalNetSettlement),
      0
    );
    const totalPending = settlements.filter(
      (s) => s.settlementStatus !== "COMPLETED"
    ).length;

    return (
      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <Card.Content style={styles.summaryContent}>
            <FontAwesome5 name="check-circle" size={24} color="#10B981" />
            <Text style={styles.summaryAmount}>
              {formatCurrency(totalCompleted)}
            </Text>
            <Text style={styles.summaryLabel}>Total Received</Text>
            <Text style={styles.summarySubtext}>
              {completedSettlements.length} settlements
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.summaryCard}>
          <Card.Content style={styles.summaryContent}>
            <FontAwesome5 name="clock" size={24} color="#F59E0B" />
            <Text style={styles.summaryCount}>{totalPending}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={styles.summarySubtext}>Awaiting processing</Text>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderSettlementItem = (settlement) => (
    <Card key={settlement.id} style={styles.settlementCard}>
      <Card.Content>
        <View style={styles.settlementHeader}>
          <View style={styles.settlementInfo}>
            <Text style={styles.settlementNumber}>
              {settlement.settlementNumber}
            </Text>
            <Text style={styles.settlementPeriod}>
              {settlement.settlementPeriod} • {settlement.totalOrders} orders
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <MaterialIcons
              name={getStatusIcon(settlement.settlementStatus)}
              size={16}
              color={getStatusColor(settlement.settlementStatus)}
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(settlement.settlementStatus) },
              ]}
            >
              {settlement.settlementStatus}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.amountBreakdown}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Gross Sales:</Text>
            <Text style={styles.breakdownValue}>
              {formatCurrency(settlement.totalGrossSales)}
            </Text>
          </View>

          <View style={styles.deductionsContainer}>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>Platform Commission (3.00% ):</Text>
              <Text style={styles.deductionAmount}>
                -{formatCurrency(settlement.totalPlatformCommission)}
              </Text>
            </View>

            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>GST on Commission (18.00% ):</Text>
              <Text style={styles.deductionAmount}>
                -{formatCurrency(settlement.totalGSTOnCommission)}
              </Text>
            </View>

            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>TDS Deducted (1.00% ):</Text>
              <Text style={styles.deductionAmount}>
                -{formatCurrency(settlement.totalTDSDeducted)}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.netAmountRow}>
            <Text style={styles.netAmountLabel}>Net Settlement:</Text>
            <Text style={styles.netAmount}>
              {formatCurrency(settlement.totalNetSettlement)}
            </Text>
          </View>
        </View>

        <View style={styles.settlementFooter}>
          <Text style={styles.statusDescription}>
            {getStatusDescription(settlement.settlementStatus)}
          </Text>
          <View style={styles.footerInfo}>
            <Text style={styles.dateText}>
              Generated: {formatDate(settlement.created_at)}
            </Text>
            {settlement.settlementDate && (
              <Text style={styles.settlementDateText}>
                Settled: {formatDate(settlement.settlementDate)}
              </Text>
            )}
          </View>
        </View>

        {settlement.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{settlement.notes}</Text>
          </View>
        )}

        {settlement.bankTransactionId && (
          <View style={styles.transactionContainer}>
            <Text style={styles.transactionLabel}>Transaction ID:</Text>
            <Text style={styles.transactionId}>
              {settlement.bankTransactionId}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  if (loading && settlements.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading settlements...</Text>
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
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20;
          if (isCloseToBottom) {
            loadMoreData();
          }
        }}
        scrollEventThrottle={400}
      >
        {renderHeader()}
        {renderSettlementSummary()}

        <View style={styles.settlementsContainer}>
          <Text style={styles.sectionTitle}>Settlement History</Text>
          {settlements.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <FontAwesome5 name="calendar-times" size={48} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>No Settlements Found</Text>
                <Text style={styles.emptySubtitle}>
                  No settlements found for {selectedYear}
                </Text>
              </Card.Content>
            </Card>
          ) : (
            settlements.map(renderSettlementItem)
          )}

          {loading && settlements.length > 0 && (
            <View style={styles.loadMoreContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadMoreText}>Loading more...</Text>
            </View>
          )}
        </View>
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
  yearFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.primary,
    marginRight: 15,
  },
  yearButtons: {
    flexDirection: "row",
  },
  yearButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 10,
  },
  yearButtonActive: {
    backgroundColor: COLORS.primary,
  },
  yearButtonText: {
    fontSize: 14,
    color: "#6B7280",
  },
  yearButtonTextActive: {
    color: "white",
    fontWeight: "500",
  },
  segmentedButtons: {
    marginBottom: 10,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
  },
  summaryContent: {
    alignItems: "center",
    paddingVertical: 15,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 8,
  },
  summaryCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#374151",
    marginTop: 4,
  },
  summarySubtext: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 2,
  },
  settlementsContainer: {
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 15,
  },
  settlementCard: {
    marginBottom: 15,
    elevation: 2,
  },
  settlementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  settlementInfo: {
    flex: 1,
  },
  settlementNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  settlementPeriod: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    marginVertical: 10,
  },
  amountBreakdown: {
    marginBottom: 15,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#059669",
  },
  deductionsContainer: {
    backgroundColor: "#FEF2F2",
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
  },
  deductionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  deductionLabel: {
    fontSize: 13,
    color: "#7F1D1D",
  },
  deductionAmount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#DC2626",
  },
  netAmountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F0F9FF",
    padding: 10,
    borderRadius: 8,
  },
  netAmountLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0C4A6E",
  },
  netAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0EA5E9",
  },
  settlementFooter: {
    marginTop: 10,
  },
  statusDescription: {
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
    marginBottom: 8,
  },
  footerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 12,
    color: "#6B7280",
  },
  settlementDateText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "500",
  },
  notesContainer: {
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 5,
  },
  notesText: {
    fontSize: 12,
    color: "#6B7280",
  },
  transactionContainer: {
    backgroundColor: "#ECFDF5",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  transactionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
    marginBottom: 5,
  },
  transactionId: {
    fontSize: 12,
    color: "#059669",
    fontFamily: "monospace",
  },
  emptyCard: {
    marginTop: 20,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 15,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 5,
  },
  loadMoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loadMoreText: {
    marginLeft: 10,
    color: COLORS.primary,
  },
});

export default SellerSettlementsScreen;
