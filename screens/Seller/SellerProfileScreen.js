import {
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Linking,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { useAuthStore } from "../../store/useAuthStore";
import getAsyncStorageFn from "../../utils/constants";
import { width } from '../../constants/helpers';


const SellerProfileScreen = ({ route, navigation }) => {
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
      const [modalVisible, setModalVisible] = useState(false);
  

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


      // delete account modal
      const DeleteAccountModal = ({ visible, onClose, onConfirm }) => {
      return (
          <Modal
              transparent
              animationType="fade"
              visible={visible}
              onRequestClose={onClose}
          >
              <View style={styles.overlayCentered}>
                  <View style={styles.deleteModalBox}>
                      {/* 🗑️ Trash Icon */}
                      <Image
                          source={{
                              uri: "https://cdn-icons-png.flaticon.com/512/1214/1214428.png", // red trash icon
                          }}
                          style={styles.deleteIcon}
                      />
  
                      {/* Confirmation Text */}
                      <Text style={styles.deleteTitle}>
                          Are you sure you want to delete your account?
                      </Text>
  
                      {/* Buttons */}
                      <TouchableOpacity
                          style={styles.deleteButtonConfirm}
                          onPress={onConfirm}
                      >
                          <Text style={styles.deleteButtonText}>Yes, Delete</Text>
                      </TouchableOpacity>
  
                      <TouchableOpacity onPress={onClose}>
                          <Text style={styles.keepButtonText}>Keep Account</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </Modal>
      );
  };

      const handleDelete = () => {
        console.log("Account deleted successfully");
        setModalVisible(false);
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
          <Text style={{ fontSize: 21, fontWeight: "500", color: "#000000ff" }}>{user?.name}</Text>
          <View>
            <Text style={{ fontSize: 12, color: "#000000ff" }}>{user?.phone_number}</Text>
            <Text style={{ fontSize: 12, color: "#000000ff" }}>{user?.email}</Text>
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
                paddingVertical: 5,
                color: "#000000ff"
              }}
            >
              Log out
            </Text>
          </View>
          <View>
            <MaterialIcons name="logout" size={22} color="black"/>
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
    
    
    <DeleteAccountModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onConfirm={handleDelete}
                />
    
                {/* Delete account Section */}
                <View style={styles.deleteAccountContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.logoutButton}>
                        <View style={{ paddingLeft: 5 }}>
                            <Text style={styles.deleteAccountext}>Delete Account</Text>
                        </View>
                        <View>
                            <MaterialIcons name="delete" size={22} color="#FF2626" />
                        </View>
                    </TouchableOpacity>
                </View>
    
                <View style={{ marginVertical: 10 }} />
    
    
    
    </ScrollView>
  );
};

const styles = StyleSheet.create({



overlayCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
},
deleteModalBox: {
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
},
deleteIcon: {
    width: 60,
    height: 60,
    tintColor: "#ff4d4f",
    marginBottom: 15,
},
deleteTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#111",
    marginBottom: 25,
    lineHeight: 22,
},
deleteButtonConfirm: {
    backgroundColor: "#ff4d4f",
    borderRadius: 25,
    paddingVertical: 10,
    width: "75%",
    alignItems: "center",
    marginBottom: 12,
},
deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
},
keepButtonText: {
    color: "#ff4d4f",
    fontWeight: "600",
    fontSize: 15,
},


  deleteAccountContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#ff4d4f20", // 🔴 soft red accent (rgba-ish)
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 10,
    },

        deleteAccountext: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ff4d4f",
        paddingVertical: 5,
    },

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
