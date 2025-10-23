import { Feather } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import EventCard from '../../components/EventCard';
import { useAuthStore } from '../../store/useAuthStore';

const dummyEvents = [
    {
        id: 1,
        name: "Textile Expo 2024",
        date: "March 15-17, 2024",
        location: "Bombay Exhibition Centre, Mumbai",
        status: "Upcoming",
        images: [
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
        ],
        description: "Join us for the biggest textile exhibition of the year. Meet industry leaders, discover new trends, and network with professionals from around the world.",
        organizer: "Textile Association of India",
        attendees: "500+",
        category: "Exhibition"
    },
    {
        id: 2,
        name: "Fashion Week 2024",
        date: "April 5-10, 2024",
        location: "Jio World Convention Centre, Mumbai",
        status: "Upcoming",
        images: [
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
        ],
        description: "Experience the future of fashion with exclusive runway shows, designer collections, and industry networking opportunities.",
        organizer: "Fashion Design Council of India",
        attendees: "1000+",
        category: "Fashion Show"
    }
];

const EventsScreen = ({ navigation }) => {
    const { userRole } = useAuthStore();

    const handleEventPress = (event) => {
        // Handle event registration or details view
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.title}>Upcoming Events</Text>
            {userRole === "superadmin" && (
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddEvent')}
                >
                    <Feather name="plus" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Event</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={dummyEvents}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <EventCard 
                        event={item} 
                        onPress={() => handleEventPress(item)}
                    />
                )}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    listContent: {
        paddingVertical: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff6347',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 8,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default EventsScreen; 