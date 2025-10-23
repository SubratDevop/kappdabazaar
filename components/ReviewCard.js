import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReviewCard = ({ rating, date, name, review }) => {
    return (
        <View style={styles.card}>
            {/* Stars and Date */}
            <View style={styles.header}>
                <View style={styles.stars}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        // <FontAwesome
                        //     key={index}
                        //     name={index < rating ? }
                        //     size={16}
                        //     color="#FFD700"
                        // />
                        index < rating ? <Ionicons name="star-outline" size={24} key={index} color="#ff6347" /> : <Ionicons name="star-outline" size={24} key={index} color="#ff6347" />
                    ))}
                </View>
                <Text style={styles.date}>{date}</Text>
            </View>

            {/* Name */}
            <Text style={styles.name}>{name}</Text>

            {/* Review Description */}
            <Text style={styles.review}>{review}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#F8F8F8',
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
        elevation: 2, // for Android shadow
        shadowColor: '#000', // for iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    stars: {
        flexDirection: 'row',
    },
    date: {
        fontSize: 12,
        color: '#666',
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    review: {
        fontSize: 13,
        color: '#333',
    },
});

export default ReviewCard;
