import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DetailsScreen = ({ route }) => {
    const { data } = route.params;

    return (
        <View>
            <Text>Details for: {data.name}</Text>
            {/* Show more details */}
        </View>
    );
};

const styles = StyleSheet.create({})

export default DetailsScreen