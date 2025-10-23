import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Card, Button, ActivityIndicator } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import EmptyState from '../../components/EmptyState';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { API_BASE } from '../../constants/exports';

const SavedScreen = ({ navigation }) => {
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { authInfo } = useAuthStore();

    useEffect(() => {
        fetchSavedItems();
    }, []);

    const fetchSavedItems = async () => {
        try {
            setLoading(true);
            const token = authInfo?.token;
            const response = await axios.get(`${API_BASE}/user/saved-products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSavedItems(response.data);
        } catch (error) {
            console.error('Error fetching saved items:', error);
            Alert.alert('Error', 'Failed to fetch saved items');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const removeSavedItem = async (productId) => {
        try {
            const token = authInfo?.token;
            await axios.delete(`${API_BASE}/user/saved-products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSavedItems(prev => prev.filter(item => item.id !== productId));
        } catch (error) {
            console.error('Error removing saved item:', error);
            Alert.alert('Error', 'Failed to remove item');
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchSavedItems();
    };

    const renderSavedItem = ({ item }) => (
        <Card style={styles.itemCard}>
            <Card.Content>
                <View style={styles.itemHeader}>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemTitle}>{item.product_name}</Text>
                        <Text style={styles.itemSubtitle}>{item.category}</Text>
                        <Text style={styles.itemPrice}>₹{item.price}/meter</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeSavedItem(item.id)}
                    >
                        <MaterialIcons name="bookmark" size={24} color="#132f56" />
                    </TouchableOpacity>
                </View>
                <View style={styles.itemActions}>
                    <Button
                        mode="outlined"
                        onPress={() => navigation.navigate('ProductDetailsScreen', { product: item })}
                        style={styles.viewButton}
                    >
                        View Details
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('QuantitySelectionScreen', { product: item })}
                        style={styles.orderButton}
                        buttonColor="#132f56"
                    >
                        Order Now
                    </Button>
                </View>
            </Card.Content>
        </Card>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} size="large" color="#132f56" />
                <Text style={styles.loadingText}>Loading saved items...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Saved Items</Text>
                <Text style={styles.headerSubtitle}>
                    {savedItems.length} {savedItems.length === 1 ? 'item' : 'items'} saved
                </Text>
            </View>

            {savedItems.length === 0 ? (
                <EmptyState
                    type="saved"
                    actionText="Browse Fabrics"
                    onActionPress={() => navigation.navigate('HomeScreen')}
                />
            ) : (
                <FlatList
                    data={savedItems}
                    renderItem={renderSavedItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#132f56',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },
    listContainer: {
        padding: 16,
    },
    itemCard: {
        marginBottom: 16,
        elevation: 2,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    itemSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#132f56',
        marginTop: 8,
    },
    removeButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#FEF3C7',
    },
    itemActions: {
        flexDirection: 'row',
        gap: 12,
    },
    viewButton: {
        flex: 1,
    },
    orderButton: {
        flex: 1,
    },
});

export default SavedScreen;
