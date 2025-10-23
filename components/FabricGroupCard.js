import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text } from "react-native";
import { width } from "../constants/helpers";

// Function to generate a random linear gradient
const getRandomGradient = () => {
    const gradients = [
        "#ff9a9e",
        "#fad0c4",
        "#a18cd1",
        "#fbc2eb",
        "#84fab0",
        "#cfd9df",
        "#fbc2eb",
        "#a6c1ee",
        "#8fd3f4",
        "#e2ebf0"
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
};

const FabricGroupCard = ({ groupName }) => {
    const colors = getRandomGradient();

    return (
        <View
            // colors={colors}
            style={{
                width: width / 3,
                height: 70,
                backgroundColor: colors,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 3,
                marginBottom: 3,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 3,
            }}
        >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff", textAlign: "center", overflow: "hidden" }}>
                {groupName}
            </Text>
        </View>
    );
};

export default FabricGroupCard;
