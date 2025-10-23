import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { colors } from '../../constants/exports';
import { useAuthStore } from '../../store/useAuthStore';

const IntroAsk = ({ navigation }) => {
    const [selectedRole, setSelectedRole] = useState('');
    const { setUserRole, userRole } = useAuthStore();


    useEffect(() => {
        if (userRole !== null) {
            navigation.replace('Login', { role: userRole });
        }
    }, [userRole]);

    const onConfirm = () => {
        const formattedRole = selectedRole.toLowerCase();
        setUserRole(formattedRole);
        navigation.replace('Login', { role: formattedRole });
    };

    return (
        <View style={styles.container}>
            <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Welcome,</Text>
                <View style={styles.brandContainer}>
                    <Text style={styles.welcomeText}>to</Text>
                    <TouchableOpacity
                        onLongPress={() => navigation.replace('Login', { role: 'superadmin' })}
                    >
                        <Text style={styles.brandName}>Kapda Bazaar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.middleContent}>
                <View style={styles.roleQuestion}>
                    <Text style={styles.roleQuestionText}>Are you a </Text>
                    <TextInput
                        mode="flat"
                        value={selectedRole}
                        style={[
                            styles.roleInput,
                            selectedRole === 'USER' && styles.userColor,
                            selectedRole === 'SELLER' && styles.sellerColor,
                        ]}
                        editable={false}
                        theme={{ colors: { primary: 'black' } }}
                    />
                    <Text style={styles.roleQuestionText}>.</Text>
                </View>

                <View style={styles.roleContainer}>
                    {['SELLER', 'USER'].map((role) => (
                        <TouchableOpacity
                            key={role}
                            style={[
                                styles.roleButton,
                                selectedRole === role && styles.selectedRole,
                            ]}
                            onPress={() =>
                                setSelectedRole((prev) => (prev === role ? '' : role))
                            }
                        >
                            <Text
                                style={[
                                    styles.roleText,
                                    selectedRole === role && styles.selectedRoleText,
                                ]}
                            >
                                {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.confirmButtonContainer}>
                <Button
                    mode="elevated"
                    onPress={onConfirm}
                    disabled={selectedRole.length === 0}
                    style={styles.confirmButton}
                    textColor="#fff"
                >
                    CONFIRM
                </Button>
            </View>
        </View>
    );
};

export default IntroAsk;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40,
        alignItems: 'center',
    },
    welcomeContainer: {
        alignSelf: 'flex-start',
    },
    welcomeText: {
        fontSize: 25,
        fontWeight: '400',
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    brandName: {
        fontSize: 28,
        fontWeight: '500',
        marginLeft: 5,
    },
    middleContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    roleQuestion: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roleQuestionText: {
        fontSize: 19,
        fontWeight: '400',
    },
    roleInput: {
        width: '30%',
        fontSize: 20,
        backgroundColor: 'white',
        marginHorizontal: 5,
        borderColor: colors.lightGray,
        fontWeight: '800',
    },
    userColor: {
        color: '#132f56',
    },
    sellerColor: {
        color: '#f28482',
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 40,
        paddingHorizontal: 10,
    },
    roleButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 10,
        width: '48%',
        alignItems: 'center',
    },
    selectedRole: {
        backgroundColor: colors.steelBlue,
        borderColor: colors.lightGray,
    },
    roleText: {
        fontSize: 16,
        color: '#000',
    },
    selectedRoleText: {
        fontWeight: 'bold',
        color: '#fff',
    },
    confirmButtonContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        paddingHorizontal: 16,
    },
    confirmButton: {
        backgroundColor: colors.navyBlue,
    },
});
