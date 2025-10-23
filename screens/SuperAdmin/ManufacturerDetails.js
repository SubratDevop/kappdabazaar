import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import UserFabricCard from '../../components/UserFabricCard';
import { COLORS, URL_BASE } from "../../constants/exports";
import { width } from "../../constants/helpers";
import { useCompanyStore } from "../../store/useCompanyStore";
const IMG = require("../../assets/company.jpg");

const ManufacturerDetails = ({ route, navigation }) => {
  const [selectedTab, setSelectedTab] = useState("Profile");
  const { manufacturer } = route.params || {};
  const [products, setProducts] = useState([]);



  const [data, setData] = useState({
    company_name: "",
    pan_number: "",
    gst_number: "",
    gst_certificate_url: "",
  });

  const [person, setPerson] = useState({
    name: "",
    phone_number: "",
    email: "",
  });

  const [isModalVisible, setModalVisible] = useState(false); // State to control modal visibility

  const tabs = ["Profile", "Products", "Orders", "Payments"];

  const { fetchCompanyDetails } = useCompanyStore();

  useEffect(() => {
    async function fetchDetails() {
      const res_data = await fetchCompanyDetails(manufacturer?.user_id);
      setPerson((prev) => ({
        ...prev,
        name: res_data?.company.name,
        phone_number: res_data?.company.phone_number,
        email: res_data.company.email,
      }));
      setData((prev) => ({
        ...prev,
        company_name: res_data.company.CInfo?.company_name,
        pan_number: res_data.company.CInfo?.pan_number,
        gst_number: res_data.company.CInfo?.gst_number,
        gst_certificate_url: res_data.company.CInfo?.gst_certificate_url,
      }));

      if (res_data?.companyInfo !== null && res_data?.companyInfo !== undefined) {
        setData(res_data?.companyInfo);
      }
      if (res_data?.product && Array.isArray(res_data.product)) {
        setProducts(res_data.product);
      }
    }
    fetchDetails();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Scrollable Content */}
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedTab(tab)}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
          >
            <View style={styles.tabContent}>
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }} // Ensures space for buttons
      >
        {selectedTab === "Profile" && (
          <View style={{ padding: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: "600" }}>Profile</Text>
            </View>

            <Animated.Image
              source={IMG}
              style={[
                {
                  width: "100%",
                  height: 200,
                  borderRadius: 8,
                  marginVertical: 10,
                },
              ]}
            />

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                value={manufacturer.company_user.name}
                style={[styles.textInput]}
                editable={false}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Phone No</Text>
              <TextInput
                value={manufacturer.company_user.phone_number}
                style={[styles.textInput]}
                editable={false}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                value={manufacturer.company_user.email}
                style={[styles.textInput]}
                editable={false}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Company Name</Text>
              <TextInput
                value={data?.company_name}
                style={[styles.textInput]}
                editable={false}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>PAN Number</Text>
              <TextInput
                value={data?.pan_number}
                style={[styles.textInput]}
                editable={false}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>GST Number</Text>
              <TextInput
                value={data?.gst_number}
                style={[styles.textInput]}
                editable={false}
              />
            </View>

            <View style={styles.formGroup}>
              <Text
                style={[
                  styles.inputLabel,
                  { color: COLORS.secondary, fontSize: 16 },
                ]}
              >
                GST Certificate
              </Text>
            </View>
            {/* Uploaded Image Preview */}
            {data?.gst_certificate_url && (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                  source={{ uri: URL_BASE + data?.gst_certificate_url }}
                  style={{
                    width: "100%",
                    height: 200,
                    marginTop: 10,
                    borderRadius: 10,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        {selectedTab === "Products" && (
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {products.length > 0 ? (
              <FlatList
                data={products}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2} // 👈 Show 2 items per row
                columnWrapperStyle={{ justifyContent: "space-between" }}
                contentContainerStyle={{ padding: 10 }}

                // renderItem={({ item }) => (
                //   <View
                //     style={{
                //       backgroundColor: "#fff",
                //       borderRadius: 12,
                //       marginBottom: 15,
                //       flex: 1,
                //       marginHorizontal: 5,
                //       shadowColor: "#000",
                //       shadowOpacity: 0.1,
                //       shadowRadius: 6,
                //       elevation: 3,
                //       overflow: "hidden",
                //     }}
                //   >
                //     {/* Product Image */}
                //     <Image
                //       source={
                //         item.image_url
                //           // ? { uri: item.image_url }
                //           ? { uri: JSON.parse(product_images) }
                //           : require("../../assets/images/no_products.jpg")
                //       }
                //       style={{ width: "100%", height: 140 }}
                //       resizeMode="cover"
                //     />

                //     {/* Product Info */}
                //     <View style={{ padding: 10 }}>
                //       <Text
                //         style={{
                //           fontSize: 14,
                //           fontWeight: "600",
                //           color: "#000",
                //           marginBottom: 4,
                //         }}
                //         numberOfLines={1}
                //       >
                //         {item.name}
                //       </Text>

                //       <Text
                //         style={{
                //           fontSize: 12,
                //           color: "#555",
                //           marginBottom: 6,
                //         }}
                //         numberOfLines={1}
                //       >
                //         {item.category}
                //       </Text>

                //       <Text
                //         style={{
                //           fontSize: 15,
                //           fontWeight: "bold",
                //           color: "#ff6347",
                //         }}
                //       >
                //         ₹ {item.price}
                //       </Text>
                //     </View>
                //   </View>
                // )}
                renderItem={({ item }) => <UserFabricCard fabric={item} navigation={navigation} />}

              />
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  padding: 20,
                }}
              >
                <Image
                  source={require("../../assets/images/no_products.jpg")}
                  style={{ width: 250, height: 250 }}
                />
                <Text
                  style={{
                    fontSize: 19,
                    fontWeight: "600",
                    color: "#000",
                    textAlign: "center",
                    marginTop: 10,
                  }}
                >
                  No Products
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    color: "#555",
                    textAlign: "center",
                    marginTop: 6,
                  }}
                >
                  No products have been added yet.
                </Text>
              </View>
            )}
          </View>
        )}


        {selectedTab === "Orders" && (
          <View style={{ flex: 1, padding: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
            <Image source={require("../../assets/images/no_products.jpg")} style={{ width: 300, height: 300 }} />
            <Text style={{ fontSize: 19, fontWeight: "500", color: "#000", textAlign: "center", marginTop: 10 }}>No Orders</Text>
            <Text style={{ fontSize: 14, fontWeight: "400", color: "#000", textAlign: "center", marginTop: 10 }}>No orders have been placed yet.</Text>
          </View>
        )}

        {selectedTab === "Payments" && (
          <View style={{ flex: 1, padding: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
            <Image source={require("../../assets/images/no_products.jpg")} style={{ width: 300, height: 300 }} />
            <Text style={{ fontSize: 19, fontWeight: "500", color: "#000", textAlign: "center", marginTop: 10 }}>No Payments</Text>
            <Text style={{ fontSize: 14, fontWeight: "400", color: "#000", textAlign: "center", marginTop: 10 }}>No payments have been made yet.</Text>
          </View>
        )}

        {/* Modal for Zoomed Image */}
        {data?.gst_certificate_url ? (
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <ImageViewer
              imageUrls={[{ url:  URL_BASE + data?.gst_certificate_url }]} // Pass the image URL
              enableSwipeDown={true} // Allow swipe down to close
              onSwipeDown={() => setModalVisible(false)}
              renderHeader={() => (
                <TouchableOpacity
                  style={[
                    styles.closeButton,
                    { top: 40, right: 20, zIndex: 1000 },
                  ]}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={22} color="#000" />
                </TouchableOpacity>
              )}
            />
          </Modal>
        ) : (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "#000",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            No GST Certificate Uploaded
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ManufacturerDetails;

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 15,
    backgroundColor: "#F8FAFC",
  },
  disabledInput: {
    backgroundColor: "#FBFBFB",
    color: "#999",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "90%",
    height: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  tableContainer: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: "500",
    padding: 10,
    backgroundColor: "#DFDFDF",
    color: "#000",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  evenRow: {
    backgroundColor: "#F8FAFC",
  },
  oddRow: {
    backgroundColor: "#F2F9FF",
  },
  tableLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  tableValue: {
    fontSize: 14,
    fontWeight: "400",
    color: "#555",
    textAlign: "left",
    alignItems: "flex-start",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  fullButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: "#ff6347",
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    color: "#000",
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    // marginTop: 8,
    marginBottom: 3,
    height: 50,
  },
  tab: {
    flex: 1, // Each tab takes equal space
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#ff6347",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4, // Adds space between icon and text
  },
  tabText: {
    color: "#000",
    fontWeight: "600",
    marginTop: 2,
    fontSize: 13,
  },
  activeTabText: {
    color: "#ff6347",
  },
  content: {
    flex: 1,
    alignItems: "flex-start",
    width: width,
    backgroundColor: "#fff",
    padding: 10,
  },
});
