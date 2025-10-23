import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const TabComponent = ({ data }) => {

    const navigation = useNavigation();

    const handleRowClick = (item) => {
        navigation.navigate('DetailsScreen', { data: item }); // Navigate to 'DetailScreen' with item data
    };
    const renderHeader = () => (
        <View style={styles.headerRow}>
            <Text style={[styles.headerCell, styles.nameHeader]}>Name</Text>
            <Text style={styles.headerCell}>Count</Text>
            <Text style={styles.headerCell}>Dora</Text>
            <Text style={styles.headerCell}>Peak</Text>
            <Text style={styles.headerCell}>Width</Text>
            <Text style={styles.headerCell}>Weight</Text>
            <Text style={styles.headerCell}>Rate</Text>
        </View>
    );

    const renderItem = ({ item }) => (
        // <ScrollView style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => handleRowClick(item)}>
            <View style={styles.row}>
                <Text style={[styles.cell, styles.nameCell]}>{item.name}</Text>
                <Text style={styles.cell}>{item.count}</Text>
                <Text style={styles.cell}>{item.dora}</Text>
                <Text style={styles.cell}>{item.peak}</Text>
                <Text style={styles.cell}>{item.width}</Text>
                <Text style={styles.cell}>{item.weight}</Text>
                <Text style={[styles.cell, item.rateChange > 0 ? styles.greenText : styles.redText]}>
                    {item.rate}
                </Text>
            </View>
        </TouchableOpacity>
        // </ScrollView>
    );

    return (
        <View style={styles.container}>
            {renderHeader()}
            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#fff',
        backgroundColor: "#222831",
        borderRadius: 10,
        elevation: 3, // Shadow for Android
        shadowColor: 'gray', // Shadow for iOS
        color: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        marginVertical: 10,
        marginHorizontal: 4,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: 'gray',
        color: '#fff',
        paddingVertical: 10,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    nameHeader: {
        textAlign: 'left',
        paddingLeft: 10,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        // color: '#333',
        color: '#fff',
        paddingHorizontal: 5,
    },
    nameCell: {
        textAlign: 'left',
        paddingLeft: 10,
        // borderLeftWidth: 5,
        // borderLeftColor: '#4CAF50', // Green border for Name column
        fontWeight: 'bold',
    },
    greenText: {
        color: 'green',
        fontWeight: 'bold',
    },
    redText: {
        color: 'red',
        fontWeight: 'bold',
    },
});

export default TabComponent;
