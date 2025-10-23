import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TabComponent from '../components/TabComponent';
import FabricPriceTicker from '../components/FabricPriceTicker';
import { Feather } from '@expo/vector-icons';

// Dummy table components for each tab
const BSEScreen = () => {

    const tableData = [
        { name: '62x62', count: "40x60", dora: "60", peak: "52/54", width: 47, weight: 6.500, rate: "23/50" },
        { name: '72x72', count: "40x60", dora: "74", peak: "64/66", width: 47, weight: 8.600, rate: "32/2" },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: 'Cotton', count: 100, dora: 3, peak: 12, width: 44, weight: 50, rate: 500 },
        { name: 'Silk', count: 80, dora: 2, peak: 10, width: 40, weight: 45, rate: 800 },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: '62x62', count: "40x60", dora: "60", peak: "52/54", width: 47, weight: 6.500, rate: "23/50" },
        { name: '72x72', count: "40x60", dora: "74", peak: "64/66", width: 47, weight: 8.600, rate: "32/2" },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: 'Cotton', count: 100, dora: 3, peak: 12, width: 44, weight: 50, rate: 500 },
        { name: 'Silk', count: 80, dora: 2, peak: 10, width: 40, weight: 45, rate: 800 },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: '62x62', count: "40x60", dora: "60", peak: "52/54", width: 47, weight: 6.500, rate: "23/50" },
        { name: '72x72', count: "40x60", dora: "74", peak: "64/66", width: 47, weight: 8.600, rate: "32/2" },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: '62x62', count: "40x60", dora: "60", peak: "52/54", width: 47, weight: 6.500, rate: "23/50" },
        { name: '72x72', count: "40x60", dora: "74", peak: "64/66", width: 47, weight: 8.600, rate: "32/2" },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
    ]
    return <ScrollView style={{ flex: 1, backgroundColor: "#222831" }}>
        <View style={{ display: "flex", justifyContent: "flex-start", backgroundColor: "#222831", alignItems: "center", flexDirection: "row", paddingHorizontal: 5, paddingVertical: 5, marginTop: 10 }}>
            {/* <StepForwardIcon color={"#fff"} size={16} fill={"#fff"}  /> */}
            <Feather name="user" size={16} color="#fff" style={{ marginRight: 4 }} />
            <Text style={{ color: "#fff", fontSize: 19 }}>NSE/BSE (Cotton)</Text>
        </View>
        <TabComponent data={tableData} />
    </ScrollView>
};
const BhiwandiScreen = () => {

    const tableData = [
        { name: '62x62', count: "40x60", dora: "60", peak: "52/54", width: 47, weight: 6.500, rate: "23/50" },
        { name: '72x72', count: "40x60", dora: "74", peak: "64/66", width: 47, weight: 8.600, rate: "32/2" },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: 'Cotton', count: 100, dora: 3, peak: 12, width: 44, weight: 50, rate: 500 },
        { name: 'Silk', count: 80, dora: 2, peak: 10, width: 40, weight: 45, rate: 800 },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: '62x62', count: "40x60", dora: "60", peak: "52/54", width: 47, weight: 6.500, rate: "23/50" },
        { name: '72x72', count: "40x60", dora: "74", peak: "64/66", width: 47, weight: 8.600, rate: "32/2" },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: 'Cotton', count: 100, dora: 3, peak: 12, width: 44, weight: 50, rate: 500 },
        { name: 'Silk', count: 80, dora: 2, peak: 10, width: 40, weight: 45, rate: 800 },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: '62x62', count: "40x60", dora: "60", peak: "52/54", width: 47, weight: 6.500, rate: "23/50" },
        { name: '72x72', count: "40x60", dora: "74", peak: "64/66", width: 47, weight: 8.600, rate: "32/2" },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: '62x62', count: "40x60", dora: "60", peak: "52/54", width: 47, weight: 6.500, rate: "23/50" },
        { name: '72x72', count: "40x60", dora: "74", peak: "64/66", width: 47, weight: 8.600, rate: "32/2" },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
    ]
    return <ScrollView style={{ flex: 1, backgroundColor: "#222831" }}>
        <View style={{ display: "flex", justifyContent: "flex-start", backgroundColor: "#222831", alignItems: "center", flexDirection: "row", paddingHorizontal: 5, paddingVertical: 5, marginTop: 10 }}>
            <Feather name="user" size={16} color="#fff" style={{ marginRight: 4 }} />
            <Text style={{ color: "#fff", fontSize: 19 }}>Bhiwandi</Text>
        </View>
        <TabComponent data={tableData} />
    </ScrollView>
};
const MalegaonScreen = () => {
    const tableData = [
        { name: 'Cotton', count: 100, dora: 3, peak: 12, width: 44, weight: 50, rate: 500 },
        { name: 'Silk', count: 80, dora: 2, peak: 10, width: 40, weight: 45, rate: 800 },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: '62x62', count: "40x60", dora: "60", peak: "52/54", width: 47, weight: 6.500, rate: "23/50" },
        { name: '72x72', count: "40x60", dora: "74", peak: "64/66", width: 47, weight: 8.600, rate: "32/2" },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: 'Cotton', count: 100, dora: 3, peak: 12, width: 44, weight: 50, rate: 500 },
        { name: 'Silk', count: 80, dora: 2, peak: 10, width: 40, weight: 45, rate: 800 },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: '62x62', count: "40x60", dora: "60", peak: "52/54", width: 47, weight: 6.500, rate: "23/50" },
        { name: '72x72', count: "40x60", dora: "74", peak: "64/66", width: 47, weight: 8.600, rate: "32/2" },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: 'Cotton', count: 100, dora: 3, peak: 12, width: 44, weight: 50, rate: 500 },
        { name: 'Silk', count: 80, dora: 2, peak: 10, width: 40, weight: 45, rate: 800 },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
    ]
    return <ScrollView style={{ flex: 1, backgroundColor: "#222831" }}>
        <View style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", flexDirection: "row", paddingHorizontal: 5, paddingVertical: 5, marginTop: 10 }}>
            <Feather name="user" size={16} color="#fff" style={{ marginRight: 4 }} />
            <Text style={{ color: "#fff", fontSize: 19 }}>Malegaon</Text>
        </View>
        <TabComponent data={tableData} />
    </ScrollView>
}
const BurhanpurScreen = () => {
    const tableData = [
        { name: 'Cotton', count: 100, dora: 3, peak: 12, width: 44, weight: 50, rate: 500 },
        { name: 'Silk', count: 80, dora: 2, peak: 10, width: 40, weight: 45, rate: 800 },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: '62x62', count: "40x60", dora: "60", peak: "52/54", width: 47, weight: 6.500, rate: "23/50" },
        { name: '72x72', count: "40x60", dora: "74", peak: "64/66", width: 47, weight: 8.600, rate: "32/2" },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: 'Cotton', count: 100, dora: 3, peak: 12, width: 44, weight: 50, rate: 500 },
        { name: 'Silk', count: 80, dora: 2, peak: 10, width: 40, weight: 45, rate: 800 },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: '62x62', count: "40x60", dora: "60", peak: "52/54", width: 47, weight: 6.500, rate: "23/50" },
        { name: '72x72', count: "40x60", dora: "74", peak: "64/66", width: 47, weight: 8.600, rate: "32/2" },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: 'Cotton', count: 100, dora: 3, peak: 12, width: 44, weight: 50, rate: 500 },
        { name: 'Silk', count: 80, dora: 2, peak: 10, width: 40, weight: 45, rate: 800 },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
    ]
    return <ScrollView style={{ flex: 1, backgroundColor: "#222831" }}>
        <View style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", flexDirection: "row", paddingHorizontal: 5, paddingVertical: 5, marginTop: 10 }}>
            <Feather name="user" size={16} color="#fff" style={{ marginRight: 4 }} />
            <Text style={{ color: "#fff", fontSize: 19 }}>Burhanpur</Text>
        </View>
        <TabComponent data={tableData} />
    </ScrollView>
};
const SouthScreen = () => {
    const tableData = [
        { name: 'Cotton', count: 100, dora: 3, peak: 12, width: 44, weight: 50, rate: 500 },
        { name: 'Silk', count: 80, dora: 2, peak: 10, width: 40, weight: 45, rate: 800 },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: '62x62', count: "40x60", dora: "60", peak: "52/54", width: 47, weight: 6.500, rate: "23/50" },
        { name: '72x72', count: "40x60", dora: "74", peak: "64/66", width: 47, weight: 8.600, rate: "32/2" },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: 'Cotton', count: 100, dora: 3, peak: 12, width: 44, weight: 50, rate: 500 },
        { name: 'Silk', count: 80, dora: 2, peak: 10, width: 40, weight: 45, rate: 800 },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: '62x62', count: "40x60", dora: "60", peak: "52/54", width: 47, weight: 6.500, rate: "23/50" },
        { name: '72x72', count: "40x60", dora: "74", peak: "64/66", width: 47, weight: 8.600, rate: "32/2" },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
        { name: 'Cotton', count: 100, dora: 3, peak: 12, width: 44, weight: 50, rate: 500 },
        { name: 'Silk', count: 80, dora: 2, peak: 10, width: 40, weight: 45, rate: 800 },
        { name: 'Wool', count: 60, dora: 4, peak: 15, width: 48, weight: 55, rate: 700 },
    ]

    return <ScrollView style={{ flex: 1, backgroundColor: "#222831" }}>
        <View style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", flexDirection: "row", paddingHorizontal: 5, paddingVertical: 5, marginTop: 10 }}>
            <Feather name="user" size={16} color="#fff" style={{ marginRight: 4 }} />
            <Text style={{ color: "#fff", fontSize: 19 }}>South</Text>
        </View>
        <TabComponent data={tableData} />
    </ScrollView>
}

// Create Top Tab Navigator
const Tab = createMaterialTopTabNavigator();

const MarketScreen = () => {
    return (
        <View style={{ flex: 1 }}>
            <FabricPriceTicker
                fabrics={
                    [
                        { name: "Silk", price: 1100 },
                        { name: "Cotton", price: 800 },
                        { name: "Linen", price: "320" },
                        { name: "Denim", price: "280" },
                        { name: "Wool", price: "500" },
                    ]
                } />
            <Tab.Navigator
                initialRouteName='NSE/BSE'
                screenOptions={{
                    tabBarStyle: { backgroundColor: '#f28482' }, // Top Tab Bar styling
                    tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold', color: "#fff" },
                    tabBarIndicatorStyle: { backgroundColor: '#fff', height: 3 }, // Active tab indicator
                    tabBarScrollEnabled: true,
                    tabBarItemStyle: {
                        width: 100
                    },
                    swipeEnabled: false
                }}
            >
                <Tab.Screen name="NSE/BSE" component={BSEScreen} />
                <Tab.Screen name="Bhiwandi" component={BhiwandiScreen} />
                <Tab.Screen name="Malegaon" component={MalegaonScreen} />
                <Tab.Screen name="Burhanpur" component={BurhanpurScreen} />
                <Tab.Screen name="Panvel" component={BurhanpurScreen} />
                <Tab.Screen name="South" component={SouthScreen} />
                <Tab.Screen name="Jaipur" component={SouthScreen} />
            </Tab.Navigator>
        </View>
    );
};

export default MarketScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#f5f5f5',
        backgroundColor: "#222831"
    },
});
