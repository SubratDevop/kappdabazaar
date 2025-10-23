import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { ActivityIndicator, Button, Card, Divider } from "react-native-paper";
import EmptyState from "../components/EmptyState";
import {
  downloadFile,
  showDownloadSuccess,
} from "../components/FileDownloader";
import { API_BASE } from "../constants/exports";
import { useAuthStore } from "../store/useAuthStore";

const GSTReportsScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("Reports");
  const [reports, setReports] = useState([]);
  const [gstDetails, setGstDetails] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingReport, setDownloadingReport] = useState(null);

  const { authInfo } = useAuthStore();

  const tabs = ["Reports", "Ledgers", "Dashboard", "GST Details"];

  useEffect(() => {
    fetchData();
  }, [selectedTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = authInfo?.token;
      const headers = { Authorization: `Bearer ${token}` };
      if (selectedTab === "Reports") {
        const response = await axios.get(`${API_BASE}/tax/reports`, {
          headers,
        });
        setReports(response.data);
      } else if (selectedTab === "Dashboard") {
        const response = await axios.get(`${API_BASE}/tax/dashboard`, {
          headers,
        });
        setDashboardData(response.data);
      } else if (selectedTab === "GST Details") {
        const response = await axios.get(`${API_BASE}/tax/gst-details`, {
          headers,
        });
        console.log("GST DETAILS  ", response.data);
        setGstDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (reportId, format = "pdf") => {
    try {
      setDownloadingReport(reportId);
      const token = authInfo?.token;
      const fileName = `tax_report_${reportId}.${format}`;

      const fileUri = await downloadFile(
        `${API_BASE}/tax/reports/${reportId}/${format}`,
        fileName,
        { Authorization: `Bearer ${token}` }
      );

      showDownloadSuccess(fileName, fileUri);
    } catch (error) {
      console.error("Error downloading report:", error);
      Alert.alert("Error", "Failed to download report. Please try again.");
    } finally {
      setDownloadingReport(null);
    }
  };

  const downloadLedger = async (type, format = "pdf") => {
    try {
      setDownloadingReport(type);
      const token = authInfo?.token;
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();
      const fileName = `${type}_ledger.${format}`;

      const url = `${API_BASE}/tax/ledger/${type}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&format=${format}`;
      const fileUri = await downloadFile(url, fileName, {
        Authorization: `Bearer ${token}`,
      });

      showDownloadSuccess(fileName, fileUri);
    } catch (error) {
      console.error("Error downloading ledger:", error);
      Alert.alert("Error", "Failed to download ledger. Please try again.");
    } finally {
      setDownloadingReport(null);
    }
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

    if (reports.length === 0) {
      return (
        <EmptyState
          type="reports"
          actionText="Generate Report"
          onActionPress={() => navigation.navigate("GenerateReport")}
        />
      );
    }

    return (
      <ScrollView style={styles.tabContent}>
        {reports.map((report) => (
          <Card key={report.id} style={styles.reportCard}>
            <Card.Content>
              <View style={styles.reportHeader}>
                <View>
                  <Text style={styles.reportTitle}>
                    {report.reportType} -{" "}
                    {new Date(report.reportPeriod).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                  <Text style={styles.reportSubtitle}>
                    Status: {report.reportStatus}
                  </Text>
                </View>
                <View style={styles.reportActions}>
                  <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => downloadReport(report.id, "pdf")}
                    disabled={downloadingReport === report.id}
                  >
                    {downloadingReport === report.id ? (
                      <ActivityIndicator size="small" color="#132f56" />
                    ) : (
                      <MaterialIcons
                        name="picture-as-pdf"
                        size={24}
                        color="#132f56"
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => downloadReport(report.id, "excel")}
                    disabled={downloadingReport === report.id}
                  >
                    <MaterialIcons
                      name="table-chart"
                      size={24}
                      color="#132f56"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.reportDetails}>
                <View style={styles.detailRow}>
                  <Text>Total Sales:</Text>
                  <Text style={styles.amount}>
                    ₹{report.totalSales?.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text>Total Tax:</Text>
                  <Text style={styles.amount}>
                    ₹{report.totalTaxAmount?.toFixed(2)}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    );
  };

  const renderLedgersTab = () => {
    const ledgerTypes = [
      {
        type: "sales",
        title: "Sales Ledger",
        icon: "trending-up",
        description: "Download sales transactions",
      },
      {
        type: "purchase",
        title: "Purchase Ledger",
        icon: "trending-down",
        description: "Download purchase transactions",
      },
    ];

    return (
      <ScrollView style={styles.tabContent}>
        {ledgerTypes.map((ledger) => (
          <Card key={ledger.type} style={styles.ledgerCard}>
            <Card.Content>
              <View style={styles.ledgerHeader}>
                <View style={styles.ledgerInfo}>
                  <MaterialIcons name={ledger.icon} size={32} color="#132f56" />
                  <View style={styles.ledgerText}>
                    <Text style={styles.ledgerTitle}>{ledger.title}</Text>
                    <Text style={styles.ledgerDescription}>
                      {ledger.description}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.ledgerActions}>
                <Button
                  mode="outlined"
                  onPress={() => downloadLedger(ledger.type, "pdf")}
                  style={styles.ledgerButton}
                  disabled={downloadingReport === ledger.type}
                  loading={downloadingReport === ledger.type}
                >
                  PDF
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => downloadLedger(ledger.type, "excel")}
                  style={styles.ledgerButton}
                  disabled={downloadingReport === ledger.type}
                >
                  Excel
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    );
  };

  const renderDashboardTab = () => {
    if (loading) {
      return (
        <ActivityIndicator
          animating={true}
          size="large"
          style={styles.loader}
        />
      );
    }

    if (!dashboardData) {
      return <EmptyState type="analytics" />;
    }

    return (
      <ScrollView style={styles.tabContent}>
        <Card style={styles.dashboardCard}>
          <Card.Content>
            <Text style={styles.dashboardTitle}>Current Month Summary</Text>
            <View style={styles.dashboardGrid}>
              <View style={styles.dashboardItem}>
                <Text style={styles.dashboardValue}>
                  ₹{dashboardData.currentMonth?.sales?.toFixed(2) || "0.00"}
                </Text>
                <Text style={styles.dashboardLabel}>Sales</Text>
              </View>
              <View style={styles.dashboardItem}>
                <Text style={styles.dashboardValue}>
                  ₹{dashboardData.currentMonth?.tax || "0.00"}
                </Text>
                <Text style={styles.dashboardLabel}>Tax</Text>
              </View>
              <View style={styles.dashboardItem}>
                <Text style={styles.dashboardValue}>
                  {dashboardData.currentMonth?.orders || 0}
                </Text>
                <Text style={styles.dashboardLabel}>Orders</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

      </ScrollView>
    );
  };

  const renderGSTDetailsTab = () => {
    if (loading) {
      return (
        <ActivityIndicator
          animating={true}
          size="large"
          style={styles.loader}
        />
      );
    }

    if (!gstDetails) {
      return (
        <EmptyState
          type="gst"
          actionText="Add GST Details"
          onActionPress={() => navigation.navigate("Profile")}
        />
      );
    }

    return (
      <ScrollView style={styles.tabContent}>
        {gstDetails.map((item) => (
          <Card key={item.id} style={styles.dashboardCard}>
            <Card.Content>
              <Text style={styles.gstCardTitle}>GST Registration Details</Text>

              <View style={styles.gstDetailRow}>
                <Text style={styles.gstDetailLabel}>GSTIN:</Text>
                <Text style={styles.gstDetailValue}>{item.gstin}</Text>
              </View>

              <View style={styles.gstDetailRow}>
                <Text style={styles.gstDetailLabel}>Business Name:</Text>
                <Text style={styles.gstDetailValue}>{item.businessName}</Text>
              </View>

              <View style={styles.gstDetailRow}>
                <Text style={styles.gstDetailLabel}>Tax Category:</Text>
                <Text style={styles.gstDetailValue}>{item.taxCategory}</Text>
              </View>

              <View style={styles.gstDetailRow}>
                <Text style={styles.gstDetailLabel}>Tax Rate:</Text>
                <Text style={styles.gstDetailValue}>{item.taxRate}%</Text>
              </View>

              <View style={styles.gstDetailRow}>
                <Text style={styles.gstDetailLabel}>Tax Period:</Text>
                <Text style={styles.gstDetailValue}>{item.taxPeriod}</Text>
              </View>

              <View style={styles.gstDetailRow}>
                <Text style={styles.gstDetailLabel}>Status:</Text>
                <Text
                  style={[
                    styles.gstDetailValue,
                    { color: item.isActive ? "#10B981" : "#EF4444" },
                  ]}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Reports":
        return renderReportsTab();
      case "Ledgers":
        return renderLedgersTab();
      case "Dashboard":
        return renderDashboardTab();
      case "GST Details":
        return renderGSTDetailsTab();
      default:
        return renderReportsTab();
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
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
    // flex: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  reportCard: {
    marginBottom: 16,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  reportActions: {
    flexDirection: "row",
    gap: 8,
  },
  downloadButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  divider: {
    marginVertical: 12,
  },
  reportDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: {
    fontWeight: "600",
    color: "#132f56",
  },
  ledgerCard: {
    marginBottom: 16,
    elevation: 2,
  },
  ledgerHeader: {
    marginBottom: 16,
  },
  ledgerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ledgerText: {
    flex: 1,
  },
  ledgerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  ledgerDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  ledgerActions: {
    flexDirection: "row",
    gap: 12,
  },
  ledgerButton: {
    flex: 1,
  },
  dashboardCard: {
    marginBottom: 16,
    elevation: 2,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  dashboardGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dashboardItem: {
    alignItems: "center",
  },
  dashboardValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#132f56",
  },
  dashboardLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  gstInfo: {
    gap: 8,
  },
  gstLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  gstCard: {
    elevation: 2,
  },
  gstCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  gstDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  gstDetailLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  gstDetailValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
});

export default GSTReportsScreen;
