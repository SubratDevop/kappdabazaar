import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { Modal, Portal, TextInput, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const BankAccountForm = ({ visible, onDismiss, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        accountHolderName: '',
        accountNumber: '',
        bankName: '',
        ifscCode: '',
        branchName: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                accountHolderName: initialData.accountHolderName || '',
                accountNumber: initialData.accountNumber || '',
                bankName: initialData.bankName || '',
                ifscCode: initialData.ifscCode || '',
                branchName: initialData.branchName || '',
            });
        }
    }, [initialData]);

    const handleSubmit = () => {
        if (!formData.accountHolderName || !formData.accountNumber || !formData.bankName || !formData.ifscCode) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }
        onSubmit(formData);
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={styles.modalContainer}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.header}>
                            <Text style={styles.title}>
                                {initialData ? 'Edit Bank Account' : 'Add Bank Account'}
                            </Text>
                            <MaterialIcons
                                name="close"
                                size={24}
                                color="#8E8E93"
                                onPress={onDismiss}
                            />
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Account Holder Name *</Text>
                                <TextInput
                                    mode="outlined"
                                    value={formData.accountHolderName}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, accountHolderName: text })
                                    }
                                    style={styles.input}
                                    placeholder="Enter account holder name"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Account Number *</Text>
                                <TextInput
                                    mode="outlined"
                                    value={formData.accountNumber}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, accountNumber: text })
                                    }
                                    style={styles.input}
                                    placeholder="Enter account number"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Bank Name *</Text>
                                <TextInput
                                    mode="outlined"
                                    value={formData.bankName}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, bankName: text })
                                    }
                                    style={styles.input}
                                    placeholder="Enter bank name"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>IFSC Code *</Text>
                                <TextInput
                                    mode="outlined"
                                    value={formData.ifscCode}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, ifscCode: text.toUpperCase() })
                                    }
                                    style={styles.input}
                                    placeholder="Enter IFSC code"
                                    autoCapitalize="characters"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Branch Name</Text>
                                <TextInput
                                    mode="outlined"
                                    value={formData.branchName}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, branchName: text })
                                    }
                                    style={styles.input}
                                    placeholder="Enter branch name"
                                />
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button
                                mode="outlined"
                                onPress={onDismiss}
                                style={[styles.button, styles.cancelButton]}
                                labelStyle={styles.cancelButtonLabel}
                            >
                                Cancel
                            </Button>
                            <Button
                                mode="contained"
                                onPress={handleSubmit}
                                style={[styles.button, styles.submitButton]}
                                labelStyle={styles.submitButtonLabel}
                            >
                                {initialData ? 'Update' : 'Add Account'}
                            </Button>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#FFFFFF',
        margin: 20,
        borderRadius: 12,
        maxHeight: '80%',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C2C2E',
    },
    form: {
        padding: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2C2C2E',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        gap: 12,
    },
    button: {
        minWidth: 100,
    },
    cancelButton: {
        borderColor: '#8E8E93',
    },
    cancelButtonLabel: {
        color: '#8E8E93',
    },
    submitButton: {
        backgroundColor: '#FF6B6B',
    },
    submitButtonLabel: {
        color: '#FFFFFF',
    },
});

export default BankAccountForm; 