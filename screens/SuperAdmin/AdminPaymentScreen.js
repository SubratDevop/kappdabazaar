import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import {
  Card,
  Searchbar,
  Chip,
  ActivityIndicator,
  Divider,
  Badge,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import EmptyState from "../../components/EmptyState";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import { API_BASE } from "../../constants/exports";

const AdminPaymentScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Data states
  const [paymentStats, setPaymentStats] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const { authInfo } = useAuthStore();

  const tabs = ["Overview", "Transactions"];
  const statusFilters = ["all", "successful", "pending", "failed", "refunded"];

  useEffect(() => {
    fetchPaymentData();
  }, [selectedTab, selectedPeriod]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const token = authInfo?.token;
      const headers = { Authorization: `Bearer ${token}` };

      if (selectedTab === "Overview") {
        // Fetch payment statistics
        try {
          const statsResponse = await axios.get(
            `${API_BASE}/admin/payments/stats?period=${selectedPeriod}`,
            { headers }
          );
          setPaymentStats(statsResponse.data);
        } catch (error) {
          // Fallback data for demo
          setPaymentStats({
            totalRevenue: 2456789.5,
            totalTransactions: 1247,
            successfulPayments: 1198,
            pendingPayments: 28,
            failedPayments: 21,
            refundedAmount: 45320.0,
            avgTransactionValue: 1970.5,
            growth: {
              revenue: 12.5,
              transactions: 8.3,
              successRate: 96.1,
            },
          });
        }
      }

      if (selectedTab === "Transactions") {
        try {
          const transactionsResponse = await axios.get(
            `${API_BASE}/admin/payments/transactions`,
            { headers }
          );
          setTransactions(transactionsResponse.data || []);
        } catch (error) {
          // Fallback transactions data
          setTransactions([
            {
              id: 1,
              transactionId: "TXN001234567",
              orderId: "ORD001",
              amount: 2500.0,
              status: "successful",
              paymentMethod: "UPI",
              customerName: "John Doe",
              sellerName: "ABC Textiles",
              createdAt: new Date().toISOString(),
              gstAmount: 450.0,
            },
            {
              id: 2,
              transactionId: "TXN001234568",
              orderId: "ORD002",
              amount: 1800.0,
              status: "pending",
              paymentMethod: "Card",
              customerName: "Jane Smith",
              sellerName: "XYZ Fabrics",
              createdAt: new Date().toISOString(),
              gstAmount: 324.0,
            },
            {
              id: 3,
              transactionId: "TXN001234569",
              orderId: "ORD003",
              amount: 3200.0,
              status: "failed",
              paymentMethod: "Net Banking",
              customerName: "Mike Johnson",
              sellerName: "Premium Silks",
              createdAt: new Date().toISOString(),
              gstAmount: 576.0,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPaymentData();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "successful":
        return "#4CAF50";
      case "pending":
        return "#FFA500";
      case "failed":
        return "#FF0000";
      case "refunded":
        return "#9C27B0";
      case "under_review":
        return "#FF9800";
      case "resolved":
        return "#4CAF50";
      default:
        return "#666";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "successful":
        return "check-circle";
      case "pending":
        return "schedule";
      case "failed":
        return "error";
      case "refunded":
        return "cached";
      case "under_review":
        return "help";
      case "resolved":
        return "check-circle";
      default:
        return "info";
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.transactionId
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customerName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || transaction.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const renderOverviewTab = () => {
    if (loading) {
      return (
        <ActivityIndicator
          animating={true}
          size="large"
          style={styles.loader}
        />
      );
    }

    return (
      <ScrollView
        style={styles.tabContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsCardContent}>
              <View style={styles.statsHeader}>
                <MaterialIcons
                  name="account-balance-wallet"
                  size={24}
                  color="#132f56"
                />
                <Text
                  style={[
                    styles.growthText,
                    {
                      color:
                        paymentStats?.growth?.revenue > 0
                          ? "#4CAF50"
                          : "#FF0000",
                    },
                  ]}
                >
                  {paymentStats?.growth?.revenue > 0 ? "+" : ""}
                  {paymentStats?.growth?.revenue}%
                </Text>
              </View>
              <Text style={styles.statsValue}>
                ₹{paymentStats?.totalRevenue?.toLocaleString() || "0"}
              </Text>
              <Text style={styles.statsLabel}>Total Revenue</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsCardContent}>
              <View style={styles.statsHeader}>
                <MaterialIcons name="receipt" size={24} color="#132f56" />
                <Text
                  style={[
                    styles.growthText,
                    {
                      color:
                        paymentStats?.growth?.transactions > 0
                          ? "#4CAF50"
                          : "#FF0000",
                    },
                  ]}
                >
                  {paymentStats?.growth?.transactions > 0 ? "+" : ""}
                  {paymentStats?.growth?.transactions}%
                </Text>
              </View>
              <Text style={styles.statsValue}>
                {paymentStats?.totalTransactions?.toLocaleString() || "0"}
              </Text>
              <Text style={styles.statsLabel}>Total Transactions</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsCardContent}>
              <View style={styles.statsHeader}>
                <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                <Text style={styles.growthText}>
                  {paymentStats?.growth?.successRate}%
                </Text>
              </View>
              <Text style={styles.statsValue}>
                {paymentStats?.successfulPayments || "0"}
              </Text>
              <Text style={styles.statsLabel}>Successful</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsCardContent}>
              <View style={styles.statsHeader}>
                <MaterialIcons name="schedule" size={24} color="#FFA500" />
                <Badge size={16} style={{ backgroundColor: "#FFA500" }}>
                  {paymentStats?.pendingPayments || 0}
                </Badge>
              </View>
              <Text style={styles.statsValue}>
                {paymentStats?.pendingPayments || "0"}
              </Text>
              <Text style={styles.statsLabel}>Pending</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="file-download" size={24} color="#132f56" />
                <Text style={styles.actionText}>Export Report</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="refresh" size={24} color="#132f56" />
                <Text style={styles.actionText}>Reconcile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="search" size={24} color="#132f56" />
                <Text style={styles.actionText}>Advanced Search</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="settings" size={24} color="#132f56" />
                <Text style={styles.actionText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Transactions */}
        <Card style={styles.recentCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => setSelectedTab("Transactions")}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {transactions.slice(0, 3).map((transaction) => (
              <View key={transaction.id} style={styles.transactionRow}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionId}>
                    {transaction.transactionId}
                  </Text>
                  <Text style={styles.transactionCustomer}>
                    {transaction.customerName}
                  </Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={styles.amountText}>
                    ₹{transaction.amount?.toFixed(2)}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(transaction.status) },
                    ]}
                  >
                    <MaterialIcons
                      name={getStatusIcon(transaction.status)}
                      size={12}
                      color="#fff"
                    />
                    <Text style={styles.statusText}>
                      {transaction.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    );
  };

  const renderTransactionsTab = () => {
    if (loading) {
      return (
        <ActivityIndicator
          animating={true}
          size="large"
          style={styles.loader}
        />
      );
    }

    return (
      <ScrollView
        style={styles.tabContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search and Filters */}
        <View style={styles.searchSection}>
          <Searchbar
            placeholder="Search transactions..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
          >
            {statusFilters.map((status) => (
              <Chip
                key={status}
                selected={selectedStatus === status}
                onPress={() => setSelectedStatus(status)}
                style={styles.filterChip}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <EmptyState
            type="payments"
            title="No Transactions Found"
            subtitle="No transactions match your current filters"
            actionText="Clear Filters"
            onActionPress={() => {
              setSearchQuery("");
              setSelectedStatus("all");
            }}
          />
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id} style={styles.transactionCard}>
              <Card.Content>
                <View style={styles.transactionHeader}>
                  <View>
                    <Text style={styles.transactionIdLarge}>
                      {transaction.transactionId}
                    </Text>
                    <Text style={styles.orderIdText}>
                      Order: {transaction.orderId}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(transaction.status) },
                    ]}
                  >
                    <MaterialIcons
                      name={getStatusIcon(transaction.status)}
                      size={14}
                      color="#fff"
                    />
                    <Text style={styles.statusText}>
                      {transaction.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.transactionDetails}>
                  <View style={styles.detailRow}>
                    <Text>Customer:</Text>
                    <Text style={styles.detailValue}>
                      {transaction.customerName}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text>Seller:</Text>
                    <Text style={styles.detailValue}>
                      {transaction.sellerName}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text>Amount:</Text>
                    <Text style={styles.amountTextLarge}>
                      ₹{transaction.amount?.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text>GST:</Text>
                    <Text style={styles.detailValue}>
                      ₹{transaction.gstAmount?.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text>Method:</Text>
                    <Text style={styles.detailValue}>
                      {transaction.paymentMethod}
                    </Text>
                  </View>
                </View>
                <View style={styles.transactionActions}>
                  <TouchableOpacity style={styles.actionButtonSmall}>
                    <MaterialIcons
                      name="visibility"
                      size={16}
                      color="#132f56"
                    />
                    <Text style={styles.actionTextSmall}>View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButtonSmall}>
                    <MaterialIcons
                      name="file-download"
                      size={16}
                      color="#132f56"
                    />
                    <Text style={styles.actionTextSmall}>Download</Text>
                  </TouchableOpacity>
                  {transaction.status === "pending" && (
                    <TouchableOpacity style={styles.actionButtonSmall}>
                      <MaterialIcons name="refresh" size={16} color="#132f56" />
                      <Text style={styles.actionTextSmall}>Refresh</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Overview":
        return renderOverviewTab();
      case "Transactions":
        return renderTransactionsTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#132f56" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Management</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <MaterialIcons name="more-vert" size={24} color="#132f56" />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => {}} title="Export Data" />
          <Menu.Item onPress={() => {}} title="Settings" />
          <Divider />
          <Menu.Item onPress={() => {}} title="Help" />
        </Menu>
      </View> */}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {renderTabContent()}
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
    paddingTop: 44,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#132f56",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  tabContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#132f56",
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#132f56",
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statsCard: {
    width: "48%",
    marginBottom: 12,
    elevation: 2,
  },
  statsCardContent: {
    paddingVertical: 16,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  growthText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statsValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#132f56",
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  actionsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#132f56",
    fontWeight: "500",
    marginLeft: 8,
  },
  recentCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: "#132f56",
    fontWeight: "500",
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  transactionCustomer: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#132f56",
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  searchSection: {
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: "row",
  },
  filterChip: {
    marginRight: 8,
  },
  transactionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  transactionIdLarge: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  orderIdText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  divider: {
    marginVertical: 12,
  },
  transactionDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailValue: {
    fontWeight: "500",
    color: "#374151",
  },
  amountTextLarge: {
    fontWeight: "600",
    color: "#132f56",
    fontSize: 16,
  },
  transactionActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButtonSmall: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    gap: 4,
  },
  actionTextSmall: {
    fontSize: 12,
    color: "#132f56",
    fontWeight: "500",
  },
  periodCard: {
    marginBottom: 16,
    elevation: 2,
  },
  periodChip: {
    marginRight: 8,
  },
  chartCard: {
    marginBottom: 16,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  pieChartContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  centerLabel: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerLabelText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  legendContainer: {
    flex: 1,
    marginLeft: 20,
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
    fontSize: 12,
    color: "#374151",
  },
  disputeCard: {
    marginBottom: 16,
    elevation: 2,
  },
  disputeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  disputeId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  disputeTransaction: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  disputeBadges: {
    alignItems: "flex-end",
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  disputeDetails: {
    gap: 8,
    marginBottom: 16,
  },
  disputeActions: {
    flexDirection: "row",
    gap: 8,
  },
});

export default AdminPaymentScreen;
