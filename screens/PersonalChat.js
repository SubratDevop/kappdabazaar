import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSocket } from '../contexts/SocketContext';
import ChatService from '../services/ChatService';
import { STORAGE_KEYS, useAuthStore } from '../store/useAuthStore';
import { formatTime } from '../utils/constants';

const PersonalChat = ({ route, navigation }) => {
    // const { companyId, productId } = route.params || {};
    const { user } = useAuthStore();
    const seller = route.params.companyId;
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const socketRef = useSocket();



    useEffect(() => {
        initializeChat();
        const interval = setInterval(checkNewMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    const initializeChat = async () => {
        try {
            const userinfo = await AsyncStorage.getItem(STORAGE_KEYS.USER);
            const parsedUser = JSON.parse(userinfo);
            useAuthStore.setState({ user: parsedUser });

            setLoading(true);
            // Create or get existing conversation
            const conversation = await ChatService.createConversation(parsedUser, seller);

            setConversationId(conversation.data.conversation.id);
            setOpponent(conversation.data.opponent);
            // Load messages
            const messageData = await ChatService.getMessages(conversation.data.conversation.id);
            setMessages(messageData.data.messages);

            // Mark messages as read
            // await ChatService.markMessagesAsRead(conversation.id, user.user_id);
        } catch (error) {
            console.error('Error initializing chat:', error);
            Alert.alert('Error', 'Failed to initialize chat');
        } finally {
            setLoading(false);
        }
    };

    const checkNewMessages = async () => {
        if (!conversationId) return;

        try {
            const res = await ChatService.getMessages(conversationId);
            const fetched = res?.data?.messages || [];

            if (
                fetched.length !== (messages?.length || 0) ||
                (fetched[0]?.id !== messages[0]?.id) // new top message
            ) {
                setMessages(fetched);
                // try {
                //   await ChatService.markMessagesAsRead(conversationId, user.user_id);
                // } catch (markErr) {
                //   console.warn("Failed to mark messages read:", markErr);
                // }
            }
        } catch (error) {
            console.error("Error in checkNewMessages:", error);
        }
    };

    const sendMessage = async () => {

        if (!newMessage.trim() || !conversationId) return;
        try {
            setSending(true);
            await ChatService.sendMessage(conversationId, user.user_id, user.role, newMessage.trim());
            await checkNewMessages();
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <View style={{ flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#111" />
                    </TouchableOpacity>
                    <Image
                        source={
                            user?.opponent?.profile_image
                                ? { uri: user.opponent.profile_image }
                                : require("../assets/kapda_icon.png")
                        }
                        style={{ width: 40, height: 40, borderRadius: 20, marginHorizontal: 10 }}
                    />
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>{opponent.company_name}</Text>
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ImageBackground
                        source={require("../assets/images/chat.jpg")}
                        style={{ flex: 1 }}
                        resizeMode="cover"
                    >
                        <FlatList
                            data={messages}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View
                                    style={[
                                        styles.messageBubble,
                                        { alignSelf: item.sender_id === user.user_id ? "flex-end" : "flex-start",
                                          backgroundColor: item.sender_id === user.user_id ? "#E1FFC7" : "#F1F1F1" }
                                    ]}
                                >
                                    <Text>{item.text}</Text>
                                    <Text style={styles.messageTime}>{formatTime(item.created_at)}</Text>
                                </View>
                            )}
                            contentContainerStyle={{ padding: 10 }}
                            inverted
                            keyboardShouldPersistTaps="handled"
                        />

                        {/* Input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={newMessage}
                                onChangeText={setNewMessage}
                                placeholder="Type a message..."
                                style={styles.textInput}
                                multiline
                                maxLength={1000}
                            />
                            <TouchableOpacity
                                onPress={sendMessage}
                                style={[styles.sendButton, { opacity: sending || !newMessage.trim() ? 0.5 : 1 }]}
                                disabled={sending || !newMessage.trim()}
                            >
                                {sending ? <ActivityIndicator size="small" color="#fff" /> :
                                    <Feather name="send" size={21} color="#fff" />}
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </KeyboardAvoidingView>



            </View>
        </TouchableWithoutFeedback>
    );
};



const styles = StyleSheet.create({


    header: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
    avatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 10 },
    headerTitle: { fontSize: 18, fontWeight: "bold" },
    messageBubble: { padding: 10, borderRadius: 10, margin: 5, maxWidth: "70%" },
    messageTime: { fontSize: 12, color: "#777", textAlign: "right" },
    inputContainer: { flexDirection: "row", alignItems: "center", padding: 10, borderTopWidth: 1, borderTopColor: "#ddd", backgroundColor: "rgba(255,255,255,0.9)" },
    textInput: { flex: 1, backgroundColor: "#f1f1f1", padding: 10, borderRadius: 10 },
    sendButton: { marginLeft: 10, backgroundColor: "#3D8D7A", padding: 8, borderRadius: 10 },




    
    container: { padding: 20, flexGrow: 1, backgroundColor: "#f8f9fa" },

    title: { fontSize: 20, fontWeight: 'bold', textAlign: "center" },


});

export default PersonalChat;

