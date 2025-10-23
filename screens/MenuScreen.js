import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { width } from '../constants/helpers';
import { Ionicons } from '@expo/vector-icons';

const MenuScreen = ({ navigation }) => {
    const addMenuItems = [
        {
            title: "Add Fancy",
            icon: <Ionicons name="shirt-outline" size={28} color="#f28482" />,
            path: 'AddFancy'
        },
    ];

    return (
        <View style={{
            flex: 1,
            alignItems: "flex-start",
            paddingVertical: 5,
            width: "100%"
        }}>
            <View style={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
                <Text style={{ textAlign: "left", fontWeight: "500", fontSize: 15, marginLeft: 5, color: "#132f56", textDecorationLine: "underline" }}>New Menu</Text>
            </View>
            <View
                style={styles.menuItemContainer}
            >
                {addMenuItems.map((item, index) => (
                    <View style={styles.menuItem} key={index}>
                        <TouchableOpacity
                            key={index}
                            style={styles.editMenuItem}
                            onPress={() => navigation.push(`${item.path}`)}
                        >
                            {item.icon}
                        </TouchableOpacity>
                        <Text style={{ fontSize: 13, fontWeight: "700", color: "#f28482" }}>{item.title}</Text>
                    </View>
                ))}
            </View>
            {/* <Divider style={{ backgroundColor: "#000", width: "100%", marginVertical: 3 }} /> */}
            {/* <View style={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
                <Text style={{ textAlign: "left", fontWeight: "500", marginLeft: 5, fontSize: 15, color: "#132f56", textDecorationLine: "underline" }}>Edit Menu</Text>
            </View> */}
        </View >
    )
}

export default MenuScreen

const styles = StyleSheet.create({
    menuItemContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingVertical: 10,
        width: width - 20,
        borderRadius: 8,
    },
    menuItem: {
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingVertical: 5,
    },
    addmenuItem: {
        width: (width / 5) - 15, // 2 columns, considering padding
        height: 60,
        backgroundColor: "#f28482",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 5,
        marginHorizontal: 10,
        padding: 10,
    },
    editMenuItem: {
        width: (width / 5) - 15, // 2 columns, considering padding
        height: 60,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 5,
        marginHorizontal: 12,
        padding: 15,
    }
})