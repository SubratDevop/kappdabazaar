import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { URL_BASE } from '../../constants/exports';
import { useProductStore } from "../../store/useProductStore";
import UserFabricCard from '../../components/UserFabricCard';
import { height, width } from '../../constants/helpers';



const SearchScreen = ({ navigation }) => {
    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [saved, setSaved] = useState(false);


    const { allProducts } = useProductStore(); // ← product list already loaded
    const handleSave = async () => {
        setSaved(!saved);
        await saveProductFn(product_id, 1);
    };

    useEffect(() => {
        if (query.trim().length === 0) {
            setFiltered([]);
            return;
        }
        const results = allProducts.filter((item) =>
            (item.name || "")
                .toLowerCase()
                .includes(query.toLowerCase())
        );

        setFiltered(results);
    }, [query]);

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", padding: 12 }}>
            {/* Search Bar */}
            <View style={styles.searchBar}>
                {/* <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={22} color="#111" />
                </TouchableOpacity> */}

                <TextInput
                    placeholder="Search fabrics..."
                    placeholderTextColor="#666"
                    value={query}
                    onChangeText={setQuery}
                    style={styles.searchInput}
                />

                <Feather name="search" size={20} color="#222" />
            </View>

            {/* Results */}
            {filtered.length > 0 ? (

                <View style={styles.lattestContent}>

                    <FlatList
                        data={filtered}
                        renderItem={({ item }) => <UserFabricCard fabric={item} navigation={navigation} />}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        nestedScrollEnabled
                    />

                </View>

            ) : query.length > 0 ? (
                <View style={{ marginTop: 20, alignItems: "center" }}>
                    <Text style={{ color: "#777" }}>No matching products found.</Text>
                </View>
            ) : null}
        </View>



    );
};

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eee",
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 45,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        paddingLeft: 10,
        color: "#111",
    },
    card: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 8,
        marginBottom: 12,
        marginHorizontal: "1%",
        elevation: 2,
    },
    cardImg: {
        width: "100%",
        height: 150,
        borderRadius: 8,
    },
    cardTitle: {
        marginTop: 6,
        textAlign: "center",
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },


});

export default SearchScreen;





















