// src/services/mockAuthService.js
// Mock service để test frontend không cần backend

import { mockCurrentUser, mockUsers } from './mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockAuthService = {
  register: async (userData) => {
    await delay(500); // Giả lập network delay
    
    // Giả lập đăng ký thành công
    const newUser = {
      ...mockCurrentUser,
      username: userData.username,
      email: userData.email
    };
    
    localStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
  },

  login: async (credentials) => {
    await delay(500);
    
    // Accept any email/password for testing
    console.log('Mock login with:', credentials);
    
    localStorage.setItem('user', JSON.stringify(mockCurrentUser));
    return mockCurrentUser;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    const user = mockAuthService.getCurrentUser();
    return user?.token;
  },

  isAuthenticated: () => {
    return !!mockAuthService.getToken();
  },

  updateUser: async (userId, userData) => {
    await delay(500);
    
    const currentUser = mockAuthService.getCurrentUser();
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  },

  getAllUsers: async () => {
    await delay(500);
    
    // Trả về danh sách users, loại trừ current user
    return mockUsers.filter(u => u._id !== mockCurrentUser._id);
  }
};

export default mockAuthService;