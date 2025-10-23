import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
  Searchbar
} from "react-native-paper";
import EmptyState from "../../components/EmptyState";
import { API_BASE } from "../../constants/exports";
import { STORAGE_KEYS } from '../../store/useAuthStore';
import useOrderStore from '../../store/useOrderStore';

const OrderMonitoringScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("Orders");
  const { updateOrderStatus } = useOrderStore();
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");


  const tabs = ["Orders", "Analytics", "Reports"];

  useEffect(() => {
    fetchData();
  }, [selectedTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);


      const headers = { Authorization: `Bearer ${token}` };
      if (selectedTab === "Orders") {
        const response = await axios.get(`${API_BASE}/orders`, {
          headers,
        });
        setOrders(response.data.data.orders || []);
      } else if (selectedTab === "Analytics") {
        const response = await axios.get(`${API_BASE}/orders/analytics`, {
          headers,
        });
        setAnalytics(response.data);
      } else if (selectedTab === "Reports") {
        const response = await axios.get(`${API_BASE}/orders/reports`, {
          headers,
        });
        setReports(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Use fallback data for demo
      if (selectedTab === "Orders") {
        setOrders([
          {
            id: 1,
            product: { product_name: "Cotton Fabric" },
            quantity: 50,
            total_amount: 2500,
            order_status: "pending",
            seller: { name: "ABC Textiles" },
            user: { name: "John Doe" },
            created_at: new Date().toISOString(),
            lr_number: "LR123456",
          },
          {
            id: 2,
            product: { product_name: "Silk Fabric" },
            quantity: 30,
            total_amount: 4500,
            order_status: "processing",
            seller: { name: "XYZ Fabrics" },
            user: { name: "Jane Smith" },
            created_at: new Date().toISOString(),
            lr_number: "LR789012",
          },
        ]);

      } else if (selectedTab === "Analytics") {
        setAnalytics({
          totalOrders: 156,
          pendingOrders: 23,
          completedOrders: 120,
          totalRevenue: 125000,
          avgOrderValue: 801.28,
          topProducts: [
            { name: "Cotton Fabric", orders: 45 },
            { name: "Silk Fabric", orders: 32 },
          ],
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#F4C430';
      case 'PROCESSING': return '#1E90FF';
      case 'DISPATCHED': return '#FF7F50';
      case 'DELIVERED': return '#2ECC71';
      case 'CANCELLED': return '#DC143C';
      default: return '#666';
    }
  };

  const handleOrderDelivery = (orderId) => {
    Alert.alert(
      'Deliver Order',
      'Are you sure you want to deliver this order?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => handleUpdateStatus(orderId, 'DELIVERED') }
      ]
    );
  };


  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status, status === 'DISPATCHED' ? lrNumber : null);
      Alert.alert('Success', 'Order status updated successfully',
        [
          {
            text: "OK",
            onPress: () => {
              fetchData(); // 'Refresh orders

            },
          },
        ],
        { cancelable: false }
      );

    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };


  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchQuery) ||
      order.product?.product_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (order.lr_number &&
        order.lr_number.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === "all" || order.orderStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const renderOrdersTab = () => {
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
        directionalLockEnabled={true}
      >
        {/* Search and Filters */}
        <View style={styles.searchSection}>
          <Searchbar
            placeholder="Search orders..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
          <ScrollView
            horizontal
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 4 }}
          >
            {[
              "all",
              "PENDING",
              "PROCESSING",
              "DISPATCHED",
              "DELIVERED",
              "CANCELLED",
            ].map((status) => (
              <Chip
                key={status}
                selected={selectedStatus === status}
                onPress={() => setSelectedStatus(status)}
                style={styles.filterChip}
                delayPressIn={0}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            title="No Orders Found"
            description="No orders match your current filters"
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery("");
              setSelectedStatus("all");
            }}
          />
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} style={styles.orderCard}>

              <Card.Content>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderTitle}>
                      {order.product.name}
                    </Text>

                    <Text style={styles.orderDate}>
                      {format(new Date(order.createdAt), "dd-MMM-yyyy, hh:mm a")}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(order.orderStatus) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {order.orderStatus.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.orderDetails}>
                  <View style={styles.detailRow}>
                    <Text>Id :</Text>
                    <Text style={styles.detailValue}>
                      {order.orderNumber}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text>Quantity:</Text>
                    <Text style={styles.detailValue}>
                      {order.quantity} meters
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text>Amount:</Text>
                    <Text style={styles.amount}>
                      ₹{order.finalAmount}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text>Seller:</Text>
                    <Text style={styles.detailValue}>
                      {order.seller?.company_name || "N/A"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text>Buyer:</Text>
                    <Text style={styles.detailValue}>
                      {order.user?.name || "N/A"}
                    </Text>
                  </View>
                  {order.lr_number && (
                    <View style={styles.detailRow}>
                      <Text>LR Number:</Text>
                      <Text style={styles.detailValue}>{order.lr_number}</Text>
                    </View>
                  )}
                </View>

                {order.orderStatus === 'DISPATCHED' && (
                  <View style={[styles.procesButtons]}>
                    <Button
                      mode="contained"
                      onPress={() => handleOrderDelivery(order.id)}
                      style={styles.actionButton}
                      title="Deliver Order"
                    >

                    </Button>
                  </View>
                )}
              </Card.Content>
              {order.orderStatus === 'PENDING' && (
                <View style={styles.actionButtons}>
                  <Button
                    mode="contained"
                    // onPress={() => handleOrderDelivery(order.id)}
                    style={[styles.cancelOrderButton, styles.modalButton]}
                    labelStyle={{ color: '#fff', fontWeight: '600' }} // ✅ text color white
                    buttonColor="#E53935" // optional background color
                  >
                    Cancel
                  </Button>

                </View>

              )}



            </Card>
          ))
        )}
      </ScrollView>
    );
  };

  const renderAnalyticsTab = () => {
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
        <Card style={styles.analyticsCard}>
          <Card.Content>
            <Text style={styles.analyticsTitle}>Order Analytics</Text>
            <View style={styles.analyticsGrid}>
              <View style={styles.analyticsItem}>
                <MaterialIcons name="shopping-cart" size={32} color="#132f56" />
                <Text style={styles.analyticsValue}>
                  {analytics?.totalOrders || 0}
                </Text>
                <Text style={styles.analyticsLabel}>Total Orders</Text>
              </View>
              <View style={styles.analyticsItem}>
                <MaterialIcons name="pending" size={32} color="#FFA500" />
                <Text style={styles.analyticsValue}>
                  {analytics?.pendingOrders || 0}
                </Text>
                <Text style={styles.analyticsLabel}>Pending</Text>
              </View>
              <View style={styles.analyticsItem}>
                <MaterialIcons name="check-circle" size={32} color="#4CAF50" />
                <Text style={styles.analyticsValue}>
                  {analytics?.completedOrders || 0}
                </Text>
                <Text style={styles.analyticsLabel}>Completed</Text>
              </View>
              <View style={styles.analyticsItem}>
                <MaterialIcons
                  name="currency-rupee"
                  size={32}
                  color="#132f56"
                />
                <Text style={styles.analyticsValue}>
                  ₹{analytics?.totalRevenue?.toLocaleString() || 0}
                </Text>
                <Text style={styles.analyticsLabel}>Total Revenue</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.analyticsCard}>
          <Card.Content>
            <Text style={styles.analyticsTitle}>Top Products</Text>
            {analytics?.topProducts?.map((product, index) => (
              <View key={index} style={styles.productRow}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productOrders}>
                  {product.orders} orders
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    );
  };

  const renderReportsTab = () => {
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
        <Card style={styles.reportCard}>
          <Card.Content>
            <View style={styles.reportHeader}>
              <View>
                <Text style={styles.reportTitle}>Daily Order Report</Text>
                <Text style={styles.reportSubtitle}>
                  Generate daily order summary
                </Text>
              </View>
              <TouchableOpacity style={styles.generateButton}>
                <MaterialIcons name="file-download" size={24} color="#132f56" />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.reportCard}>
          <Card.Content>
            <View style={styles.reportHeader}>
              <View>
                <Text style={styles.reportTitle}>Weekly Order Report</Text>
                <Text style={styles.reportSubtitle}>
                  Generate weekly order summary
                </Text>
              </View>
              <TouchableOpacity style={styles.generateButton}>
                <MaterialIcons name="file-download" size={24} color="#132f56" />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.reportCard}>
          <Card.Content>
            <View style={styles.reportHeader}>
              <View>
                <Text style={styles.reportTitle}>Monthly Order Report</Text>
                <Text style={styles.reportSubtitle}>
                  Generate monthly order summary
                </Text>
              </View>
              <TouchableOpacity style={styles.generateButton}>
                <MaterialIcons name="file-download" size={24} color="#132f56" />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  };

  // const renderSettingsTab = () => {
  //   return (
  //     <ScrollView style={styles.tabContent}>
  //       <Card style={styles.settingsCard}>
  //         <Card.Content>
  //           <Text style={styles.settingsTitle}>Order Management Settings</Text>

  //           <TouchableOpacity style={styles.settingItem}>
  //             <View style={styles.settingInfo}>
  //               <MaterialIcons name="notifications" size={24} color="#132f56" />
  //               <View style={styles.settingText}>
  //                 <Text style={styles.settingLabel}>Order Notifications</Text>
  //                 <Text style={styles.settingDescription}>
  //                   Manage order notification preferences
  //                 </Text>
  //               </View>
  //             </View>
  //             <MaterialIcons name="chevron-right" size={24} color="#666" />
  //           </TouchableOpacity>

  //           <TouchableOpacity style={styles.settingItem}>
  //             <View style={styles.settingInfo}>
  //               <MaterialIcons name="schedule" size={24} color="#132f56" />
  //               <View style={styles.settingText}>
  //                 <Text style={styles.settingLabel}>Auto-Update Settings</Text>
  //                 <Text style={styles.settingDescription}>
  //                   Configure automatic order updates
  //                 </Text>
  //               </View>
  //             </View>
  //             <MaterialIcons name="chevron-right" size={24} color="#666" />
  //           </TouchableOpacity>

  //           <TouchableOpacity style={styles.settingItem}>
  //             <View style={styles.settingInfo}>
  //               <MaterialIcons name="filter-list" size={24} color="#132f56" />
  //               <View style={styles.settingText}>
  //                 <Text style={styles.settingLabel}>Default Filters</Text>
  //                 <Text style={styles.settingDescription}>
  //                   Set default order filters
  //                 </Text>
  //               </View>
  //             </View>
  //             <MaterialIcons name="chevron-right" size={24} color="#666" />
  //           </TouchableOpacity>

  //           <TouchableOpacity style={styles.settingItem}>
  //             <View style={styles.settingInfo}>
  //               <MaterialIcons name="backup" size={24} color="#132f56" />
  //               <View style={styles.settingText}>
  //                 <Text style={styles.settingLabel}>Data Export</Text>
  //                 <Text style={styles.settingDescription}>
  //                   Export order data
  //                 </Text>
  //               </View>
  //             </View>
  //             <MaterialIcons name="chevron-right" size={24} color="#666" />
  //           </TouchableOpacity>
  //         </Card.Content>
  //       </Card>
  //     </ScrollView>
  //   );
  // };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Orders":
        return renderOrdersTab();
      case "Analytics":
        return renderAnalyticsTab();
      case "Reports":
        return renderReportsTab();
      //   case "Settings":
      //     return renderSettingsTab();
      default:
        return renderOrdersTab();
    }
  };

  return (
    <View style={styles.container}>
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





  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  modalButton: {
    flex: 1,
    marginTop: 8
  },
  cancelOrderButton: {
    borderColor: '#666',
    marginTop: 8,
    backgroundColor: '#DC143C',
  },




  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  tabContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  procesButtons: {

    // gap: 12,
    marginTop: 5,
    backgroundColor: '#fff',
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
    borderRadius: 20,
  },
  orderCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: "#ffffff",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 900,
    fontWeight: "700",
    color: "#000000",
  },
  orderSubtitle: {
    fontSize: 1,
    color: "#232b2b",
    fontWeight: "600",
    marginTop: 4,
  },
  orderDate: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  divider: {
    marginVertical: 12,
  },
  orderDetails: {
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
  amount: {
    fontWeight: "600",
    color: "#132f56",
  },
  orderActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#132f56",
    fontWeight: "500",
  },
  analyticsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  analyticsItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
  },
  analyticsValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#132f56",
    marginTop: 8,
  },
  analyticsLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  productOrders: {
    fontSize: 14,
    color: "#6B7280",
  },
  reportCard: {
    marginBottom: 16,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  reportSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  generateButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  settingsCard: {
    elevation: 2,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  settingDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
});

export default OrderMonitoringScreen;