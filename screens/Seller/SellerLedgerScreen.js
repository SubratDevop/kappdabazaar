import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  ActivityIndicator,
  Card,
  Divider,
  FAB,
  SegmentedButtons,
} from "react-native-paper";
import { API_BASE, COLORS } from "../../constants/exports";
import { useAuthStore } from "../../store/useAuthStore";

const SellerLedgerScreen = ({ navigation }) => {
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState("start");
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState("ALL");
  const { authInfo } = useAuthStore();

  const statusOptions = [
    { value: "ALL", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "SETTLED", label: "Settled" },
    { value: "ON_HOLD", label: "On Hold" },
  ];

  useEffect(() => {
    fetchLedgerData();
  }, [filterStatus, startDate, endDate]);

  const fetchLedgerData = async (page = 1, reset = true) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
      }

      const sellerId = authInfo.user_id;

      const params = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        page,
        limit: 50,
      };

      const response = await axios.get(`${API_BASE}/ledger/seller/${sellerId}/ledger`,
        {
          headers: { Authorization: `Bearer ${authInfo?.token}` },
          params,
        }
      );

      const filteredData =
        filterStatus === "ALL"
          ? response.data.data.data.ledgerEntries
          : response.data.data.data.ledgerEntries.filter(
            (item) => item.settlementStatus === filterStatus
          );

      if (reset) {
        setLedgerData(filteredData);
      } else {
        setLedgerData((prev) => [...prev, ...filteredData]);
      }

      // if (reset) {
      //   setLedgerData(response.data.data.data.ledgerEntries);
      // } else {
      //   setLedgerData(prev => [...prev, ...response.data.data.data.ledgerEntries]);
      // }

      setHasNextPage(response.data.data.data.pagination.hasNextPage);
      setCurrentPage(response.data.data.data.pagination.currentPage);
    } catch (error) {
      console.error("Error fetching ledger data:", error);
      Alert.alert("Error", "Failed to fetch ledger data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLedgerData();
  };

  const loadMoreData = () => {
    if (hasNextPage && !loading) {
      fetchLedgerData(currentPage + 1, false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SETTLED': return '#10B981';
      case 'PENDING': return '#F59E0B';
      case 'PROCESSING': return '#3B82F6';
      case 'ON_HOLD': return '#EF4444';
      case 'DISPUTED': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SETTLED': return 'check-circle';
      case 'PENDING': return 'lock-clock';
      case 'PROCESSING': return 'refresh';
      case 'ON_HOLD': return 'pause-circle';
      case 'DISPUTED': return 'crisis-alert';
      default: return 'help-circle';
    }
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
      <Text style={styles.headerTitle}>Transaction Ledger</Text>
      <Text style={styles.headerSubtitle}>Track all your earnings and deductions</Text>

      {/* Date Filter */}
      <View style={styles.dateFilterContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            setDatePickerType('start');
            setShowDatePicker(true);
          }}
        >
          <MaterialIcons name="calendar-today" size={16} color={COLORS.primary} />
          <Text style={styles.dateButtonText}>
            From: {formatDate(startDate)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            setDatePickerType('end');
            setShowDatePicker(true);
          }}
        >
          <MaterialIcons name="calendar-today" size={16} color={COLORS.primary} />
          <Text style={styles.dateButtonText}>
            To: {formatDate(endDate)}
          </Text>
        </TouchableOpacity>
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

  const renderLedgerItem = (item) => (
    <Card key={item.id} style={styles.ledgerCard}>
      <Card.Content>
        <View style={styles.ledgerHeader}>
          <View style={styles.ledgerInfo}>
            <Text style={styles.ledgerNumber}>{item.ledgerNumber}</Text>
            <Text style={styles.orderInfo}>
              Order #{item.order?.orderNumber || item.orderId}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <MaterialIcons
              name={getStatusIcon(item.settlementStatus)}
              size={16}
              color={getStatusColor(item.settlementStatus)}
            />
            <Text style={[styles.statusText, { color: getStatusColor(item.settlementStatus) }]}>
              {item.settlementStatus}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.amountContainer}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Gross Amount:</Text>
            <Text style={styles.grossAmount}>{formatCurrency(item.grossAmount)}</Text>
          </View>

          <View style={styles.deductionsContainer}>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>Platform Commission ({item.commissionRate}%):</Text>
              <Text style={styles.deductionAmount}>-{formatCurrency(item.platformCommission)}</Text>
            </View>

            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>GST on Commission (18.00%):</Text>
              <Text style={styles.deductionAmount}>-{formatCurrency(item.gstOnCommission)}</Text>
            </View>

            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>TDS ({item.tdsRate}%):</Text>
              <Text style={styles.deductionAmount}>-{formatCurrency(item.tdsAmount)}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.netAmountRow}>
            <Text style={styles.netAmountLabel}>Net Amount:</Text>
            <Text style={styles.netAmount}>{formatCurrency(item.netAmount)}</Text>
          </View>
        </View>

        <View style={styles.ledgerFooter}>
          <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
          {item.settlementDate && (
            <Text style={styles.settlementDate}>
              Settled: {formatDate(item.settlementDate)}
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  const renderSummaryCards = () => {
    const totalGross = ledgerData.reduce((sum, item) => sum + parseFloat(item.grossAmount), 0);
    const totalCommission = ledgerData.reduce((sum, item) => sum + parseFloat(item.platformCommission), 0);
    const totalNet = ledgerData.reduce((sum, item) => sum + parseFloat(item.netAmount), 0);

    return (
      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <Card.Content style={styles.summaryContent}>
            <FontAwesome5 name="coins" size={24} color="#10B981" />
            <Text style={styles.summaryAmount}>{formatCurrency(totalGross)}</Text>
            <Text style={styles.summaryLabel}>Total Gross</Text>
          </Card.Content>
        </Card>

        <Card style={styles.summaryCard}>
          <Card.Content style={styles.summaryContent}>
            <FontAwesome5 name="percentage" size={24} color="#EF4444" />
            <Text style={styles.summaryAmount}>{formatCurrency(totalCommission)}</Text>
            <Text style={styles.summaryLabel}>Total Commission</Text>
          </Card.Content>
        </Card>

        <Card style={styles.summaryCard}>
          <Card.Content style={styles.summaryContent}>
            <FontAwesome5 name="wallet" size={24} color="#3B82F6" />
            <Text style={styles.summaryAmount}>{formatCurrency(totalNet)}</Text>
            <Text style={styles.summaryLabel}>Net Earnings</Text>
          </Card.Content>
        </Card>
      </View>
    );
  };

  if (loading && ledgerData.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading ledger data...</Text>
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
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          if (isCloseToBottom) {
            loadMoreData();
          }
        }}
        scrollEventThrottle={400}
      >
        {renderHeader()}
        {renderSummaryCards()}

        <View style={styles.ledgerContainer}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          {ledgerData.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <FontAwesome5 name="receipt" size={48} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>No Transactions Found</Text>
                <Text style={styles.emptySubtitle}>
                  No ledger entries found for the selected period
                </Text>
              </Card.Content>renderDatePicker
            </Card>
          ) : (
            ledgerData.map(renderLedgerItem)
          )}

          {loading && ledgerData.length > 0 && (
            <View style={styles.loadMoreContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadMoreText}>Loading more...</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="chart-line"
        onPress={() => navigation.navigate('SellerEarningsScreen')}
        color="white"
        customSize={56}
      />
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
  dateFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
  },
  dateButtonText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontSize: 14,
  },
  segmentedButtons: {
    marginBottom: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
  },
  summaryContent: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  ledgerContainer: {
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  ledgerCard: {
    marginBottom: 15,
    elevation: 2,
  },
  ledgerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  ledgerInfo: {
    flex: 1,
  },
  ledgerNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  orderInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 10,
  },
  amountContainer: {
    marginBottom: 15,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  grossAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  deductionsContainer: {
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
  },
  deductionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  deductionLabel: {
    fontSize: 13,
    color: '#7F1D1D',
  },
  deductionAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
  netAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 8,
  },
  netAmountLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0C4A6E',
  },
  netAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0EA5E9',
  },
  ledgerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  settlementDate: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  emptyCard: {
    marginTop: 20,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 15,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 5,
  },
  loadMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadMoreText: {
    marginLeft: 10,
    color: COLORS.primary,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
});

export default SellerLedgerScreen; 