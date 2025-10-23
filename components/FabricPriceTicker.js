import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

// Mock fabric prices (Replace with real API data)
const mockFabrics = [
    { name: "Cotton", price: "250" },
    { name: "Silk", price: "400" },
    { name: "Linen", price: "320" },
    { name: "Denim", price: "280" },
    { name: "Wool", price: "500" },
];

const FabricPriceTicker = ({ fabrics = mockFabrics }) => {
    const scrollX = useRef(new Animated.Value(0)).current;

    const itemWidth = width / 3; // Show at least 3 items at a time
    const extendedFabrics = [...fabrics, ...fabrics, ...fabrics]; // Tripled for smooth loop
    const tickerWidth = extendedFabrics.length * itemWidth;

    useEffect(() => {
        Animated.loop(
            Animated.timing(scrollX, {
                toValue: -tickerWidth / 3, // Move exactly one full set
                duration: fabrics.length * 3000, // Speed control (adjustable)
                easing: (t) => t, // Linear easing for smooth animation
                useNativeDriver: true,
            })
        ).start();
    }, [fabrics]);

    return (
        <View style={styles.tickerWrapper}>
            <View style={styles.container}>
                <Animated.View
                    style={{
                        flexDirection: "row",
                        transform: [{ translateX: scrollX }],
                    }}
                >
                    {extendedFabrics.map((fabric, index) => (
                        <View key={index} style={styles.item}>
                            <Text style={styles.text}>{fabric.name} - ₹{fabric.price}      •</Text>
                        </View>
                    ))}
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tickerWrapper: {
        width: "100%",
        height: 40,
        backgroundColor: "#222831",
        justifyContent: "center",
        zIndex: 999, // Ensures it stays above other components
    },
    container: {
        overflow: "hidden",
        width: "100%",
        paddingVertical: 5,
    },
    item: {
        paddingHorizontal: 20,
    },
    text: {
        color: "#fff",
        fontSize: 17, // Increased for better readability
        fontWeight: "bold",
    },
});

export default FabricPriceTicker;
