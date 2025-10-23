import React from 'react'
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { width } from '../constants/helpers';
import FabricCard from '../components/FabricCard';
import { Feather } from '@expo/vector-icons';

const UserHomeScreen = ({ navigation }) => {

    const fabricData = [
        {
            images: require("../assets/img3.png"),
            price: 24.25,
            previousPrice: 23,
            groupName: 'Premium Cotton',
            phoneNumber: '+918369055036',
            whatsappNumber: '8160740260',
        },
        {
            images: require("../assets/img7.png"),
            price: 24.25,
            previousPrice: 25,
            groupName: 'Premium Cotton',
            phoneNumber: '+918369055036',
            whatsappNumber: '8160740260',
        },
        {
            images: require("../assets/img5.png"),
            price: 24.25,
            previousPrice: 25,
            groupName: 'Premium Cotton',
            phoneNumber: '+918369055036',
            whatsappNumber: '8160740260',
        },
        {
            images: require("../assets/img6.png"),
            price: 24.25,
            previousPrice: 25,
            groupName: 'Premium Cotton',
            phoneNumber: '+918369055036',
            whatsappNumber: '8160740260',
        },
        {
            images: require("../assets/img8.png"),
            price: 24.25,
            previousPrice: 25,
            groupName: 'Premium Cotton',
            phoneNumber: '+918369055036',
            whatsappNumber: '8160740260',
        },
    ];

    const fabricDataGroup = [
        { groupName: "Premium Cotton" },
        { groupName: "Silk Blend" },
        { groupName: "Linen" },
        { groupName: "Premium Cotton" }, // Duplicate
        { groupName: "Denim" },
        { groupName: "Silk Blend" }, // Duplicate
    ];

    return (
        <View style={{ flex: 1, alignItems: "center", width: width, backgroundColor: "#132f56" }}>
            <View style={{ display: "flex", justifyContent: "flex-start", width, paddingVertical: 0 }}>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 8,
                    backgroundColor: "#132f56",
                    paddingHorizontal: 8
                }}>
                    <View style={{ paddingHorizontal: 1, paddingVertical: 4 }}>
                        <Text style={{ fontSize: 26, fontWeight: "500", color: "white" }}>Kapda Bazaar</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-end", width: width / 4 }}>
                        <Pressable
                            style={{
                                backgroundColor: "#f28482", padding: 8,
                                borderRadius: 50
                            }}
                            onPress={() => navigation.openDrawer()}
                        >
                            {/* <UserIcon color={"white"} strokeWidth={2.8} /> */}
                            <Feather name='user' size={20} color="white" />
                        </Pressable>
                    </View>
                </View>
            </View>

            {/* Search Icon */}
            <TouchableOpacity
                onPress={() => navigation.navigate("Search")}
                activeOpacity={0.8}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    marginVertical: 10,
                    paddingHorizontal: 12,
                    width: width * 0.9,
                    height: 42
                }}>
                {/* <SearchIcon color="#000" size={20} /> */}
                <Feather name='search' size={20} color="#000" />
                <Text style={{
                    flex: 1,
                    marginLeft: 8,
                    fontSize: 14,
                    color: "#111",
                    backgroundColor: "#fff"
                }}>
                    Search fabrics...
                </Text>
            </TouchableOpacity>
            <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width,
                    paddingHorizontal: 10,
                    marginTop: 10,
                    // backgroundColor:"red"
                }}>
                    <Text style={{ marginBottom: 5, fontWeight: "500", fontSize: 14, color: "#ff6347" }}>Fresh Arrivals</Text>
                    <Text style={{ fontWeight: "500", marginBottom: 4, fontSize: 13, color: "red", textDecorationLine: "underline" }}>
                        view all
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        padding: 3,
                        width: width - 10,
                    }}
                >
                    <FlatList
                        data={fabricData}
                        renderItem={({ item }) => <FabricCard fabric={item} navigation={navigation} />}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        nestedScrollEnabled={true} // ✅ Fixes the warning
                    />
                </View>


                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width,
                    paddingHorizontal: 10,
                    marginTop: 10,
                    // backgroundColor:"red"
                }}>
                    <Text style={{ marginBottom: 5, fontWeight: "500", fontSize: 14, color: "#ff6347" }}>Fresh Arrivals</Text>
                    <Text style={{ fontWeight: "500", marginBottom: 4, fontSize: 13, color: "red", textDecorationLine: "underline" }}>
                        view all
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        padding: 3,
                        width: width - 10,
                    }}
                >
                    <FlatList
                        data={fabricData}
                        renderItem={({ item }) => <FabricCard fabric={item} navigation={navigation} />}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        nestedScrollEnabled={true} // ✅ Fixes the warning
                    />
                </View>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width,
                    paddingHorizontal: 10,
                    marginTop: 10,
                    // backgroundColor:"red"
                }}>
                    <Text style={{ marginBottom: 5, fontWeight: "500", fontSize: 14, color: "#ff6347" }}>Fresh Arrivals</Text>
                    <Text style={{ fontWeight: "500", marginBottom: 4, fontSize: 13, color: "red", textDecorationLine: "underline" }}>
                        view all
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        padding: 3,
                        width: width - 10,
                    }}
                >
                    <FlatList
                        data={fabricData}
                        renderItem={({ item }) => <FabricCard fabric={item} navigation={navigation} />}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        nestedScrollEnabled={true} // ✅ Fixes the warning
                    />
                </View>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width,
                    paddingHorizontal: 10,
                    marginTop: 10,
                    // backgroundColor:"red"
                }}>
                    <Text style={{ marginBottom: 5, fontWeight: "500", fontSize: 14, color: "#ff6347" }}>Fresh Arrivals</Text>
                    <Text style={{ fontWeight: "500", marginBottom: 4, fontSize: 13, color: "red", textDecorationLine: "underline" }}>
                        view all
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        padding: 3,
                        width: width - 10,
                    }}
                >
                    <FlatList
                        data={fabricData}
                        renderItem={({ item }) => <FabricCard fabric={item} navigation={navigation} />}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        nestedScrollEnabled={true} // ✅ Fixes the warning
                    />
                </View>

            </ScrollView >
        </View >
    )
}

const styles = StyleSheet.create({})

export default UserHomeScreen