import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BankAccountCard from './BankAccountCard';

const BankDetailsList = ({
    accounts,
    onEdit,
    onDelete,
    onSetDefault,
    onAddNew
}) => {
    const renderItem = ({ item }) => (
        <BankAccountCard
            account={item}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item)}
            onSetDefault={() => onSetDefault(item)}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Bank Accounts</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={onAddNew}
                >
                    <Ionicons name="add-circle" size={24} color="#007AFF" />
                    <Text style={styles.addButtonText}>Add New</Text>
                </TouchableOpacity>
            </View>

            {accounts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="card" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>No bank accounts added yet</Text>
                    <TouchableOpacity
                        style={styles.emptyAddButton}
                        onPress={onAddNew}
                    >
                        <Text style={styles.emptyAddButtonText}>Add Your First Account</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={accounts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000'
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    addButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600'
    },
    listContainer: {
        padding: 16
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        marginBottom: 24
    },
    emptyAddButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8
    },
    emptyAddButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    }
});

export default BankDetailsList; 