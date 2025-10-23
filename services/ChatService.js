import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE } from '../constants/exports';
import { STORAGE_KEYS } from '../store/useAuthStore';


class ChatService {
  static async getConversations(userId) {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.get(`${API_BASE}/chat/conversations/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  static async getMessages(conversationId) {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.get(`${API_BASE}/chat/messages/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  static async sendMessage(conversationId, senderId, role, content, type = 'text') {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      const response = await axios.post(`${API_BASE}/chat/send`, {
        conversation_id: conversationId,
        sender_id: senderId,
        sender_type: role,
        message_text: content,
        message_type: type,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  static async createSellerConversation(seller_id) {

    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.post(`${API_BASE}/chat/conversations/start-seller`, {
        seller_id
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }
  static async createConversation(participants, user2) {

    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.post(`${API_BASE}/chat/conversations/start`, {
        user1_id: participants.user_id,
        user1_type: participants.role,
        user2_id: user2,
        user2_type: participants.role == "user" ? "seller" : "user"
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  static async markMessagesAsRead(conversationId, userId) {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      const response = await axios.put(`${API_BASE}/chat/messages/read`, {
        conversationId,
        userId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  static async deleteMessage(messageId) {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      const response = await axios.delete(`${API_BASE}/chat/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  static async deleteConversation(conversationId) {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      const response = await axios.delete(`${API_BASE}/chat/conversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  static async getUnreadCount(userId) {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

    try {
      const response = await axios.get(`${API_BASE}/chat/unread/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  static async searchMessages(query, conversationId) {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      const response = await axios.get(`${API_BASE}/chat/search`, {
        params: { query, conversationId },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }

  static async getConversationDetails(conversationId) {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

    try {
      const response = await axios.get(`${API_BASE}/chat/conversations/${conversationId}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation details:', error);
      throw error;
    }
  }

  static async updateConversationSettings(conversationId, settings) {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      const response = await axios.put(`${API_BASE}/chat/conversations/${conversationId}/settings`, settings, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating conversation settings:', error);
      throw error;
    }
  }

  static async addParticipants(conversationId, participants) {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

    try {
      const response = await axios.post(`${API_BASE}/chat/conversations/${conversationId}/participants`, {
        participants,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding participants:', error);
      throw error;
    }
  }

  static async removeParticipant(conversationId, participantId) {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      const response = await axios.delete(
        `${API_BASE}/chat/conversations/${conversationId}/participants/${participantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      );
      return response.data;
    } catch (error) {
      console.error('Error removing participant:', error);
      throw error;
    }
  }

  static async getTypingStatus(conversationId) {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      const response = await axios.get(`${API_BASE}/chat/typing/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching typing status:', error);
      throw error;
    }
  }

  static async updateTypingStatus(conversationId, userId, isTyping) {

    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      const response = await axios.put(`${API_BASE}/chat/typing`, {
        conversationId,
        userId,
        isTyping,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating typing status:', error);
      throw error;
    }
  }

  static async getMessageStatus(messageId) {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

    try {
      const response = await axios.get(`${API_BASE}/chat/messages/${messageId}/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching message status:', error);
      throw error;
    }
  }

  static async updateMessageStatus(messageId, status) {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      const response = await axios.put(`${API_BASE}/chat/messages/${messageId}/status`, {
        status,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating message status:', error);
      throw error;
    }
  }
}

export default ChatService; 