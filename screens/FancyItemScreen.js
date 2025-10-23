import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useMemo } from 'react';

// Sample data
const data = [
    { id: '1', name: 'Silk' },
    { id: '2', name: 'Cotton' },
    { id: '3', name: 'Denim' },
    { id: '4', name: 'Linen & and lorem ipsum whose work does not do' },
    { id: '5', name: 'Wool' },
    { id: '6', name: 'Polyester' },
];

// Function to generate random modern colors
const generateRandomColor = () => {
    const colors = [
        '#FF6B6B', '#6B8E23', '#1E90FF', '#FF8C00', '#20B2AA', "#FFCFEF", "#2E236C", "#FF6969", "#FFCDB2",
        '#8A2BE2', "#0D92F4", '#DC143C', '#00CED1', '#FF1493', '#32CD32', "#3F4F44", "#FFB22C", "#8E1616", "#441752"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

const FancyItemScreen = () => {
    const colorMap = useMemo(() => {
        return data.reduce((acc, item) => {
            acc[item.id] = generateRandomColor();
            return acc;
        }, {});
    }, []);

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: colorMap[item.id] }]}>
            <Text style={styles.cardText}>{item.name}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={{ marginBottom: 5, fontWeight: "500", fontSize: 15, color: "#ff6347", marginLeft: 7 }}>Fancy Items</Text>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2} // Ensures a 2-column layout
                columnWrapperStyle={styles.row} // Adds spacing between rows
            />
        </View>
    );
};

export default FancyItemScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222831',
        padding: 10,
    },
    row: {
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        padding: 25,
        margin: 5,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 5, // For Android shadow
    },
    cardText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});
