import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Animated, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const EventCard = ({ event, onPress }) => {
    const [expanded, setExpanded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const {
        name,
        date,
        location,
        status,
        images,
        description,
        organizer,
        attendees,
        category
    } = event;

    const onScroll = (event) => {
        const scrollX = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollX / width);
        setCurrentImageIndex(index);
    };

    return (
        <View style={styles.container}>
            {/* Image Carousel */}
            <View style={styles.imageContainer}>
                <FlatList
                    data={images}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: item }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                />
                <View style={styles.paginationContainer}>
                    {images.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                currentImageIndex === index && styles.paginationDotActive
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* Event Info */}
            <View style={styles.infoContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.name}>{name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: status === 'Upcoming' ? '#E3F2FD' : '#E8F5E9' }]}>
                        <Text style={[styles.statusText, { color: status === 'Upcoming' ? '#1976D2' : '#2E7D32' }]}>
                            {status}
                        </Text>
                    </View>
                </View>

                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <Feather name="calendar" size={14} color="#666" />
                        <Text style={styles.detailText}>{date}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Feather name="map-pin" size={14} color="#666" />
                        <Text style={styles.detailText}>{location}</Text>
                    </View>
                </View>

                <View style={styles.categoryRow}>
                    <Text style={styles.category}>{category}</Text>
                    <Text style={styles.attendees}>{attendees} attending</Text>
                </View>

                {/* Expandable Section */}
                <TouchableOpacity
                    style={styles.expandButton}
                    onPress={() => setExpanded(!expanded)}
                >
                    <Text style={styles.expandButtonText}>
                        {expanded ? 'Show less' : 'Show more'}
                    </Text>
                    <Feather
                        name={expanded ? "chevron-up" : "chevron-down"}
                        size={16}
                        color="#666"
                    />
                </TouchableOpacity>

                {expanded && (
                    <Animated.View style={styles.expandedContent}>
                        <Text style={styles.description}>{description}</Text>
                        <View style={styles.organizerRow}>
                            <Text style={styles.organizerLabel}>Organized by:</Text>
                            <Text style={styles.organizerName}>{organizer}</Text>
                        </View>
                        {/* <TouchableOpacity
                            style={styles.registerButton}
                            onPress={onPress}
                        >
                            <Text style={styles.registerButtonText}>Register Now</Text>
                        </TouchableOpacity> */}
                    </Animated.View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        position: 'relative',
        height: 200,
    },
    image: {
        width: width - 32,
        height: 200,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginHorizontal: 3,
    },
    paginationDotActive: {
        backgroundColor: '#fff',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    infoContainer: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    detailsRow: {
        flexDirection: 'row',
        marginBottom: 12,
        gap: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: 13,
        color: '#666',
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    category: {
        fontSize: 13,
        color: '#666',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    attendees: {
        fontSize: 13,
        color: '#666',
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    expandButtonText: {
        fontSize: 13,
        color: '#666',
        marginRight: 4,
    },
    expandedContent: {
        marginTop: 12,
    },
    description: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
        marginBottom: 12,
    },
    organizerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    organizerLabel: {
        fontSize: 13,
        color: '#666',
        marginRight: 4,
    },
    organizerName: {
        fontSize: 13,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    registerButton: {
        backgroundColor: '#ff6347',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default EventCard; 