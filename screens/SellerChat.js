import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSocket } from '../contexts/SocketContext';
import ChatService from '../services/ChatService';
import { STORAGE_KEYS, useAuthStore } from '../store/useAuthStore';
import { formatTime } from '../utils/constants';

const SellerChat = ({ route, navigation }) => {
    const { companyId, productId } = route.params || {};
    const { user } = useAuthStore();
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
            const conversation = await ChatService.createSellerConversation(parsedUser.user_id);

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

            // Check both length and last message ID
            if (
                fetched.length !== messages.length ||
                fetched[0]?.id !== messages[0]?.id
            ) {
                setMessages(fetched);
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
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>{opponent.name}</Text>
                </View>


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
                                    style={{
                                        alignSelf: item.sender_id === user.user_id ? "flex-end" : "flex-start",
                                        backgroundColor: item.sender_id === user.user_id ? "#E1FFC7" : "#F1F1F1",
                                        padding: 10,
                                        borderRadius: 10,
                                        margin: 5,
                                        maxWidth: "70%"
                                    }}
                                >
                                    <Text>{item.text}</Text>
                                    <Text style={{ fontSize: 12, color: "#777", textAlign: "right" }}>
                                        {formatTime(item.created_at)}
                                    </Text>
                                </View>
                            )}
                            contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                            inverted
                        />

                        <View style={{ flexDirection: "row", alignItems: "center", padding: 10, borderTopWidth: 1, borderTopColor: "#ddd" }}>
                            <TextInput
                                value={newMessage}
                                onChangeText={setNewMessage}
                                placeholder="Type a message..."
                                style={{ flex: 1, backgroundColor: "#f1f1f1", padding: 10, borderRadius: 10 }}
                                multiline
                                maxLength={1000}
                            />
                            <TouchableOpacity
                                onPress={sendMessage}
                                style={{
                                    marginLeft: 10,
                                    backgroundColor: "#3D8D7A",
                                    padding: 8,
                                    borderRadius: 10,
                                    opacity: sending || !newMessage.trim() ? 0.5 : 1
                                }}
                                disabled={sending || !newMessage.trim()}
                            >
                                {sending ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Feather name="send" size={21} color="#fff" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>


            </View>
        
    );
};



const styles = StyleSheet.create({
    container: { padding: 20, flexGrow: 1, backgroundColor: "#f8f9fa" },

    title: { fontSize: 20, fontWeight: 'bold', textAlign: "center" },


});

export default SellerChat;

