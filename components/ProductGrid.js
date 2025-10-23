import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { IMG_1, IMG_11, IMG_8, IMG_9 } from "../constants/exports"

const products = [
    {
        id: 0,
        name: "Cotton Fabric",
        price: "₹199",
        discount: "30% OFF",
        oldPrice: "₹299",
        image: IMG_11, // Replace with actual image URL
    },
    {
        id: 1,
        name: "Silk Fabric",
        price: "₹349",
        discount: "20% OFF",
        oldPrice: "₹449",
        image: IMG_1,
    },
    {
        id: 2,
        name: "Denim Fabric",
        price: "₹599",
        discount: "40% OFF",
        oldPrice: "₹999",
        image: IMG_8,
    },
    {
        id: 3,
        name: "Linen Fabric",
        price: "₹249",
        discount: "10% OFF",
        oldPrice: "₹275",
        image: IMG_9,
    },
    {
        id: 4,
        name: "Silk Fabric",
        price: "₹349",
        discount: "20% OFF",
        oldPrice: "₹449",
        image: IMG_1,
    },
    {
        id: 7,
        name: "Cotton Fabric",
        price: "₹199",
        discount: "30% OFF",
        oldPrice: "₹299",
        image: IMG_11, // Replace with actual image URL
    },
    {
        id: 6,
        name: "Linen Fabric",
        price: "₹249",
        discount: "10% OFF",
        oldPrice: "₹275",
        image: IMG_9,
    },
    {
        id: 5,
        name: "Denim Fabric",
        price: "₹599",
        discount: "40% OFF",
        oldPrice: "₹999",
        image: IMG_8,
    },

    {
        id: 8,
        name: "Silk Fabric",
        price: "₹349",
        discount: "20% OFF",
        oldPrice: "₹449",
        image: IMG_1,
    },
    {
        id: 10,
        name: "Linen Fabric",
        price: "₹249",
        discount: "10% OFF",
        oldPrice: "₹275",
        image: IMG_9,
    },
    {
        id: 9,
        name: "Denim Fabric",
        price: "₹599",
        discount: "40% OFF",
        oldPrice: "₹999",
        image: IMG_8,
    },
];

const ProductGrid = ({ navigation }) => {

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={[styles.card,]}
                onPress={() => navigation.navigate('ProductDetails', {
                    product: {
                        id: 1,
                        name: item.name,
                        image: item.image,
                        specifications: "100% Organic Cotton, Soft & Breathable, 60-inch width",
                        price: item.price,
                        inStock: true,
                        relatedProducts: [
                            {
                                id: 2,
                                name: "Silk Fabric",
                                image: item.image,
                                price: 49.99
                            },
                            {
                                id: 3,
                                name: "Denim Fabric",
                                image: item.image,
                                price: 39.99
                            },
                            {
                                id: 4,
                                name: "Linen Fabric",
                                image: item.image,
                                price: 35.99
                            }
                        ]
                    }
                })
                }>
                <Image source={item?.image} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.oldPrice}>{item.oldPrice}</Text>
                    <Text style={styles.price}>{item.price}</Text>
                </View>
            </TouchableOpacity >)
    };

    return (
        <View style={styles.container}>
            {/* <Text>Products Screen</Text> */}
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true} // ✅ Fixes the warning
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#fff",
        paddingHorizontal: 5,
    },
    listContainer: {
        paddingBottom: 10,
    },
    card: {
        flex: 1,
        margin: 5,
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        padding: 4,
        alignItems: "stretch",
        borderBottomWidth: 1,  // Horizontal separator
        borderBottomColor: '#ddd',
    },
    image: {
        width: "100%",
        height: 170,
        borderRadius: 10,
    },
    name: {
        fontSize: 15,
        fontWeight: "bold",
        marginTop: 8,
        paddingHorizontal: 3,
        textAlign: "left",
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        paddingHorizontal: 4
    },
    oldPrice: {
        fontSize: 12,
        color: "gray",
        textDecorationLine: "line-through",
        marginRight: 6,
    },
    price: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#ff5733",
    },
});

export default ProductGrid;
