import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Button, TextInput } from 'react-native-paper';
import { themeInput } from '../constants/exports';


const AddQuality = () => {
    const [quality, setQuality] = useState({
        name: '',
        location: '',
        description: '',
    });

    const handleChange = (key, value) => {
        setQuality({ ...quality, [key]: value });
    };

    const handleSubmit = () => {
    };


    const [locations, setLocations] = useState([
        { label: 'Cotton', value: 'Cotton' },
        { label: 'Silk', value: 'Silk' },
        { label: 'Denim', value: 'Denim' },
    ]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={{ marginBottom: 10, fontWeight: "500", fontSize: 15, color: "#ff6347" }}>Quality Details</Text>
                <TextInput
                    label="Quality Name"
                    mode="outlined"
                    value={quality.name}
                    onChangeText={(text) => handleChange('name', text)}
                    style={styles.input}
                    theme={themeInput}
                />

                <Dropdown
                    data={locations}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Location"
                    value={quality.location}
                    onChange={(item) => handleChange('location', item.value)}
                    style={styles.dropdown}
                    closeModalWhenSelectedItem
                    dropdownPosition="top"
                />

                <TextInput
                    label="Description"
                    mode="outlined"
                    value={quality.description}
                    onChangeText={(text) => handleChange('description', text)}
                    style={styles.input}
                    multiline
                    theme={themeInput}
                />

                <View style={styles.buttonContainer}>
                    <Button mode="outlined" onPress={() => console.log('Cancelled')} textColor="red" style={styles.fullButton}>
                        Cancel
                    </Button>
                    <Button mode="elevated" onPress={handleSubmit} style={[styles.fullButton, styles.button]} textColor="#fff">
                        Save
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f9fa',
        flexGrow: 1,
        paddingBottom: 70,
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10,
        marginTop: 10,
    },
    fullButton: {
        flex: 1,
    },
    button: {
        backgroundColor: '#ff6347',
    },
    dropdown: {
        marginBottom: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 14,
        backgroundColor: 'white',
    },
    dropdownContainer: {
        borderColor: '#ccc',
        backgroundColor: "#fff",
    },
});

export default AddQuality;