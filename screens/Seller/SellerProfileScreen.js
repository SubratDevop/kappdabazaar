import {
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { useAuthStore } from "../../store/useAuthStore";
import getAsyncStorageFn from "../../utils/constants";


const SellerProfileScreen = ({ route, navigation }) => {
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { clearStorage } = useAuthStore();

  useEffect(() => {
    async function fetchData() {
      // Fetch data or perform any action here
      const user_res = await getAsyncStorageFn();
      setUser(user_res);
    }
    setIsLoading(true);
    fetchData();
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    setIsModalVisible(false);
    clearStorage();
  };

  const handleMenuPress = (path) => {
    navigation.navigate(path);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 5 }}>
   
   <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          backgroundColor: "#F8FAFC",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 3,
          marginVertical: 5,
        }}
      >
        <Feather name="user" size={40} color="#969696" />
        <View style={{ paddingLeft: 15 }}>
          <Text style={{ fontSize: 21, fontWeight: "500" }}>{user?.name}</Text>
          <View>
            <Text style={{ fontSize: 12 }}>{user?.phone_number}</Text>
            <Text style={{ fontSize: 12 }}>{user?.email}</Text>
          </View>
        </View>
      </View>
       
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          backgroundColor: "#F8FAFC",
          paddingHorizontal: 8,
          paddingVertical: 10,
          borderRadius: 2,
        }}
      >
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View style={{ paddingLeft: 5 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#FF2626",
                paddingVertical: 5,
              }}
            >
              Log out
            </Text>
          </View>
          <View>
            <MaterialIcons name="logout" size={22} color="#FF2626" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ marginVertical: 3 }} />

      <View style={{ marginVertical: 10 }} />
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)} // Close the modal on back press
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                mode="elevated"
                onPress={() => setIsModalVisible(false)}
                textColor="#000" // Text color for Cancel button
              >
                Cancel
              </Button>
              <Button
                buttonColor="#EA4C4C" // Background color for Confirm button
                textColor="#fff" // Text color for Confirm button
                onPress={handleLogout}
                mode="elevated"
              >
                Confirm
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  logoutContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 2,
  },
  logoutButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FF2626",
    paddingVertical: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  statCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#132f56",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default SellerProfileScreen;
