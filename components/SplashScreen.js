import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function SplashScreen({ onAnimationComplete }) {
    const scaleAnim = useRef(new Animated.Value(1)).current; // Initial scale value

    useEffect(() => {
        // Start the zoom-out animation when the loading is complete
        Animated.timing(scaleAnim, {
            toValue: 1.5, // Scale down to 0
            duration: 2000, // Animation duration in milliseconds
            useNativeDriver: true, // Use native driver for better performance
        }).start(() => {
            if (onAnimationComplete) {
                onAnimationComplete(); // Notify when the animation is complete
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../assets/kapda_splash_new.png')} // Replace with your splash image
                style={[styles.image, { transform: [{ scale: scaleAnim }] }]} // Apply scale animation
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#132f56', // Match your splash screen background color
    },
    image: {
        width: '100%',
        height: '90%',
    },
});