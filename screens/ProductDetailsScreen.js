import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { URL_BASE, colors } from '../constants/exports';

import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImageView from "react-native-image-zoom-viewer";
import { Badge, Button, Card } from "react-native-paper";
import { useAuthStore } from "../store/useAuthStore";
import { useProductStore } from "../store/useProductStore";

const { width, height } = Dimensions.get("window");

// Modern MOQ Card Component
const MOQCard = ({ moq, isSelected, onSelect }) => {
  if (!moq) return null;

  return (
    <TouchableOpacity
      style={[styles.moqCard, isSelected && styles.selectedMoqCard]}
      onPress={() => onSelect(moq)}
    >
      <View style={styles.moqHeader}>
        <Text
          style={[styles.moqQuantity, isSelected && styles.selectedMoqText]}
        >
          {moq.quantity || 0}m
        </Text>
        {moq.discount && (
          <Badge style={styles.discountBadge} size={16}>
            -{moq.discount}%
          </Badge>
        )}
      </View>
      <Text style={[styles.moqPrice, isSelected && styles.selectedMoqText]}>
        ₹{moq.price || 0}/m
      </Text>
      {/* <Text style={styles.moqSavings}>
        Save ₹{((moq.mrp || moq.price * 1.2) - moq.price).toFixed(0)}
      </Text> */}
    </TouchableOpacity>
  );
};

// Modern Company Card Component
const ModernCompanyCard = ({ company, onPress }) => {
  if (!company) return null;

  return (
    <Card style={styles.modernCompanyCard} onPress={onPress}>
      <Card.Content style={styles.companyCardContent}>
        <View style={styles.companyHeader}>
          <Image
            source={{ uri: company.logo || "https://via.placeholder.com/60" }}
            style={styles.companyLogo}
          />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{company.name || "Company"}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>
                  ⭐ {company.rating || "4.8"}
                </Text>
              </View>
              <Text style={styles.responseText}>
                {company.responseRate || "98%"} response rate
              </Text>
            </View>
            <View style={styles.verificationContainer}>
              <MaterialIcons name="verified" size={16} color="#10B981" />
              <Text style={styles.verifiedText}>Verified Supplier</Text>
            </View>
          </View>
          {/* <Ionicons name="chevron-forward" size={24} color="#666" /> */}
        </View>
      </Card.Content>
    </Card>
  );
};

// Modern Attribute Chip Component
const AttributeChip = ({ label, value }) => {
  if (!label || !value) return null;

  return (
    <View style={styles.attributeChip}>
      <Text style={styles.attributeLabel}>{label}</Text>
      <Text style={styles.attributeValue}>{value}</Text>
    </View>
  );
};

const ProductDetailsScreen = ({ navigation, route }) => {
  // Safe parameter extraction
  const product = route?.params?.product || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedMoq, setSelectedMoq] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { item, isLoading, fetchProduct, saveProductFn, checkSavedProductFn } =
    useProductStore();
  const { userRole } = useAuthStore();

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {

    if (product?.product_id) {
      fetchProduct(product.product_id);
      fetchSaved();
    }
  }, [product]);

  useEffect(() => {
    if (item?.moqs && Array.isArray(item.moqs) && item.moqs.length > 0) {
      setSelectedMoq(item.moqs[0]);
    }
    if (
      item?.available_colors &&
      Array.isArray(item.available_colors) &&
      item.available_colors.length > 0
    ) {
      setSelectedColor(item.available_colors[0]);
    }
  }, [item]);


  const details = [
    { label: "Description", value: item["description"] },
    { label: "Category", value: item["category"] },
    { label: "Material", value: item["material"] },
    { label: "Pattern", value: item["pattern"] },
    { label: "Color", value: item["color"] },
    { label: "GSM", value: item["fabricWeight"] },
    { label: "Width", value: item["fabricWidth"] },
    { label: "HSN Code", value: item["hsn_code"] },

  ];


  const fetchSaved = async () => {
    try {
      if (product?.product_id) {
        const savedRes = await checkSavedProductFn(product.product_id, 1);
        if (savedRes && typeof savedRes.saved === "boolean") {
          setSaved(savedRes.saved);
        }
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const handleShare = async () => {
    try {
      const productName = item?.product_name || "Product";
      const productPrice = selectedMoq?.price || 0;
      const productId = item?.product_id || "";

      await Share.share({
        message: `Check out this amazing fabric: ${productName}
Price: ₹${productPrice}/meter
View more details in Kapda Bazaar app!`,
        url: `https://kapdabazaar.com/product/${productId}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleSaveProduct = async () => {
    try {
      if (product?.product_id) {
        await saveProductFn(product.product_id, 1);
        await fetchSaved();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save product. Please try again.");
    }
  };

  const onScroll = (event) => {
    if (event?.nativeEvent?.contentOffset) {
      const scrollX = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollX / width);
      setCurrentIndex(index);
    }
  };

  const handleScrollY = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        if (event?.nativeEvent?.contentOffset) {
          const offsetY = event.nativeEvent.contentOffset.y;
          const opacity = Math.min(offsetY / 200, 1);
          headerOpacity.setValue(opacity);
        }
      },
    }
  );

  // Safe data access with fallbacks
  // const productImages =
  //   item.product_images && Array.isArray(item.product_images)
  //     ? item.product_images
  //     : [];
  let imageArray = [];
  if (Array.isArray(item.product_images)) {
    // Already an array
    imageArray = item.product_images;
  } else if (typeof item.product_images === "string") {
    try {
      imageArray = JSON.parse(item.product_images);
    } catch (e) {
      console.error("Invalid JSON in product_images:", item.product_images);
      imageArray = [];
    }
  } else {
    imageArray = [];
  }

  const productMoqs = item?.moqs && Array.isArray(item.moqs) ? item.moqs : [];
  const productAttributes =
    item?.key_attributes && typeof item.key_attributes === "object"
      ? item.key_attributes
      : {};
  const images = imageArray.map((url) => ({ url: `${URL_BASE}${url}` || "" }));

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6347" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (!item || Object.keys(item).length === 0) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color="#666" />
        <Text style={styles.errorText}>Product not found</Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {item?.name || "Product Details"}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#000" />
          </TouchableOpacity>
          {!(userRole === "seller") && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleSaveProduct}
            >
              <Ionicons
                name={saved ? "heart" : "heart-outline"}
                size={24}
                color={saved ? "#ff6347" : "#000"}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        onScroll={handleScrollY}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          {imageArray.length > 0 ? (
            // <TouchableOpacity
            //   onPress={() => setShowImageViewer(true)}
            //   activeOpacity={0.9}
            // >
            <FlatList
              data={imageArray}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={true}
              keyExtractor={(index) => index.toString()}
              renderItem={({ item: image, index }) => (

                <TouchableOpacity
                  onPress={() => {
                    setCurrentIndex(index); // save which image was tapped
                    setShowImageViewer(true);
                  }}
                  activeOpacity={0.9}
                >

                  <Image
                    source={{ uri: `${URL_BASE}${image}` || "https://via.placeholder.com/400" }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />


                </TouchableOpacity>
              )}
              onScroll={onScroll}
              scrollEventThrottle={16}
            />
            // </TouchableOpacity>
          ) : (
            <View style={styles.placeholderImageContainer}>
              <MaterialIcons name="image" size={64} color="#ccc" />
              <Text style={styles.placeholderText}>No images available</Text>
            </View>
          )}

          {/* Image Indicators */}
          {imageArray.length > 1 && (
            <View style={styles.imageIndicators}>
              {imageArray.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    currentIndex === index && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Floating Action Buttons */}
          <View style={styles.floatingActions}>
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={20} color="#000" />
            </TouchableOpacity>
            {!(userRole === "seller") && (
              <TouchableOpacity
                style={[styles.floatingButton, saved && styles.savedButton]}
                onPress={handleSaveProduct}
              >
                <Ionicons
                  name={saved ? "heart" : "heart-outline"}
                  size={20}
                  color={saved ? "#fff" : "#000"}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          {/* Brand and Name */}
          <View style={styles.brandSection}>
            <Text style={styles.brandName}>
              {item?.company_info?.company_name || "Brand"}
            </Text>
            <Text style={styles.productName}>
              {item?.name || "Product Name"}
            </Text>
            <Text style={styles.productDesc}>
              {item?.description || "Product Description"}
            </Text>
          </View>

          {/* Rating and Reviews
          <View style={styles.ratingSection}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>4.3 ⭐</Text>
            </View>
            <Text style={styles.reviewCount}>199 reviews</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProductReviews", { product: item })
              }
            >
              <Text style={styles.viewReviews}>View all</Text>
            </TouchableOpacity>
          </View> */}


          {/* Price Section */}

          <View style={styles.priceSection}>
            <Text style={styles.currentPrice}>
              ₹{selectedMoq?.price || productMoqs[0]?.price || 0}
            </Text>
            {/* <Text style={styles.originalPrice}>
              ₹
              {(
                (selectedMoq?.price || productMoqs[0]?.price || 0) * 1.2
              ).toFixed(0)}
            </Text> */}
            {/* <Text style={styles.discount}>20% OFF</Text> */}
            <Text style={styles.priceUnit}>per meter</Text>
          </View>

          {/* MOQ Selection */}
          {productMoqs.length > 0 && (
            <View style={styles.moqSection}>
              <Text style={styles.sectionTitle}>Select Quantity</Text>
              <FlatList
                data={productMoqs}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) =>
                  item?.moq_id?.toString() || Math.random().toString()
                }
                renderItem={({ item: moq }) => (
                  <MOQCard
                    moq={moq}
                    isSelected={selectedMoq?.moq_id === moq?.moq_id}
                    onSelect={setSelectedMoq}
                  />
                )}
                contentContainerStyle={styles.moqList}
              />
            </View>
          )}

          {/* Product Attributes */}
          {Object.keys(productAttributes).length > 0 && (
            <View style={styles.attributesSection}>
              <Text style={styles.sectionTitle}>Product Details</Text>
              <View style={styles.attributesGrid}>
                {Object.entries(productAttributes).map(
                  ([key, value], index) => (
                    <AttributeChip key={index} label={key} value={value} />
                  )
                )}
              </View>
            </View>
          )}

          {/*  Produc Details */}
          <View style={styles.companySection}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <Card style={styles.modernCompanyCard}>
              <Card.Content style={styles.companyCardContent}>
                {details.map((item, index) => (
                  <View key={index} style={styles.row}>
                    <Text style={styles.label}>{item.label}</Text>
                    <Text style={styles.value}>{item.value || "-"}</Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          </View>

          {/* Company Details */}
          <View style={styles.companySection}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <ModernCompanyCard
              company={{
                name: item?.company_info?.company_name || "Paramount Tech Pvt Ltd",
                logo: item?.company_info?.company_logo,
                rating: "4.8",
                responseRate: "98%",
                responseTime: "< 24h",
              }}
              onPress={() =>
                navigation.navigate("ViewStoreScreen", {
                  manufacturer: item?.company_info,
                })
              }
            />
          </View>

          {/* Reviews Section */}
          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ProductReviews", { product: item })
                }
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.writeReviewButton}
              onPress={() =>
                navigation.navigate("ProductReviews", {
                  product: item,
                  openWrite: true,
                })
              }
            >
              <MaterialIcons name="rate-review" size={20} color="#ff6347" />
              <Text style={styles.writeReviewText}>Write a Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      {/* {!(userRole === "seller") && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() =>
              navigation.navigate("PersonalChat", {
                companyId: item?.company_id,
                productId: item?.product_id,
              })
            }
          >
            <Ionicons name="chatbubble-outline" size={22} color="#fff" />
            <Text style={styles.contactText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.orderButton}
            onPress={() =>
              navigation.navigate("QuantitySelection", {
                moqs: productMoqs,
                product: item,
              })
            }
          >
            <LinearGradient
              colors={["#ff6347", "#ff4500"]}
              style={styles.orderGradient}
            >
              <Text style={styles.orderText}>Place Order</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )} */}

      {!(userRole === "seller") && (
        <View style={styles.bottomBar}>

          <TouchableOpacity
            style={styles.contactButton}
            onPress={() =>
              navigation.navigate("PersonalChat", {
                companyId: item?.company_id,
                productId: item?.product_id,
              })
            }
          >
            <Ionicons name="chatbubble-outline" size={22} color="#fff" />
            <Text style={styles.contactText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.orderButton}
            onPress={() =>
              navigation.navigate("QuantitySelection", {
                moqs: productMoqs,
                product: item,
              })
            }
          >
            <LinearGradient
              colors={["#264577", "#264577"]}
              style={styles.orderGradient}
            >
              <Text style={styles.orderText}>Place Order</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Image Viewer Modal */}
      {showImageViewer && images.length > 0 && (
        <Modal
          visible={showImageViewer}
          transparent={true}
          onRequestClose={() => setShowImageViewer(false)}
        >
          <View style={styles.imageViewerContainer}>
            <ImageView
              imageUrls={images}
              index={currentIndex}
              enableSwipeDown={true}
              onSwipeDown={() => setShowImageViewer(false)}
              renderHeader={() => (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowImageViewer(false)}  // ✅ fixed
                >
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,

    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee45",
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  value: {
    fontSize: 14,
    color: "#666",
  },
  container: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2, // shadow for Android
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    paddingVertical: 8,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  value: {
    fontSize: 14,
    color: "#555",
  },

  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "400",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#6D6D80",
    marginTop: 12,
    marginBottom: 20,
    fontWeight: "500",
  },
  backButton: {
    backgroundColor: "#FF6B6B",
  },
  header: {
    position: "absolute",
    top: 34,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 5,
    zIndex: 1000,
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
  },
  headerButton: {
    padding: 8,
    borderRadius: 18,
    backgroundColor: "#F8F8F8",
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#2C2C2E",
    textAlign: "center",
    marginHorizontal: 12,
  },
  headerActions: {
    flexDirection: "row",
    gap: 6,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    height: height * 0.5,
    backgroundColor: "#F5F5F5",
  },
  productImage: {
    width: width,
    height: height * 0.5,
  },
  placeholderImageContainer: {
    width: width,
    height: height * 0.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: "#A8A8A8",
    fontWeight: "400",
  },
  imageIndicators: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: "#FFFFFF",
    width: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  floatingActions: {
    position: "absolute",
    top: 55,
    right: 14,
    gap: 8,
  },
  floatingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
  },
  savedButton: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
  },
  productInfo: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  brandSection: {
    marginBottom: 12,
  },
  brandName: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C2C2E",
    marginTop: 4,
    lineHeight: 24,
  },
  productDesc: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C2C2E",
    marginTop: 4,
    lineHeight: 24,
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingBadge: {
    backgroundColor: "#34C759",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    elevation: 1,
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  ratingText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  reviewCount: {
    fontSize: 12,
    color: "#8E8E93",
    marginRight: 8,
    fontWeight: "400",
  },
  viewReviews: {
    fontSize: 12,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    flexWrap: "wrap",
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.lightGray,
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C2C2E",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: "#A8A8A8",
    textDecorationLine: "line-through",
    marginRight: 8,
    fontWeight: "400",
  },
  discount: {
    fontSize: 11,
    color: "#34C759",
    fontWeight: "600",
    marginRight: 8,
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priceUnit: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "400",
  },
  moqSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C2C2E",
    marginBottom: 12,
  },
  moqList: {
    paddingVertical: 6,
  },
  moqCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginRight: 8,
    minWidth: 85,
    borderWidth: 1,
    borderColor: colors.lightGray,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  selectedMoqCard: {
    backgroundColor: colors.navyBlue,
    borderColor: colors.lightGray,
    elevation: 2,
    shadowColor: colors.lightGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  moqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  moqQuantity: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C2C2E",
  },
  selectedMoqText: {
    color: "#FFFFFF",
  },
  discountBadge: {
    backgroundColor: "#34C759",
  },
  moqPrice: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.navyBlue,
    marginBottom: 4,
  },
  moqSavings: {
    fontSize: 10,
    color: colors.navyBlue,
    fontWeight: "500",
  },
  attributesSection: {
    marginBottom: 20,
  },
  attributesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  attributeChip: {
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: colors.lightGray,
  },
  attributeLabel: {
    fontSize: 10,
    color: "#8E8E93",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },
  attributeValue: {
    fontSize: 12,
    color: "#2C2C2E",
    fontWeight: "600",
    marginTop: 2,
  },
  companySection: {
    marginBottom: 20,
  },
  modernCompanyCard: {
    elevation: 1,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: colors.lightGray,
  },
  companyCardContent: {
    padding: 5,
  },
  companyHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C2C2E",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  responseText: {
    fontSize: 11,
    color: "#8E8E93",
    fontWeight: "400",
  },
  verificationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  verifiedText: {
    fontSize: 11,
    color: "#34C759",
    marginLeft: 4,
    fontWeight: "500",
  },
  reviewsSection: {
    marginBottom: 100,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 12,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  writeReviewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: "#FF6B6B",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    elevation: 1,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  writeReviewText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "500",
    marginLeft: 6,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopWidth: 0.5,
    borderTopColor: colors.lightGray,
  },
  contactButton: {
    flex: 1,
    backgroundColor: "#6D6D80",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 8,
    elevation: 2,
    shadowColor: "#6D6D80",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  contactText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  orderButton: {
    flex: 2,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  orderGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  orderText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  imageViewerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
  },
  closeButton: {
    position: "absolute",
    top: 55,
    right: 16,
    zIndex: 1000,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 18,
  },
});

export default ProductDetailsScreen;
