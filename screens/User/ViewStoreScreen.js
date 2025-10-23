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
  TouchableOpacity,
  View
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import UserFabricCard from '../../components/UserFabricCard';
import { COLORS } from "../../constants/exports";
import { width } from "../../constants/helpers";
import { useCompanyStore } from "../../store/useCompanyStore";
const IMG = require("../../assets/company.jpg");

const ViewStoreScreen = ({ route, navigation }) => {
  const [selectedTab, setSelectedTab] = useState("Products");
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
    orders: 0,
  });

  const [isModalVisible, setModalVisible] = useState(false); // State to control modal visibility

  const tabs = ["Profile", "Products"];

  const { fetchCompanyDetails } = useCompanyStore();

  useEffect(() => {
    async function fetchDetails() {
      const res_data = await fetchCompanyDetails(manufacturer?.user_id);
      setPerson((prev) => ({
        ...prev,
        name: res_data?.company.name,
        phone_number: res_data?.company.phone_number,
        email: res_data.company.email,
        orders: res_data.orders,
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
            {/* Banner */}
            <Animated.Image
              source={IMG}
              style={{
                width: "100%",
                height: 200,
                borderRadius: 8,
                marginVertical: 10,
              }}
            />

            {/* Profile Table */}
            <View style={styles.tableContainer}>
              <Text style={styles.tableHeader}>Company Profile</Text>

              {/* Row: Name */}
              <View style={[styles.tableRow, styles.evenRow]}>
                <Text style={styles.tableLabel}>Name</Text>
                <Text style={styles.tableValue}>{manufacturer.company_user.name}</Text>
              </View>

              {/* Row: Phone */}
              {/* <View style={[styles.tableRow, styles.oddRow]}>
                <Text style={styles.tableLabel}>Phone</Text>
                <Text style={styles.tableValue}>
                  {manufacturer.company_user.phone_number}
                </Text>
              </View> */}

              {/* Row: Email */}
              <View style={[styles.tableRow, styles.evenRow]}>
                <Text style={styles.tableLabel}>Email</Text>
                <Text style={styles.tableValue}>
                  {manufacturer.company_user.email}
                </Text>
              </View>

              {/* Row: Company Name */}
              <View style={[styles.tableRow, styles.oddRow]}>
                <Text style={styles.tableLabel}>Company Name</Text>
                <Text style={styles.tableValue}>{data?.company_name}</Text>
              </View>

              {/* Row: PAN Number */}
              <View style={[styles.tableRow, styles.evenRow]}>
                <Text style={styles.tableLabel}>PAN Number</Text>
                <Text style={styles.tableValue}>{data?.pan_number}</Text>
              </View>

              {/* Row: GST Number */}
              <View style={[styles.tableRow, styles.oddRow, styles.verifiedBackground]}>

                <Text style={styles.tableLabel}>
                  <MaterialIcons
                    name="verified"
                    size={20}
                    color="green"
                    style={{ marginLeft: 10, marginTop: 10 }}
                  />
                  GST Number
                </Text>

                <Text style={styles.tableValue}>{data?.gst_number}</Text>
              </View>

              {/* Row: GST Certificate */}
              <View style={[styles.tableRow, styles.evenRow]}>
                <Text style={styles.tableLabel}>GST Certificate</Text>

                {data?.gst_certificate_url ? (
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={[styles.tableValue, { color: COLORS.secondary }]}>
                      View Certificate

                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.tableValue}>Not Uploaded</Text>
                )}
              </View>

              {/* Row: Total Orders */}
              <View style={[styles.tableRow, styles.evenRow]}>
                <Text style={styles.tableLabel}>Total Orders Processed</Text>
                <Text style={styles.tableValue}>{person.orders}</Text>
              </View>
            </View>
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

        {/* Modal for Zoomed Image */}
        {data?.gst_certificate_url ? (
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <ImageViewer
              imageUrls={[{ url: data?.gst_certificate_url }]} // Pass the image URL
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

export default ViewStoreScreen;

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
  verifiedBackground: {
    backgroundColor: "#88E78845",

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




  tableContainer: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: "600",
    padding: 12,
    backgroundColor: "#f6f6f6",
    color: "#000",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  evenRow: {
    backgroundColor: "#fdfdfd",
  },
  oddRow: {
    backgroundColor: "#f7faff",
  },
  tableLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  tableValue: {
    fontSize: 14,
    fontWeight: "400",
    color: "#555",
    flex: 2,
    textAlign: "right",
  },







});
