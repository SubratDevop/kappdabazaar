import React, { useState } from "react";
import {
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"; // or { MaterialIcons } from "@expo/vector-icons";

export default function CustomerSupport() {
  const [modalVisible, setModalVisible] = useState(false);

  // Function to open phone dialer
  const handleCall = () => {
    Linking.openURL("tel:+919876543210"); // replace with your number
  };

  // Function to open Gmail
  const handleMail = () => {
    Linking.openURL("mailto:support@example.com?subject=Support&body=Hello");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* Trigger Button */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: "#FF6B6B" }]}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="support-agent" size={30} color="#fff" />
        <Text style={styles.cardTitle}>Customer Support</Text>
        <Text style={styles.cardSubtitle}>Chat with customers</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
                transparent={true}
                visible={customerSupprtModalVisible}
                animationType="slide"
                onRequestClose={() => setcustomerSupprtModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setcustomerSupprtModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        {/* Prevent closing when tapping inside */}
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContainer}>
                                {/* Close "X" icon */}
                                <TouchableOpacity
                                    onPress={() => setcustomerSupprtModalVisible(false)}
                                    style={{ position: "absolute", top: 10, right: 10 }}
                                >
                                    <MaterialIcons name="close" size={28} color="red" />
                                </TouchableOpacity>

                                <Text style={styles.modalTitle}>Customer Support</Text>

                                <View style={styles.iconRow}>
                                    <TouchableOpacity onPress={handleCall} style={styles.iconButton}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <MaterialIcons name="call" size={25} color="green" />
                                            <Text style={{ marginLeft: 10 }}>+91 9930196361</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={handleMail} style={styles.iconButton}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <MaterialIcons name="email" size={25} color="red" />
                                            <Text style={{ marginLeft: 10 }}>kapdabazaar1989@gmail.com</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

    
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  iconButton: {
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#FF6B6B",
    padding: 10,
    borderRadius: 8,
  },
});
