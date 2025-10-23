import { Feather, Fontisto, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Checkbox, TextInput } from "react-native-paper";
import { colors } from "../constants/exports";
import { STORAGE_KEYS, useAuthStore } from "../store/useAuthStore";

const SignInScreen = ({ route }) => {
    const navigation = useNavigation();
    const { role } = route.params; // user or seller


    const [userRole, setUserRole] = useState(role); // fallback to route param

    const [agree, setAgree] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [data, setData] = useState({
        name: "",
        phone_number: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const {
        registerUserFn,
        registerSellerFn,
        isLoading,
    } = useAuthStore();

    useEffect(() => {
        const getRole = async () => {
            const storedRole = await AsyncStorage.getItem(STORAGE_KEYS.ROLE);
            if (storedRole) setUserRole(storedRole);
        };
        getRole();
    }, []);


    const handleChange = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const validateFields = () => {
        const newErrors = {};
        let valid = true;

        if (!data.name || !/^[A-Za-z\s]+$/.test(data.name)) {
            newErrors.name = "Enter a valid full name";
            valid = false;
        }

        if (!/^\d{10}$/.test(data.phone_number)) {
            newErrors.phone_number = "Enter a valid 10-digit mobile number";
            valid = false;
        }

        if (!/^\S+@\S+\.\S+$/.test(data.email)) {
            newErrors.email = "Enter a valid email";
            valid = false;
        }

        if (
            !data.password ||
            data.password.length < 8 ||
            !/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/.test(data.password)
        ) {
            newErrors.password = "Password must be at least 8 characters and include letters and numbers";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleRegister = async () => {
        if (!validateFields()) return;

        try {
            if (role === "seller") {
                await registerSellerFn(data);
                // Toast.show({
                //     type: "success",
                //     text1: "Registered successfully!"
                // })

            } else {
                await registerUserFn(data);
                // Toast.show({
                //     type: "success",
                //     text1: "Registered successfully!"
                // })
            }
            // Proceed to OTP screen or other necessary navigation
            if (role === "seller") {
                navigation.replace("OnboardingScreen", { role });
            } else if (role === "user") {
                // navigation.replace("OtpScreen", { role });
                navigation.replace("Login", { role });
            }

        } catch (err) {
            // Toast.show({
            //     type: "error",
            //     text1: err?.response?.data?.message
            // })
            console.error(err)
        }

    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.title}>Create an Account</Text>
            <Text style={styles.subHeading}>You are signning in as : {role.charAt(0).toUpperCase() + role.slice(1)}</Text>

            {/* Input Fields */}
            {[
                { label: "Full Name", icon: <MaterialIcons name="perm-contact-cal" size={24} color={colors.navyBlue} />, field: "name", placeholder: "Full Name", keyboardType: "default" },
                { label: "Mobile No.", icon: <Feather name="phone" size={24} color={colors.navyBlue} />, field: "phone_number", placeholder: "e.g., 9999999999", keyboardType: "number-pad" },
                { label: "Email", icon: <Fontisto name="email" size={24} color={colors.navyBlue} />, field: "email", placeholder: "Enter your email", keyboardType: "email-address" },
            ].map(({ label, icon, field, placeholder, keyboardType }) => (
                <View key={field} style={styles.inputWrapper}>
                    <Text style={styles.label}>{label}</Text>
                    <View style={styles.passwordContainer}>
                        <View style={styles.icon}>{icon}</View>
                        <TextInput
                            mode="flat"
                            placeholder={placeholder}
                            value={data[field]}
                            onChangeText={(text) => handleChange(field, text)}
                            style={styles.input}
                            keyboardType={keyboardType}
                            autoCapitalize={field === "email" ? "none" : "words"}
                            error={!!errors[field]}
                            maxLength={field === "phone_number" ? 10 : undefined}
                        />
                    </View>
                    {errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
                </View>
            ))}

            {/* Password Field */}
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
                        {showPassword ? <Feather name="eye" size={24} color="#132f56" /> : <Feather name="eye-off" size={24} color="#132f56" />}
                    </TouchableOpacity>
                    <TextInput
                        mode="flat"
                        placeholder="min 8 characters"
                        value={data.password}
                        onChangeText={(text) => handleChange("password", text)}
                        secureTextEntry={!showPassword}
                        style={styles.input}
                        error={!!errors.password}
                    />
                </View>
                {errors.password && <Text style={styles.error}>{errors.password}</Text>}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                <Checkbox
                    onPress={() => setAgree(!agree)}
                    color="#132f56"
                    status={agree ? "checked" : "unchecked"}
                />
                <Text style={{ marginLeft: 8 }}>
                    I agree to the{" "}
                    <Text
                        onPress={() => setModalVisible(true)}
                        style={{ color: "#003285", textDecorationLine: "underline", fontWeight: "600" }}
                    >
                        Terms and Conditions
                    </Text>
                </Text>
            </View>

            {/* Login Link */}
            <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text>Already have an account? </Text>
                <Text
                    onPress={() => navigation.replace("Login", { role: userRole })}
                    style={{ color: "#003285", fontWeight: "500", textDecorationLine: "underline" }}
                >
                    Log in
                </Text>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 10,
                        width: '90%',
                        maxHeight: '80%',
                    }}>
                        <ScrollView style={{ padding: 20 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16, color: '#132f56' }}>
                                Terms and Conditions
                            </Text>

                            {role === "user" ? (<Text style={{ fontSize: 14, color: "#333", lineHeight: 22 }}>

                                Please read these terms and conditions carefully before using the Kapda Bazaar platform. By accessing or using this platform, you acknowledge that you have read, understood, and agree to be bound by these terms.{'\n'}{'\n'}

                                1. Right to Cancellation due to Non-Shipment or Delay by Manufacturer/Seller: {'\n'}

                                1.1. In the event that the goods ordered by the Buyer through the Kapda Bazaar platform are not shipped, or their shipment is delayed beyond the stipulated or agreed-upon time for dispatch/delivery by the manufacturer/seller, the Buyer shall have the full and unequivocal right to cancel the said order.{'\n'}

                                1.2. The 'stipulated or agreed-upon time' shall mean:{'\n'}

                                (a) The delivery/dispatch timeline explicitly stated on the product page at the time of order placement; or{'\n'}

                                (b) Any specific delivery/dispatch date or period communicated and agreed upon between the Buyer and the manufacturer/seller subsequent to the order placement.{'\n'}

                                1.3. Upon exercise of the right to cancellation under Clause 1.1, the Buyer shall be entitled to a full refund of the entire payment made for the cancelled order, including any shipping, handling, or other charges levied at the time of purchase.{'\n'}

                                1.4. The Kapda Bazaar platform shall facilitate the initiation of the full refund to the Buyer without any deduction whatsoever, within a reasonable timeframe 2 to 4 business days from the date of cancellation by the Buyer.{'\n'}

                                2. No Guarantee of Product Quality:{'\n'}

                                Kapda Bazaar explicitly states that it provides no guarantees regarding the quality or specifications of products purchased on the platform. {'\n'}


                                3. Transactions Between Manufacturers and Customers Only:{'\n'}

                                Kapda Bazaar positions itself as a facilitator of an online marketplace, connecting manufacturers and customers directly. This implies that the contractual relationship for the sale of goods exists solely between the manufacturer and the customer. Kapda Bazaar is not a party to this contract. This is a common model for e-commerce marketplaces.{'\n'}


                                4. Zero Liability for GST Non-Payment by Manufacturers:{'\n'}

                                Under the Goods and Services Tax (GST) Act, 2017, the responsibility for the collection and remittance of GST lies with the supplier (in this case, the manufacturer). Kapda Bazaar explicitly disclaims any liability if the manufacturer fails to pay the GST amount. This aligns with the statutory obligations under the GST Act.{'\n'}


                                5. Transactions Outside the Platform:{'\n'}

                                Kapda Bazaar clearly states it is not responsible for transactions conducted outside its platform. This is a reasonable position as it has no control or oversight over such transactions. Any disputes arising from such off-platform dealings would fall outside Kapda Bazaar's purview. Users engaging in such transactions do so at their own risk.{'\n'}

                                6. Payment Credited Upon Upload of Transport Copy:{'\n'}

                                This clause outlines a specific payment mechanism. Once an order is placed and the transport copy ( lorry receipt) is uploaded, signifying dispatch, the payment is directly credited to the manufacturer. Kapda Bazaar absolves itself of any liability to stop this payment thereafter.{'\n'}

                                7. Conditions for Purchase:{'\n'}
                                By purchasing goods on the Kapda Bazaar platform, you agree to the following terms and conditions:{'\n'}

                                1. Price and Payment: All goods are sold on an ex-shipping cost basis. This means the price you pay on the platform covers the cost of the goods only.{'\n'}

                                2. Shipping and Delivery: You, the buyer, are responsible for all shipping, delivery, and associated costs. These charges must be paid directly to the shipping company upon the collection or delivery of your goods. Kapda Bazaar is not responsible for any shipping-related fees or arrangements. {'\n'}


                                7. No Return and No Refund Policy:{'\n'}

                                This platform facilitates direct purchases from fabric manufacturers. Please note that we offer no guarantees or warranties regarding the quality, condition, or accuracy of any fabrics purchased, including potential defects or incorrect deliveries.{'\n'}

                                Particularly if the goods are "defect" means any fault, imperfection or shortcoming in the quality, quantity, potency, purity or standard which is required to be.


                                8. Encouraging GST Verification:{'\n'}

                                Kapda Bazaar encourages users to verify GST numbers as a due diligence measure. While it correctly states that verification doesn't guarantee against fraud, it's a prudent step for transparency and assessing the legitimacy of the manufacturer under the GST framework.{'\n'}

                                9. Payment Through Gateway Only:{'\n'}

                                Stipulating that payments will be received only through the platform's payment gateway enhances security and traceability. This helps protect both buyers and sellers by providing a documented transaction trail.{'\n'}

                                10. No Cash Payments:{'\n'}

                                Explicitly stating the non-acceptance of cash payments reduces the risk of unauthorized or fraudulent transactions and aligns with digital payment practices.{'\n'}

                                11. Caution Against Unsolicited Communications:{'\n'}

                                Warning users against believing unsolicited calls or messages claiming to be from Kapda Bazaar is crucial for preventing cyber fraud and aligns with general cybersecurity awareness and the provisions of the Information Technology Act, 2000, concerning cybercrime.{'\n'}

                                12. No Sharing of Information:{'\n'}

                                Stating that Kapda Bazaar does not share manufacturer or customer information via phone calls or messages is important for data privacy and security. However, the platform's actual data handling practices would need to comply with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, under the IT Act, 2000, if it collects and stores personal data.{'\n'}


                                13. No Fees for Buying:{'\n'}

                                Clarifying that there are no charges for buying on the platform ensures transparency for customers.{'\n'}


                                14) Change of terms{'\n'}

                                Kapda Bazaar retains the exclusive right to amend or update these terms and conditions periodically. It is your responsibility to review the terms and conditions regularly to ensure ongoing adherence. Your continued use of our services signifies your acceptance of any revised or amended terms.{'\n'}

                                15) eligibility to use service{'\n'}
                                By accessing or using the Kapda Bazaar platform, you affirm that you are at least 18 years of age{'\n'}

                                Violation Policy:{'\n'}

                                Unlawful Conduct, Fraud, and Reputational Harm{'\n'}
                                Kapda Bazaar unequivocally reserves the right, at its sole and absolute discretion, to forthwith suspend, deactivate, or permanently terminate the account and access of any user (including, but not limited to, buyers and sellers) who is found to be engaged in, or reasonably suspected of, any activity constituting a violation of applicable laws, rules, or regulations in force within the Republic of India.{'\n'}
                                Without derogating from the generality of the foregoing, such violations shall specifically include, but not be limited to, acts of:{'\n'}

                                Fraud:{'\n'}
                                Any deceptive practice, misrepresentation, or concealment of material facts with the intent to gain an unfair or unlawful advantage, or to cause loss or injury to Kapda Bazaar or other users.{'\n'}

                                Scamming:{'\n'}
                                Any fraudulent scheme or deceptive act designed to illicitly obtain money, goods, or services from other users or Kapda Bazaar.{'\n'}

                                Reputational Harm:{'\n'}
                                Any conduct, whether active or passive, that directly or indirectly causes, or is likely to cause, damage, disrepute, or adverse impact to the goodwill, brand, or business operations of Kapda Bazaar.{'\n'}
                                The exercise of this right by Kapda Bazaar shall be final and binding, and shall be without prejudice to any other legal remedies, recourses, or actions available to Kapda Bazaar under law or equity.{'\n'}
                            </Text>
                            ) : (

                                <Text style={{ fontSize: 14, color: "#333", lineHeight: 22 }}>
                                    • This document outlines the terms and conditions governing the relationship between Kapdabazaar and sellers utilizing its platform for selling fabrics.{'\n'}
                                    • By engaging with Kapdabazaar, manufacturers agree to abide by these terms.{'\n'}

                                    **Payment and Commission Structure**{'\n'}

                                    • Kapdabazaar assumes full responsibility for the payment of successful deliveries facilitated through its platform.{'\n'}
                                    • Commission: A commission of 1% will be charged on the taxable amount of all sales conducted via the Kapdabazaar platform.{'\n'}
                                    • This commission is subject to an additional 18% Goods and Services Tax (GST).{'\n'}
                                    • Commission for Payment Gateway Services: Kapda Bazaar shall levy and deduct a commission equal to two percent (2%) of the final bill amount for all transactions where the payment gateway service is utilized to collect payments for goods sold by the Seller on the Kapda Bazaar platform.{'\n'}
                                    • This commission shall be initially paid by Kapda Bazaar to the designated payment integration company, acting on behalf of the Seller.{'\n'}
                                    • Payment Processing: Kapdabazaar exclusively collects payments from buyers through its integrated payment gateway.{'\n'}
                                    • This measure is implemented to mitigate risks such as scams, fraud, and bad debts, thereby ensuring secure transactions for all parties.{'\n'}
                                    • Payment Initiation: Upon successful upload of the original copies of the transport L.R. (Lorry Receipt) and the invoice by the manufacturer, Kapdabazaar will initiate payment to the manufacturer within 7 business days.{'\n'}
                                    • Manufacturers are required to courier the original physical copies of these documents to the address provided by Kapdabazaar.{'\n'}

                                    **Delivery and Dispute Resolution**{'\n'}

                                    • Delivery Authority: Kapdabazaar grants full authority to the customer in instances where goods delivery is not completed within a mutually agreed-upon timeframe.{'\n'}
                                    • In such cases, payment will not be initiated to the manufacturer and will be refunded to the customer's original source of payment.{'\n'}

                                    **Manufacturer's Direct Transactions**{'\n'}

                                    • Zero Responsibility: If a transaction is conducted directly between the manufacturer and the buyer, without utilizing the Kapdabazaar platform, Kapdabazaar bears zero responsibility for any kind of loss, fraud, or other issues arising from such transactions.{'\n'}

                                    **Commission Collection and Compliance**{'\n'}

                                    • No Cash Transactions: Kapdabazaar explicitly states that it never requests commission payments in cash or through any other method from manufacturers.{'\n'}
                                    • All applicable commissions are directly deducted through the in-application processing system.{'\n'}

                                    **Security and Communication**{'\n'}

                                    • Cyber Crime Awareness: To prevent cyber fraud, manufacturers are strongly advised to avoid sharing any sensitive information through phone calls or messages.{'\n'}
                                    • Kapdabazaar will never ask for personal or financial information via these channels.{'\n'}
                                    • Please be vigilant against such cybercrimes.{'\n'}
                                    • Official Communication Channels: For any queries, issues, or to raise a support ticket, manufacturers are encouraged to use Kapdabazaar's verified WhatsApp number and email ID, which are shared within the application.{'\n'}

                                    **Government Regulations and Deductions**{'\n'}

                                    • GST TCS (Tax Collected at Source): As per government regulations, a 0.5% GST TCS will be charged on every transaction.{'\n'}
                                    • This amount will be credited back to the manufacturer's account by the GST department.{'\n'}
                                    • TDS (Tax Deducted at Source) on Income Tax: A 0.1% TDS will be charged on every transaction.{'\n'}
                                    • This amount can be claimed by the manufacturer through Form 26AS.{'\n'}

                                    **14) Change of Terms**{'\n'}

                                    • Kapda Bazaar retains the exclusive right to amend or update these terms and conditions periodically.{'\n'}
                                    • It is your responsibility to review the terms and conditions regularly to ensure ongoing adherence.{'\n'}
                                    • Your continued use of our services signifies your acceptance of any revised or amended terms.{'\n'}

                                    **15) Eligibility to Use Service**{'\n'}

                                    • By accessing or using the Kapda Bazaar platform, you affirm that you are at least 18 years of age.{'\n'}

                                    **16) Violation Policy**{'\n'}

                                    • Kapda Bazaar unequivocally reserves the right, at its sole and absolute discretion, to forthwith suspend, deactivate, or permanently terminate the account and access of any user (including, but not limited to, buyers and sellers) who is found to be engaged in, or reasonably suspected of, any activity constituting a violation of applicable laws, rules, or regulations in force within the Republic of India.{'\n'}
                                    • Without derogating from the generality of the foregoing, such violations shall specifically include:{'\n'}
                                    • Any deceptive practice, misrepresentation, or concealment of material facts with the intent to gain an unfair or unlawful advantage, or to cause loss or injury to Kapda Bazaar or other users.{'\n'}
                                    • Scamming: Any fraudulent scheme or deceptive act designed to illicitly obtain money, goods, or services from other users or Kapda Bazaar.{'\n'}
                                    • Reputational Harm: Any conduct, whether active or passive, that directly or indirectly causes, or is likely to cause, damage, disrepute, or adverse impact to the goodwill, brand, or business operations of Kapda Bazaar.{'\n'}
                                    • The exercise of this right by Kapda Bazaar shall be final and binding, and shall be without prejudice to any other legal remedies, recourses, or actions available to Kapda Bazaar under law or equity.{'\n'}

                                </Text>
                            )
                            }

                        </ScrollView>

                        <Button onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
                            Close
                        </Button>
                    </View>
                </View>
            </Modal>

            <Button
                mode="elevated"
                onPress={handleRegister}
                style={styles.button}
                textColor="#fff"
                loading={isLoading}
                disabled={!data.name || !data.password || !data.email || !data.phone_number || !agree}
            >
                Sign In
            </Button>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "#fff",
        width: "100%",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#132f56",
        marginBottom: 10,
        textAlign: "center",
    },
    inputWrapper: {
        width: "100%",
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#132f56",
        marginBottom: 5,
    },
    subHeading: {
        fontSize: 16,
        fontWeight: "700",
        color: "#132f56",
        marginBottom: 10,
    },
    input: {
        backgroundColor: "transparent",
        fontSize: 16,
        borderBottomColor: "#fff",
        width: "90%",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 5,
        paddingRight: 10,
    },
    icon: {
        padding: 10,
    },
    button: {
        backgroundColor: "#ff4b2b",
        paddingVertical: 4,
        width: "100%",
        borderRadius: 50,
        marginTop: 20,
        fontSize: 18,
    },
    error: {
        color: "red",
        fontSize: 12,
        marginTop: 4,
    },
});

export default SignInScreen;
