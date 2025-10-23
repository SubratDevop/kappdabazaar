import axios from 'axios';
import Toast from 'react-native-toast-message';
import { create } from 'zustand';
import { API_BASE } from '../constants/exports';

export const useChatStore = create((set) => ({
    conversations: [], // List of all chats
    messages: {}, // Messages for a specific chat
    isLoading: false,
    error: null,

    // Fetch all chats for the user
    fetchConversations: async (payload) => {

        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_BASE}/chat/conversations`, {
                params: {
                    user_id: payload.user_id,
                    user_type: payload.role,
                }
            });
            set({ conversations: response.data.conversations || [], isLoading: false });
            return response.data || [];
        } catch (error) {
            console.error("Failed to fetch chats:", error);
            set({ error: error.message, isLoading: false });
        }
    },

    // Fetch messages for a specific chat
    fetchMessages: async (chatId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_BASE}/chats/${chatId}/messages`);
            set((state) => ({
                messages: {
                    ...state.messages,
                    [chatId]: response.data.messages || [],
                },
                isLoading: false,
            }));
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            set({ error: error.message, isLoading: false });
        }
    },

    // Send a message to a specific chat
    sendMessage: async (chatId, message) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_BASE}/chats/${chatId}/messages`, { message });

            // Update the messages state with the new message
            set((state) => ({
                messages: {
                    ...state.messages,
                    [chatId]: [...(state.messages[chatId] || []), response.data.message],
                },
                isLoading: false,
            }));

            Toast.show({
                type: 'success',
                text1: 'Message Sent',
                text2: 'Your message was sent successfully.',
                swipeable: true,
                position: 'top',
            });
        } catch (error) {
            console.error("Failed to send message:", error);
            set({ error: error.message, isLoading: false });

            Toast.show({
                type: 'error',
                text1: 'Message Failed',
                text2: 'Failed to send your message. Please try again.',
                swipeable: true,
                position: 'top',
            });
        }
    },

    // Clear chat-related errors
    clearError: () => set({ error: null }),
}));