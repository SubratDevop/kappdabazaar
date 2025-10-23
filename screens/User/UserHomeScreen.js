import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FabricCard from '../../components/FabricCard';
import UserFabricCard from '../../components/UserFabricCard';
import { width } from '../../constants/helpers';
import { useCompanyStore } from '../../store/useCompanyStore';
import { useProductStore } from '../../store/useProductStore';

const UserHomeScreen = ({ navigation }) => {

    const { allCompanies, fetchAllCompanies } = useCompanyStore();
    const { getAllProducts, allProducts } = useProductStore();

    // Loading states
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);


    useEffect(() => {
        setLoadingCompanies(true);
        setLoadingProducts(true);

        // Fetch companies
        Promise.resolve(fetchAllCompanies())
            .finally(() => setLoadingCompanies(false));

        // Fetch products
        Promise.resolve(getAllProducts())
            .finally(() => setLoadingProducts(false));
    }, []);
    const latestRef = useRef(null);
    const [latestIndex, setLatestIndex] = useState(0);
    const trendingRef = useRef(null);
    const [trendingIndex, setTrendingIndex] = useState(0);
    const featuredRef = useRef(null);
    const [featuredIndex, setFeaturedIndex] = useState(0);
    const useAutoScroll = (ref, data, index, setIndex, intvl) => {
        useEffect(() => {
            if (!data || data.length === 0) return;

            const interval = setInterval(() => {
                let nextIndex = index + 1;
                if (nextIndex >= data.length) {
                    nextIndex = 0;
                }
                ref.current?.scrollToIndex({ index: nextIndex, animated: true });
                setIndex(nextIndex);
            }, intvl);

            return () => clearInterval(interval);
        }, [index, data]);
    };

    // Attach auto scroll to each list
    useAutoScroll(latestRef, allProducts, latestIndex, setLatestIndex, 3000);
    useAutoScroll(trendingRef, allProducts, trendingIndex, setTrendingIndex, 3500);
    useAutoScroll(featuredRef, allProducts, featuredIndex, setFeaturedIndex, 2500);


    const searchPhrases = ["Search fabrics...", "Find the best deals!", "Explore new arrivals!", "Discover premium fabrics!"];
    const [index, setIndex] = useState(0);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const translateYAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            // Start fade out and move up animation
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0, // Fade out
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnim, {
                    toValue: -10, // Move text up
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                // Change text
                setIndex((prevIndex) => (prevIndex + 1) % searchPhrases.length);

                // Reset animation values
                fadeAnim.setValue(0);
                translateYAnim.setValue(10);

                // Start fade in animation
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateYAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start();
            });
        }, 3000); // Change text every 3 seconds

        return () => clearInterval(interval);
    }, []);

    // Helper: Render loading spinner
    const renderLoading = () => (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <ActivityIndicator size="large" color="#132f56" />
            <Text style={{ marginTop: 10, color: "#132f56" }}>Loading...</Text>
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#132f56" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Kapda Bazaar</Text>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Pressable style={styles.cartIcon} onPress={() => navigation.push("Profile")}>
                            {/* <ShoppingBagIcon color={"white"} strokeWidth={2.1} /> */}
                            <Feather name="shopping-bag" size={23} color="white" />
                        </Pressable>
                        <Pressable style={styles.userIcon} onPress={() => navigation.push("UserProfile")}>
                            {/* <UserIcon color={""} strokeWidth={2.8} /> */}
                            <Feather name="user" size={22} color="white" />
                        </Pressable>
                    </View>
                </View>

                {/* Search Box */}
                <TouchableOpacity onPress={() => navigation.navigate("Search")} activeOpacity={0.8} style={styles.searchBox}>
                    {/* <SearchIcon color="#000" size={20} /> */}
                    <Feather name="search" size={20} color="#000" />
                    <View style={{ overflow: "hidden", height: 20, marginLeft: 10 }}>
                        <Animated.Text style={[styles.searchText, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
                            {searchPhrases[index]}
                        </Animated.Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <ScrollView showsVerticalScrollIndicator alwaysBounceVertical={false}>
                <>
                    {/* Loading states */}
                    {(loadingCompanies || loadingProducts) && renderLoading()}



                    {/* Latest Arrivals */}
                    {!loadingProducts && allProducts?.length >= 1 && <View style={{ backgroundColor: "transparent" }}>
                        <LinearGradient
                            colors={["#F5F5F5", "#F8FAFC"]} // Red fading to a lighter red
                            style={{ flex: 1 }} // Ensures it covers the full container
                        >
                            <Text style={[styles.sectionTitle, { paddingHorizontal: 5,  paddingTop: 8, paddingBottom: 3,backgroundColor: "#ff634750", color: "#132f56" }]}>Latest Arrivals</Text>
                            <View style={styles.lattestContent}>
                                <FlatList
                                    ref={latestRef}
                                    data={allProducts}
                                    renderItem={({ item }) => <UserFabricCard fabric={item} navigation={navigation} />}
                                    keyExtractor={(item, index) => index.toString()}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    nestedScrollEnabled
                                />
                            </View>
                        </LinearGradient>
                    </View>}

                    {/* Trending Fabrics */}
                    {!loadingProducts && allProducts && allProducts?.length >= 5 && <LinearGradient
                        colors={["#F5F5F5", "#F8FAFC"]} // Dark purple to light purple
                        style={{ flex: 1 }}>
                        <Text style={[styles.sectionTitle, { paddingHorizontal: 5,  paddingTop: 8, paddingBottom: 3,backgroundColor: "#E6E6FA", color: "#132f56" }]}>Trending Fabrics</Text>
                        <View style={styles.trendingContent}>
                            <FlatList
                                ref={trendingRef}
                                data={allProducts}
                                renderItem={({ item }) => <UserFabricCard fabric={item} navigation={navigation} />}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                nestedScrollEnabled
                            />
                        </View>
                    </LinearGradient>
                    }

                    {/* Featured Products*/}
                    {!loadingProducts && allProducts?.length >= 5 && <LinearGradient
                        colors={["#F5F5F5", "#F8FAFC"]} // Dark purple to light purple
                        style={{ flex: 1 }}
                    >
                        <Text style={[styles.sectionTitle, { paddingHorizontal: 5,  paddingTop: 8, paddingBottom: 3,backgroundColor: "#D2F8D290", color: "#132f56" }]}>Featured</Text>
                        <View style={styles.featuredContent}>
                            <FlatList
                                ref={featuredRef}

                                data={allProducts}
                                renderItem={({ item }) => <UserFabricCard fabric={item} navigation={navigation} />}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                nestedScrollEnabled
                            />
                        </View>
                    </LinearGradient>}

                    {/* All Manufacturers/Companies */}
                    <Text style={styles.sectionTitleForManufact}>
                        Our Manufacturers
                    </Text>
                    <LinearGradient
                        colors={["#F5F5F5", "#F8FAFC"]}
                        style={{ flex: 1 }}
                    >
                        {allCompanies?.map((company, idx) => (
                            <View key={idx} style={styles.content}>
                                <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", backgroundColor: "#ff6347", alignItems: "center", paddingHorizontal: 4, borderRadius: 3, marginBottom: 4 }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            paddingLeft: 5,
                                            fontWeight: "bold",
                                            color: "#ff6347",
                                            marginBottom: 0,
                                            color: "#fff",
                                            paddingVertical: 5,

                                        }}
                                    >
                                        {company?.company_name}
                                    </Text>
                                    <Text
                                        onPress={() => navigation.navigate('ViewStoreScreen', { manufacturer: company })}
                                        style={styles.sectionTitleStoreView}>
                                        view Store
                                    </Text>
                                </View>
                                <FlatList
                                    data={company.Products}
                                    renderItem={({ item }) => <FabricCard fabric={item} navigation={navigation} />}
                                    keyExtractor={(item, index) => index.toString()}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    nestedScrollEnabled
                                />
                            </View>
                        ))}

                    </LinearGradient>
                </>
            </ScrollView>
        </View >
    );
};

export default UserHomeScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        alignItems: "center",
        width: width,
        backgroundColor: "#f28482",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: 12,
        backgroundColor: "#132f56",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    userIcon: {
        backgroundColor: "#f28482",
        padding: 8,
        borderRadius: 50,
    },
    cartIcon: {
        // backgroundColor: "#f28482",
        padding: 8,
        paddingRight: 12,
        borderRadius: 50,
    },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 12,
        width: "90%",
        height: 40,
        marginVertical: 8,
        marginBottom: 12,
    },
    searchText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: "#111",
    },
    tabContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#132f56",
        paddingHorizontal: 5,
        marginTop: 8,
        marginBottom: 3,
        height: 50,
    },
    sectionTitleForManufact: {
        fontSize: 17,
        backgroundColor: "#F8FAFC",
        marginHorizontal: 5,
        fontWeight: "500",
        paddingVertical: 8,
        paddingHorizontal: 5,
        marginTop: 3,
        color: "#f28482",
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        textAlign: "center"
    },
    tab: {
        flex: 1, // Each tab takes equal space
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 13,
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    activeTab: {
        borderBottomColor: "#ff6347",
    },
    tabContent: {
        alignItems: "center",
        justifyContent: "center",
        gap: 4, // Adds space between icon and text
    },
    tabText: {
        color: "#fff",
        fontWeight: "600",
        marginTop: 2,
        fontSize: 11,
    },
    activeTabText: {
        color: "#ff6347",
    },
    lattestContent: {
        flex: 1,
        alignItems: "flex-start",
        width: width,
        backgroundColor: "#ff634750",
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    trendingContent: {
        flex: 1,
        alignItems: "flex-start",
        width: width,
        backgroundColor: "#E6E6FA",
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    featuredContent: {
        flex: 1,
        alignItems: "flex-start",
        width: width,
        backgroundColor: "#D2F8D290",
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    sectionTitle: {
        fontSize: 20,
        paddingLeft: 5,
        textAlign: "center",
        fontWeight: "bold",
        color: "#ff6347",
    },
    sectionTitleStoreView: {
        fontSize: 12,
        paddingLeft: 5,
        fontWeight: "bold",
        color: "#666",
        textDecorationLine: "underline",
        // marginBottom: 0,
    },
    placeholderText: {
        fontSize: 16,
        textAlign: "center",
        color: "#666",
        marginTop: 20,
    },
    addButton: {
        flex: 1,
        display: "flex",
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#ff6347",
        paddingVertical: 12,
        paddingHorizontal: 26,
        borderRadius: 8,
        marginBottom: 10,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
});
