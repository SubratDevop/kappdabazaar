import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions,Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const OrderCard = ({ order, onPress }) => {
    const [expanded, setExpanded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const {
        orderId,
        date,
        status,
        images,
        productName,
        quantity,
        price,
        color,
        deliveryAddress,
        paymentMethod,
        trackingNumber,
        estimatedDelivery
    } = order;

    const onScroll = (event) => {
        const scrollX = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollX / width);
        setCurrentImageIndex(index);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return '#4CAF50';
            case 'processing':
                return '#2196F3';
            case 'shipped':
                return '#FF9800';
            case 'cancelled':
                return '#F44336';
            default:
                return '#666';
        }
    };

    return (
        <View style={styles.container}>
            {/* Order Header */}
            <View style={styles.header}>
                <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>Order #{orderId}</Text>
                    <Text style={styles.date}>{date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(status)}15` }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                        {status}
                    </Text>
                </View>
            </View>

            {/* Product Images */}
            <View style={styles.imageContainer}>
                <FlatList
                    data={images}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: item }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                />
                <View style={styles.paginationContainer}>
                    {images.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                currentImageIndex === index && styles.paginationDotActive
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* Order Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.productName}>{productName}</Text>
                
                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Quantity:</Text>
                        <Text style={styles.detailValue}>{quantity} meters</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Color:</Text>
                        <Text style={styles.detailValue}>{color}</Text>
                    </View>
                </View>

                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Total Amount:</Text>
                    <Text style={styles.priceValue}>₹{price}</Text>
                </View>

                {/* Expandable Section */}
                <TouchableOpacity 
                    style={styles.expandButton}
                    onPress={() => setExpanded(!expanded)}
                >
                    <Text style={styles.expandButtonText}>
                        {expanded ? 'Show less' : 'Show more'}
                    </Text>
                    <Feather 
                        name={expanded ? "chevron-up" : "chevron-down"} 
                        size={16} 
                        color="#666" 
                    />
                </TouchableOpacity>

                {expanded && (
                    <Animated.View style={styles.expandedContent}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Delivery Address</Text>
                            <Text style={styles.addressText}>{deliveryAddress}</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Payment Details</Text>
                            <View style={styles.paymentRow}>
                                <Text style={styles.paymentLabel}>Method:</Text>
                                <Text style={styles.paymentValue}>{paymentMethod}</Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Tracking Information</Text>
                            <View style={styles.trackingRow}>
                                <Text style={styles.trackingLabel}>Tracking Number:</Text>
                                <Text style={styles.trackingValue}>{trackingNumber}</Text>
                            </View>
                            <View style={styles.trackingRow}>
                                <Text style={styles.trackingLabel}>Estimated Delivery:</Text>
                                <Text style={styles.trackingValue}>{estimatedDelivery}</Text>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.trackButton}
                            onPress={onPress}
                        >
                            <Text style={styles.trackButtonText}>Track Order</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    orderInfo: {
        flex: 1,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    date: {
        fontSize: 13,
        color: '#666',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '500',
    },
    imageContainer: {
        position: 'relative',
        height: 180,
    },
    image: {
        width: width - 32,
        height: 180,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginHorizontal: 3,
    },
    paginationDotActive: {
        backgroundColor: '#fff',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    detailsContainer: {
        padding: 16,
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    detailsRow: {
        flexDirection: 'row',
        marginBottom: 12,
        gap: 24,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailLabel: {
        fontSize: 13,
        color: '#666',
    },
    detailValue: {
        fontSize: 13,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    priceLabel: {
        fontSize: 14,
        color: '#666',
    },
    priceValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    expandButtonText: {
        fontSize: 13,
        color: '#666',
        marginRight: 4,
    },
    expandedContent: {
        marginTop: 16,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    addressText: {
        fontSize: 13,
        color: '#444',
        lineHeight: 18,
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    paymentLabel: {
        fontSize: 13,
        color: '#666',
    },
    paymentValue: {
        fontSize: 13,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    trackingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 4,
    },
    trackingLabel: {
        fontSize: 13,
        color: '#666',
    },
    trackingValue: {
        fontSize: 13,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    trackButton: {
        backgroundColor: '#ff6347',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    trackButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default OrderCard; 