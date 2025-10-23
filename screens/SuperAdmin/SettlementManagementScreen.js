import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  Divider,
  FAB,
  SegmentedButtons,
  TextInput
} from "react-native-paper";
import { API_BASE, COLORS } from "../../constants/exports";
import { STORAGE_KEYS, useAuthStore } from "../../store/useAuthStore";


const { width: screenWidth } = Dimensions.get("window");

const SettlementManagementScreen = ({ navigation }) => {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionNotes, setActionNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const { authInfo } = useAuthStore();

  const statusOptions = [
    { value: "ALL", label: "All" },
    { value: "DRAFT", label: "Draft" },
    { value: "READY", label: "Ready" },
    { value: "PROCESSING", label: "Processing" },
    { value: "COMPLETED", label: "Completed" },
    { value: "FAILED", label: "Failed" },
  ];

  useEffect(() => {
    fetchSettlements();
  }, [filterStatus]);

  const fetchSettlements = async (page = 1, reset = true) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
      }

      const params = {
        page,
        limit: 20,
      };

      if (filterStatus !== "ALL") {
        params.status = filterStatus;
      }
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);  //! tokenn fetched

      const response = await axios.get(
        `${API_BASE}/ledger/settlements`, // This would be a new endpoint
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      if (reset) {
        setSettlements(response.data.data.data.settlements);
      } else {
        setSettlements(prev => [...prev, ...response.data.data.data.settlements]);
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

  const updateSettlementStatus = async (settlementId, newStatus, notes = "") => {
    try {
      setActionLoading(true);

      const payload = {
        status: newStatus,
        notes: notes,
      };

      if (newStatus === "COMPLETED") {
        payload.paymentMethod = "NEFT";
        payload.bankTransactionId = `TXN${Date.now()}`;
      }

      const response = await axios.put(
        `${API_BASE}/ledger/settlement/${settlementId}/status`,
        payload,
        {
          headers: { Authorization: `Bearer ${authInfo?.token}` },
        }
      );

      // Update local state
      setSettlements(prev =>
        prev.map(settlement =>
          settlement.id === settlementId
            ? { ...settlement, settlementStatus: newStatus, notes }
            : settlement
        )
      );

      Alert.alert("Success", `Settlement status updated to ${newStatus}`);
      setShowActionModal(false);
      setSelectedSettlement(null);
      setActionNotes("");
    } catch (error) {
      console.error("Error updating settlement:", error);
      Alert.alert("Error", "Failed to update settlement status");
    } finally {
      setActionLoading(false);
    }
  };

  const generateSettlement = async (sellerId, year, month) => {
    try {
      const response = await axios.post(
        `${API_BASE}/ledger/seller/${sellerId}/settlement/generate`,
        { year, month },
        {
          headers: { Authorization: `Bearer ${authInfo?.token}` },
        }
      );

      Alert.alert("Success", "Settlement generated successfully");
      fetchSettlements(); // Refresh the list
    } catch (error) {
      console.error("Error generating settlement:", error);
      Alert.alert("Error", "Failed to generate settlement");
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
      case 'COMPLETED': return '#10B981';
      case 'READY': return '#3B82F6';
      case 'PROCESSING': return '#F59E0B';
      case 'DRAFT': return '#6B7280';
      case 'FAILED': return '#EF4444';
      case 'DISPUTED': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return 'check-circle';
      case 'READY': return 'radio-button-checked';
      case 'PROCESSING': return 'refresh';
      case 'DRAFT': return 'edit';
      case 'FAILED': return 'error';
      case 'DISPUTED': return 'report-problem';
      default: return 'help';
    }
  };

  const getNextStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case 'DRAFT':
        return ['READY', 'CANCELLED'];
      case 'READY':
        return ['PROCESSING', 'CANCELLED'];
      case 'PROCESSING':
        return ['COMPLETED', 'FAILED'];
      case 'FAILED':
        return ['READY', 'CANCELLED'];
      default:
        return [];
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Settlement Management</Text>
      <Text style={styles.headerSubtitle}>
        Monitor and process seller settlements
      </Text>

      <SegmentedButtons
        value={filterStatus}
        onValueChange={setFilterStatus}
        buttons={statusOptions}
        style={styles.segmentedButtons}
      />
    </View>
  );

  const renderSummaryCards = () => {
    const summaryData = settlements.reduce((acc, settlement) => {
      const status = settlement.settlementStatus;
      const amount = parseFloat(settlement.totalNetSettlement);

      if (!acc[status]) {
        acc[status] = { count: 0, amount: 0 };
      }
      acc[status].count++;
      acc[status].amount += amount;

      return acc;
    }, {});

    const summaryCards = [
      {
        title: "Ready",
        status: "READY",
        color: "#3B82F6",
        icon: "radio-button-checked",
      },
      {
        title: "Processing",
        status: "PROCESSING",
        color: "#F59E0B",
        icon: "refresh",
      },
      {
        title: "Completed",
        status: "COMPLETED",
        color: "#10B981",
        icon: "check-circle",
      },
      {
        title: "Failed",
        status: "FAILED",
        color: "#EF4444",
        icon: "error",
      },
    ];

    return (
      <View style={styles.summaryContainer}>
        {summaryCards.map((card) => {
          const data = summaryData[card.status] || { count: 0, amount: 0 };
          return (
            <Card key={card.status} style={styles.summaryCard}>
              <Card.Content style={styles.summaryContent}>
                <MaterialIcons name={card.icon} size={24} color={card.color} />
                <Text style={styles.summaryCount}>{data.count}</Text>
                <Text style={styles.summaryLabel}>{card.title}</Text>
                <Text style={styles.summaryAmount}>{formatCurrency(data.amount)}</Text>
              </Card.Content>
            </Card>
          );
        })}
      </View>
    );
  };

  const renderActionModal = () => (
    <Modal
      visible={showActionModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowActionModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update Settlement Status</Text>
          <Text style={styles.modalSubtitle}>
            {selectedSettlement?.settlementNumber}
          </Text>

          <View style={styles.currentStatusContainer}>
            <Text style={styles.currentStatusLabel}>Current Status:</Text>
            <Chip
              mode="outlined"
              textStyle={{ color: getStatusColor(selectedSettlement?.settlementStatus) }}
            >
              {selectedSettlement?.settlementStatus}
            </Chip>
          </View>

          <Text style={styles.actionLabel}>Select New Status:</Text>
          <View style={styles.actionButtons}>
            {getNextStatusOptions(selectedSettlement?.settlementStatus).map(status => (
              <TouchableOpacity
                key={status}
                style={[styles.actionButton, { borderColor: getStatusColor(status) }]}
                onPress={() => {
                  Alert.alert(
                    "Confirm Action",
                    `Are you sure you want to change status to ${status}?`,
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Confirm",
                        onPress: () => updateSettlementStatus(selectedSettlement.id, status, actionNotes)
                      }
                    ]
                  );
                }}
              >
                <MaterialIcons
                  name={getStatusIcon(status)}
                  size={20}
                  color={getStatusColor(status)}
                />
                <Text style={[styles.actionButtonText, { color: getStatusColor(status) }]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            label="Notes (Optional)"
            value={actionNotes}
            onChangeText={setActionNotes}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.notesInput}
          />

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => {
                setShowActionModal(false);
                setSelectedSettlement(null);
                setActionNotes("");
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderSettlementItem = (settlement) => (
    <Card key={settlement.id} style={styles.settlementCard}>
      <Card.Content>
        <View style={styles.settlementHeader}>
          <View style={styles.settlementInfo}>
            <Text style={styles.settlementNumber}>{settlement.settlementNumber}</Text>
            <Text style={styles.sellerInfo}>
              {settlement.seller?.company_name || `Seller ID: ${settlement.sellerId}`}
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
            <Text style={[styles.statusText, { color: getStatusColor(settlement.settlementStatus) }]}>
              {settlement.settlementStatus}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.amountSummary}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Gross Sales:</Text>
            <Text style={styles.amountValue}>{formatCurrency(settlement.totalGrossSales)}</Text>
          </View>

          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Platform Revenue:</Text>
            <Text style={styles.platformRevenue}>{formatCurrency(settlement.platformRevenue)}</Text>
          </View>

          <View style={styles.netAmountRow}>
            <Text style={styles.netAmountLabel}>Net Settlement:</Text>
            <Text style={styles.netAmount}>{formatCurrency(settlement.totalNetSettlement)}</Text>
          </View>
        </View>

        <View style={styles.settlementFooter}>
          <Text style={styles.dateText}>
            Generated: {formatDate(settlement.created_at)}
          </Text>
          {settlement.settlementDate && (
            <Text style={styles.settlementDateText}>
              Settled: {formatDate(settlement.settlementDate)}
            </Text>
          )}
        </View>

        {getNextStatusOptions(settlement.settlementStatus).length > 0 && (
          <View style={styles.actionContainer}>
            <Button
              mode="contained"
              onPress={() => {
                setSelectedSettlement(settlement);
                setShowActionModal(true);
              }}
              style={styles.actionBtn}
              compact
            >
              Update Status
            </Button>
          </View>
        )}

        {settlement.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{settlement.notes}</Text>
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
      {renderActionModal()}

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

        <View style={styles.settlementsContainer}>
          <Text style={styles.sectionTitle}>All Settlements</Text>
          {settlements.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <FontAwesome5 name="calendar-times" size={48} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>No Settlements Found</Text>
                <Text style={styles.emptySubtitle}>
                  No settlements match the current filter
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
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          Alert.alert(
            "Generate Settlement",
            "This will automatically generate settlements for all eligible sellers for the previous month.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Generate",
                onPress: () => {
                  // This would trigger bulk settlement generation
                  Alert.alert("Info", "Settlement generation started for all eligible sellers");
                }
              }
            ]
          );
        }}
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
    marginHorizontal: 2,
    elevation: 2,
  },
  summaryContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 5,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#374151',
    marginTop: 2,
  },
  summaryAmount: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  settlementsContainer: {
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  settlementCard: {
    marginBottom: 15,
    elevation: 2,
  },
  settlementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  settlementInfo: {
    flex: 1,
  },
  settlementNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  sellerInfo: {
    fontSize: 14,
    color: '#374151',
    marginTop: 2,
  },
  settlementPeriod: {
    fontSize: 12,
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
  amountSummary: {
    marginBottom: 15,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  amountValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  platformRevenue: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  netAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F0F9FF',
    padding: 8,
    borderRadius: 6,
    marginTop: 5,
  },
  netAmountLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0C4A6E',
  },
  netAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0EA5E9',
  },
  settlementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  settlementDateText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  actionContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
  },
  notesContainer: {
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 12,
    color: '#6B7280',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: screenWidth - 40,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  currentStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  currentStatusLabel: {
    fontSize: 14,
    color: '#374151',
    marginRight: 10,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  notesInput: {
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default SettlementManagementScreen; 