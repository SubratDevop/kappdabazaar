import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Card, Divider } from 'react-native-paper';
import { URL_BASE, colors } from '../constants/exports';

const { width, height } = Dimensions.get('window');

// Modern MOQ Card Component
const ModernMOQCard = ({ moq, isSelected, onSelect }) => {
  if (!moq) return null;

  return (
    <TouchableOpacity
      style={[styles.moqCard, isSelected && styles.selectedMoqCard]}
      onPress={() => onSelect(moq)}
      activeOpacity={0.7}
    >
      <View style={styles.moqHeader}>
        <Text style={[styles.moqQuantity, isSelected && styles.selectedText]}>
          {moq.quantity || 0}m
        </Text>
        {moq.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{moq.discount}%</Text>
          </View>
        )}
      </View>
      <Text style={[styles.moqPrice, isSelected && styles.selectedText]}>
        ₹{moq.price || 0}/m
      </Text>
      {moq.mrp && moq.mrp > moq.price && (
        <Text style={styles.moqSavings}>
          Save ₹{(moq.mrp - moq.price).toFixed(0)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// Modern Color Selector Component
const ColorSelector = ({ colors, selectedColor, onSelect }) => {
  if (!colors || colors.length === 0) return null;

  return (
    <View style={styles.colorSection}>
      <Text style={styles.sectionTitle}>Select Color</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScrollView}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorChip,
              selectedColor === color && styles.selectedColorChip
            ]}
            onPress={() => onSelect(color)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.colorText,
              selectedColor === color && styles.selectedColorText
            ]}>
              {color}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Modern Quantity Selector Component
const QuantitySelector = ({ quantity, onQuantityChange, onIncrement, onDecrement }) => {
  return (
    <View style={styles.quantitySection}>
      <Text style={styles.sectionTitle}>Select Quantity</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={onDecrement}
          activeOpacity={0.7}
        >
          <MaterialIcons name="remove" size={20} color="#6D6D80" />
        </TouchableOpacity>
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={quantity.toString()}
          onChangeText={onQuantityChange}
          textAlign="center"
        />
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={onIncrement}
          activeOpacity={0.7}
        >
          <MaterialIcons name="add" size={20} color="#6D6D80" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const QuantitySelectionScreen = ({ navigation, route }) => {
  const { moqs, product } = route.params || {};
  const [selectedMoq, setSelectedMoq] = useState(moqs?.[0] || null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [savedForLater, setSavedForLater] = useState(false);

  const image = typeof (product.product_images) == 'object' ? product.product_images : JSON.parse(product.product_images);

  const scrollY = useRef(new Animated.Value(0)).current;

  // Sample colors - replace with actual product colors
  const colors = product?.available_colors || ['No Color','Red', 'Blue', 'Black', 'White', 'Green'];

  const handleProceed = () => {

    if (!selectedMoq || selectedQty <= 0) {
      Alert.alert('Selection Required', 'Please select quantity and other options to proceed.');
      return;
    }
    navigation.navigate("Checkout", {
      product,
      selectedMoq,
      quantity: selectedQty,
      selectedColor,
      orderNotes,
      subtotal: selectedMoq.price * selectedQty,
      shippingCost: 0,
      tax: (selectedMoq.price * selectedQty * 0.18),
    });
  };

  const handleQtyChange = (value) => {
    const numeric = parseInt(value);
    if (!isNaN(numeric) && numeric > 0) {
      setSelectedQty(numeric);
    } else if (value === "") {
      setSelectedQty("");
    }
  };

  const incrementQty = () => setSelectedQty(prev => Number(prev) + 1);
  const decrementQty = () => setSelectedQty(prev => (prev > 1 ? prev - 1 : 1));
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this product: ${product?.product_name || product?.name}`,
        url: image[0] || ''
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const subtotal = selectedMoq ? selectedMoq.price * selectedQty : 0;
  const shippingCost = 0;
  const gst = subtotal * 0.18;
  const total = subtotal + shippingCost + gst;

  if (!product || !moqs) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color="#8E8E93" />
        <Text style={styles.errorText}>Product information not available</Text>
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
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image

            source={{ 
              uri: `${URL_BASE}${image[0]}` || 'https://via.placeholder.com/400'
            }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>
              {product?.product_name || product?.name || 'Product Name'}
            </Text>
            <Text style={styles.productDescription}>
              {product?.description || 'Premium quality fabric for your needs'}
            </Text>
          </View>

          {/* MOQ Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Minimum Order Quantity</Text>
            <FlatList
              data={moqs}
              keyExtractor={(item) => item?.moq_id?.toString() || Math.random().toString()}
              renderItem={({ item }) => (
                <ModernMOQCard
                  moq={item}
                  isSelected={selectedMoq?.moq_id === item?.moq_id}
                  onSelect={setSelectedMoq}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.moqList}
            />
          </View>

          {/* Color Selection */}
          <ColorSelector
            colors={colors}
            selectedColor={selectedColor}
            onSelect={setSelectedColor}
          />

          {/* Quantity Selection */}
          <QuantitySelector
            quantity={selectedQty}
            onQuantityChange={handleQtyChange}
            onIncrement={incrementQty}
            onDecrement={decrementQty}
          />

          {/* Order Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              numberOfLines={3}
              placeholder="Add any special instructions or requirements..."
              placeholderTextColor="#A8A8A8"
              value={orderNotes}
              onChangeText={setOrderNotes}
            />
          </View>

          {/* Price Breakdown */}
          <Card style={styles.priceCard}>
            <Card.Content style={styles.priceContent}>
              <Text style={styles.priceTitle}>Price Details</Text>
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal ({selectedQty}m × ₹{selectedMoq?.price || 0})</Text>
                <Text style={styles.priceValue}>₹{subtotal.toFixed(2)}</Text>
              </View>
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Shipping Cost</Text>
                <Text style={styles.priceValue}>To be paid by buyer</Text>
              </View>
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>GST (18%)</Text>
                <Text style={styles.priceValue}>₹{gst.toFixed(2)}</Text>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
              </View>
            </Card.Content>
          </Card>

          {/* Delivery Info */}
          <View style={styles.deliveryInfo}>
            <MaterialIcons name="local-shipping" size={20} color="#34C759" />
            <Text style={styles.deliveryText}>Estimated delivery: 5-7 business days</Text>
          </View>
          {/* Delivery Info */}
          <View style={styles.disclaimerInfo}>
            <MaterialIcons name="notification-important" size={20} color="#B22222" />
            <Text style={styles.disclaimerText}>Shipping cost is extra (Should be paid by user).</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, savedForLater && styles.savedButton]}
            onPress={() => setSavedForLater(!savedForLater)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={savedForLater ? "bookmark" : "bookmark-outline"}
              size={22}
              color={savedForLater ? "#FF6B6B" : "#6D6D80"}
            />
            <Text style={[styles.actionText, savedForLater && styles.savedText]}>
              {savedForLater ? 'Saved' : 'Save'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Ionicons name="share-outline" size={22} color="#6D6D80" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[styles.proceedButton, (!selectedMoq || !selectedColor) && styles.disabledButton]}
          onPress={handleProceed}
          disabled={!selectedMoq || !selectedColor}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={(!selectedMoq || !selectedColor) ? ['#A8A8A8', '#8E8E93'] : ["#264577", "#264577"]}
            style={styles.proceedGradient}
          >
            <Text style={styles.proceedText}>Proceed to Checkout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#6D6D80',
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: height * 0.35,
    backgroundColor: '#F5F5F5',
  },
  productImage: {
    width: width,
    height: height * 0.35,
  },
  imageOverlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  productHeader: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C2C2E',
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2E',
    marginBottom: 12,
  },
  moqList: {
    paddingVertical: 4,
  },
  moqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginRight: 10,
    minWidth: 90,
    borderWidth: 1,
    borderColor:   colors.lightGray,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectedMoqCard: {
    backgroundColor: colors.navyBlue,
    borderColor: colors.lightGray,
    shadowColor: colors.lightblue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  moqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  moqQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2C2E',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  discountBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  moqPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navyBlue,
    marginBottom: 4,
  },
  moqSavings: {
    fontSize: 11,
    color: '#34C759',
    fontWeight: '500',
  },
  colorSection: {
    marginBottom: 24,
  },
  colorScrollView: {
    flexGrow: 0,
  },
  colorChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor:   colors.lightGray,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  selectedColorChip: {
    backgroundColor: colors.navyBlue,
    borderColor: colors.lightGray,
  },
  colorText: {
    fontSize: 14,
    color: '#2C2C2E',
    fontWeight: '500',
  },
  selectedColorText: {
    color: '#FFFFFF',
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 4,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor:   colors.lightGray,
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2E',
    paddingVertical: 12,
  },
  notesInput: {
    borderWidth: 1,
    borderColor:   colors.lightGray,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#2C2C2E',
    backgroundColor: '#FFFFFF',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  priceContent: {
    padding: 16,
  },
  priceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2E',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6D6D80',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C2C2E',
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#E8E8E8',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2E',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B6B',
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopWidth: 0.5,
    borderTopColor: '#E8E8E8',
  },
  actionButtons: {
    flexDirection: 'row',
    marginRight: 12,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
  },
  savedButton: {
    backgroundColor: '#FFE8E8',
  },
  actionText: {
    fontSize: 12,
    color: '#6D6D80',
    marginTop: 2,
    fontWeight: '500',
  },
  savedText: {
    color: '#FF6B6B',
  },
  proceedButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.6,
  },
  proceedGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuantitySelectionScreen;
