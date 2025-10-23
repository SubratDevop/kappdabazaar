import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';

const EmptyState = ({ 
    type = 'default', 
    title, 
    subtitle, 
    actionText, 
    onActionPress,
    style 
}) => {
    const getEmptyStateConfig = () => {
        switch (type) {
            case 'orders':
                return {
                    icon: <MaterialIcons name="shopping-bag" size={80} color="#E5E7EB" />,
                    defaultTitle: 'No Orders Yet',
                    defaultSubtitle: 'Your orders will appear here once you start shopping for fabrics'
                };
            case 'products':
                return {
                    icon: <MaterialIcons name="inventory" size={80} color="#E5E7EB" />,
                    defaultTitle: 'No Products Found',
                    defaultSubtitle: 'Add some beautiful fabrics to showcase your collection'
                };
            case 'reports':
                return {
                    icon: <Ionicons name="document-text-outline" size={80} color="#E5E7EB" />,
                    defaultTitle: 'No Reports Available',
                    defaultSubtitle: 'Tax reports and analytics will appear here once you have transactions'
                };
            case 'gst':
                return {
                    icon: <MaterialIcons name="receipt-long" size={80} color="#E5E7EB" />,
                    defaultTitle: 'No GST Records',
                    defaultSubtitle: 'GST details and tax information will be displayed here'
                };
            case 'saved':
                return {
                    icon: <MaterialIcons name="bookmark-border" size={80} color="#E5E7EB" />,
                    defaultTitle: 'No Saved Items',
                    defaultSubtitle: 'Save your favorite fabrics to view them here'
                };
            case 'search':
                return {
                    icon: <Feather name="search" size={80} color="#E5E7EB" />,
                    defaultTitle: 'No Results Found',
                    defaultSubtitle: 'Try adjusting your search terms or browse our fabric categories'
                };
            case 'manufacturers':
                return {
                    icon: <MaterialIcons name="business" size={80} color="#E5E7EB" />,
                    defaultTitle: 'No Manufacturers',
                    defaultSubtitle: 'Fabric manufacturers will be listed here once they register'
                };
            case 'payments':
                return {
                    icon: <MaterialIcons name="payment" size={80} color="#E5E7EB" />,
                    defaultTitle: 'No Payment Records',
                    defaultSubtitle: 'Payment history and transactions will appear here'
                };
            case 'analytics':
                return {
                    icon: <Ionicons name="analytics-outline" size={80} color="#E5E7EB" />,
                    defaultTitle: 'No Analytics Data',
                    defaultSubtitle: 'Business insights and analytics will be shown here'
                };
            case 'fabrics':
                return {
                    icon: <MaterialIcons name="texture" size={80} color="#E5E7EB" />,
                    defaultTitle: 'No Fabrics Available',
                    defaultSubtitle: 'Explore our collection of premium fabrics and textiles'
                };
            default:
                return {
                    icon: <Feather name="inbox" size={80} color="#E5E7EB" />,
                    defaultTitle: 'No Data Available',
                    defaultSubtitle: 'Content will appear here when available'
                };
        }
    };

    const config = getEmptyStateConfig();

    return (
        <View style={[styles.container, style]}>
            <View style={styles.iconContainer}>
                {config.icon}
            </View>
            <Text style={styles.title}>
                {title || config.defaultTitle}
            </Text>
            <Text style={styles.subtitle}>
                {subtitle || config.defaultSubtitle}
            </Text>
            {actionText && onActionPress && (
                <Button 
                    mode="contained" 
                    onPress={onActionPress}
                    style={styles.actionButton}
                    buttonColor="#132f56"
                >
                    {actionText}
                </Button>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    iconContainer: {
        marginBottom: 24,
        opacity: 0.6,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    actionButton: {
        marginTop: 16,
        paddingHorizontal: 24,
    },
});

export default EmptyState; 