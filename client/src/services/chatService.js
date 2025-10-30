// src/services/chatService.js

import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const chatService = {
  getConversations: async () => {
    try {
      const response = await axios.get(`${API_URL}/conversations`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể tải cuộc trò chuyện' };
    }
  },

  createPrivateConversation: async (userId) => {
    try {
      const response = await axios.post(
        `${API_URL}/conversations/private`,
        { userId },
        {
          headers: { Authorization: `Bearer ${authService.getToken()}` }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể tạo cuộc trò chuyện' };
    }
  },

  createGroupConversation: async (groupData) => {
    try {
      const response = await axios.post(
        `${API_URL}/conversations/group`,
        groupData,
        {
          headers: { Authorization: `Bearer ${authService.getToken()}` }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể tạo nhóm' };
    }
  },

  updateGroup: async (conversationId, groupData) => {
    try {
      const response = await axios.put(
        `${API_URL}/conversations/${conversationId}`,
        groupData,
        {
          headers: { Authorization: `Bearer ${authService.getToken()}` }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể cập nhật nhóm' };
    }
  },

  getMessages: async (conversationId, page = 1, limit = 50) => {
    try {
      const response = await axios.get(
        `${API_URL}/messages/${conversationId}`,
        {
          params: { page, limit },
          headers: { Authorization: `Bearer ${authService.getToken()}` }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể tải tin nhắn' };
    }
  },

  sendMessage: async (conversationId, content, type = 'text') => {
    try {
      const response = await axios.post(
        `${API_URL}/messages`,
        { conversationId, content, type },
        {
          headers: { Authorization: `Bearer ${authService.getToken()}` }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể gửi tin nhắn' };
    }
  }
};

export default chatService;