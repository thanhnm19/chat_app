// src/services/mockChatService.js
// Mock service để test frontend không cần backend

import { mockConversations, mockMessages, mockCurrentUser, mockUsers } from './mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for mock data
let conversations = [...mockConversations];
let messages = { ...mockMessages };

const mockChatService = {
  getConversations: async () => {
    await delay(500);
    return conversations;
  },

  createPrivateConversation: async (userId) => {
    await delay(500);
    
    // Kiểm tra xem conversation đã tồn tại chưa
    const existing = conversations.find(
      conv => !conv.isGroup && conv.members.includes(userId)
    );
    
    if (existing) return existing;
    
    // Tạo conversation mới
    const otherUser = mockUsers.find(u => u._id === userId);
    const newConv = {
      _id: `conv-${Date.now()}`,
      isGroup: false,
      otherUser: otherUser,
      members: [mockCurrentUser._id, userId],
      lastMessage: null,
      unreadCount: 0
    };
    
    conversations.unshift(newConv);
    messages[newConv._id] = [];
    
    return newConv;
  },

  createGroupConversation: async (groupData) => {
    await delay(500);
    
    const newGroup = {
      _id: `group-${Date.now()}`,
      isGroup: true,
      name: groupData.name,
      members: [mockCurrentUser._id, ...groupData.memberIds],
      lastMessage: null,
      unreadCount: 0,
      createdBy: mockCurrentUser._id,
      createdAt: new Date().toISOString()
    };
    
    conversations.unshift(newGroup);
    messages[newGroup._id] = [];
    
    return newGroup;
  },

  updateGroup: async (conversationId, groupData) => {
    await delay(500);
    
    conversations = conversations.map(conv =>
      conv._id === conversationId
        ? { ...conv, ...groupData }
        : conv
    );
    
    return conversations.find(c => c._id === conversationId);
  },

  addGroupMembers: async (conversationId, memberIds) => {
    await delay(500);
    
    conversations = conversations.map(conv => {
      if (conv._id === conversationId) {
        return {
          ...conv,
          members: [...new Set([...conv.members, ...memberIds])]
        };
      }
      return conv;
    });
    
    return conversations.find(c => c._id === conversationId);
  },

  leaveGroup: async (conversationId) => {
    await delay(500);
    
    conversations = conversations.filter(c => c._id !== conversationId);
    delete messages[conversationId];
    
    return { success: true };
  },

  getMessages: async (conversationId) => {
    await delay(500);
    
    return messages[conversationId] || [];
  },

  sendMessage: async (conversationId, content, type = 'text') => {
    await delay(300);
    
    const newMessage = {
      _id: `msg-${Date.now()}`,
      conversationId,
      senderId: mockCurrentUser._id,
      sender: mockCurrentUser,
      content,
      type,
      status: 'sent',
      createdAt: new Date().toISOString()
    };
    
    // Thêm vào messages
    if (!messages[conversationId]) {
      messages[conversationId] = [];
    }
    messages[conversationId].push(newMessage);
    
    // Cập nhật lastMessage trong conversation
    conversations = conversations.map(conv => {
      if (conv._id === conversationId) {
        return {
          ...conv,
          lastMessage: newMessage
        };
      }
      return conv;
    });
    
    // Simulate status updates sau 1s
    setTimeout(() => {
      messages[conversationId] = messages[conversationId].map(msg =>
        msg._id === newMessage._id
          ? { ...msg, status: 'delivered' }
          : msg
      );
    }, 1000);
    
    setTimeout(() => {
      messages[conversationId] = messages[conversationId].map(msg =>
        msg._id === newMessage._id
          ? { ...msg, status: 'read' }
          : msg
      );
    }, 2000);
    
    return newMessage;
  },

  markMessagesAsRead: async (conversationId, messageIds) => {
    await delay(200);
    
    if (messages[conversationId]) {
      messages[conversationId] = messages[conversationId].map(msg =>
        messageIds.includes(msg._id)
          ? { ...msg, status: 'read' }
          : msg
      );
    }
    
    return { success: true };
  },

  uploadFile: async (file, conversationId) => {
    await delay(1000);
    
    return {
      url: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: file.size
    };
  },

  searchMessages: async (conversationId, query) => {
    await delay(500);
    
    const convMessages = messages[conversationId] || [];
    return convMessages.filter(msg =>
      msg.content.toLowerCase().includes(query.toLowerCase())
    );
  }
};

export default mockChatService;