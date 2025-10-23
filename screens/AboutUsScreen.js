import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const founders = [
    {
        name: 'Mr. Dwarkadas',
        role: 'Co-Founder & CEO',
        image: require('../assets/prof1.jpeg'), // Replace with actual image
    },
    {
        name: 'Mr. Junior Dwarkadas',
        role: 'Co-Founder & COO',
        image: require('../assets/prof2.jpeg'), // Replace with actual image
    },
];

const AboutUsScreen = () => {
    return (
        <LinearGradient
            colors={['#FFDD44', '#00C851', '#0052D4']} // Krishna & Textile Theme
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Heading */}
                <Text style={styles.heading}>Dwarkadas & Sons</Text>

                {/* About Company */}
                <Text style={styles.aboutText}>
                    Welcome to our company! We are dedicated to delivering the finest services, driven by innovation and passion.
                    With a legacy of craftsmanship and a commitment to excellence, we continuously push the boundaries of creativity and technology.
                </Text>

                {/* Founder Section */}
                <View style={styles.founderContainer}>
                    {founders.map((founder, index) => (
                        <View key={index} style={styles.founderCard}>
                            <Image source={founder.image} style={styles.founderImage} />
                            <Text style={styles.founderName}>{founder.name}</Text>
                            <Text style={styles.founderRole}>{founder.role}</Text>
                        </View>
                    ))}
                </View>

                {/* The Next Generation Speaks */}
                <View style={styles.legacyContainer}>
                    <Text style={styles.legacyHeading}>✨ The Next Generation Speaks ✨</Text>
                    <Text style={styles.legacyText}>
                        "Textiles are more than just materials; they represent a rich heritage. For over 40 years, our family has devoted itself to the art of textiles, carrying forward traditions established since 1985.
                        What began with my grandfather, flourished under my father, and now continues with me. My vision is to share this passion, bringing the unmatched quality of our textiles to the nation and beyond—to the world."
                    </Text>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2d2d2d',
        marginBottom: 10,
        color: "#fff"
    },
    aboutText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        marginBottom: 20,
        lineHeight: 22,
        color: "#fff"
    },
    founderContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 20,
    },
    founderCard: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
        marginHorizontal: 5,
        marginVertical: 5,
    },
    founderImage: {
        width: 220,
        height: 250,
        objectFit: "contain",
        borderRadius: 100,
        marginBottom: 10,
    },
    founderName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
    },
    founderRole: {
        fontSize: 14,
        color: '#777',
    },
    legacyContainer: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
        marginTop: 10,
    },
    legacyHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2d2d2d',
        textAlign: 'center',
        marginBottom: 10,
    },
    legacyText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#444',
        textAlign: 'center',
        lineHeight: 22,
    },
});
