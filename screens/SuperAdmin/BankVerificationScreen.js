import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { API_BASE } from "../../constants/exports";
import { useAuthStore } from "../../store/useAuthStore";

const BankVerificationScreen = () => {
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPendingAccounts();
  }, []);

  const fetchPendingAccounts = async () => {
    try {
      // const token = await getToken();
      const response = await fetch(`${API_BASE}/api/bank-details/pending`, {
        headers: {
        //   Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pending accounts");
      }

      const data = await response.json();
      setPendingAccounts(data);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (accountId, status) => {
    try {
      // const token = await getToken();
      const response = await fetch(
        `${API_BASE}/api/bank-details/${accountId}/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update verification status");
      }

      // Remove the verified account from the list
      setPendingAccounts((prevAccounts) =>
        prevAccounts.filter((account) => account.id !== accountId)
      );

      Alert.alert(
        "Success",
        `Bank account ${status.toLowerCase()} successfully`
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const renderAccountItem = ({ item }) => (
    <View style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View>
          <Text style={styles.bankName}>{item.bankName}</Text>
          <Text style={styles.accountHolder}>{item.accountHolderName}</Text>
        </View>
        <Text style={styles.accountNumber}>A/C: {item.accountNumber}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>IFSC Code:</Text>
          <Text style={styles.value}>{item.ifscCode}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Branch:</Text>
          <Text style={styles.value}>{item.branchName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Account Type:</Text>
          <Text style={styles.value}>{item.accountType}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => handleVerification(item.id, "REJECTED")}
        >
          <Ionicons name="close-circle" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Reject</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.verifyButton]}
          onPress={() => handleVerification(item.id, "VERIFIED")}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank Account Verification</Text>
      </View>

      {pendingAccounts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No pending verifications</Text>
        </View>
      ) : (
        <FlatList
          data={pendingAccounts}
          renderItem={renderAccountItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  accountCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  accountHeader: {
    marginBottom: 16,
  },
  bankName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  accountHolder: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    width: 100,
    fontSize: 14,
    color: "#666",
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  rejectButton: {
    backgroundColor: "#FF3B30",
  },
  verifyButton: {
    backgroundColor: "#34C759",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
});

export default BankVerificationScreen;
