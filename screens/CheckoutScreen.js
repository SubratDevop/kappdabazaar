import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Chip, Divider, RadioButton } from "react-native-paper";
import RazorpayCheckout from 'react-native-razorpay';
import { URL_BASE, colors } from '../constants/exports';
import TaxService from '../services/TaxService';
import { STORAGE_KEYS, useAuthStore } from '../store/useAuthStore';
import useOrderStore from "../store/useOrderStore";


// Modern Address Input Component
const AddressInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  style,
  icon,
}) => (
  <View style={[styles.inputContainer, style]}>
    {icon && (
      <MaterialIcons
        name={icon}
        size={20}
        color="#8E8E93"
        style={styles.inputIcon}
      />
    )}
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#A8A8A8"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || "default"}
    />
  </View>
);

// Modern Payment Option Component
const PaymentOption = ({
  value,
  selectedValue,
  onSelect,
  title,
  description,
  icon,
  iconColor,
}) => (
  <TouchableOpacity
    style={[
      styles.paymentOption,
      selectedValue === value && styles.selectedPaymentOption,
    ]}
    onPress={() => onSelect(value)}
    activeOpacity={0.7}
  >
    <RadioButton
      value={value}
      status={selectedValue === value ? "checked" : "unchecked"}
      color="#FF6B6B"
    />
    <View style={styles.paymentDetails}>
      <Text style={styles.paymentTitle}>{title}</Text>
      <Text style={styles.paymentDesc}>{description}</Text>
    </View>
    <MaterialIcons name={icon} size={24} color={iconColor} />
  </TouchableOpacity>
);

const CheckoutScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuthStore();
  const { placeOrder } = useOrderStore();

  const {
    product,
    selectedMoq,
    quantity,
    selectedColor,
    orderNotes,
    subtotal,
    shippingCost,
    tax,
  } = route.params || {};

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [gstBreakdown, setGstBreakdown] = useState(null);
  const [loadingTax, setLoadingTax] = useState(false);
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const total = subtotal + shippingCost + (gstBreakdown?.totalGST || tax);

  useEffect(() => {
    calculateGST();
  }, [address.state]);

  const calculateGST = async () => {

    try {
      setLoadingTax(true);
      const order = {
        sellerId: product.company_id,
        productId: product.product_id,
        totalAmount: subtotal,
        discountAmount: 0,
      }
      const response_tax = await TaxService.calculateGST(
        subtotal,
        address.state,
        product?.sellerState || 'Maharashtra',
        product?.hsnCode || '5208',
        product?.company_id,
        product?.category,
        order
      );
      setGstBreakdown(response_tax);
    } catch (error) {
      console.error('Error calculating GST:', error);
      // Fallback to simple 18% GST
      setGstBreakdown({
        baseAmount: subtotal,
        gstRate: 18,
        cgst: subtotal * 0.09,
        sgst: subtotal * 0.09,
        igst: 0,
        totalGST: subtotal * 0.18,
        isIntraState: false,
      });
    } finally {
      setLoadingTax(false);
    }
  };

  const handlePayment = async () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill in all address fields to proceed."
      );
      return;
    }

    try {
      setLoading(true);
      const now = Date.now(); // current timestamp in ms
      const random = Math.floor(Math.random() * 1000); // 0–999
      const orderNumber = `ORD-${now}-${random}`;
      const orderData = {
        product,
        orderNumber,
        selectedMoq,
        quantity,
        selectedColor,
        orderNotes,
        address,
        paymentMethod,
        subtotal,
        shippingCost,
        gstBreakdown,
        total,
      };
      if (paymentMethod === "razorpay") {
      console.log("PAYMENT METHOD :::::::", paymentMethod)

        const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        const user_info = JSON.parse(user);
        var options = {
          description: 'kp order',
          image: `${URL_BASE}/uploads/products/kapda_icon.png`,
          currency: 'INR',
          key: 'rzp_test_RENAO3Apcy9Lcu',
          amount: gstBreakdown.order_amount,
          name: 'Kapda Bazar',
          order_id: gstBreakdown.rz_orderid,//Replace this with an order_id created using Orders API.
          prefill: {
            email: user_info.email,
            contact: user_info.phone_number,
            name: user_info.name
          },
          theme: { color: '#FF6B6B' }
        };
        RazorpayCheckout.open(options).then((data) => {
          // handle success
          console.log(`Success: ${data.razorpay_payment_id}`);

        }).catch((error) => {
          alert(`Error: ${error.code} | ${error.description}`);
          return false;
        });
        const orderResponse = await placeOrder(orderData);
        navigation.navigate("OrderConfirmation", orderData);
      } else {
        // Handle other payment methods
        const orderResponse = await placeOrder(orderData);
        navigation.navigate("OrderConfirmation", orderData);
      }
    } catch (error) {
      // Alert.alert("Error", "Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderGSTBreakdown = () => {
    if (!gstBreakdown) return null;

    return (
      <Card style={styles.gstCard}>
        <Card.Content style={styles.gstContent}>
          <View style={styles.gstHeader}>
            <View style={styles.gstTitleContainer}>
              <MaterialIcons name="receipt" size={20} color= {colors.navyBlue} />
              <Text style={styles.gstTitle}>Tax Breakdown</Text>
            </View>
            <Chip
              mode="outlined"
              compact
              textStyle={styles.chipText}
              style={[
                styles.gstChip,
                gstBreakdown.data.isIntraState
                  ? styles.intraStateChip
                  : styles.interStateChip
              ]}
            >
              {gstBreakdown.isIntraState ? "Intra-State" : "Inter-State"}
            </Chip>
          </View>

          <View style={styles.gstDetails}>
            <View style={styles.gstRow}>
              <Text style={styles.gstLabel}>Taxable Amount</Text>
              <Text style={styles.gstValue}>
                ₹{gstBreakdown.data.breakdown.finalTaxableAmount?.toFixed(2)}
              </Text>
            </View>

            {!gstBreakdown.data.isIntraState ? (
              <View style={styles.gstRow}>
                <Text style={styles.gstLabel}>
                  IGST ({gstBreakdown.data.taxRate}%)
                </Text>
                <Text style={styles.gstValue}>
                  ₹{gstBreakdown.data.igstAmount?.toFixed(2)}
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.gstRow}>
                  <Text style={styles.gstLabel}>
                    CGST ({gstBreakdown.data.taxRate / 2}%)
                  </Text>
                  <Text style={styles.gstValue}>
                    ₹{gstBreakdown.data.cgstAmount?.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.gstRow}>
                  <Text style={styles.gstLabel}>
                    SGST ({gstBreakdown.data.taxRate / 2}%)
                  </Text>
                  <Text style={styles.gstValue}>
                    ₹{gstBreakdown.data.sgstAmount?.toFixed(2)}
                  </Text>
                </View>
              </>
            )}

            <Divider style={styles.gstDivider} />
            <View style={styles.gstTotalRow}>
              <Text style={styles.gstTotalLabel}>Total GST</Text>
              <Text style={styles.gstTotalValue}>
                ₹{gstBreakdown.data.taxAmount?.toFixed(2)}
              </Text>
            </View>

            {product?.hsnCode && (
              <View style={styles.hsnInfo}>
                <Text style={styles.hsnText}>HSN Code: {product.hsnCode}</Text>
                <Text style={styles.hsnText}>
                  Tax Rate: {gstBreakdown.data.taxRate}%
                </Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (!product || !selectedMoq) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color="#8E8E93" />
        <Text style={styles.errorText}>Order information not available</Text>
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
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled keyboardVerticalOffset={100}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}

        >
          {/* Order Summary Header */}
          <Card style={styles.orderSummaryCard}>
            <Card.Content style={styles.orderSummaryContent}>
              <View style={styles.orderSummaryHeader}>
                <MaterialIcons name="shopping-bag" size={20} color= {colors.navyBlue} />
                <Text style={styles.orderSummaryTitle}>Order Summary</Text>
              </View>

              <View style={styles.productSummary}>
                <Text style={styles.productName}>
                  {product?.product_name || product?.name}
                </Text>
                <View style={styles.productDetails}>
                  <Text style={styles.productDetail}>Color: {selectedColor}</Text>
                  <Text style={styles.productDetail}>
                    Quantity: {quantity}
                  </Text>
                  <Text style={styles.productDetail}>
                    Price: ₹{selectedMoq?.price}/meter
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Address Section */}
          <Card style={styles.sectionCard}>
            <Card.Content style={styles.sectionContent}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="location-on" size={20} color= {colors.navyBlue} />
                <Text style={styles.sectionTitle}>Delivery Address</Text>
              </View>

              <View style={styles.addressForm}>
                <AddressInput
                  placeholder="Full Name"
                  value={address.fullName}
                  onChangeText={(text) =>
                    setAddress({ ...address, fullName: text })
                  }
                  icon="person"
                />

                <AddressInput
                  placeholder="Phone Number"
                  value={address.phone}
                  onChangeText={(text) => setAddress({ ...address, phone: text })}
                  keyboardType="phone-pad"
                  icon="phone"
                />

                <AddressInput
                  placeholder="Street Address"
                  value={address.street}
                  onChangeText={(text) =>
                    setAddress({ ...address, street: text })
                  }
                  icon="home"
                />

                <View style={styles.row}>
                  <AddressInput
                    placeholder="City"
                    value={address.city}
                    onChangeText={(text) =>
                      setAddress({ ...address, city: text })
                    }
                    style={styles.halfInput}
                    icon="location-city"
                  />
                  <AddressInput
                    placeholder="State"
                    value={address.state}
                    onChangeText={(text) =>
                      setAddressMaterialIconsDeliver({ ...address, state: text })
                    }
                    style={styles.halfInput}
                    icon="map"
                  />
                </View>

                <AddressInput
                  placeholder="PIN Code"
                  value={address.pincode}
                  onChangeText={(text) =>
                    setAddress({ ...address, pincode: text })
                  }
                  keyboardType="numeric"
                  icon="pin-drop"
                />
              </View>
            </Card.Content>
          </Card>

          {/* Price Breakdown */}
          <Card style={styles.sectionCard}>
            <Card.Content style={styles.sectionContent}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="receipt-long" size={20} color= {colors.navyBlue} />
                <Text style={styles.sectionTitle}>Price Details</Text>
              </View>

              <View style={styles.priceBreakdown}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>
                    Subtotal ({quantity}m × ₹{selectedMoq?.price})
                  </Text>
                  <Text style={styles.priceValue}>₹{subtotal?.toFixed(2)}</Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Shipping Cost</Text>
                  <Text style={styles.priceValue}>₹{shippingCost}</Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>
                    {loadingTax
                      ? "Calculating GST..."
                      : `GST (${gstBreakdown?.gstRate || 18}%)`}
                  </Text>
                  <View style={styles.priceValueContainer}>
                    {loadingTax && (
                      <ActivityIndicator size="small" color="#FF6B6B" />
                    )}
                    <Text style={styles.priceValue}>
                      ₹{(gstBreakdown?.totalGST || tax)?.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>

              <Divider style={styles.priceDivider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>₹{total?.toFixed(2)}</Text>
              </View>
            </Card.Content>
          </Card>

          {/* GST Breakdown */}
          {renderGSTBreakdown()}

          {/* Payment Method Section */}
          <Card style={styles.sectionCard}>
            <Card.Content style={styles.sectionContent}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="payment" size={20} color= {colors.navyBlue} />
                <Text style={styles.sectionTitle}>Payment Method</Text>
              </View>

              <RadioButton.Group
                onValueChange={setPaymentMethod}
                value={paymentMethod}
              >

                <PaymentOption
                  value="razorpay"
                  selectedValue={paymentMethod}
                  onSelect={setPaymentMethod}
                  title="RazorPay"
                  description="Pay using Credit or Debit Card"
                  icon="credit-card"
                  iconColor="#3b82f6"
                />

                {/* <PaymentOption
                  value="cod"
                  selectedValue={paymentMethod}
                  onSelect={setPaymentMethod}
                  title="Cash on Delivery"
                  description="Pay when you receive the order"
                  icon="local-shipping"
                  iconColor="#34C759"
                /> */}
              </RadioButton.Group>
            </Card.Content>
          </Card>

          {/* Delivery Info */}
          <View style={styles.deliveryInfo}>
            <MaterialIcons name="local-shipping" size={20} color="#34C759" />
            <Text style={styles.deliveryText}>
              Estimated delivery: 5-7 business days
            </Text>
          </View>

          <View style={styles.disclaimerInfo}>
            <MaterialIcons name="notification-important" size={20} color="#B22222" />
            <Text style={styles.disclaimerText}>Shipping cost is extra (Should be paid by user).</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.bottomTotalLabel}>Total Amount</Text>
          <Text style={styles.bottomTotalValue}>₹{total?.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.disabledButton]}
          onPress={handlePayment}
          disabled={loading || loadingTax}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={loading ? ["#A8A8A8", "#8E8E93"] : ["#264577", "#264577"]}
            style={styles.placeOrderGradient}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.placeOrderText}>
                {paymentMethod === "cod" ? "Place Order" : "Proceed to Payment"}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
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
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#FF6B6B",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  orderSummaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  orderSummaryContent: {
    padding: 16,
  },
  orderSummaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  orderSummaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C2C2E",
    marginLeft: 8,
  },
  productSummary: {
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderRadius: 8,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F0',
    padding: 12,
    borderRadius: 10,
  },

  deliveryText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
  },
  disclaimerInfo: {
    marginTop : 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B2222215',
    padding: 12,
    borderRadius: 10,
    marginBottom: 100,
  },
  
  disclaimerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#B22222',
    fontWeight: '500',
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C2C2E",
    marginBottom: 6,
  },
  productDetails: {
    gap: 2,
  },
  productDetail: {
    fontSize: 12,
    color: "#6D6D80",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionContent: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C2C2E",
    marginLeft: 8,
  },
  addressForm: {
    gap: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: "#2C2C2E",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  priceBreakdown: {
    gap: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 14,
    color: "#6D6D80",
  },
  priceValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2C2C2E",
  },
  priceDivider: {
    marginVertical: 8,
    backgroundColor: "#E8E8E8",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.navyBlue,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.navyBlue,
  },
  gstCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  gstContent: {
    padding: 16,
  },
  gstHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  gstTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  gstTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C2C2E",
    marginLeft: 8,
  },
  gstChip: {
    borderWidth: 1,
  },
  interStateChip: {
    borderColor: "#FF6B6B",
    backgroundColor: "#FFE8E8",
  },
  intraStateChip: {
    borderColor: "#34C759",
    backgroundColor: "#E8F5E8",
  },
  chipText: {
    fontSize: 11,
    fontWeight: "500",
  },
  gstDetails: {
    gap: 6,
  },
  gstRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gstLabel: {
    fontSize: 13,
    color: "#6D6D80",
  },
  gstValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2C2C2E",
  },
  gstDivider: {
    marginVertical: 8,
    backgroundColor: "#E8E8E8",
  },
  gstTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 8,
    borderRadius: 6,
  },
  gstTotalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C2C2E",
  },
  gstTotalValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.navyBlue,
  },
  hsnInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#F8F8F8",
    borderRadius: 6,
  },
  hsnText: {
    fontSize: 11,
    color: "#8E8E93",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFFFFF",
  },
  selectedPaymentOption: {
    borderColor: "#FF6B6B",
    backgroundColor: "#FFE8E8",
  },
  paymentDetails: {
    flex: 1,
    marginLeft: 8,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2C2C2E",
  },
  paymentDesc: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopWidth: 0.5,
    borderTopColor: "#E8E8E8",
  },
  totalContainer: {
    flex: 1,
    marginRight: 12,
  },
  bottomTotalLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  bottomTotalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C2C2E",
  },
  placeOrderButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  disabledButton: {
    opacity: 0.6,
  },
  placeOrderGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  placeOrderText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CheckoutScreen;
