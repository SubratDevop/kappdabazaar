import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Divider, TouchableRipple } from 'react-native-paper';
import { useCompanyStore } from '../../store/useCompanyStore';

const ManufacturerList = ({ navigation }) => {
    const isFocused = useIsFocused();
    const { allCompanies, fetchAllCompanies, approvalToAppFn } = useCompanyStore();
    const [refreshing, setRefreshing] = useState(false);

    const refreshData = async () => {
        setRefreshing(true);
        await fetchAllCompanies(); // Your API call
        setRefreshing(false);
    };

    useEffect(() => {
        if (isFocused) {
            refreshData();
        }
    }, []);
    return (
        <FlatList
            data={allCompanies}
            keyExtractor={(item) => item.id}
            refreshing={refreshing}
            onRefresh={refreshData}
            ListHeaderComponent={() => (
                <Text style={styles.headerText}>
                    Manufacturers
                </Text>
            )}
            ListEmptyComponent={() =>
                refreshing ? null : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No manufacturers found.</Text>
                    </View>
                )
            }
            renderItem={({ item, index }) => {
                if (item?.company_user?.status === "approved") {
                    return null;
                }
                return (


                    <View key={index}>
                        <TouchableRipple
                            key={item.id}
                            style={styles.manufacturerItem}
                            onPress={() => navigation.navigate('ManufacturerDetails', { manufacturer: item })}
                            rippleColor="#EED7CE"
                            borderless={false}
                        >
                            <View style={styles.manufacturerContent}>
                                <View style={styles.manufacturerDetails}>
                                    <Text
                                        style={[styles.manufacturerName, { fontSize: item.company_name.length > 20 ? 16 : 19 }]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {item.company_name}
                                    </Text>

                                    <Text style={styles.manufacturerSubText}>
                                        ({item?.company_user?.name})
                                    </Text>
                                </View>

                                <Button
                                    mode={item?.company_user?.status === "approved" ? "elevated" : "elevated"}
                                    onPress={async () => {
                                        approvalToAppFn(item?.company_user?.user_id, "approved");
                                        await fetchAllCompanies();
                                    }}
                                    disabled={item?.company_user?.status === "approved"}
                                    style={item?.company_user?.status === "approved" ? styles.disabledButton : styles.activeButton}
                                    textColor={item?.company_user?.status === "approved" ? "#000" : "#fff"}
                                >
                                    {item?.company_user?.status === "approved" ? "Approved" : "Approve"}
                                </Button>
                                <Button
                                    mode={item?.company_user?.status !== "rejected" ? "elevated" : "elevated"}
                                    onPress={async () => {
                                        approvalToAppFn(item?.company_user?.user_id, "rejected");
                                        await fetchAllCompanies();
                                    }}
                                    disabled={item?.company_user?.status === "rejected"}
                                    style={item?.company_user?.status === "rejected" ? styles.disabledButton : styles.activeButton}
                                    textColor={item?.company_user?.status === "rejected" ? "#000" : "#fff"}
                                >
                                    {item?.company_user?.status === "rejected" ? "Rejected" : "Reject"}
                                </Button>
                            </View>
                        </TouchableRipple>
                        <Divider style={styles.divider} />
                    </View>
                )


            }




            }
            contentContainerStyle={allCompanies.length === 0 && !refreshing ? styles.emptyListContainer : styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#555',
    },
    headerText: {
        fontSize: 17,
        fontWeight: "500",
        paddingLeft: 5,
        marginBottom: 5,
        color: "#ff6347",
    },
    manufacturerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginVertical: 4,
        backgroundColor: '#fff',
        borderRadius: 6,
    },
    manufacturerContent: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        flexWrap: "wrap",
    },
    manufacturerDetails: {
        flexDirection: "column",
        flexShrink: 1,
        maxWidth: "100%",
    },
    manufacturerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    manufacturerSubText: {
        fontSize: 13,
        color: "#555",
    },
    activeButton: {
        backgroundColor: "#ff6347",
        alignSelf: "center",
    },
    disabledButton: {
        backgroundColor: "#EEEEEE",
        alignSelf: "center",
    },
    divider: {
        marginVertical: 1,
    },
});

export default ManufacturerList;
