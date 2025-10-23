import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { URL_BASE } from '../constants/exports';
import { useAuthStore } from '../store/useAuthStore';
import { useProductStore } from '../store/useProductStore';

const UserFabricCard = ({ fabric, navigation }) => {
    const { name, company_id, description, key_attributes, product_images, product_id, unit, category, sub_category, is_featured, status, outOfStock, moqs = [] } = fabric;

    const [saved, setSaved] = useState(false);
    const { userRole } = useAuthStore();
    const { saveProductFn } = useProductStore();
    const images = typeof (product_images) == 'object' ? product_images : JSON.parse(product_images);

    const handleSave = async () => {
        setSaved(!saved);
        await saveProductFn(product_id, 1);
    };
// console.log("description;;;;;;;;;;", key_attributes);
    return (

        <TouchableOpacity
            style={[styles.card, is_featured && styles.featuredCard]}
            onPress={() => navigation.navigate('ProductDetails', {
                product: {
                    product_id
                }
            })}
            activeOpacity={0.9}
        >
            {/* Image Container */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: `${URL_BASE}${images[0]}` }}

                    style={styles.image}
                    resizeMode="cover"
                />
                {is_featured && (
                    <View style={styles.featuredBadge}>
                        <Text style={styles.featuredText}>Featured</Text>
                    </View>
                )}
                {!(userRole === "seller") && (
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                    >
                        <Feather
                            name="bookmark"
                            size={18}
                            color={saved ? "#ff6347" : "#666"}
                            fill={saved ? "#ff6347" : "none"}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Product Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.productName} numberOfLines={2}>
                    {name}
                </Text>
                <Text style={styles.productName} numberOfLines={2}>
                    {category}
                </Text>

                <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                        ₹{moqs[0]?.price}
                    </Text>
                    {moqs.length > 1 && (
                        <Text style={styles.priceRange}>
                            - ₹{moqs[moqs.length - 1]?.price}
                        </Text>
                    )}
                    <Text style={styles.unit}>/{unit}</Text>
                </View>


            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 180,
        backgroundColor: '#fff',
        margin: 8,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    featuredCard: {
        backgroundColor: '#FFF9F0',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 180,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    featuredBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#ff6347',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
    },
    featuredText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    saveButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 6,
        borderRadius: 16,
    },
    infoContainer: {
        padding: 10,
    },
    productName: {
        fontSize: 13,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
        lineHeight: 16,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 6,
    },
    price: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
    },
    priceRange: {
        fontSize: 12,
        fontWeight: '500',
        color: '#666',
        marginLeft: 4,
    },
    unit: {
        fontSize: 11,
        color: '#666',
        marginLeft: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    statText: {
        fontSize: 11,
        color: '#666',
    },
});

export default UserFabricCard;
